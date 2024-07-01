document.addEventListener('DOMContentLoaded', getNotes);

const form = document.querySelector("#form");
const titleInput = document.querySelector("#title");
const textInput = document.querySelector("#text");
const categorySelect = document.querySelector("#category");
const cardContainer = document.querySelector("#card_container");
const clearButton = document.querySelector("#clear_all");
const searchInput = document.querySelector("#search");

const moods = {
    smile: "smile",
    flushed: "flushed",
    frown: "frown",
    angry: "angry",
    surprise: "surprise",
    wink: "smile-wink",
    hearts: "grin-hearts",
    tired: "tired",
    cry: "sad-cry",
};

for (let mood in moods) {
    let option = document.createElement("option");
    option.value = moods[mood];
    option.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
    categorySelect.appendChild(option);
}

form.addEventListener("submit", addNote);
cardContainer.addEventListener("click", handleCardActions);
clearButton.addEventListener("click", removeAllNotes);
searchInput.addEventListener("input", filterNotes);

function addNote (e) {
    e.preventDefault();
    const title = titleInput.value;
    const text = textInput.value;
    const category = categorySelect.value;

    if (!title || !text || !category) {
        alert("Please fill all fields");
        return;
    }

    const note = {
        title,
        text,
        category,
        date: new Date().toLocaleDateString()
    };

    storeNoteInLocalStorage(note);
    createNoteCard(note);
    form.reset();
}

function handleCardActions(e) {
    if (e.target.closest(".remove")) {
        const card = e.target.closest(".note-card");
        const title = card.querySelector(".card-title").textContent;
        removeNoteFromLocalStorage(title);
        card.remove();
    } else if (e.target.closest(".edit")) {
        const card = e.target.closest(".note-card");
        const title = card.querySelector(".card-title").textContent;
        const text = card.querySelector(".card-text").textContent;
        const category = card.querySelector(".emoji").dataset.mood;

        titleInput.value = title;
        textInput.value = text;
        categorySelect.value = category;

        removeNoteFromLocalStorage(title);
        card.remove();
    }
}

function removeAllNotes() {
    cardContainer.innerHTML = "";
    localStorage.clear();
}

function filterNotes() {
    const searchValue = searchInput.value.toLowerCase();
    document.querySelectorAll(".note-card").forEach(card => {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        card.style.display = title.includes(searchValue) ? "block" : "none";
    });
}

function storeNoteInLocalStorage(note) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
}

function getNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.forEach(createNoteCard);
}

function createNoteCard(note) {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = ` 
        <i class="fas fa-face-${note.category} emoji" data-mood="${note.category}"></i>
        <div class="card-title">${note.title}</div>
        <div class="card-text">${note.text}</div>
        <div class="card-date">Created on ${note.date}</div>
        <div class="card-actions">
            <span class="edit"><i class="fas fa-edit"></i></span>
            <span class="remove"><i class="fas fa-trash"></i></span>
        </div>
    `;
    cardContainer.appendChild(card);
}

function removeNoteFromLocalStorage(title) {
    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes = notes.filter(note => note.title !== title);
    localStorage.setItem("notes", JSON.stringify(notes));
}
