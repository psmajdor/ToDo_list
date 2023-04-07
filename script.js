const form = document.querySelector("[data-form]");
const list = document.querySelector("[data-list]");
const input = document.querySelector("[data-input]");

//local Storage
class Storage {
    static addToStorage(todoArr){
        console.log(todoArr)
        localStorage.setItem("todo", JSON.stringify(todoArr));
        return;
    }
    static getStorage(){
        let storage = localStorage.getItem("todo") === null ? 
        [] : JSON.parse(localStorage.getItem("todo"));
        return storage
    }
}

// array keeping todos 
let todoArr = Storage.getStorage();

// form part 
form.addEventListener("submit", (e) => {
    e.preventDefault();
    id = Math.random();
    if(input.value != "") {
        const todoEl = new Todo(id, input.value);
        todoArr.push(todoEl);
        //add to storage
        Storage.addToStorage(todoArr);
        UI.displayData();
        UI.clearInput();
    }
});

// make object instance 
class Todo {
    constructor(id, todoText) {
        this.id = id;
        this.todo = todoText;
        this.completed = false;
    }
}

// display the todo in the DOM;
class UI {
    static displayData(){
        let displayData = todoArr.map((item) => {
            if(item.completed){
                return `
                <div class="todo__element">
                <p class="complete completed" data-id = ${item.id}>${item.todo}</p>
                <span class="remove" data-id = ${item.id}>🗑️</span>
                </div>
            `
            }
            return `
                <div class="todo__element">
                <p class="complete" data-id = ${item.id}>${item.todo}</p>
                <span class="remove" data-id = ${item.id}>🗑️</span>
                </div>
            `
        })
        displayData.reverse();
        list.innerHTML = (displayData).join(" ");
    }
    static clearInput(){
        input.value = "";
    }
    static completeTodo(){
        list.addEventListener("click", (e) => {
            if(e.target.classList.contains("complete")){
                e.target.classList.toggle("completed");
                let elemId = e.target.dataset.id;
                UI.toggleCompletionInStorage(Number(elemId));
            }
        });
    }
    static toggleCompletionInStorage(id) {
        let toggledElementIndex = todoArr.findIndex((item) => item.id === id);
        todoArr[toggledElementIndex].completed = !(todoArr[toggledElementIndex].completed);
        Storage.addToStorage(todoArr);
    }
    static removeTodo(){
        list.addEventListener("click", (e) => {
            if(e.target.classList.contains("remove")){
                e.target.parentElement.remove();
                let elemId = e.target.dataset.id;
                //remove element form todoArr array.
                UI.removeFromStorage(Number(elemId));
            }
        });
    }
    static removeFromStorage(id){
        todoArr = todoArr.filter((item) => item.id !== id);
        Storage.addToStorage(todoArr);
    }
}

//once the browser is loaded
window.addEventListener("DOMContentLoaded", () => {
    UI.displayData();
    UI.removeTodo();
    UI.completeTodo();
});
