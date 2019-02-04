'use strict'

var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function getId(pswdLength) {
  var newPswd = '';
  var options = str.split('');
  for (var i = 0; i < pswdLength; i++) {
    newPswd += options[getRandomIntInclusive(0, options.length - 1)];
  }
  
  return newPswd;
}