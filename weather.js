var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var fiveDayApiURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
var appID = "dd3dfbcd3f0fae3b1e46bb5cad463b3d";
var imgURL = "http://openweathermap.org/img/w/";
var params = "&units=metric&appid="; //"&lang=en&units=metric&appid="
function showOnLoad() {
  setTimeout(function () {
    $("#message").html("<span class='spinner-border'></span >&nbsp; Loading weather...");
  }, 1000);
  let show = function () {
    return new Promise(function (resolve, rej) {
      $.get("http://ip-api.com/json", function (data, status) {
        var location = data.city;
        resolve(location)
      })
    })
  }
  show().then(function (location) {
    getWeather(location);
    return location;
  }).then(function (location) {
    getForecast(location);
  })
}

function showWeather() {
  var location = $("input").val();
  getWeather(location);
  getForecast(location);
  return false
}

function getDay(day) {
  switch (day) {
    case 0: return "Sun";
    case 1: return "Mon";
    case 2: return "Tue";
    case 3: return "Wed";
    case 4: return "Thu";
    case 5: return "Fri";
    default: return "Sat";
  }
}

function getForecast(location) {
  var fiveDayURL = fiveDayApiURL + location + params + appID;
  $.get(
    fiveDayURL, function (result) {
      showDate = (new Date()).getHours() + 1;
      result.list.forEach((element, i) => {
        let previousTime = new Date().getHours() + 1;
        if (i != 0) {
          previousTime = new Date(result.list[i - 1].dt * 1000).getHours();
        }
        let time = new Date(element.dt * 1000);
        if (time.getHours() <= previousTime) {
          let rowDate = document.createElement("tr");
          let showDate = document.createElement("td");
          showDate.setAttribute("colspan", "8")
          showDate.classList.add("text-center", "bg-light", "font-weight-bolder");
          let dayWeek = time.getDay()
          let day = `${getDay(dayWeek)} ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`
          showDate.textContent = day;
          rowDate.append(showDate);
          $("#forecast").append(rowDate);
          previousTime = time.getHours();
        } 
        let record = document.createElement("tr");
        var hourMinute = document.createElement("td");
        hourMinute.classList.add("p-0");
        hourMinute.textContent = time.toString().substring(16, 21);
        record.append(hourMinute);

        var temp = document.createElement("td");
        temp.classList.add("p-0");
        temp.innerHTML = `${element.main.temp}<sup>o</sup>C`;
        record.append(temp);

        var main = document.createElement("td");
        main.classList.add("p-0");
        main.innerHTML = `<img class='img-lg' src='${imgURL}${element.weather[0].icon}.png' height='100px'/>`;
        record.append(main);

        var des = document.createElement("td");
        des.classList.add("p-0");
        des.innerHTML = `<h6>${element.weather[0].main}</h6><p>
        ${element.weather[0].description}</p>`;
        record.append(des);
 
        var cloud = document.createElement("td");
        cloud.classList.add("p-0");
        cloud.textContent = `${element.clouds.all}%`;
        record.append(cloud);

        var wind = document.createElement("td");
        wind.classList.add("p-0");
        wind.innerHTML = `<p>${element.wind.speed}m/s</p> <p>${element.wind.deg}</p>`;
        record.append(wind);
              
        var humidity = document.createElement("td");
        humidity.classList.add("p-0");
        humidity.textContent = `${element.main.humidity}%`;
        record.append(humidity);

        var pressure = document.createElement("td");
        pressure.classList.add("p-0");
        pressure.textContent = `${element.main.pressure}hPa`;
        record.append(pressure);
        
        $("#forecast").append(record)
      });
    }
  )
}

function getWeather(location) {
  var day = document.getElementById("day");
  var weather = document.getElementById("weather");
  var weatherDes = document.getElementById("description");
  var city = document.getElementById("city");
  var country = document.getElementById("country");
  var icon = document.getElementById("icon");
  var temp = document.getElementById("temp");
  var humi = document.getElementById("humi");
  var press = document.getElementById("press");

  var url = apiURL + location + params + appID;
  $.ajax({
    url, success: (function (data) {
      var now = new Date;
      day.innerHTML = now.toString().substring(0, 21);
      weather.innerHTML = data.weather[0].main;
      weatherDes.innerHTML = data.weather[0].description;
      city.innerHTML = data.name;
      country.innerHTML = data.sys.country;
      var imgIcon = "<img class='img-lg' src='" + imgURL + data.weather[0].icon + ".png' height='150px'/>";
      icon.innerHTML = imgIcon;
      temp.innerHTML = data.main.temp;
      humi.innerHTML = data.main.humidity;
      press.innerHTML = data.main.pressure;
      $("#message").remove();
      $("#container").show();
      $("#error").empty();
      $("input[type='text']").val("");
      $("input[type='text']").focus();

    }),
    error: function (jqXHR) {
      errorCODE = jqXHR.responseJSON.cod.toString();
      if (errorCODE = "404") {
        $("#error").text("Opp! Sorry, we not found your city in our database");
        $("input[type='text']").val("");
        $("input[type='text']").focus();
      }
    }
  })
}