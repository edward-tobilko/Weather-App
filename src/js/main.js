// api
const apiKey = "05e00602435d177e433999ddc511de86";
const apiUrl = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

// Variables
const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let ampm = "AM";

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();
  let hour = d.getHours();

  if (hour > 12) {
    hour = hour - 12;
    ampm = "PM";
  }

  return `${day}, ${date} ${month}, ${year}, ${hour}:00 ${ampm}`;
};

// Elements
const weatherForecastEl = document.getElementById("weather__forecast");
const weatherFormEl = document.getElementById("weather__form");
const weatherInputEl = document.getElementById("weather__input");

// async functions
async function getWeatherForecast(city) {
  const response = await fetch(apiUrl(city));
  const responseData = await response.json();
  console.log(responseData);

  showWeatherForecastPage(responseData);
}

// Functions
// show weather forecast page
function showWeatherForecastPage(data) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `        
  <div class="card__header">
    <div class="card__header-btn">
      <button
        class="card__headerBtn-close"
      >
        <i class="ri-close-line"></i>
      </button>
    </div>
    <div class="card__header-title">
      <h3 class="card__header-name">
        ${data.name}, ${data.sys.country}
      </h3>
      <div class="card__header-weather">
        <img
          src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png'
          alt=""
          class="card__header-img"
        />
        <span class="card__header-subtitle">
          ${data.weather[0].main}
        </span>
      </div>
    </div>
    <h2 class="card__header-date">${dateBuilder(new Date())}</h2>
  </div>

    <div class="card__content">
        <div class="card__content-cowerHot"></div>
        <div class="card__content-dates">
            <span class="card__content-date">19.04</span>
            <span class="card__content-date">20.04</span>
            <span class="card__content-date">21.04</span>
            <span class="card__content-date">22.04</span>
            <span class="card__content-date">23.04</span>
            <span class="card__content-date">24.04</span>
            <span class="card__content-date">25.04</span>
            <span class="card__content-date">26.04</span>
        </div>
    </div>
    
    <div class="card__footer">
        <div class="card__footer-left">
            <h1 class="card__footer-temp">
                ${Math.floor(data.main.temp)}
            </h1>

            <div class="card__footer-unit"><span class="unit-span">°F</span></div>
        </div>
        <p class="card__footer-feellikes">
        Feels like:
        <span class="card__footer-feellike">${Math.floor(
          data.main.feels_like
        )}<span class="unit-span">°F</span></span>
        </p>
    <div class="card__footer-right">
      <p class="card__footer-main">
        Wind:
        <span class="card__footer-result">
            <span class="card__footer-resultHot">
              ${Math.ceil(Number(data.wind.speed))} m/s
            </span>
        </span>
      </p>
      <p class="card__footer-main">
      Humidity:
          <span class="card__footer-resultHot">
            ${data.main.humidity}%
          </span>
      </p>
      <p class="card__footer-main">
      Pressure:
          <span class="card__footer-resultHot">
            ${data.main?.pressure}Pa
          </span>
      </p>
    </div>
  </div>
    `;

  // delete card
  let deleteCard = card.querySelector(".card__headerBtn-close");
  deleteCard.addEventListener("click", () => {
    card.remove();
  });

  // change to Celsius
  let celsius = Math.floor(data.main.temp - 273.15);
  let celsiusFeelLike = Math.floor(data.main.feels_like - 273.15);

  let changeToCelsiusTempUnit = card.querySelector(".card__footer-unit");
  let changeToCelsiusTemp = card.querySelector(".card__footer-temp");
  let changeToCelsiusTempUnitSpan = card.querySelector(".unit-span");
  let changeToCelsiusTempUnitFeelLike = card.querySelector(
    ".card__footer-feellike"
  );
  let changeColorCold = card.querySelector(".card__footer-resultCold");
  let changeColorHot = card.querySelector(".card__footer-resultHot");

  // click change to Celsius
  changeToCelsiusTempUnit.addEventListener("click", () => {
    if (changeToCelsiusTempUnitSpan.textContent === "°F") {
      changeColorCold;
      changeToCelsiusTempUnitSpan.textContent = "°C";
      changeToCelsiusTemp.textContent = celsius;
      changeToCelsiusTempUnitFeelLike.textContent = celsiusFeelLike;
    } else {
      changeColorHot;
      changeToCelsiusTempUnitSpan.textContent = "°F";
      changeToCelsiusTemp.textContent = Math.floor(data.main.temp);
      changeToCelsiusTempUnitFeelLike.textContent = Math.floor(
        data.main.feels_like
      );
    }
  });

  weatherForecastEl.appendChild(card);
}

//
weatherFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = weatherInputEl.value;

  if (city) {
    getWeatherForecast(city);
  }

  weatherInputEl.value = "";
});
