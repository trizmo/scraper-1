console.log("script app.js connected")

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  console.log("submit clicked!")

  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      comment: $("#comment").val(),
    }
  })
    .then(function(data) {
      console.log(data);
      $("#comment").empty();
    });

});
