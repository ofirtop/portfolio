'use strict'
const PROJECT_PROTFOLIO_KEY = 'projectProtf';
var gProjs = [];
var ID_LENGTH = 12;


function createProjs() {
    if (!gProjs || gProjs.length === 0) {
        gProjs = [
            createProj('project Mine Sweeper', 'mine sweeper', 'game board which mimic the known game',
                'projs/mine-sweeper/index.html', 1448693940000, ['Matrixes', 'keyboard events'],
                'img/portfolio/01-thumbnail.jpg', 'img/portfolio/01-full.jpg','Board games','Coding Academy'),

            createProj('Project Ball Board', 'Ball Board', 'this is short description 2',
                'projs/ball-board/index.html', 1448693940000, ['layouts', 'console'],
                'img/portfolio/02-thumbnail.jpg', 'img/portfolio/02-full.jpg','Board games','Coding Academy'),

            createProj('Project Book Shop', 'Book Shop', 'this is short description 3',
                'projs/book-shop/index.html', 1448693940000, ['flex', 'grid', 'DOM Manipulation'],
                'img/portfolio/03-thumbnail.jpg', 'img/portfolio/03-full.jpg','category3','Coding Academy'),
        ];
    }
    return gProjs;
}

function createProj(name, title, desc, webUrl, publishedAt, lables, imgSrc, imgSrcBig,category,client) {
    return {
        id: getId(ID_LENGTH),
        name: name,
        title: title,
        desc: desc,
        webUrl: webUrl,
        publishedAt: publishedAt,
        labels: lables,
        imgSrc: imgSrc,
        imgSrcBig: imgSrcBig,
        category:category,
        client:client
    }
}

function getProjsForDisplay() {
    return gProjs;
}

function getProjById(projId) {
    return gProjs.find(function (proj) {
        return proj.id === projId;
    })
}