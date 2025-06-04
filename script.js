const library = [];
const libraryItem = document.querySelector('.books');

const bookForm = document.querySelector('form');
bookForm.addEventListener('submit', () => {
    event.preventDefault();
    addBookToLibrary();
    if (library.at(-1).slot !== null) {
        return;
    }
    library.at(-1).slot = addBookItemToPage(library.at(-1).book);
});
libraryItem.addEventListener('click', () => {
    if (event.target.className === 'remove-btn') {
        let bookItem = event.target.parentElement;
        for (let i = 0; i < library.length; i++) {
            if (bookItem === library[i].slot) {
                library.splice(i, 1);
            }
        }
        removeBookItemFromPage(bookItem);
    }
});

const closingFormBtn = document.querySelector('#closing-button button');
closingFormBtn.addEventListener('click', closeAddingForm);

function addBookToLibrary() {
    let title = document.querySelector('form input#title').value;
    let author = document.querySelector('form input#author').value;
    if (title.length === 0 || author.length === 0) {
        return;
    }
    let readStatus = document.querySelector('form input#read-status-1').checked;

    newBook = new Book(title, author, readStatus);
    library.push({
        'uuid': newBook.getUUID(),
        'book': newBook,
        'slot': null,
    });
}

function addBookItemToPage(book) {
    if (!book) {
        return;
    }
    let title = book.getTitle();
    let author = book.getAuthor();
    let readStatus = book.getReadStatus();

    const newBookItem = document.createElement('div');
    newBookItem.classList.toggle('book');
    readStatus ? newBookItem.classList.add('read') : newBookItem.classList.add('unread');

    const components = [
        {
            'tag': 'div', 'class': 'cover', 'textContent': '',
        },
        {
            'tag': 'p', 'class': 'title', 'textContent': title,
        },
        {
            'tag': 'p', 'class': 'author', 'textContent': author,
        },
        {
            'tag': 'button', 'class': 'edit-btn', 'textContent': 'Edit',
        },
        {
            'tag': 'button', 'class': 'remove-btn', 'textContent': 'Remove',
        },
    ];
    for (const component of components) {
        const newComponent = document.createElement(component.tag);
        newComponent.classList.toggle(component.class);
        newComponent.textContent = component.textContent;
        newBookItem.appendChild(newComponent);
    }

    libraryItem.appendChild(newBookItem);
    return newBookItem;
}

function removeBookItemFromPage(bookItem) {
    if (!bookItem || !bookItem.classList.contains('book')) {
        return;
    }

    libraryItem.removeChild(bookItem);
}

function closeAddingForm() {
    const addingForm = document.querySelector('div.adding-form');
    const doc = document.querySelector('body');

    doc.removeChild(addingForm);
    libraryItem.style.gridColumn = '1 / -1';
}

function Book(title, author, readStatus = false) {
    if (!new.target) {
        throw Error("Attempted to initialize without the 'new' operator!");
    }

    this.title = title;
    this.author = author;
    this.readStatus = readStatus;
    this.uuid = crypto.randomUUID();
}

// getters
Book.prototype.getTitle = function () {
    return this.title;
}
Book.prototype.getAuthor = function () {
    return this.author;
}
Book.prototype.getReadStatus = function () {
    return this.readStatus;
}
Book.prototype.getUUID = function () {
    return this.uuid;
}

// setters
Book.prototype.setTitle = function (title) {
    this.title = title;
}
Book.prototype.setAuthor = function(author) {
    this.author = author;
}
Book.prototype.setReadStatus = function(readStatus) {
    this.readStatus = readStatus;
}