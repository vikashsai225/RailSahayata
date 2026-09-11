import json
import sys


def fallback_score(task):
    score = (
        task.get("safetyRisk", 0) * 0.30
        + task.get("delayImpact", 0) * 0.25
        + task.get("assetCriticality", 0) * 0.20
        + task.get("maintenanceUrgency", 0) * 0.15
        + task.get("resourceAvailability", 0) * 0.10
    )
    return round(max(0, min(100, score)), 2)


def label_for(score):
    if score >= 75:
        return "Critical"
    if score >= 50:
        return "High"
    if score >= 25:
        return "Medium"
    return "Low"


def predict_scores(tasks):
    try:
        from xgboost import XGBRegressor

        features = [
            [
                task.get("safetyRisk", 0),
                task.get("delayImpact", 0),
                task.get("assetCriticality", 0),
                task.get("maintenanceUrgency", 0),
                task.get("resourceAvailability", 0),
            ]
            for task in tasks
        ]
        labels = [fallback_score(task) for task in tasks]
        model = XGBRegressor(
            n_estimators=40,
            max_depth=3,
            learning_rate=0.08,
            objective="reg:squarederror",
            n_jobs=1,
            random_state=42,
        )
        model.fit(features, labels, verbose=False)
        predictions = model.predict(features)
        return [round(float(max(0, min(100, score))), 2) for score in predictions], "XGBoost"
    except ImportError:
        return [fallback_score(task) for task in tasks], "Rule-based fallback (install requirements.txt for XGBoost)"


def optimize_schedule(tasks):
    try:
        from ortools.sat.python import cp_model

        model = cp_model.CpModel()
        horizon = max(60, len(tasks) * 90)
        starts = []
        intervals = []
        for index, task in enumerate(tasks):
            duration = int(task.get("durationMinutes", 60))
            start = model.NewIntVar(0, horizon - duration, f"start_{index}")
            end = model.NewIntVar(0, horizon, f"end_{index}")
            interval = model.NewIntervalVar(start, duration, end, f"interval_{index}")
            starts.append(start)
            intervals.append(interval)
        model.AddNoOverlap(intervals)
        model.Minimize(sum(starts[index] * int(tasks[index]["aiPriorityScore"] * 100) for index in range(len(tasks))))
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = 2
        solver.Solve(model)
        return [
            {"taskId": task["id"], "startMinute": solver.Value(starts[index]), "durationMinutes": int(task.get("durationMinutes", 60))}
            for index, task in enumerate(tasks)
        ], "Google OR-Tools"
    except ImportError:
        minute = 0
        schedule = []
        for task in tasks:
            duration = int(task.get("durationMinutes", 60))
            schedule.append({"taskId": task["id"], "startMinute": minute, "durationMinutes": duration})
            minute += duration
        return schedule, "Sequential fallback (install requirements.txt for Google OR-Tools)"


def main():
    tasks = json.load(sys.stdin)
    scores, model_name = predict_scores(tasks)
    enriched = []
    for task, score in zip(tasks, scores):
        enriched.append({**task, "aiPriorityScore": score, "aiPriorityLabel": label_for(score), "durationMinutes": task.get("durationMinutes", 60)})
    enriched.sort(key=lambda task: task["aiPriorityScore"], reverse=True)
    schedule, optimizer_name = optimize_schedule(enriched)
    print(json.dumps({"tasks": enriched, "schedule": schedule, "model": model_name, "optimizer": optimizer_name}))


if __name__ == "__main__":
    main()
