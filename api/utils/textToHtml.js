const mongoose = require('mongoose')
  

const convertStringToHTML = (str) => {
 
  let newStr = str.replace('\n\n', '<br><br>')
  newStr = '<p>' + newStr + '</p>'
  return newStr
}

module.exports = convertStringToHTML



/*
NOTE:

-resource 
https://sabe.io/blog/javascript-convert-string-to-html
*/
