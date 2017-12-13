$(document).ready(function () {
  // initialising the tooltip with jquery
  $('[data-toggle="tooltip"]').tooltip();

  /* */
  $("#localWeather").on("click", function() {
    $("#frontPage").hide();
    $(".localWeather").show();
  })

var output = document.getElementById("demo");

/* check if geolocation is supported */
function getLocation() {
          output.innerHTML = "Hell";
    /*if (navigator.geolocation) {
        //navigator.geolocation.getCurrentPosition(showPosition, showError); // if it is supported run this method to get the current position
    } else { // if not supported, display a message to the user
        output.innerHTML = "Geolocation is not supported by this browser.";
    }*/
}

/* outputs the Latitude and longitude */
function showPosition(position) {
    output.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
}

/* handle error if getCurrentPosition fails to get the user's position */
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            output.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            output.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            output.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            output.innerHTML = "An unknown error occurred."
            break;
    }
}
})
