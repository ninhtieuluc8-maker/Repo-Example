const defaults = [
  { id: 1, title: "Phác thảo kế hoạch dự án", priority: "high", done: true },
  { id: 2, title: "Trả lời email quan trọng", priority: "normal", done: true },
  { id: 3, title: "Đi bộ 20 phút sau giờ trưa", priority: "normal", done: true },
  { id: 4, title: "Hoàn thiện bản trình bày", priority: "high", done: false },
  { id: 5, title: "Đọc 10 trang sách", priority: "normal", done: false },
];

const storedTasks = localStorage.getItem("focusflow-tasks");
let tasks = storedTasks ? JSON.parse(storedTasks) : defaults;
let filter = "all";
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const form = document.querySelector("#add-task-form");
const input = document.querySelector("#task-input");

function save() { localStorage.setItem("focusflow-tasks", JSON.stringify(tasks)); }
function visibleTasks() { return tasks.filter((task) => filter === "all" || (filter === "done" ? task.done : !task.done)); }
function escapeHtml(value) { const element = document.createElement("div"); element.textContent = value; return element.innerHTML; }

function render() {
  const displayed = visibleTasks();
  list.innerHTML = displayed.map((task) => `<li class="task ${task.done ? "completed" : ""}"><div class="task-main"><button class="check" data-toggle="${task.id}" aria-label="Đánh dấu ${task.done ? "chưa hoàn thành" : "hoàn thành"}">${task.done ? "✓" : ""}</button><span class="task-title">${escapeHtml(task.title)}</span></div>${task.priority === "high" ? '<span class="tag">Quan trọng</span>' : ""}<button class="remove" data-remove="${task.id}" aria-label="Xoá công việc">×</button></li>`).join("");
  emptyState.hidden = displayed.length > 0;
  const completed = tasks.filter((task) => task.done).length;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  document.querySelector("#progress-label").textContent = `${completed} / ${tasks.length} việc đã hoàn thành`;
  document.querySelector("#progress-percent").textContent = `${percent}%`;
  document.querySelector("#progress-value").style.width = `${percent}%`;
}

form.addEventListener("submit", (event) => { event.preventDefault(); const title = input.value.trim(); if (!title) return; tasks.unshift({ id: Date.now(), title, priority: form.priority.value, done: false }); input.value = ""; save(); render(); input.focus(); });
list.addEventListener("click", (event) => { const id = Number(event.target.dataset.toggle || event.target.dataset.remove); if (!id) return; if (event.target.dataset.toggle) tasks = tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task); else tasks = tasks.filter((task) => task.id !== id); save(); render(); });
document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", () => { filter = button.dataset.filter; document.querySelector(".filter.active").classList.remove("active"); button.classList.add("active"); render(); }));
render();
