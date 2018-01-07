$(document).ready(function () {

  /* When the button to get the Current Weather location is clicked */
  $("#getLocalWeather").on("click", function() {
    //$(this).addClass("animate-pulse");
    $("#messageLocation").html("Locating your current position...");
    getLocation();
    // when AJAX stars getting weather api
    $(document).ajaxStart(function() {
      $("#messageLocation").html("Fetching data...");
    });
    // after data has been fetched
    $(document).ajaxStop(function() {
      $("#frontPage").hide(); // front page dissapears
      $(".localWeather").show(2000); // the container to display the data appears
    });
  });

  /* When the button to get the weather in a Specified location is clicked.
    It is in #frontPage section */
  $("#getAwayWeather").on("click", function(){
    $("#frontPage").hide(); // front page dissapears
    $(".awayWeather").show(2000); // the container to display the data appears
    $("#awayPanelData").hide();
  });

  /* when button to get another location is clicked we display the awayWeather section
     to get the weather for a specified location */
  $("#anotherLocation").on("click", function(){
    $(".localWeather").hide();
    $(".awayWeather").show(2000);
    $("#awayPanelData").hide();
    $(".locationHeader").hide();
  });

  /* after typing and submiting the name of a place, we get the weather for that place */
  $("#searchLocation").on("click", function(){
    var location = $("#location").val();
    $(".place").text(location);
    $(".locationHeader").show(2000);
    $("#awayPanelData").show(2000);
    var geoCoder =  new google.maps.Geocoder();
    geoCoder.geocode({ 'address': location}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = "lat=" + results[0].geometry.location.lat();
        var longitude = "lon=" + results[0].geometry.location.lng();
        getWeather(latitude, longitude);
        $(".localWeather").hide();
      } else {
        $(".alert-danger").show();
        $("errorWeatherMessage").html("We couldn't get the weather for " + location + ". Please try again later!");
      }
    });
  });

  /* button to get back to #frontPage section from .awayWeather section */
  $("#moveToFrontPage").on("click", function(){
    $(".awayWeather").hide();
    $("#frontPage").show(2000);
  })

  /* Convert Celcius in Fahrenheit and viceversa */
  $(".switchTypeDegree").on("click", function() {
    var typeDegree = $("#typeDegree").text(); // from .localWeather section
    var typeDegree2 = $("#typeDegree2").text(); // from .awayWeather section
    var temp = $(".temperature").text();
    var temperature = parseFloat(temp);
    var tempMin = $(".tempMin").text();
    var temperatureMin = parseFloat(tempMin);
    var tempMax = $(".tempMax").text();
    var temperatureMax = parseFloat(tempMax);
    // if temperature is in Celcius, we convert it in Fahrenheit
    if (typeDegree === "C" || typeDegree2 === "C") {
      temperature = Math.round((temperature * (9 / 5)) + 32);
      $(".temperature").html(temperature + "&deg");
      $("#typeDegree").html("F");
      $("#typeDegree2").html("F");
      temperatureMin = Math.round((temperatureMin * (9 / 5)) + 32);
      $(".tempMin").html(temperatureMin + "&deg");
      $(".typeDegree").html("F");
      temperatureMax = Math.round((temperatureMax * (9 / 5)) + 32);
      $(".tempMax").html(temperatureMax + "&deg");
      $("#unit").html("Celcius");
    } else if (typeDegree === "F" || typeDegree2 === "F") {
      console.log(typeDegree);
      console.log(typeDegree2);
      temperature = Math.round((temperature - 32) / (9 / 5));
      $(".temperature").html(temperature + "&deg");
      $("#typeDegree").html("C");
      $("#typeDegree2").html("C");
      temperatureMin = Math.round((temperatureMin - 32) / (9 / 5));
      $(".tempMin").html(temperatureMin + "&deg");
      $(".typeDegree").html("C");
      temperatureMax = Math.round((temperatureMax - 32) / (9 / 5));
      $(".tempMax").html(temperatureMax + "&deg");
      $("#unit").html("Fahrenheit");
    } else {
      console.log(typeDegree);
      $(".alert-danger").show();
      $("errorWeatherMessage").html("We coudn't switch the degree type");
    }
  });

  /* check if geolocation is supported */
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError); // if it is supported run this method to get the current position
    } else { // if not supported, display a message to the user
      $("alert-danger").show(); // show this element to display the next error message
      $("#noGeoSupported").html("<strong>I'm so sorry!</strong> Geolocation is not supported by this browser.");
      $(".panelData").hide();
    }
  }

  /* outputs the Latitude and longitude */
  function showPosition(position) {
    var latitude = "lat=" + position.coords.latitude;
    var longitude = "lon=" + position.coords.longitude;
    getWeather(latitude, longitude);
  }

  /* handle error if getCurrentPosition fails to get the user's position */
  function showError(error) {
    $(".alert-danger").fadeIn(2000); // show this element to display the next error message
    switch(error.code) {
      case error.PERMISSION_DENIED:
        $("#messageLocation").hide();
        $("#noGeoSupported").html("User denied the request for Geolocation.<br>You can't see the weather in your current location!<br> Click the right button to get the weather in your favourite place.");
        break;
      case error.POSITION_UNAVAILABLE:
        $("#noGeoSupported").html("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        $("#noGeoSupported").html("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        $("#noGeoSupported").html("An unknown error occurred. Please try again later!");
        break;
    }
  }

  /* get weather in the current location */
  function getWeather(latitude, longitude) {
    var urlRequest = "https://fcc-weather-api.glitch.me/api/current?";
    $.ajax({
      url: urlRequest + latitude + "&" + longitude,
      success: function (data) {
        var city = data.name;
        $(".city").html(city);

        var country = data.sys.country;
        $(".country").html(", " + country);

        var temperature = Math.round(data.main.temp);
        $(".temperature").html(temperature + "&deg;");

        $(".icon").html("<img src='" + data.weather[0].icon + "' width= 60px height=60px/>");

        var description = data.weather[0].description;
        $(".description").html("<strong>" + description + "</strong>");
        $(".tempMin").html(data.main.temp_min + "&deg;");
        $(".tempMax").html(data.main.temp_max + "&deg;");

        var pressure = Math.round(data.main.pressure) / 10; // convert to kPa from hPa.
        $(".pressure").html(pressure + " kPa");

        var humidity = data.main.humidity;
        $(".humidity").html(humidity + " %");

        var windSpeed = Math.round(data.wind.speed * 18 / 5); // convert meter/sec to km/hour.
        $(".windSpeed").html(windSpeed + " km/h");

        $(".clouds").html(data.clouds.all + " %");

        var sunrise = unixTimeToLocal(data.sys.sunrise).toLocaleTimeString(); // convert to user's time zone, pretty format.
        $(".sunrise").html(sunrise);

        var sunset = unixTimeToLocal(data.sys.sunset).toLocaleTimeString(); // convert to user's time zone, pretty format.
        $(".sunset").html(sunset);

        weatherBackground(data.weather[0].main);
        twitter(city, country, temperature, description); // to share the weather on twitter
      },
      error: function(err) { // output a message if if the data can not be fetched
        $(".alert-danger").show();
        $(".errorWeatherMessage").html("An error has occured. Try later again!");
        $(".panelData").hide();
      }
    });
  }

  /* passed a date set in unix time, and returns a Date object in the user's local time */
  function unixTimeToLocal(unix) {
    var local = new Date(0);
    local.setUTCSeconds(unix);
    return local;
  }
  function weatherBackground (mainWeather) {
    var mainWeather  = mainWeather.toLowerCase();
    console.log(mainWeather);
    switch (true) {
      case (mainWeather == "rain" || mainWeather == "drizzle"):
        $("#weatherPicture").attr("src", "../pictures/rain.jpg");
        break;
      case (mainWeather == "clear"):
        $("#weatherPicture").attr("src", "../pictures/clear.jpg");
        break;
      case (mainWeather == "snow"):
        $("#weatherPicture").attr("src", "../pictures/snow.jpg");
        break;
      case (mainWeather == "clouds"):
        $("#weatherPicture").attr("src", "../pictures/cloudy.jpg");
        break;
      case (mainWeather == "wind"):
        $("#weatherPicture").attr("src", "../pictures/windy.jpg");
        break;
      case (mainWeather == "fog" || mainWeather == "mist"):
        $("#weatherPicture").attr("src", "../pictures/foggy.jpg");
        break;
    }
  }

  /* to share the weather in Twitter */
  function twitter (city, country, temperature, description){
    $('.tweetIt').click(function() {
      var encodedData = encodeURIComponent("I'm in " + city + ", " + country + ". The temperature is "
                        + temperature  + "ºC and it's " + description);
      var tweetUrl = "https://twitter.com/intent/tweet?text=" + encodedData;
      window.open(tweetUrl);
    });
  }
});

/* json response with the paramaters
{
"coord":{ "lon":159, "lat":35 },
"weather":[ {
    "id":500,
    "main":"Rain",
    "description":"light rain",
    "icon":"https://cdn.glitch.com/6e8889e5-7a72-48f0-a061-863548450de5%2F10n.png?1499366021399"
}],
"base":"stations",
"main":{
  "temp":22.59,
  "pressure":1027.45,
  "humidity":100,
  "temp_min":22.59,
  "temp_max":22.59,
  "sea_level":1027.47,
  "grnd_level":1027.45
 },
"wind":{
    "speed":8.12,
    "deg":246.503
},
"rain":{
    "3h":0.45
},
"clouds":{ "all":92 },
"dt":1499521932,
"sys":{
  "message":0.0034,
  "sunrise":1499451436,
  "sunset":1499503246
},
"id":0,
"name":"",
"cod":200
}*/

/* Using openweather
var urlRequest = "api.openweathermap.org/data/2.5/weather?lat=35&lon=139";
my free key: 5736f2184df5eb73fae14a484a240533
*/
/*link =
  "https://api.apixu.com/v1/forecast.json?key="+
  apiKey+
  "&q=" +
  lat +
  "+" +
  lon +
  "&days=5";
*/
