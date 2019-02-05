function openCanvas(){
    document.querySelector('.offcanvas-btn').classList.toggle('offcanvas-btn-open');
    document.querySelector('.offcanvas-aside').classList.toggle('offcanvas-aside-open');    
}

function onSubmit(){
    var subject = $('.subject-section-input').val();
    var email = $('.email-section-input').val();
    var msg = $('.textarea-section-input').val();
    window.location = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${msg}`;
    
}