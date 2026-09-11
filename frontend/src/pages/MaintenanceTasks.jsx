import React, { useEffect, useState } from "react";
import { Card, PageTitle, Table, TaskRows, tasks } from "./ui";
import { createTask, getTasks } from "../api";

const emptyTask = { id: "", department: "Engineering", asset: "", location: "", defect: "", criticality: "Medium", due: "", duration: "" };

const MaintenanceTasks = () => {
	const [filter, setFilter] = useState("All");
	const [search, setSearch] = useState("");
	const [taskList, setTaskList] = useState(tasks);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [newTask, setNewTask] = useState(emptyTask);
	const visibleTasks = taskList.filter((task) => (filter === "All" || task.criticality === filter) && `${task.id} ${task.asset} ${task.location} ${task.defect}`.toLowerCase().includes(search.toLowerCase()));
	const updateTask = (event) => setNewTask({ ...newTask, [event.target.name]: event.target.value });
	useEffect(() => {
		getTasks().then(setTaskList).catch(() => setError("Unable to load maintenance tasks. Please start the backend service."))
			.finally(() => setIsLoading(false));
	}, []);
	const addTask = async (event) => {
		event.preventDefault();
		setError("");
		try {
			const savedTask = await createTask(newTask);
			setTaskList((currentTasks) => [savedTask, ...currentTasks]);
			setNewTask(emptyTask);
			setIsAddOpen(false);
		} catch (requestError) {
			setError(requestError.message || "Unable to save maintenance task.");
		}
	};

	return <div className="page">
		<PageTitle title="Maintenance Task Management" subtitle="Unified defects, due maintenance and intervention requests from connected departmental systems." action={<button className="primary" onClick={() => setIsAddOpen(true)}>+ Add Task</button>} />
		<div className="source-grid">{[["TMS", "Engineering", "112 imported tasks"], ["SMMS", "Signal & Telecom", "78 imported tasks"], ["TDMS", "Traction Distribution", "58 imported tasks"]].map(([a, b, c]) => <div className="source" key={a}><b>{a}</b><strong>{b}</strong><span>● Demo Connected • Sync 10:42</span><small>{c}</small></div>)}</div>
		<Card title="Unified maintenance register" subtitle="Demo records drawn from TMS, SMMS and TDMS"><div className="filters"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search task, asset or section" /><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Critical</option><option>High</option><option>Medium</option></select><button>Import data</button><button className="primary">Send to AI priority</button></div>{error && <p className="form-error" role="alert">{error}</p>}{isLoading ? <p>Loading maintenance tasks...</p> : <Table><thead><tr><th>Task ID</th><th>Department</th><th>Asset</th><th>Location / corridor</th><th>Defect / activity</th><th>Criticality</th><th>AI Score</th></tr></thead><tbody><TaskRows rows={visibleTasks} /></tbody></Table>}</Card>
		{isAddOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsAddOpen(false)}><form className="task-modal" onSubmit={addTask}><div className="modal-header"><div><span>NEW REGISTER ENTRY</span><h2>Add maintenance task</h2><p>Capture a local task for the unified maintenance register.</p></div><button type="button" className="modal-close" aria-label="Close" onClick={() => setIsAddOpen(false)}>×</button></div><div className="task-form"><div className="form-group"><label htmlFor="task-id">Task ID</label><input id="task-id" name="id" value={newTask.id} onChange={updateTask} placeholder="ENG-120" required /></div><div className="form-group"><label htmlFor="task-department">Department</label><select id="task-department" name="department" value={newTask.department} onChange={updateTask}><option>Engineering</option><option>S&T</option><option>Traction</option></select></div><div className="form-group"><label htmlFor="task-asset">Asset</label><input id="task-asset" name="asset" value={newTask.asset} onChange={updateTask} placeholder="Turnout 18A" required /></div><div className="form-group"><label htmlFor="task-location">Location / corridor</label><input id="task-location" name="location" value={newTask.location} onChange={updateTask} placeholder="NDL-GZB / CR-04" required /></div><div className="form-group"><label htmlFor="task-defect">Defect / activity</label><input id="task-defect" name="defect" value={newTask.defect} onChange={updateTask} placeholder="Describe the issue" required /></div><div className="form-group"><label htmlFor="task-criticality">Criticality</label><select id="task-criticality" name="criticality" value={newTask.criticality} onChange={updateTask}><option>Critical</option><option>High</option><option>Medium</option></select></div><div className="form-group"><label htmlFor="task-due">Due date</label><input id="task-due" name="due" value={newTask.due} onChange={updateTask} placeholder="18 Sep" /></div><div className="form-group"><label htmlFor="task-duration">Duration</label><input id="task-duration" name="duration" value={newTask.duration} onChange={updateTask} placeholder="60 min" /></div></div><div className="modal-actions"><button type="button" onClick={() => setIsAddOpen(false)}>Cancel</button><button type="submit" className="primary">Add task</button></div></form></div>}
	</div>;
};

export default MaintenanceTasks;
