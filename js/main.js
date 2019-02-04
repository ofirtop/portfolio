'use strict'
console.log('Starting up');

function init() {
    createProjs();
    renderProjs();
}

function renderProjs(){
    var projs = getProjsForDisplay();    
    var strHtmls = projs.map(function (proj) {
        return `<div class="col-md-4 col-sm-6 portfolio-item">
        <a class="portfolio-link" data-toggle="modal" href="#portfolioModal1" onclick="openModal('${proj.id}')">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content">
              <i class="fa fa-plus fa-3x"></i>
            </div>
          </div>
          <img class="img-fluid" src="${proj.imgSrc}" alt="">
        </a>
        <div class="portfolio-caption">
          <h4>${proj.title}</h4>
          <p class="text-muted">${proj.desc}</p>
        </div>
      </div>
`
    })
    
    $('.proj-container').html(strHtmls.join(''));
}

function openModal(projId){
    var proj = getProjById(projId);
    $('.modal-title').html(proj.title);
    $('.item-intro').html(proj.desc);
    // $('.modal-proj-date').html('Published At: ' + new Date(proj.publishedAt));
    $('.modal-proj-client').html('Client: ' + proj.client);
    $('.modal-proj-category').html('Category: ' + proj.category);
    $('.img-fluid.d-block').attr('src',proj.imgSrcBig)

    var date = moment(1454521239279).format("DD MMM YYYY hh:mm a");
    $('.modal-proj-date').html('Published At: ' + date);
    $('.modal-link-proj').attr('href',proj.webUrl);
    $('.modal-link-proj').html(proj.webUrl);
}
