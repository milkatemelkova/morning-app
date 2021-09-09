class Weather {
  constructor() {
    this.apiKey = "4273a58509af8b4095dcda665253c62f";
  }
  async getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${this.apiKey}&units=metric`;
    const weatherData = await fetch(url);
    const weather = await weatherData.json();
    return weather;
  }
}

class Display {
  constructor() {
    this.results = document.querySelector(".results");
    this.cityName = document.getElementById("cityName");
    this.cityCountry = document.getElementById("cityCountry");
    this.cityIcon = document.getElementById("cityIcon");
    this.cityTemp = document.getElementById("cityTemp");
    this.cityHumidity = document.getElementById("cityHumidity");
  }
  showWeather(data) {
    const {
      name,
      sys: { country },
      main: { temp, humidity }
    } = data;
    const { icon } = data.weather[0];

    this.results.classList.add("showItem");
    this.cityName.textContent = name;
    this.cityCountry.textContent = country;
    this.cityTemp.textContent = temp;
    this.cityHumidity.textContent = humidity;
    this.cityIcon.src = `http://openweathermap.org/img/w/${icon}.png`;
  }
}

(function() {
  const form = document.getElementById("wheatherForm");
  const cityInput = document.getElementById("cityInput");
  const feedback = document.querySelector(".feedback");

  // class
  const ajax = new Weather();
  const display = new Display();
  form.addEventListener("submit", event => {
    event.preventDefault();
    const city = cityInput.value;

    if (city.length === 0) {
      showFeedback("city value cannot be empty");
    } else {
      ajax.getWeather(city).then(data => {
        if (data.message === "city not found") {
          showFeedback("city with such name cannot be found");
        } else {
          display.showWeather(data);
          cityInput.value = "";
        }
      });
    }
  });

  function showFeedback(text) {
    feedback.classList.add("showItem");
    feedback.innerHTML = `<p>${text}</p>`;

    setTimeout(() => {
      feedback.classList.remove("showItem");
    }, 2500);
  }
})();
//geo
let map = L.map("map", {
  layers: MQ.mapLayer(),
  center: [35.791188, -78.636755],
  zoom: 12
});

function runDirection(beginning, end) {
  map = L.map("map", {
    layers: MQ.mapLayer(),
    center: [35.791188, -78.636755],
    zoom: 12
  });

  var dir = MQ.routing.directions();

  dir.route({
    locations: [beginning, end]
  });

  CustomRouteLayer = MQ.Routing.RouteLayer.extend({
    createbeginningMarker: location => {
      var custom_icon;
      var custom_icon1;
      var marker;

      custom_icon1 = L.icon({
        iconUrl: "img/starts.png",
        iconSize: [60, 39],
        iconAnchor: [10, 29],
        popupAnchor: [0, -29]
      });

      marker = L.marker(location.latLng, { icon: custom_icon1 }).addTo(map);

      return marker;
    },

    createEndMarker: location => {
      var custom_icon;
      var marker;

      custom_icon = L.icon({
        iconUrl: "img/fin.png",
        iconSize: [60, 39],
        iconAnchor: [10, 29],
        popupAnchor: [0, -29]
      });

      marker = L.marker(location.latLng, { icon: custom_icon }).addTo(map);

      return marker;
    }
  });

  map.addLayer(
    new CustomRouteLayer({
      directions: dir,
      fitBounds: true
    })
  );
}
var scale = L.control.scale();
scale.addTo(map);

function submitinputplace(event) {
  event.preventDefault();

  map.remove();

  beginning = document.getElementById("beginning").value;
  end = document.getElementById("final").value;

  runDirection(beginning, end);

  document.getElementById("inputplace").reset();
}

const inputplace = document.getElementById("inputplace");

inputplace.addEventListener("submit", submitinputplace);
