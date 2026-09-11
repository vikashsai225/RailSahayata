import React from "react";

const conflictData = [
  {
    id: "CF-201",
    corridor: "Delhi–Amritsar",
    type: "Track Occupancy",
    severity: "Critical",
    status: "Auto Resolved",
    action: "Shift maintenance to alternate slot",
    score: 92,
  },
  {
    id: "CF-202",
    corridor: "Mumbai–Pune",
    type: "Signal Conflict",
    severity: "High",
    status: "Escalated",
    action: "Manual dispatch approval required",
    score: 81,
  },
  {
    id: "CF-203",
    corridor: "Kolkata–Asansol",
    type: "Platform Clash",
    severity: "Medium",
    status: "Pending",
    action: "Reassign platform for freight movement",
    score: 68,
  },
  {
    id: "CF-204",
    corridor: "Chennai–Bengaluru",
    type: "Weather Delay",
    severity: "High",
    status: "Monitoring",
    action: "Reroute slow freight trains",
    score: 74,
  },
];

const severityStyles = {
  Critical: { bg: "#fee2e2", color: "#b91c1c" },
  High: { bg: "#fef3c7", color: "#b45309" },
  Medium: { bg: "#dbeafe", color: "#1d4ed8" },
};

const statusStyles = {
  "Auto Resolved": { bg: "#dcfce7", color: "#166534" },
  Escalated: { bg: "#f3e8ff", color: "#6d28d9" },
  Pending: { bg: "#f1f5f9", color: "#334155" },
  Monitoring: { bg: "#e0f2fe", color: "#0f766e" },
};

const ConflictResolution = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div style={{ color: "#475569", fontSize: 13, letterSpacing: 1.1 }}>
              OPERATIONS
            </div>
            <h2 style={{ margin: "8px 0 0", fontSize: 32, color: "#0f172a" }}>
              Conflict Resolution
            </h2>
          </div>

          <button
            style={{
              background: "#0f172a",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Resolve All
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>Open Conflicts</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>18</div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>Critical</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10, color: "#dc2626" }}>
              5
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>Auto Resolved</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10, color: "#15803d" }}>
              9
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>Avg Risk</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10, color: "#7c3aed" }}>
              77
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 20px 0 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 22, color: "#0f172a" }}>
              Resolution Queue
            </h3>
            <div style={{ color: "#64748b", fontSize: 14 }}>Updated 5 min ago</div>
          </div>

          <div style={{ overflowX: "auto", padding: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ textAlign: "left", padding: "14px 12px", color: "#334155" }}>
                    ID
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", color: "#334155" }}>
                    Corridor
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", color: "#334155" }}>
                    Type
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", color: "#334155" }}>
                    Severity
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", color: "#334155" }}>
                    Status
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", color: "#334155" }}>
                    Action
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", color: "#334155" }}>
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {conflictData.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "16px 12px", fontWeight: 700 }}>{item.id}</td>
                    <td style={{ padding: "16px 12px" }}>{item.corridor}</td>
                    <td style={{ padding: "16px 12px" }}>{item.type}</td>
                    <td style={{ padding: "16px 12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background: severityStyles[item.severity]?.bg || "#f3f4f6",
                          color: severityStyles[item.severity]?.color || "#0f172a",
                        }}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td style={{ padding: "16px 12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background: statusStyles[item.status]?.bg || "#f3f4f6",
                          color: statusStyles[item.status]?.color || "#0f172a",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 12px", color: "#475569" }}>{item.action}</td>
                    <td style={{ padding: "16px 12px", fontWeight: 800 }}>{item.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolution;