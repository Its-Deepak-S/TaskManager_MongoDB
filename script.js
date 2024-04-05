document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');

  // Function to fetch tasks from the backend and display them
  async function fetchAndDisplayTasks() {
    try {
      const response = await fetch('http://localhost:3000/tasks');
      const tasks = await response.json();
      taskList.innerHTML = ''; // Clear previous tasks
      tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.innerHTML = `
          <h3>${task.title}</h3>
          <p>Description: ${task.description}</p>
          <p>Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
          <p>Priority: ${task.priority}</p>
          <p>Status: ${task.status}</p>
          <button class="delete-btn" data-task-id="${task._id}">Delete</button>
        `;
        taskList.appendChild(taskItem);
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  // Event listener for form submission to add a new task
  taskForm.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const taskData = {};
    formData.forEach((value, key) => {
      taskData[key] = value;
    });
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      if (response.ok) {
        console.log('Task added successfully');
        await fetchAndDisplayTasks(); // Refresh task list after adding a new task
        taskForm.reset();
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  });
  taskList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const taskId = event.target.dataset.taskId;
      try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          console.log('Task deleted successfully');
          event.target.parentElement.remove(); // Remove task from UI
        } else {
          console.error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  });
  

  // Initial fetch and display tasks when the page loads
  fetchAndDisplayTasks();
});