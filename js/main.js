import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const toDoList = new ToDoList();

// Launch app
document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});

function initApp() {
    //Add listeners
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", function(event) {
        // preventing submission reload
        event.preventDefault();
        processSubmission();
    })

    const clearItems = document.getElementById("clearItems");
    clearItems.addEventListener("click", function() {
        const list = toDoList.getList();
        if (list.length) {
            const confirmed = confirm("Are you sure you want to clear the entire list?");
            if (confirmed) {
                toDoList.clearList();
                updatePersistentData(toDoList.getList());
                refreshThePage();
            }
        }
    })

    //Procedural
    loadListObject();
    refreshThePage();
}

function loadListObject() {
    const storedList = localStorage.getItem("myToDoList");
    if (typeof storedList !== "string") return;
    const parsedList = JSON.parse(storedList);
    parsedList.forEach(itemObj => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);
        toDoList.addItemToList(newToDoItem);
    });
}

function refreshThePage() {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry;
}

function clearListDisplay() {
    const parentElement = document.getElementById("listItems");
    deleteContents(parentElement);
}

function deleteContents(parentElement) {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

function renderList() {
    const list = toDoList.getList();
    list.forEach(item => {
        buildListItem(item);
    });
}

function buildListItem(item) {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;
    addClickListenerToCheckbox(check);
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div)
}

function addClickListenerToCheckbox(checkbox) {
    checkbox.addEventListener("click", (event) => {
        toDoList.removeItemFromList(checkbox.id);
        updatePersistentData(toDoList.getList());
        const removedText = getLabelText(checkbox.id)
        updateScreenReaderConfirmation(removedText, "removed from the list");
        setTimeout(() => {
            refreshThePage();
        }, 500);
    });
}

function getLabelText(checkboxId) {
    return document.getElementById(checkboxId).nextElementSibling.textContent;
}

function updatePersistentData(listArray) {
    localStorage.setItem("myToDoList", JSON.stringify(listArray));
}

function clearItemEntryField() {
    // clears text input box
    document.getElementById("newItem").value = "";
}

function setFocusOnItemEntry() {
    document.getElementById("newItem").focus();
}

function processSubmission() {
    const newEntryText = getNewEntry();
    if (newEntryText.length == 0) return;
    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addItemToList(toDoItem);
    updatePersistentData(toDoList.getList());
    updateScreenReaderConfirmation(newEntryText, "added to the list");
    refreshThePage();
}

function getNewEntry() {
    return document.getElementById("newItem").value.trim();
}

function calcNextItemId() {
    let nextItemId = 1;
    const list = toDoList.getList();
    if (list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
}

function createNewItem(itemId, itemText) {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;
}

function updateScreenReaderConfirmation(newEntryText, actionVerb) {
    document.getElementById("confirmation").textContent = `${newEntryText} ${actionVerb}`;
}