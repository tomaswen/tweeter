let maxLength = 140;
$(document).ready(function() {
  $("#tweet-text").on("keyup", function() {
    let outputCounter = $(this)
      .parent()
      .children("output.counter");
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
