import {
  checkIcon,
  getEditIcon,
  getDeleteIcon,
  getConfirmIcon,
} from "./utils/icons";

const todoListEl = document.getElementById("todo-list");
const addTodoBtnEl = document.getElementById("add-todo-btn");
const addTodoInputEl = document.getElementById("add-todo-input");

// ### EVENTS
addTodoBtnEl.addEventListener("click", () => {
  addTask(addTodoInputEl.value);

  addTodoInputEl.value = "";
  renderTodoList();
});

const dataFromLocalStorage = localStorage.getItem("todos");
const tasks = dataFromLocalStorage ? JSON.parse(dataFromLocalStorage) : [];

const renderTodoList = () => {
  todoListEl.innerHTML = tasks
    .map(
      (task) => `
        <div class="flex items-center">
            <div class="mr-4">
                ${
                  task.completed
                    ? checkIcon
                    : `<div class="w-8 h-8 border-2 border-transparent hover:border-gray-500 cursor-pointer"></div>`
                }
            </div>
            <div class="flex flex-col py-4 w-[50%]">
            ${
              task.isEditing
                ? `<input id="confirm-btn-${task.id}" value="${task.text}" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">`
                : `<dd class="text-lg font-semibold">${task.text}</dd>`
            }
            </div>
            <div class="flex gap-2 ml-auto">
                ${
                  task.isEditing
                    ? getConfirmIcon(task.id)
                    : getEditIcon(task.id)
                }
                ${getDeleteIcon(task.id)}
            </div>
        </div>
    `
    )
    .join("");

  const allTodoDeleteEls = document.querySelectorAll(".todo-delete-icon");
  const allTodoEditEls = document.querySelectorAll(".todo-edit-icon");
  const allTodoConfirmEls = document.querySelectorAll(".todo-confirm-icon");

  allTodoDeleteEls.forEach((node) => {
    node.addEventListener("click", () => {
      deleteTask(parseInt(node.dataset.taskId));
      renderTodoList();
    });
  });

  allTodoEditEls.forEach((node) => {
    node.addEventListener("click", () => {
      onEditMode(parseInt(node.dataset.taskId));
      renderTodoList();
    });
  });

  allTodoConfirmEls.forEach((node) => {
    node.addEventListener("click", () => {
      const taskId = parseInt(node.dataset.taskId);
      const newText = document.getElementById(`confirm-btn-${taskId}`).value;

      editTask(taskId, newText);
      renderTodoList();
    });
  });

  localStorage.setItem("todos", JSON.stringify(tasks));
};

renderTodoList();

// ### ADD TASK
const addTask = (text) => {
  tasks.unshift({
    text,
    id: tasks.length,
    completed: false,
    isEditing: false,
  });
};

// ### DELETE TASK
const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task.id === id);

  tasks.splice(index, 1);
};

// ### EDIT TASK
const editTask = (id, text) => {
  const index = tasks.findIndex((item) => item.id === id);

  tasks[index] = {
    ...tasks[index],
    text,
    isEditing: false,
  };
};

// ### enterEditing
const onEditMode = (id) => {
  const index = tasks.findIndex((item) => item.id === id);

  tasks[index] = {
    ...tasks[index],
    isEditing: true,
  };
};
