const taskInput = document.getElementById('taskInput');
const pendingTasksList = document.getElementById('pendingTasks');
const completedTasksList = document.getElementById('completedTasks');

// Load tasks from local storage
const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

// Populate the task lists
function populateTaskLists() {
    pendingTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';

    pendingTasks.forEach((task, index) => {
        const li = createTaskElement(task, index);
        pendingTasksList.appendChild(li);
    });

    completedTasks.forEach((task, index) => {
        const li = createTaskElement(task, index, true);
        completedTasksList.appendChild(li);
    });
}

populateTaskLists();

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString(),
        completedAt: null,
    };

    pendingTasks.push(task);
    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    taskInput.value = '';

    populateTaskLists();
}

// Create a task element
function createTaskElement(task, index, isCompleted = false) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="${isCompleted ? 'completed' : ''}">${task.text}</span>
        <span>${task.createdAt}</span>
        <button class="delete-button" onclick="deleteTask(${index}, ${isCompleted})">Delete</button>
        <button class="edit-button" onclick="editTask(${index}, ${isCompleted})">Edit</button>
        <button onclick="toggleComplete(${index}, ${isCompleted})">${isCompleted ? 'Undo' : 'Complete'}</button>
    `;
    return li;
}

// Toggle task completion
function toggleComplete(index, isCompleted) {
    if (isCompleted) {
        const task = completedTasks[index];
        task.completed = false;
        task.completedAt = null;
        pendingTasks.push(task);
        completedTasks.splice(index, 1);
    } else {
        const task = pendingTasks[index];
        task.completed = true;
        task.completedAt = new Date().toLocaleString();
        completedTasks.push(task);
        pendingTasks.splice(index, 1);
    }

    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

    populateTaskLists();
}

// Delete a task
function deleteTask(index, isCompleted) {
    if (isCompleted) {
        completedTasks.splice(index, 1);
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    } else {
        pendingTasks.splice(index, 1);
        localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    }

    populateTaskLists();
}

// Edit a task
function editTask(index, isCompleted) {
    const tasks = isCompleted ? completedTasks : pendingTasks;
    const editedText = prompt('Edit the task:', tasks[index].text);
    if (editedText !== null) {
        tasks[index].text = editedText;
        localStorage.setItem(isCompleted ? 'completedTasks' : 'pendingTasks', JSON.stringify(tasks));
        populateTaskLists();
    }
}
