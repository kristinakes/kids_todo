const form = document.getElementById('form');
const input = document.getElementById('input');
const todosUl = document.getElementById('todos');
const missingT = document.getElementById('missTask');
const completedT = document.getElementById('completed');
const uncompletedT = document.getElementById('uncompleted');
const double = document.getElementById('double');
const total = document.getElementById('total');
const cashPoints = document.getElementById('points');
const earnings = document.getElementById('earning');

const todos = JSON.parse(localStorage.getItem('todos'));

if(todos) {
    todos.forEach(todo => addTodo(todo)); 
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
});

function addTodo(todo) {  
    let todoText = input.value;

    if(todo) {
        todoText = todo.text;
    };

    if(todoText) {
        const todoEl = document.createElement('li');
        
        if(todo && todo.completed) {
            todoEl.classList.add('completed');
        }

        todoEl.innerText = todoText;
        todoEl.addEventListener('click', () => {
            todoEl.classList.toggle('completed');
            updateLS();
        });

        todoEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            todoEl.remove();
            updateLS();
        });

        todosUl.appendChild(todoEl);
        input.value = '';
        updateLS(); 
    };
}
    
function updateLS() {
    todosEl = document.querySelectorAll('li');
    countPoints(todosEl);

    const todos = [];

    todosEl.forEach(todoEl => {
        todos.push({
            text: todoEl.innerText,
            completed: todoEl.classList.contains('completed')
        });
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}

function reset() {
    let todosL = document.querySelectorAll('li');
    todosL.forEach(element => {
        if(element.classList.contains('completed')){
            element.classList.remove('completed');  
        }
        updateLS();
    });   
}

function countPoints(allTasks) {
    let minTasks = 6;
    let totalT = allTasks.length;
    let completed = 0;
    let price = 0.5;
    
    // count how many tasks needs to be added (min 6)
    if(totalT < minTasks) {
        let missing = minTasks - totalT;
        missingT.innerHTML = missing;
    }
    else if(totalT >= 6) {
        missingT.innerHTML = 'All good';
    }
    
    // Count completed tasks and update status
    allTasks.forEach(task => {
        if (task.classList == 'completed') {
            completed++;
        }
    });
    completedT.innerHTML = completed;
    total.innerHTML = completed;
    cashPoints.innerHTML = completed;
    earnings.innerHTML = completed * price + ' Eur';

    // Count uncompleted tasks
    uncompletedT.innerHTML = totalT - completed;

    //Double/triple points if min 6 tasks completed and count total
    if(completed < 6){
        double.innerHTML =  'Not yet :(';
    }
    else if(completed >= 6 && completed < 10) {
        double.innerHTML =  'Double points!';
        total.innerHTML = completed * 2;
        cashPoints.innerHTML = completed * 2;
        earnings.innerHTML = completed * price * 2 + ' Eur';
    }
    else {
        double.innerHTML = 'Triple points!';
        total.innerHTML = completed * 3;
        cashPoints.innerHTML = completed * 3;
        earnings.innerHTML = completed * price * 3 + ' Eur';
    }
}

function openReceipt() {
    document.querySelector('.modal-content').classList.add('fadein');
    document.querySelector('.modal-content').classList.remove('fadeout');
    document.querySelector('.modal').style.display = 'block';

    getTodaysDate();
}

function sendReceipt() {
    if (confirm('If you pres OK email will be generated and all tasks will be reset automaticaly') == true) {
        generateMail()
    }
    else {
        closeReceipt();
    }
}

function generateMail() {
    let status = document.querySelectorAll('#mail tr');
    let completed = document.querySelectorAll('.completed');
    let mail = '';

    status.forEach(element => {
        mail += element.innerText + '\n';
    });

    mail += '\n' + 'TASKS COMPLETED' + '\n';

    completed.forEach(element => {
        mail += element.innerText + '\n';
    });

    mail = encodeURIComponent(mail);
    window.location='mailto:?subject=Points to cash&body='+mail;

    reset();
    closeReceipt();
}

function closeReceipt() {
    document.querySelector('.modal-content').classList.add('fadeout');
    document.querySelector('.modal-content').classList.remove('fadein');
    document.querySelector('.modal').style.display = 'none';
}

function getTodaysDate() {
    let todayDate = new Date();
    let date = document.getElementById('date');
    date.innerHTML = todayDate.getFullYear() + '-' + (todayDate.getMonth()+1) + '-' + todayDate.getDate();
}

