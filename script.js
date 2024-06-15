// script.js

document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const homeContainer = document.getElementById('home-container');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const todoInput = document.getElementById('new-todo');
    const categorySelect = document.getElementById('category');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterSelect = document.getElementById('filter');

    const checkUserLogin = () => {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        if (email && password) {
            loginContainer.style.display = 'none';
            homeContainer.style.display = 'block';
            renderTodos();
        } else {
            loginContainer.style.display = 'block';
            homeContainer.style.display = 'none';
        }
    };

    loginBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        if (email && password) {
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            checkUserLogin();
        } else {
            alert('Please enter both email and password.');
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        checkUserLogin();
    });

    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        const filterValue = filterSelect.value;
        todoList.innerHTML = '';
        todos
            .filter(todo => filterValue === 'All' || todo.category === filterValue)
            .forEach((todo, index) => {
                const li = document.createElement('li');
                li.className = todo.completed ? 'completed' : '';
                li.innerHTML = `
                    <span>${todo.text} (${todo.category})</span>
                    <div class="buttons">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                `;

                li.addEventListener('click', () => {
                    todo.completed = !todo.completed;
                    saveTodos();
                    renderTodos();
                });

                li.querySelector('.edit-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const newText = prompt('Edit your task:', todo.text);
                    if (newText) {
                        todo.text = newText;
                        saveTodos();
                        renderTodos();
                    }
                });

                li.querySelector('.delete-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    todos.splice(index, 1);
                    saveTodos();
                    renderTodos();
                });

                todoList.appendChild(li);
            });
    };

    addBtn.addEventListener('click', () => {
        const text = todoInput.value.trim();
        const category = categorySelect.value;
        if (text) {
            todos.push({ text, category, completed: false });
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    });

    filterSelect.addEventListener('change', renderTodos);

    checkUserLogin();
});
