import React, { useState } from "react";
import { Card, PageTitle } from "./ui";

const reports = [
	{ title: "Weekly Block Utilization", status: "Available for export", value: "78%", detail: "28 of 36 planned blocks used" },
	{ title: "Monthly Maintenance Planning", status: "Updated today", value: "142", detail: "tasks scheduled this month" },
	{ title: "Department Performance", status: "Available for export", value: "92%", detail: "average on-time completion" },
	{ title: "Asset Availability", status: "Updated today", value: "96.4%", detail: "critical assets operational" },
	{ title: "Critical Defect Register", status: "Available for export", value: "12", detail: "open critical defects" },
	{ title: "Overdue Maintenance", status: "Updated today", value: "7", detail: "tasks need escalation" },
	{ title: "Conflict Resolution", status: "Available for export", value: "18", detail: "conflicts resolved this week" },
	{ title: "AI Optimization Summary", status: "Updated today", value: "14.8%", detail: "estimated planning efficiency gain" },
];

const comparisonRows = [
	["Planning process", "Department-wise", "Integrated"],
	["Conflict detection", "Limited", "Automated review"],
	["Task prioritisation", "Manual", "AI-assisted"],
	["Planning horizon", "Short term", "Weekly + monthly"],
];

const Reports = () => {
	const [selectedReport, setSelectedReport] = useState(null);
	const [exported, setExported] = useState(false);

	const exportReport = () => {
		window.print();
		setExported(true);
	};

	return <div className="page">
		<PageTitle title="Reports & Analytics" subtitle="Decision-ready outputs for planning review and authorized approval." action={<button className="primary" onClick={exportReport}>{exported ? "Exported" : "Export PDF"}</button>} />
		<div className="report-grid">
			{reports.map((report) => <Card key={report.title} title={report.title} subtitle={report.status}>
				<strong className="report-value">{report.value}</strong>
				<span className="report-detail">{report.detail}</span>
				<button className="quiet" onClick={() => setSelectedReport(report)}>View report →</button>
			</Card>)}
		</div>
		{selectedReport && <Card className="report-detail-panel" title={selectedReport.title} subtitle="Report preview">
			<div className="report-preview"><strong>{selectedReport.value}</strong><span>{selectedReport.detail}</span><button className="quiet" onClick={() => setSelectedReport(null)}>Close preview</button></div>
		</Card>}
		<Card title="From independent planning to coordinated intelligence" subtitle="Illustrative prototype comparison">
			<div className="compare"><div><b>Metric</b><b>Before</b><b>With RailSahayata</b></div>{comparisonRows.map((row) => <div key={row[0]}>{row.map((item) => <span key={item}>{item}</span>)}</div>)}</div>
		</Card>
	</div>;
};

export default Reports;
