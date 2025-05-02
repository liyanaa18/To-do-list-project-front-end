let currentFilter = "all";

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

const addBtn = document.getElementById("addTaskButton");
addBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const taskInput = document.querySelector("#taskInput");
  const task = taskInput.value.trim();

  if (task === "") {
    alert("Enter the task");
    return;
  }

  const tasks = getTasksFromLocalStorage();
  tasks.push({ text: task, completed: false });
  saveTasksToLocalStorage(tasks);

  taskInput.value = "";
  renderTasks();
});

function renderTasks() {
  const allTasks = getTasksFromLocalStorage();
  const tasksList = document.getElementById("task-list");
  tasksList.innerHTML = "";

  let filteredTasks = [];
  if (currentFilter === "active") {
    filteredTasks = allTasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = allTasks.filter((task) => task.completed);
  } else {
    filteredTasks = allTasks;
  }

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    if (task.completed) {
      taskText.style.textDecoration = "line-through";
      taskText.style.color = "gray";
    }
    taskItem.appendChild(taskText);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeBtn = document.createElement("i");
    completeBtn.className = "fas fa-check-circle";
    completeBtn.style.cursor = "pointer";
    completeBtn.style.color = task.completed ? "green" : "#aaa";
    completeBtn.addEventListener("click", () => {
      const realIndex = allTasks.findIndex((t) => t.text === task.text);
      allTasks[realIndex].completed = !allTasks[realIndex].completed;
      saveTasksToLocalStorage(allTasks);
      renderTasks();
    });
    actions.appendChild(completeBtn);

    const editBtn = document.createElement("i");
    editBtn.className = "fas fa-edit";
    editBtn.style.cursor = "pointer";
    editBtn.style.color = "blue";
    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit the task:", task.text);
      if (newText !== null) {
        const trimmed = newText.trim();
        if (trimmed !== "") {
          const realIndex = allTasks.findIndex((t) => t.text === task.text);
          allTasks[realIndex].text = trimmed;
          saveTasksToLocalStorage(allTasks);
          renderTasks();
        } else {
          alert("Enter the task!");
        }
      }
    });
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement("i");
    deleteBtn.className = "fas fa-trash";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.color = "red";
    deleteBtn.addEventListener("click", () => {
      const realIndex = allTasks.findIndex((t) => t.text === task.text);
      allTasks.splice(realIndex, 1);
      saveTasksToLocalStorage(allTasks);
      renderTasks();
    });
    actions.appendChild(deleteBtn);

    taskItem.appendChild(actions);
    tasksList.appendChild(taskItem);
  });

  const completedCount = allTasks.filter((task) => task.completed).length;
  const remainingCount = allTasks.length - completedCount;
  document.getElementById("completed-count").textContent = completedCount;
  document.getElementById("remaining-count").textContent = remainingCount;

  updateFilterButtons();
}

document.getElementById("allTasks").addEventListener("click", () => {
  currentFilter = "all";
  renderTasks();
});

document.getElementById("activeTasks").addEventListener("click", () => {
  currentFilter = "active";
  renderTasks();
});

document.getElementById("completedTasks").addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks();
});

function updateFilterButtons() {
  const allBtn = document.getElementById("allTasks");
  const activeBtn = document.getElementById("activeTasks");
  const completedBtn = document.getElementById("completedTasks");

  allBtn.classList.remove("active");
  activeBtn.classList.remove("active");
  completedBtn.classList.remove("active");

  if (currentFilter === "all") {
    allBtn.classList.add("active");
  } else if (currentFilter === "active") {
    activeBtn.classList.add("active");
  } else if (currentFilter === "completed") {
    completedBtn.classList.add("active");
  }
}

window.onload = renderTasks;
