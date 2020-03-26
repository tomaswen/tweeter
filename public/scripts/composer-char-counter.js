//FUNCTION THAT UPDATES COUNTER

let maxLength = 140;
$(document).ready(function() {
  $("#tweet-text").on("keyup", function() {
    let outputCounter = $(this)
      .parent()
      .children("output.counter"); //<------- LOOKING FOR THE COUNTER ELEMENT IN HTML, THROUGH TRAVERSING TO ITS PARENT ELEMENT AND BACK
    let txtLength = $("#tweet-text").val().length;
    let length = maxLength - txtLength;
    if (length < 0) {
      outputCounter.css("color", "red");
    } else {
      outputCounter.css("color", "#545149");
    }
    outputCounter.text(length);
  });
});
