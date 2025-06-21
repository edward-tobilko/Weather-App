import { DateTime } from "luxon";

/* API */

const OPEN_WEATHER_APP_API_URL = "https://api.openweathermap.org/data/2.5";
const OPEN_WEATHER_APP_API_KEY = "e3adea4109af5d0ded17e1884d0df8fd";

// fetch data
const getWeatherData = (infoType, searchParams) => {
  const url = new URL(OPEN_WEATHER_APP_API_URL + "/" + infoType);

  url.search = new URLSearchParams({
    ...searchParams,
    appid: OPEN_WEATHER_APP_API_KEY,
  });

  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  });
};

// fetch data field
const getDataFieldWeather = (data) => {
  const {
    coord: { lat, lon },
    main: {
      temp,
      feels_like,
      temp_min,
      temp_max,
      humidity,
      pressure,
      sea_level,
      grnd_level,
    },
    name,
    dt,
    weather,
    sys: { country, sunrise, sunset },
    wind: { speed },
    timezone,
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
    sea_level,
    grnd_level,
    timezone,
  };
};

// fetch data field forecast (processing of forecast data (3-hour interval)))
const getDataFieldForecast = (data) => {
  const timezoneOffset = data.city.timezone; // в секундах

  const getHourly = data?.list.slice(1, 7).map((hourly) => ({
    time: formatToLocalTime(hourly.dt, timezoneOffset, "hh:mm a"),
    temp: hourly.main.temp,
    icon: hourly.weather[0].icon,
  }));

  // group by date and take the daily temperature (the first one for each day)
  const dailyMap = new Map();
  data.list.forEach((day) => {
    const date = formatToLocalTime(day.dt, timezoneOffset, "ccc");
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        temp: day.main.temp,
        icon: day.weather[0].icon,
      });
    }
  });

  const getDaily = Array.from(dailyMap.values()).slice(0, 6);

  return { timezoneOffset, getHourly, getDaily };
};

// fetch weather data
export const fetchData = async (searchParams) => {
  try {
    const current = await getWeatherData("weather", searchParams).then(
      getDataFieldWeather,
    );

    if (!current || !current.lat || !current.lon) {
      throw new Error("Weather data not found");
    }

    const { lat, lon } = current;

    const formattedDataForecast = await getWeatherData("forecast", {
      lat,
      lon,
      units: searchParams.units,
    }).then(getDataFieldForecast);

    return { ...current, ...formattedDataForecast };
  } catch (error) {
    console.error("fetchData error:", error);

    return null;
  }
};

// get icon
export const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

// get time
export const formatToLocalTime = (
  secs,
  timezoneOffset,
  format = "cccc, dd LLL yyyy' | Local Time: 'hh:mm a",
) => {
  if (!secs || typeof secs !== "number") {
    console.warn("Invalid seconds value in formatToLocalTime:", secs);

    return "Invalid Time";
  }

  return DateTime.fromSeconds(secs, { zone: "utc" })
    .plus({ seconds: timezoneOffset })
    .toFormat(format);
};
