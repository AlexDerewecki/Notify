let notes = [];
const addNoteButton = document.getElementById(`addNote`);
const noteName = document.getElementById(`noteName`)
const noteDialog = document.getElementById(`noteDialog`);
const noteContent = document.getElementById(`noteContent`);
const saveButton = document.getElementById(`saveNote`);
const closeDialogBtn = document.getElementById(`closeDialogHeader`);
const nightModeBtn = document.getElementById(`nightMode`);
const noNotesDiv = document.querySelector(`.no-notes`);
let editIndex = null;



addNoteButton.addEventListener(`click`, () => {
    editIndex = null;
    noteName.value = ``;
    noteContent.value = ``;
    noteDialog.showModal();    
});



saveButton.addEventListener(`click`, (e) => {
    e.preventDefault();
        const name = noteName.value.trim();;
        const content = noteContent.value.trim();
        if (name && content){
            if (editIndex !== null){
                notes[editIndex] = {name, content};
            } else {
                notes.push({name, content});
            }
            saveNotes(); 
            noteName.value = ``;
            noteContent.value = ``;
            noteDialog.close();
            renderNotes();
               
        }        
});

closeDialogBtn.addEventListener(`click`, (e) => {
    e.preventDefault();
    noteDialog.close();
})

function renderNotes(){
    const notesContainer = document.getElementById(`notes-container`)
    notesContainer.innerHTML = ``;
    if (notes.length === 0){
        const noNotesDiv = document.createElement(`div`);
        noNotesDiv.className = `no-notes`;
        noNotesDiv.innerHTML = `
            <h2>no notes yet</h2>
            <button id="addNewNote">+</button>
            <p>Click the + button to add a new note</p>
            `
        notesContainer.appendChild(noNotesDiv);
        addNewNote.addEventListener(`click`, () =>{
        editIndex = null;
        noteName.value = ``;
        noteContent.value = ``;
        noteDialog.showModal();
        
    });

    }


    notes.forEach(noteText => {
        const noteDiv = document.createElement(`div`);



        noteDiv.className = `note`;
        noteDiv.innerHTML = `
            <h3 class="note-name">${noteText.name}</h3>
            <p class="note-content">${noteText.content}</p>
            <button class="edit-button" data-index="${notes.indexOf(noteText)}">✏️</button>
            <button class="delete-button" data-index="${notes.indexOf(noteText)}">🗑️</button>
        `;
        notesContainer.appendChild(noteDiv);


        if (noteText.name.length > 20){
            const truncatedName = noteText.name.substring(0, 20) + `...`;
            noteDiv.querySelector(`.note-name`).textContent = truncatedName;
        }

        if (noteText.content.length > 40){
            const truncatedContent = noteText.content.substring(0, 40) + `...`;
            noteDiv.querySelector(`.note-content`).textContent = truncatedContent;
        }

    });    
    document.querySelectorAll(`.edit-button`).forEach(btn => {
        btn.addEventListener(`click`, function(e){
            e.stopPropagation();
            const idx = this.getAttribute(`data-index`);
            noteName.value = notes[idx].name;
            noteContent.value = notes[idx].content;
            editIndex = idx;
            noteDialog.showModal();
        });
    });
    document.querySelectorAll(`.delete-button`).forEach(btn => {
        btn.addEventListener(`click`, deleteNote.bind(null, btn.getAttribute(`data-index`)))
    });
}
function deleteNote(index){
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

function saveNotes(){
    localStorage.setItem(`notes`, JSON.stringify(notes));
}

function loadNotes(){
    const saved = localStorage.getItem(`notes`);
    if (saved){
        notes = JSON.parse(saved);
    }
}

nightModeBtn.addEventListener(`click`, () => {
    document.body.classList.toggle(`night-mode`);
    nightModeBtn.textContent = document.body.classList.contains(`night-mode`) ? `☀️` : `🌙`;
});
loadNotes();
renderNotes();