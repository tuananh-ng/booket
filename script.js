const library = [];
let currentEdit = {bookItem: null, bookReference: null};
const libraryItem = document.querySelector('.books');

const content = document.querySelector('body');
content.addEventListener('submit', () => {
    const submitBtn = event.target[5];
    event.preventDefault();
    event.stopPropagation();

    if (submitBtn.classList.contains('change')) {
        const newTitle = document.querySelector('input#title').value;
        const newAuthor = document.querySelector('input#author').value;
        const newReadStatus = document.querySelector('input#read-status-1').checked;

        currentEdit.bookReference.setTitle(newTitle);
        currentEdit.bookReference.setAuthor(newAuthor);
        currentEdit.bookReference.setReadStatus(newReadStatus);

        if (newReadStatus) {
            if (currentEdit.bookItem.classList.contains('unread')) {
                currentEdit.bookItem.classList.toggle('unread');
                currentEdit.bookItem.classList.toggle('read');
            }
        } else {
            if (currentEdit.bookItem.classList.contains('read')) {
                currentEdit.bookItem.classList.toggle('read');
                currentEdit.bookItem.classList.toggle('unread');
            }
        }
        currentEdit.bookItem.childNodes[1].textContent = newTitle;
        currentEdit.bookItem.childNodes[2].textContent = newAuthor;

        currentEdit.bookItem = null;
        currentEdit.bookReference = null;
        closeForm();
        libraryItem.style.gridColumn = '1 / -1';
        return;
    }

    addBookToLibrary();
    if (library.at(-1).slot !== null) {
        return;
    }
    library.at(-1).slot = addBookItemToPage(library.at(-1).book);
});
content.addEventListener('click', () => {
    const bookItem = event.target.parentElement;
    switch (event.target.className) {
        case 'remove':
            for (let i = 0; i < library.length; i++) {
                if (bookItem === library[i].slot) {
                    library.splice(i, 1);
                    break;
                }
            }
            removeBookItemFromPage(bookItem);
            break;
        
        case 'make':
            if (document.querySelector('form')) {
                alert('Please complete your current form or close it to make a new one!');
            } else {
                const newForm = makeForm();
                libraryItem.style.gridColumn = '1 / 2';
                content.appendChild(newForm);
            }
            break;
        
        case 'edit':
            let form = document.querySelector('form');
            currentEdit.bookItem = bookItem;

            for (let i = 0; i < library.length; i++) {
                if (library[i].slot === currentEdit.bookItem) {
                    currentEdit.bookReference = library[i].book;
                    break;
                }
            }

            const bookItemTitle = currentEdit.bookReference.getTitle();
            const bookItemAuthor = currentEdit.bookReference.getAuthor();
            const bookItemReadStatus = currentEdit.bookReference.getReadStatus();
            if (!form) { // when there is no form, the library takes up the whole main section
                libraryItem.style.gridColumn = '1 / 2'; // make space for the new form
            } else {
                closeForm();
            }
            form = makeForm(bookItemTitle, bookItemAuthor, bookItemReadStatus, 'edit');
            content.appendChild(form);
            break;     

        case 'close':
            closeForm();
            libraryItem.style.gridColumn = '1 / -1';
    }
});

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

    const newBookItem = makeElement({element: 'div', class: 'book'});
    readStatus ? newBookItem.classList.add('read') : newBookItem.classList.add('unread');
    const components = [
        {
            'element': 'div', 'class': 'cover', 'textContent': '',
            'style': `background-color: rgb(
                ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}
            );`
        },
        {
            'element': 'p', 'class': 'title', 'textContent': title,
        },
        {
            'element': 'p', 'class': 'author', 'textContent': author,
        },
        {
            'element': 'button', 'class': 'edit', 'textContent': 'Edit',
        },
        {
            'element': 'button', 'class': 'remove', 'textContent': 'Remove',
        },
    ];
    for (const component of components) {
        const newComponent = makeElement(component);
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

function closeForm() {
    const form = document.querySelector('form');
    content.removeChild(form);
}

function makeForm(title = '', author = '', readStatus = false, type = 'add') {
    const newForm = makeElement({element: 'form', action: '', method: 'post'});

    const closeBtn = makeElement({element: 'button', class: 'close', form: '', textContent: 'x'});
    newForm.appendChild(closeBtn);

    const essentials = [{'type': 'title', 'value': title}, {'type': 'author', 'value': author}];
    for (const essential of essentials) {
        const row = makeElement({element: 'div', class: 'form-row'});
        const label = makeElement({
            element: 'label', for: `${essential.type}`, textContent: `${essential.type[0].toUpperCase() + essential.type.slice(1)}`
        });
        const input = makeElement({
            element: 'input', type: 'text', id: `${essential.type}`, name: `book-${essential.type}`, value: `${essential.value}`
        });

        row.appendChild(label);
        row.appendChild(input);
        newForm.appendChild(row);
    }

    const fieldSet = makeElement({element: 'fieldset', class: 'form-row'});
    const legend = makeElement({element: 'legend', textContent: 'Read Status'});
    fieldSet.appendChild(legend);

    const radioOptions = [{'id': 'read-status-0', 'value': 'unread'}, {'id': 'read-status-1', 'value': 'read'}];
    for (const radioOption of radioOptions) {
        const row = makeElement({element: 'div', class: 'radio-option'});

        const radio = makeElement({
            element: 'input', type: 'radio', name: 'read-status', id: `${radioOption.id}`, value: `${radioOption.value}`
        });
        if (readStatus === true && radioOption.value === 'read') {
            radio.toggleAttribute('checked');
        } else if (readStatus === false && radioOption.value === 'unread') {
            radio.toggleAttribute('checked');
        }
        const label = makeElement({
            element: 'label', class: 'radio-label', 'for': `${radioOption.id}`,
            textContent: `${radioOption.value[0].toUpperCase() + radioOption.value.slice(1)}`
        });

        row.appendChild(radio);
        row.appendChild(label);
        fieldSet.appendChild(row);
    }
    newForm.appendChild(fieldSet);

    let btnRow = makeElement({element: 'div', class: 'form-row'});
    let btn = makeElement({element: 'button'});
    btnRow.appendChild(btn);
    newForm.appendChild(btnRow);
    if (type === 'add') {
        btn.textContent = 'Add';
        btn.classList.toggle('add');
    } else if (type === 'edit') {
        btn.textContent = 'Save';
        btn.classList.toggle('change');

        btnRow = makeElement({element: 'div', class: 'form-row'});
        btn = makeElement({element: 'button', class: 'close', form: '', textContent: 'Discard'});
        btnRow.appendChild(btn);
        newForm.appendChild(btnRow);
    }

    return newForm;
}

// Assumes elementDescription is an object whose properties
// are attributes of HTML elements
function makeElement(elementDescription) {
    const attributes = Array.from(Object.keys(elementDescription));
    if (!attributes.includes('element')) throw Error('Please specify an element to create!');
    attributes.splice(attributes.indexOf('element'), 1);

    const newElement = document.createElement(elementDescription.element);
    for (const attribute of attributes) {
        if (attribute === 'textContent'){
            newElement.textContent = elementDescription[attribute];
            continue;
        }
        newElement.setAttribute(attribute, elementDescription[attribute]);
    }
    return newElement;
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