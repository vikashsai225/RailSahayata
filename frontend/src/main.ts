import "./style.css";

import {
  getTasks,
  createTask,
  type Task,
  type NewTask,
} from "./api";

const app = document.querySelector<HTMLDivElement>("#app");

let tasks: Task[] = [];
let searchText = "";
let selectedStatus = "All";
let selectedDepartment = "All";

function railwayLogo() {
  return `
    <img
      src="/logos/indian-railways.png"
      alt="Indian Railways Official Logo"
      class="real-railway-logo"
    />
  `;
}

function g20Logo() {
  return `
    <img
      src="/logos/g20-india.png"
      alt="G20 India 2023 Official Logo"
      class="real-g20-logo"
    />
  `;
}

function priorityClass(priority: string) {
  return priority.toLowerCase();
}

function filteredTasks() {
  return tasks.filter((task) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      task.id.toLowerCase().includes(search) ||
      task.asset.toLowerCase().includes(search) ||
      task.location.toLowerCase().includes(search) ||
      task.defect.toLowerCase().includes(search) ||
      task.department.toLowerCase().includes(search);

    const matchesStatus =
      selectedStatus === "All" || task.status === selectedStatus;

    const matchesDepartment =
      selectedDepartment === "All" ||
      task.department === selectedDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });
}

function render() {
  if (!app) return;

  const visibleTasks = filteredTasks();

  const critical = tasks.filter(
    (task) => task.criticality === "Critical"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const scheduled = tasks.filter(
    (task) => task.status === "Scheduled"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const departments = [
    "All",
    ...new Set(tasks.map((task) => task.department)),
  ];

  app.innerHTML = `
    <div class="app-shell">

      <header class="top-header">

        <div class="brand-section">
          ${railwayLogo()}

          <div class="brand-text">
            <h1>Indian Railways</h1>
            <p>Ministry of Railways</p>
            <small>Government of India</small>
          </div>
        </div>

        <div class="portal-title">
          <span class="portal-kicker">
            RAILWAY OPERATIONS PLATFORM
          </span>

          <h2>RailSahayata</h2>

          <p>
            Integrated Maintenance & Block Planning Command Center
          </p>
        </div>

        <div class="header-right">
          <div class="government-text">
            <strong>भारत सरकार</strong>
            <span>Government of India</span>
          </div>

          ${g20Logo()}
        </div>

      </header>

      <div class="status-bar">
        <span>● System Online</span>
        <span>Backend Connected</span>
        <span>${new Date().toLocaleDateString("en-IN")}</span>
        <span class="status-user">Railway Planner ▾</span>
      </div>

      <div class="layout">

        <aside class="sidebar">
          <div class="sidebar-title">MAIN MENU</div>

          <nav>
            <button class="nav-item active">
              ⌂ <span>Dashboard</span>
            </button>

            <button class="nav-item">
              ▣ <span>Maintenance Tasks</span>
            </button>

            <button class="nav-item">
              🚦 <span>Corridor Availability</span>
            </button>

            <button class="nav-item">
              ✦ <span>AI Priority Engine</span>
            </button>

            <button class="nav-item">
              ▤ <span>Block Planning</span>
            </button>

            <button class="nav-item">
              ⚠ <span>Conflict Resolution</span>
            </button>

            <button class="nav-item">
              ▥ <span>Reports & Analytics</span>
            </button>

            <button class="nav-item">
              ⚙ <span>System Integration</span>
            </button>
          </nav>

          <div class="sidebar-bottom">
            <div class="rail-symbol">🚆</div>
            <strong>भारतीय रेल</strong>
            <span>राष्ट्र की जीवन रेखा</span>
            <div class="tricolor"></div>
          </div>
        </aside>

        <main class="main-content">

          <section class="hero-banner">
            <div>
              <span class="hero-kicker">
                RAILWAY MAINTENANCE COMMAND CENTER
              </span>

              <h2>Maintenance Planning Dashboard</h2>

              <p>
                Plan, prioritize and monitor railway maintenance
                activities using intelligent decision support.
              </p>
            </div>

            <button
              class="primary-button"
              id="generatePlanBtn"
            >
              ✦ Generate Optimized Plan
            </button>
          </section>

          <section class="kpi-grid">

            <div class="kpi-card">
              <div class="kpi-icon blue">▣</div>

              <div>
                <span>Total Tasks</span>
                <h2>${tasks.length}</h2>
                <small>All maintenance activities</small>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon red">⚠</div>

              <div>
                <span>Critical Tasks</span>
                <h2>${critical}</h2>
                <small>Require immediate attention</small>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon orange">◷</div>

              <div>
                <span>Pending Tasks</span>
                <h2>${pending}</h2>
                <small>Awaiting scheduling</small>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon green">✓</div>

              <div>
                <span>Completed Tasks</span>
                <h2>${completed}</h2>
                <small>${scheduled} currently scheduled</small>
              </div>
            </div>

          </section>

          <section class="content-grid">

            <div class="panel">
              <div class="panel-heading">
                <div>
                  <h3>Add Maintenance Task</h3>
                  <p>
                    Register a new railway maintenance requirement
                  </p>
                </div>

                <span class="badge blue-badge">NEW TASK</span>
              </div>

              <form class="task-form" id="taskForm">

                <div class="form-group">
                  <label>Department</label>

                  <select name="department" required>
                    <option value="">
                      Select department
                    </option>

                    <option>Engineering</option>
                    <option>Traction Distribution</option>
                    <option>Signal & Telecommunication</option>
                    <option>Electrical</option>
                    <option>Operations</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Asset ID</label>

                  <input
                    name="asset"
                    placeholder="Example: Track-204"
                    required
                  />
                </div>

                <div class="form-group">
                  <label>Location</label>

                  <input
                    name="location"
                    placeholder="Example: Bhilai Section"
                    required
                  />
                </div>

                <div class="form-group">
                  <label>Defect / Requirement</label>

                  <input
                    name="defect"
                    placeholder="Enter maintenance requirement"
                    required
                  />
                </div>

                <div class="form-group">
                  <label>Criticality</label>

                  <select name="criticality" required>
                    <option value="">
                      Select criticality
                    </option>

                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <button
                  class="primary-button submit-button"
                  type="submit"
                >
                  + Add Maintenance Task
                </button>

              </form>

              <p class="form-message" id="formMessage"></p>
            </div>

            <div class="panel">
              <div class="panel-heading">
                <div>
                  <h3>AI Priority Engine</h3>
                  <p>
                    Intelligent maintenance decision support
                  </p>
                </div>

                <span class="badge purple">
                  AI ENABLED
                </span>
              </div>

              <div class="ai-box">
                <div class="ai-icon">✦</div>

                <h3>Smart Priority Recommendation</h3>

                <p>
                  The AI engine evaluates criticality, asset condition,
                  location and operational impact to recommend task priority.
                </p>

                <div class="ai-stats">
                  <div>
                    <strong>${critical}</strong>
                    <span>Critical Alerts</span>
                  </div>

                  <div>
                    <strong>${tasks.length}</strong>
                    <span>Tasks Analysed</span>
                  </div>
                </div>

                <button
                  class="secondary-button"
                  id="aiInsightBtn"
                >
                  View AI Insight
                </button>
              </div>
            </div>

          </section>

          <section class="panel overview-panel">

            <div class="panel-heading table-heading">
              <div>
                <h3>Maintenance Task Overview</h3>
                <p>
                  Live railway maintenance task register
                </p>
              </div>

              <div class="table-actions">

                <input
                  id="searchInput"
                  class="search-input"
                  placeholder="Search tasks..."
                  value="${searchText}"
                />

                <select
                  id="statusFilter"
                  class="filter-select"
                >
                  <option
                    ${selectedStatus === "All" ? "selected" : ""}
                  >
                    All
                  </option>

                  <option
                    ${selectedStatus === "Pending" ? "selected" : ""}
                  >
                    Pending
                  </option>

                  <option
                    ${selectedStatus === "Scheduled" ? "selected" : ""}
                  >
                    Scheduled
                  </option>

                  <option
                    ${selectedStatus === "Completed" ? "selected" : ""}
                  >
                    Completed
                  </option>
                </select>

                <select
                  id="departmentFilter"
                  class="filter-select"
                >
                  ${departments
                    .map(
                      (department) =>
                        `<option
                          ${
                            selectedDepartment === department
                              ? "selected"
                              : ""
                          }
                        >
                          ${department}
                        </option>`
                    )
                    .join("")}
                </select>

              </div>
            </div>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Department</th>
                    <th>Asset</th>
                    <th>Location</th>
                    <th>Defect</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  ${
                    visibleTasks.length
                      ? visibleTasks
                          .map(
                            (task) => `
                              <tr>
                                <td>
                                  <strong>${task.id}</strong>
                                </td>

                                <td>${task.department}</td>
                                <td>${task.asset}</td>
                                <td>${task.location}</td>
                                <td>${task.defect}</td>

                                <td>
                                  <span
                                    class="priority ${priorityClass(
                                      task.criticality
                                    )}"
                                  >
                                    ${task.criticality}
                                    <small>
                                      ${task.priorityScore}
                                    </small>
                                  </span>
                                </td>

                                <td>
                                  <span class="status-badge">
                                    ${task.status}
                                  </span>
                                </td>
                              </tr>
                            `
                          )
                          .join("")
                      : `
                        <tr>
                          <td
                            colspan="7"
                            class="empty-state"
                          >
                            No maintenance tasks found
                          </td>
                        </tr>
                      `
                  }
                </tbody>
              </table>
            </div>

          </section>

          <section class="bottom-grid">

            <div class="panel">
              <div class="panel-heading">
                <div>
                  <h3>Weekly Maintenance Activity</h3>
                  <p>Task distribution overview</p>
                </div>
              </div>

              <div class="chart">
                ${[42, 65, 50, 78, 58, 88, 70]
                  .map(
                    (height, index) => `
                      <div class="chart-column">
                        <div
                          class="chart-bar"
                          style="height:${height}%"
                        ></div>

                        <span>
                          ${
                            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                              index
                            ]
                          }
                        </span>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            </div>

            <div class="panel">
              <div class="panel-heading">
                <div>
                  <h3>Railway Network Status</h3>
                  <p>Current system monitoring</p>
                </div>
              </div>

              <div class="network-status">

                <div>
                  <span class="status-light green-light"></span>
                  <strong>Backend API</strong>
                  <small>Connected and responding</small>
                </div>

                <div>
                  <span class="status-light blue-light"></span>
                  <strong>Task Database</strong>
                  <small>Data synchronization active</small>
                </div>

                <div>
                  <span class="status-light orange-light"></span>
                  <strong>AI Priority Engine</strong>
                  <small>Ready for analysis</small>
                </div>

              </div>
            </div>

          </section>

          <footer class="page-footer">
            <span>RailSahayata</span>
            <span>Digital Maintenance Coordination Platform</span>
            <strong>For demonstration and SIH prototype use</strong>
          </footer>

        </main>
      </div>
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  document
    .querySelector<HTMLInputElement>("#searchInput")
    ?.addEventListener("input", (event) => {
      searchText = (event.target as HTMLInputElement).value;
      render();
    });

  document
    .querySelector<HTMLSelectElement>("#statusFilter")
    ?.addEventListener("change", (event) => {
      selectedStatus = (event.target as HTMLSelectElement).value;
      render();
    });

  document
    .querySelector<HTMLSelectElement>("#departmentFilter")
    ?.addEventListener("change", (event) => {
      selectedDepartment = (event.target as HTMLSelectElement).value;
      render();
    });

  document
    .querySelector<HTMLFormElement>("#taskForm")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();

      const form = event.target as HTMLFormElement;
      const message = document.querySelector("#formMessage");
      const formData = new FormData(form);

      const newTask: NewTask = {
        department: String(formData.get("department") || ""),
        asset: String(formData.get("asset") || ""),
        location: String(formData.get("location") || ""),
        defect: String(formData.get("defect") || ""),
        criticality: String(formData.get("criticality") || ""),
      };

      try {
        if (message) {
          message.textContent = "Task submit हो रहा है...";
          message.className = "form-message loading";
        }

        await createTask(newTask);
        tasks = await getTasks();

        if (message) {
          message.textContent =
            "Maintenance task successfully added.";
          message.className = "form-message success";
        }

        form.reset();
        render();
      } catch (error) {
        if (message) {
          message.textContent =
            error instanceof Error
              ? error.message
              : "Something went wrong";

          message.className = "form-message error";
        }
      }
    });

  document
    .querySelector("#generatePlanBtn")
    ?.addEventListener("click", () => {
      alert(
        "AI Optimized Plan Generated!\n\n" +
          "Critical tasks को सबसे पहले schedule किया जाएगा."
      );
    });

  document
    .querySelector("#aiInsightBtn")
    ?.addEventListener("click", () => {
      const criticalTasks = tasks.filter(
        (task) => task.criticality === "Critical"
      ).length;

      alert(
        `AI Insight:\n\n${criticalTasks} critical tasks require immediate attention.`
      );
    });
}

async function init() {
  try {
    tasks = await getTasks();
    render();
  } catch {
    if (app) {
      app.innerHTML = `
        <div class="error-screen">
          <h2>RailSahayata</h2>
          <p>
            Backend connected नहीं है।
            पहले server start करें।
          </p>
          <code>node server.js</code>
        </div>
      `;
    }
  }
}

init();