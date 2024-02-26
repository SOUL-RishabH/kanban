import kanban from "./kanban.js";

const toDo = document.querySelector(".cards.todo");
const pending = document.querySelector(".cards.pending");
const completed = document.querySelector(".cards.completed");

const taskBox = [toDo, pending, completed];

function addTaskCard(task, index) {

    const element = document.createElement("form");
    element.className = "card";
    element.draggable = true;
    element.dataset.id = task.taskId;
    element.innerHTML = `
        <input type="text" name="task" value= "${task.content}" autocomplete="off" disabled="disabled" maxlength="30">
        <div>
            <span class="task-id"># ${task.taskId}</span>
            <span>
                <button class="bi bi-pencil edit" data-id="${task.taskId}"></button>
                <button class="bi bi-check-lg update hide" data-id="${task.taskId}" data-column="${index}"></button>
                <button class="bi bi-trash3 delete" data-id="${task.taskId}" name="submit"></button>
            </span>
        </div>`;

    taskBox[index].appendChild(element);
}

kanban.getAllTasks().forEach((tasks, index) => {
    tasks.forEach((task) => {
        addTaskCard(task, index);
    });
});

const addForm = document.querySelectorAll(".add");
addForm.forEach(form => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (form.task.value) {
            const task = kanban.insertTask(form.submit.dataset.id, form.task.value.trim());
            addTaskCard(task, form.submit.dataset.id);
            form.reset();
        }
    });
});

taskBox.forEach(column => {
    column.addEventListener("click", (event) => {
        event.preventDefault();

        const formInput = event.target.parentElement.parentElement.previousElementSibling;

        if (event.target.classList.contains("edit")) {
            formInput.removeAttribute("disabled");
            event.target.classList.add("hide");
            event.target.nextElementSibling.classList.remove("hide");
        }

        if (event.target.classList.contains("update")) {
            formInput.setAttribute("disabled", "disabled");
            event.target.classList.add("hide");
            event.target.previousElementSibling.classList.remove("hide");

            const taskId = event.target.dataset.id;
            const columnId = event.target.dataset.column;
            const content = formInput.value;

            kanban.updateTask(taskId, {
                columnId: columnId,
                content: content,
            });
        }

        if (event.target.classList.contains("delete")) {
            formInput.parentElement.remove();
            kanban.deleteTask(event.target.dataset.id);
        }
    });

    column.addEventListener("dragstart", (singleCard) => {
        if (singleCard.target.classList.contains("card")) {
            singleCard.target.classList.add("dragging");
        }
    });

    column.addEventListener("dragover", (singleCard) => {
        const card = document.querySelector(".dragging");
        column.appendChild(card);
    });

    column.addEventListener("dragend", (singleCard) => {
        if (singleCard.target.classList.contains("card")) {
            singleCard.target.classList.remove("dragging");

            const taskId = singleCard.target.dataset.id;
            const columnId = singleCard.target.parentElement.dataset.id;
            const content = singleCard.target.task.value;

            kanban.updateTask(taskId, {
                columnId : columnId,
                content : content
            });
        }
    });
});
