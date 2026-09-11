import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import AIPriorityEngine from "./pages/AIPriorityEngine";
import BlockPlanning from "./pages/BlockPlanning";
import ConflictResolution from "./pages/ConflictResolution";
import CorridorAvailability from "./pages/CorridorAvailability";
import Dashboard from "./pages/Dashboard";
import MaintenanceTasks from "./pages/MaintenanceTasks";
import WeeklyPlanning from "./pages/WeeklyPlanning";
import MonthlyPlanning from "./pages/MonthlyPlanning";
import Reports from "./pages/Reports";
import SystemIntegration from "./pages/SystemIntegration";
import HelpSupport from "./pages/HelpSupport";

const formatDate = (date) => new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(date);

const formatTime = (date) => new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZoneName: "short",
}).format(date);

const PortalStatus = () => {
  const [now, setNow] = useState(() => new Date());
  const [location, setLocation] = useState("Locating...");
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const findLocation = () => {
    setLocation("Locating...");
    setLocationError(false);

    if (!navigator.geolocation) {
      setLocation("Location not supported");
      setLocationError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const coordinates = `${coords.latitude.toFixed(5)}°, ${coords.longitude.toFixed(5)}°`;
        setLocation(coordinates);

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&zoom=10&addressdetails=1`);
          if (!response.ok) return;
          const place = await response.json();
          const area = place.address?.city || place.address?.town || place.address?.village || place.address?.state;
          if (area) setLocation(`${area} · ${coordinates}`);
        } catch {
          // Coordinates remain visible when reverse geocoding is unavailable.
        }
      },
      () => {
        setLocation("Location permission required");
        setLocationError(true);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    findLocation();
  }, []);

  return <div className="portal-status"><span>▣ &nbsp; {formatDate(now)}</span><span>| &nbsp;{formatTime(now)}</span><span className="current-location" title="Your browser's current location">◉ &nbsp; {location} {locationError && <button type="button" onClick={findLocation}>Retry</button>}</span><span className="status-links">Skip to Main Content　|　A-　A　A+　|　◐　◎ English⌄　|　♟　<span>3</span>　<b>DP</b>　Demo User⌄</span></div>;
};

const AppShell = () => (
  <div className="portal-shell">
    <Sidebar />
    <main className="portal-main">
      <header className="portal-header"><div className="gov-brand"><img src="/logos/government-of-india.svg" alt="Government of India" /></div><div className="portal-brand"><img src="/logos/indian-railways.png" alt="Indian Railways" /><div><span className="header-kicker">भारतीय रेल मंत्रालय</span><b>RailSahayata</b><small>Integrated Maintenance &amp; Block Planning Command Center</small><em>AI for a Smarter, Safer, Greener Indian Railways</em></div></div><div className="header-logos"><img className="g20-header-logo" src="/logos/g20-india.png" alt="G20 India 2023" /><img className="azadi-logo" src="/logos/azadi-amrit-mahotsav.png" alt="Azadi Ka Amrit Mahotsav" /><img className="digital-logo" src="/logos/digital-india.png" alt="Digital India" /></div></header><PortalStatus />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maintenance-tasks" element={<MaintenanceTasks />} />
        <Route path="/ai-priority" element={<AIPriorityEngine />} />
        <Route path="/block-planning" element={<BlockPlanning />} />
        <Route path="/weekly-planning" element={<WeeklyPlanning />} />
        <Route path="/monthly-planning" element={<MonthlyPlanning />} />
        <Route path="/conflict-resolution" element={<ConflictResolution />} />
        <Route path="/corridor-availability" element={<CorridorAvailability />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/system-integration" element={<SystemIntegration />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </main>
  </div>
);

const App = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;[
  {
    "id": "T-101",
    "title": "Signal failure repair",
    "safetyRisk": 90,
    "delayImpact": 80,
    "assetCriticality": 95,
    "maintenanceUrgency": 85,
    "resourceAvailability": 70,
    "zone": "Northern",
    "line": "Delhi–Amritsar"
  },
  {
    "id": "T-102",
    "title": "Track inspection",
    "safetyRisk": 60,
    "delayImpact": 50,
    "assetCriticality": 70,
    "maintenanceUrgency": 55,
    "resourceAvailability": 40,
    "zone": "Western",
    "line": "Mumbai–Pune"
  },
  {
    "id": "T-103",
    "title": "Routine cleaning",
    "safetyRisk": 20,
    "delayImpact": 30,
    "assetCriticality": 35,
    "maintenanceUrgency": 25,
    "resourceAvailability": 60,
    "zone": "Southern",
    "line": "Chennai–Bengaluru"
  },
  {
    "id": "T-104",
    "title": "Bridge inspection",
    "safetyRisk": 88,
    "delayImpact": 72,
    "assetCriticality": 92,
    "maintenanceUrgency": 80,
    "resourceAvailability": 65,
    "zone": "Eastern",
    "line": "Kolkata–Asansol"
  },
  {
    "id": "T-105",
    "title": "Coach AC maintenance",
    "safetyRisk": 45,
    "delayImpact": 58,
    "assetCriticality": 60,
    "maintenanceUrgency": 65,
    "resourceAvailability": 80,
    "zone": "Central",
    "line": "Nagpur–Bhopal"
  }
]
