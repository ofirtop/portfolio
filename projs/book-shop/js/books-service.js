'use strict'
const BOOKS_SHOP_KEY = 'booksShop';
var gBooks = [];
const ALL = 'All';
var PASWORD_LENGTH = 24;
var gFilterBy = 'All';

function createBooks() {

    gBooks = loadFromStorage(BOOKS_SHOP_KEY);
    if (!gBooks || gBooks.length === 0) {
        gBooks = [];
        gBooks.push(createBook('In Search of Lost Time', 'Marcel Proust', getRandomIntInclusive(50, 200), 'img/In-Search-of-Lost-Time-by-Marcel-Proust.jpg'));
        gBooks.push(createBook('Don Quixote', 'Miguel de Cervantes', getRandomIntInclusive(50, 200), 'img/Don-Quixote-by-Miguel-de-Cervantes.jpg'));
        gBooks.push(createBook('Ulysses', 'James Joyce', getRandomIntInclusive(50, 200), 'img/Ulysses-by-James-Joyce.jpg'));
        gBooks.push(createBook('The Great Gatsby', 'F. Scott Fitzgerald', getRandomIntInclusive(50, 200), 'img/The-Great-Gatsby-by-F-Scott-Fitzgerald.jpg'));
        gBooks.push(createBook('Moby Dick', 'Herman Melville', getRandomIntInclusive(50, 200), 'img/Moby-Dick-by-Herman-Melville.jpg'));
        gBooks.push(createBook('Hamlet', 'William Shakespeare', getRandomIntInclusive(50, 200), 'img/Hamlet-by-William-Shakespeare.jpg'));
        gBooks.push(createBook('War and Peace', 'Leo Tolstoy', getRandomIntInclusive(50, 200), 'img/War-and-Peace-by-Leo-Tolstoy.jpg'));
        gBooks.push(createBook('The Odyssey', 'Homer', getRandomIntInclusive(50, 200), 'img/The-Odyssey-by-Homer.jpg'));
    }
    return gBooks;
}

function createBook(bookName, author, price, imgUrl) {
    return {
        id: getId(PASWORD_LENGTH),
        title: bookName,
        author: author,
        price: price,
        imgUrl: imgUrl,
        rating: 0
    }
}

function getNewBook() {
    var book = createBook(null, null, null, null);
    gBooks.push(book);
    return book;
}

function addBook(newBook) {
    gBooks.push(newBook);
    saveToStorage(BOOKS_SHOP_KEY, gBooks);
}

function deleteBook(bookId) {
    var idx = gBooks.findIndex(function (book) {
        return book.id === bookId;
    })
    gBooks.splice(idx, 1);
    saveToStorage(BOOKS_SHOP_KEY, gBooks);
}

function updateBook(bookId, updatedBook) {
    var idx = gBooks.findIndex(function (book) {
        return book.id === bookId;
    })
    gBooks[idx].name = updateBook.name;
    gBooks[idx].author = updatedBook.author;
    gBooks[idx].price = updateBook.price;
    saveToStorage(BOOKS_SHOP_KEY, gBooks);
}

function getBooksToDisplay() {
    //if no filter
    if (gFilterBy === ALL) return gBooks.slice();
}

function getBookById(bookId) {
    return gBooks.find(function (book) {
        return book.id === bookId;
    })
}

function getBookIdxById(bookId) {
    return gBooks.findIndex(function (book) {
        return book.id === bookId;
    })
}

function saveBooks() {
    saveToStorage(BOOKS_SHOP_KEY, gBooks);
}












