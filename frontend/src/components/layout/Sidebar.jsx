import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "▦" },
  { label: "Maintenance Tasks", path: "/maintenance-tasks", icon: "◫" },
  { label: "Corridor Availability", path: "/corridor-availability", icon: "⌁" },
  { label: "AI Priority Engine", path: "/ai-priority", icon: "✦" },
  { label: "Automatic Block Planning", path: "/block-planning", icon: "◈" },
  { label: "Weekly Planning", path: "/weekly-planning", icon: "▤" },
  { label: "Monthly Planning", path: "/monthly-planning", icon: "▥" },
  { label: "Train & Goods Movement", path: "/corridor-availability", icon: "▰" },
  { label: "Conflict Resolution", path: "/conflict-resolution", icon: "!" },
  { label: "Reports & Analytics", path: "/reports", icon: "◔" },
  { label: "User Management", path: "/system-integration", icon: "●" },
  { label: "System Integration", path: "/system-integration", icon: "◎" },
  { label: "Help & Support", path: "/help-support", icon: "?" },
];

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <div className="side-brand"><img src="/logos/indian-railways.png" alt="Indian Railways" /><div><b>RailSahayata</b><small>RAIL OPERATIONS</small></div></div>
      <p className="side-label">COMMAND CENTER</p>
      <nav>
        {navItems.map((item, index) => (
          <NavLink
            key={`${item.path}-${index}`}
            to={item.path}
            style={({ isActive }) => ({
              background: isActive ? "#1d5e96" : "transparent",
            })}
          >
            <i>{item.icon}</i>{item.label}
          </NavLink>
        ))}
      </nav>
      <div className="side-train"><img src="/logos/railway-train.jpg" alt="Indian Railways train" /></div><div className="side-footer"><b>INDIAN RAILWAYS</b><span>Lifeline of the Nation</span><em>● All integrations healthy</em></div>
    </aside>
  );
};

export default Sidebar;
