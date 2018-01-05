$(document).ready(function () {

  /* When the button to get the current weather location is clicked */
  $("#getLocalWeather").on("click", function() {
    $(this).addClass("animate-pulse");
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

  /* when button to get another location is clicked we display the awayWeather section
     to get the weather for a specified location */
  $("#anotherLocation").on("click", function(){
    $(".localWeather").hide(1000);
    $(".awayWeather").show(2000);
  });

  /* Convert Celcius in Fahrenheit and viceversa */
  $("#switchTypeDegree").on("click", function() {
    var typeDegree = $("#typeDegree").text();
    var temp = $(".temperature").text();
    var temperature = parseFloat(temp);
    var tempMin = $(".tempMin").text();
    var temperatureMin = parseFloat(tempMin);
    var tempMax = $(".tempMax").text();
    var temperatureMax = parseFloat(tempMax);
    // if temperature is in Celcius, we convert it in Fahrenheit
    if (typeDegree === "C") {
      temperature = Math.round((temperature * (9 / 5)) + 32);
      $(".temperature").html(temperature);
      $("#typeDegree").html("&deg;F");
      temperatureMin = Math.round((temperatureMin * (9 / 5)) + 32);
      $(".tempMin").html(temperatureMin);
      $(".typeDegree").html("&deg;F");
      temperatureMax = Math.round((temperatureMax * (9 / 5)) + 32);
      $(".tempMax").html(temperatureMax);
      $("#unit").html("Celcius");
    } else {
      temperature = Math.round((temperature - 32) / (9 / 5));
      $(".temperature").html(temperature);
      $("#typeDegree").html("&deg;C");
      temperatureMin = Math.round((temperatureMin - 32) / (9 / 5));
      $(".tempMin").html(temperatureMin);
      $(".typeDegree").html("&deg;C");
      temperatureMax = Math.round((temperatureMax - 32) / (9 / 5));
      $(".tempMax").html(temperatureMax);
      $("#unit").html("Fahrenheit");
    }
  });


  /* check if geolocation is supported */
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError); // if it is supported run this method to get the current position
    } else { // if not supported, display a message to the user
      $("alert-danger").show(); // show this element to display the next error message
      $("#noGeoSupported").html("<strong>I'm so sorry!</strong> Geolocation is not supported by this browser.");
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
        $("#noGeoSupported").html("User denied the request for Geolocation.<br>You can't see the weather in your current location!");
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

        var temperature = data.main.temp;
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
      case (mainWeather == "cloudy"):
        $("#weatherPicture").attr("src", "../pictures/cloudy.jpg");
        break;
      case (mainWeather == "windy"):
        $("#weatherPicture").attr("src", "../pictures/windy.jpg");
        break;
      case (mainWeather == "fog"):
        $("#weatherPicture").attr("src", "../pictures/foggy.jpg");
        break;
    }
  }

  /* to share the weather in Twitter */
  function twitter (city, country, temperature, description){
    $('#tweetIt').click(function() {
      var encodedData = encodeURIComponent("I'm in " + city + ", " + country + ". The temperature is "
                        + temperature  + "ºC and it's " + description);
      var tweetUrl = "https://twitter.com/intent/tweet?text=" + encodedData;
      window.open(tweetUrl);
    });
  }
});
/*
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
