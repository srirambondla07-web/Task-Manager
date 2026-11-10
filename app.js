document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Application state
    let tasks = [];

    // Add Task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        renderTasks();
        taskForm.reset();
    });

    // Handle complete and delete actions inside the list
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const taskId = parseInt(target.closest('.task-item').dataset.id);

        if (target.classList.contains('complete-btn')) {
            toggleComplete(taskId);
        } else if (target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        }
    });

    // Toggle Task Completion status
    function toggleComplete(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        renderTasks();
    }

    // Delete Task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }

    // Dynamic UI Rendering
    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<li style="text-align:center; color:#888; padding: 20px;">No tasks yet!</li>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <span class="task-text">${escapeHTML(task.text)}</span>
                <div class="actions">
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Done'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    // Helper function to prevent XSS exploits
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});
