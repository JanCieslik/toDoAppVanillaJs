let taskArray = [];


class Task {
    #title
    #textArea
    #timeSpan
    #tasksDiv
    #dateSelect
    #nowDate

    constructor (title, textArea, dateSelect) {
        this.#title = title;
        this.#textArea = textArea;
        this.#dateSelect = new Date (dateSelect);
        this.#nowDate = new Date();
        this.#tasksDiv = document.getElementById('tasks')
        this.render();
    }

    calculateTimeLeft () {
        const diff = this.#dateSelect - this.#nowDate;

        let days = Math.floor(diff/ (1000*60*60*24));

        let hours = Math.floor((diff/ (1000*60*60)) % 24);

        let minutes = Math.floor((diff/ (1000*60)) % 60);

        if(diff <= 0) {
            return "deadline has passed"
        } else if (days<=0){
            return `${hours} hours, ${minutes} minutes`
        } else if (hours<=0){
            return `${minutes} minutes`
        } else {
            return `${days} days, ${hours} hours, ${minutes} minutes`
        }
        
    }

    render () {
        const task = document.createElement('div');
        task.classList.add('container', 'mt-3', 'p-3', 'border', 'border-dark', 'rounded-5');

        const h1 = document.createElement('h1');
        h1.textContent = this.#title;

        const p = document.createElement('p');
        p.classList.add('m-1')
        p.textContent = this.#textArea;


        let h4;
        if (!isNaN(this.#dateSelect)) {
            h4 = document.createElement('h4');
            h4.textContent = `Time Left: `
            this.#timeSpan = document.createElement('span');
            this.#timeSpan.textContent = this.calculateTimeLeft();
            h4.appendChild(this.#timeSpan);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'mt', 'btn-danger');
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener('click', () =>  {
            task.remove();
            taskArray = taskArray.filter(taskObj => taskObj.title !== this.#title);
            localStorage.setItem('tasks', JSON.stringify(taskArray));
            clearInterval(interval);
            });


        task.appendChild(h1);
        task.appendChild(p);
        if (!isNaN(this.#dateSelect)) {
            task.appendChild(h4);
        }
        task.appendChild(deleteBtn);


        this.#tasksDiv.appendChild(task);
        if (this.#timeSpan) {
            const interval = setInterval(() => {
            this.#timeSpan.textContent = this.calculateTimeLeft();
            if(this.#timeSpan.textContent === "deadline has passed") {
                clearInterval(interval);
            }
        }, 60000);
        }
    }
}
    const setTask = (e) => {
        e.preventDefault();
        const title = document.querySelector("#title");
        const textArea = document.querySelector("#textArea");
        const time = document.querySelector("#dateSelect");


        new Task(title.value,textArea.value,time.value);
        taskArray.push({
            title: title.value,
            textArea: textArea.value,
            dateSelect: time.value
        });
        localStorage.setItem('tasks', JSON.stringify(taskArray));


        title.value ="";
        textArea.value ="";
        time.value ="";
    }





document.querySelector('#form').addEventListener('submit', setTask)
window.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('tasks')) {
        taskArray = JSON.parse(localStorage.getItem('tasks'));
        taskArray.forEach(taskObj => {
            new Task(taskObj.title, taskObj.textArea, taskObj.dateSelect);
        });
    };
});

document.querySelector('#ClearBtn').addEventListener('click', () => {
    localStorage.removeItem('tasks');
    taskArray = [];
    document.getElementById('tasks').innerHTML = '';
});

