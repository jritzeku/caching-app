const getDaysArray = function (start, end) {
  for (
    var arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Intl.DateTimeFormat('en-US').format(new Date(dt)))
  }
  return arr
}

module.exports = getDaysArray

/*

NOTES: 

-resource: https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates

    ->ex:  getDaysArray(new Date("2018-05-01"),new Date("2018-07-01"));

 
*/
