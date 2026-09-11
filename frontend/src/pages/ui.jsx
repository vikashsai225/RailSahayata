import React from "react";

export const tasks = [
  { id: "ST-208", department: "S&T", asset: "Electronic Interlocking", location: "NDL–GZB / CR-04", defect: "Intermittent relay feedback", criticality: "Critical", score: 96, due: "Today", duration: "90 min" },
  { id: "ENG-104", department: "Engineering", asset: "Turnout 18A", location: "NDL–GZB / CR-04", defect: "Tongue rail wear beyond limit", criticality: "Critical", score: 94, due: "Today", duration: "120 min" },
  { id: "TD-091", department: "Traction", asset: "OHE mast 43/2", location: "KNP–PRYJ / CR-12", defect: "Insulator flashover indication", criticality: "High", score: 88, due: "14 Sep", duration: "75 min" },
  { id: "ST-233", department: "S&T", asset: "Axle Counter", location: "KNP–PRYJ / CR-12", defect: "Cable insulation degradation", criticality: "High", score: 84, due: "13 Sep", duration: "90 min" },
  { id: "ENG-119", department: "Engineering", asset: "Bridge 217", location: "BPL–ET / CR-07", defect: "Expansion joint inspection", criticality: "Medium", score: 73, due: "17 Sep", duration: "60 min" },
];
export const Tag = ({ children, tone = "blue" }) => <span className={`tag ${tone}`}>{children}</span>;
export const PageTitle = ({ eyebrow = "RAILWAY OPERATIONS", title, subtitle, action }) => <div className="page-title"><div><span>{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
export const Metric = ({ label, value, note, tone = "blue" }) => <div className={`metric ${tone}`}><small>{label}</small><b>{value}</b><span>{note}</span></div>;
export const Card = ({ title, subtitle, children, className = "" }) => <section className={`card ${className}`}><div className="card-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>{children}</section>;
export const Table = ({ children }) => <div className="table-wrap"><table>{children}</table></div>;
export const TaskRows = ({ rows = tasks }) => <>{rows.map((task) => <tr key={task.id}><td><b>{task.id}</b></td><td><Tag tone={task.department === "Engineering" ? "blue" : task.department === "S&T" ? "purple" : "orange"}>{task.department}</Tag></td><td>{task.asset}</td><td>{task.location}</td><td>{task.defect}</td><td><Tag tone={task.criticality === "Critical" ? "red" : task.criticality === "High" ? "orange" : "blue"}>{task.criticality}</Tag></td><td><b>{task.score ?? "-"}</b></td></tr>)}</>;
