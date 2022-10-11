import { DateTime } from "luxon";

/* API */

// import from https://api.openweathermap.org/data/2.5

const OPEN_WEATHER_APP_API_URL = "https://api.openweathermap.org/data/2.5";
const OPEN_WEATHER_APP_API_KEY = "e3adea4109af5d0ded17e1884d0df8fd";

// fetch data
const getWeatherData = (infoType, searchParams) => {
  const url = new URL(OPEN_WEATHER_APP_API_URL + "/" + infoType);
  url.search = new URLSearchParams({
    ...searchParams,
    appid: OPEN_WEATHER_APP_API_KEY,
  });
  return fetch(url).then((response) => response.json());
};

// fetch data field
const getDataFieldWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    name,
    dt,
    weather,
    sys: { country, sunrise, sunset },
    wind: { speed },
  } = data;

  const { main: description, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    speed,
    pressure,
    description,
    icon,
  };
};

// fetch data field forecast
const getDataFieldForecast = (data) => {
  const { timezone, daily, hourly } = data;

  const getDaily = daily.slice(1, 7).map((date) => {
    return {
      date: formatToLocalTime(date.dt, timezone, "ccc"),
      temp: date.temp.day,
      icon: date.weather[0].icon,
    };
  });

  const getHourly = hourly.slice(1, 7).map((date) => {
    return {
      time: formatToLocalTime(date.dt, timezone, "hh:mm a"),
      temp: date.temp,
      icon: date.weather[0].icon,
    };
  });

  return { timezone, getDaily, getHourly };
};

// fetch weather data
export const fetchData = async (searchParams) => {
  const formattedDataWeather = await getWeatherData(
    "weather",
    searchParams,
  ).then(getDataFieldWeather);

  const { lat, lon } = formattedDataWeather;

  const formattedDataForecast = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then(getDataFieldForecast);

  return { ...formattedDataWeather, ...formattedDataForecast };
};

// get icon
export const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

// get time
export const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a",
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);
