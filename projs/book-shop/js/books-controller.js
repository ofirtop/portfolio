'use strict'

$(document).ready(init);
var isfirstTime = true;

function init() {
    createBooks();
    registerToEvents();
    renderBooks();
}
function registerToEvents() {
    //register to the browse / upload event in the update book modal
    $('#inputGroupFile02').on('change', function () {
        // debugger
        //get the file name
        var fileName = $(this).val();
        console.log(fileName)
        //extract the name of the file from the fakepath
        const name = fileName.split(/\\|\//).pop();
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(name);
    })

    // var $realInput = $('.custom-file-label');
    // realInput.addEventListener('change', () => {
    //     debugger
    //     const name = realInput.value.split(/\\|\//).pop();
    //     const truncated = name.length > 20 
    //       ? name.substr(name.length - 20) 
    //       : name;

    //     // fileInfo.innerHTML = truncated;
    //     $(this).next('.custom-file-label').html(truncated);
    //   });
}
function renderBooks() {
    var books = getBooksToDisplay();
    var strHtmls = books.map(function (book) {
        return `
        <div class="card book-item">

            <img class="card-img-top" src="${book.imgUrl}" alt="Card image cap">
            <span class="btn-delete" onclick="onDeleteBook('${book.id}')">X</span>
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <h6 class="card-text">Author: ${book.author}</h6>
                <div class="card-price">Price:\u20AA ${book.price}</div>
                <div class="action-container">
                    <button type="button" class="btn btn-primary" onclick="onReadBook('${book.id}')">Read</button>
                    <button type="button" class="btn btn-warning" onclick="onUpdateBook('${book.id}')">Update</button>
                    <button type="button" class="btn btn-danger" onclick="onDeleteBook('${book.id}')">Delete</button>                
                </div>
            </div>
        </div> 
        `
    })
    $('.books-container').html(strHtmls.join(''))
}
function onReadBook(bookId) {

    var book = getBookById(bookId);

    var $modal = $('.modal.read');
    $modal.find('h5').text(book.title);
    $modal.find('.modal-read-img').attr("src", book.imgUrl);
    $modal.find('.modal-body-author').text('Author: ' + book.author);
    $modal.find('.modal-body-price').text('Price:' + book.price);
    $modal.find('.rating-input').val(book.rating);
    $modal.show();
}
function onAddBook() {


    var $modal = $('.modal.update');
    $modal.find('.title-input').val('');
    $modal.find('.modal-read-img').attr("src", '');
    $modal.find('.author-input').val('');
    $modal.find('.price-input').val('');
    $modal.find('.bookId').text('');
    $modal.show();


    // addBook()
    // renderBooks();
}
function onDeleteBook(bookId) {
    deleteBook(bookId);
    renderBooks();
}
function onUpdateBook(bookId) {

    var book = getBookById(bookId);

    var $modal = $('.modal.update');
    $modal.find('.title-input').val(book.title);
    $modal.find('.modal-read-img').attr("src", book.imgUrl);
    $modal.find('.author-input').val(book.author);
    $modal.find('.price-input').val(book.price);
    $modal.find('.bookId').text(book.id);
    $modal.show();
}
function onSaveBook() {
    //get info from page
    var $modal = $('.modal.update');
    var id = $modal.find('.bookId').text();
    var title = $modal.find('.title-input').val();
    var author = $modal.find('.author-input').val();
    var price = $modal.find('.price-input').val();
    var imgUrl = $modal.find('.custom-file-label').text();

    var book;
    //existing book updated
    if (id === '') book = getNewBook();
    //New book created
    else book = getBookById(id);

    //update properties
    book.title = title;
    book.price = price;
    book.author = author;
    book.imgUrl = 'img/' + imgUrl;

    onCloseModal();
    saveBooks();
    renderBooks();
}
function onCloseModal() {
    var $modal = $('.modal');
    $modal.hide();
}
function onRatingChange() {
    //get info from page
    var $modal = $('.modal');
    var id = $modal.find('.bookId').text();

}











