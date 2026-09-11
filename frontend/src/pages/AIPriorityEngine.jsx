import React, { useEffect, useMemo, useState } from "react";
import { Card, Metric, PageTitle, Table, Tag } from "./ui";

const API_URL = "http://127.0.0.1:5000/api/ai-priority";
const FILTERS = ["All", "Critical", "High", "Medium", "Low"];

const getRecommendation = (score) => {
  if (score >= 75) return "Dispatch crew and secure an urgent block window.";
  if (score >= 50) return "Prioritise inspection and allocate backup resources.";
  if (score >= 25) return "Schedule in the next available maintenance window.";
  return "Monitor through routine checks and planned maintenance.";
};

const getTagTone = (label) => ({ Critical: "red", High: "orange", Medium: "blue", Low: "green" }[label] || "blue");

const AIPriorityEngine = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [engineInfo, setEngineInfo] = useState({ model: "", optimizer: "" });

  const fetchPriorityTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}?t=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (!result.success || !Array.isArray(result.data)) throw new Error("Invalid API response");
      setTasks(result.data);
      setEngineInfo({ model: result.model || "", optimizer: result.optimizer || "" });
      setLastUpdated(new Date());
    } catch (requestError) {
      console.error("AI priority fetch failed:", requestError);
      setError("Unable to load the priority queue. Check that the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorityTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter = filter === "All" || task.aiPriorityLabel === filter;
      const searchableText = `${task.id} ${task.title} ${task.zone} ${task.line}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [filter, query, tasks]);

  const summary = useMemo(() => ({
    total: tasks.length,
    critical: tasks.filter((task) => task.aiPriorityLabel === "Critical").length,
    high: tasks.filter((task) => task.aiPriorityLabel === "High").length,
    average: tasks.length ? Math.round(tasks.reduce((sum, task) => sum + task.aiPriorityScore, 0) / tasks.length) : 0,
  }), [tasks]);

  return (
    <div className="page">
      <PageTitle
        eyebrow="EXPLAINABLE AI / LIVE MODEL"
        title="AI Priority Engine"
        subtitle="Ranks maintenance demand by safety, urgency and expected impact on asset availability."
        action={<button className="primary" type="button" onClick={fetchPriorityTasks} disabled={loading}>{loading ? "Loading..." : "↻ Recalculate priorities"}</button>}
      />

      {error && <div className="notice error" role="alert">{error}<button type="button" onClick={fetchPriorityTasks}>Retry</button></div>}

      <div className="metrics">
        <Metric label="Tasks analysed" value={summary.total} note="From live priority feed" />
        <Metric label="Critical tasks" value={summary.critical} note="Immediate operational attention" tone="red" />
        <Metric label="High priority" value={summary.high} note="Next safe intervention window" tone="orange" />
        <Metric label="Average score" value={summary.average} note="Out of 100" />
        <Metric label="Model status" value={loading ? "Syncing" : "Live"} note={lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Awaiting first sync"} tone="green" />
      </div>

      <Card title="Hybrid AI decision engine" subtitle="XGBoost predicts priority; Google OR-Tools creates the conflict-free schedule.">
        <div className="formula">Priority score = (Safety risk x 30%) + (Delay impact x 25%) + (Asset criticality x 20%) + (Maintenance urgency x 15%) + (Resource availability x 10%)</div>
        {engineInfo.model && <p className="fine">Active model: {engineInfo.model} · Active optimizer: {engineInfo.optimizer}</p>}
        <p className="fine">Scores are decision-support recommendations. Block approvals remain with authorised railway authorities.</p>
      </Card>

      <Card title="AI-ranked intervention queue" subtitle={`${filteredTasks.length} of ${tasks.length} tasks shown, sorted by priority score`}>
        <div className="filters">
          <input aria-label="Search priority tasks" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search task, zone or line" />
          {FILTERS.map((item) => <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        {loading && <div className="empty-state">Loading priority recommendations...</div>}
        {!loading && !error && filteredTasks.length === 0 && <div className="empty-state">No priority tasks match the current filter.</div>}
        {!loading && filteredTasks.length > 0 && (
          <Table>
            <thead><tr><th>Rank</th><th>Task</th><th>Zone / line</th><th>Priority</th><th>Score</th><th>Decision factors</th><th>Recommended action</th></tr></thead>
            <tbody>{filteredTasks.map((task, index) => (
              <tr key={task.id}>
                <td><b>{String(index + 1).padStart(2, "0")}</b></td>
                <td><b>{task.id}</b><br /><small>{task.title}</small></td>
                <td>{task.zone}<br /><small>{task.line}</small></td>
                <td><Tag tone={getTagTone(task.aiPriorityLabel)}>{task.aiPriorityLabel}</Tag></td>
                <td><b className={task.aiPriorityScore >= 75 ? "danger" : ""}>{Math.round(task.aiPriorityScore)}</b><small>/100</small></td>
                <td><small>Safety {task.safetyRisk} · Delay {task.delayImpact}<br />Criticality {task.assetCriticality} · Urgency {task.maintenanceUrgency}</small></td>
                <td>{getRecommendation(task.aiPriorityScore)}</td>
              </tr>
            ))}</tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AIPriorityEngine;
