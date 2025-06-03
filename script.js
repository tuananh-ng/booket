function Book(title, authors, readStatus = false) {
    if (!new.target) {
        throw Error("Attempted to initialize without the 'new' operator!");
    }

    this.title = title;
    this.authors = authors;
    this.readStatus = readStatus;
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