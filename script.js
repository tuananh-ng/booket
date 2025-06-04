const library = [];

const bookForm = document.querySelector('form');
bookForm.addEventListener('submit', () => {
    event.preventDefault();
    addBookToLibrary();
    addBookItemToPage(library.at(-1));
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
    let authors = book.getAuthors();
    let readStatus = book.getReadStatus();

    const newBookItem = document.createElement('div');
    newBookItem.classList.toggle('book');
    if (readStatus) {
        newBookItem.classList.add('read');
    } else {
        newBookItem.classList.add('unread');
    }

    const newBookCover = document.createElement('div');
    newBookCover.classList.toggle('cover');
    const newBookTitle = document.createElement('p');
    newBookTitle.classList.toggle('title');
    newBookTitle.textContent = title;
    const newBookAuthor = document.createElement('p');
    newBookAuthor.classList.toggle('author');
    newBookAuthor.textContent = authors;
    const newBookEditBtn = document.createElement('button');
    newBookEditBtn.classList.toggle('edit-btn');
    newBookEditBtn.textContent = 'Edit';
    const newBookRemoveBtn = document.createElement('button');
    newBookRemoveBtn.classList.toggle('remove-btn');
    newBookRemoveBtn.textContent = 'Remove';
    newBookRemoveBtn.addEventListener('click', () => removeBookItemFromPage(newBookItem));

    newBookItem.appendChild(newBookCover);
    newBookItem.appendChild(newBookTitle);
    newBookItem.appendChild(newBookAuthor);
    newBookItem.appendChild(newBookEditBtn);
    newBookItem.appendChild(newBookRemoveBtn);

    const libraryItem = document.querySelector('.books');
    libraryItem.appendChild(newBookItem);
}

function removeBookItemFromPage(bookItem) {
    if (!bookItem || !bookItem.classList.contains('book')) {
        return;
    }

    const libraryItem = document.querySelector('.books');
    libraryItem.removeChild(bookItem);
}

function closeAddingForm() {
    const addingForm = document.querySelector('div.adding-form');
    const libraryItem = document.querySelector('div.books');
    const doc = document.querySelector('body');

    doc.removeChild(addingForm);
    libraryItem.style.gridColumn = '1 / -1';
}

function Book(title, authors, readStatus = false) {
    if (!new.target) {
        throw Error("Attempted to initialize without the 'new' operator!");
    }

    this.title = title;
    this.authors = authors;
    this.readStatus = readStatus;
    this.uuid = crypto.randomUUID();
}

// getters
Book.prototype.getTitle = function () {
    return this.title;
}
Book.prototype.getAuthors = function () {
    return this.authors;
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
Book.prototype.setAuthors = function(authors) {
    this.authors = authors;
}
Book.prototype.setReadStatus = function(readStatus) {
    this.readStatus = readStatus;
}