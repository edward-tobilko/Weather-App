import "./weatherCard.css";

import { formatToLocalTime, iconUrlFromCode } from "../../api/api";

import HourlyForecast from "./HourlyForecast";
import DailyForecast from "./DailyForecast";

import cardBackground from "../../assets/img_1.png";

const CurrentWeatherCard = ({
  weather: {
    name,
    icon,
    temp,
    country,
    speed,
    humidity,
    feels_like,
    pressure,
    description,
    dt,
    timezone,
  },
  weather,
  setUnits,
  units,
}) => {
  const windUnit = units === "metric" ? "m/s" : "m/h";
  const tempUnit = units === "metric" ? "°C" : "°F";

  const handleChangeUnits = (event) => {
    const selectedUnit = event.currentTarget.name;
    if (units !== selectedUnit) setUnits(selectedUnit);
  };

  return (
    <>
      <div className="card">
        <img src={cardBackground} alt="Cloud" className="card__background" />
        <div className="card__header">
          <div className="card__header-btn">
            <button className="card__headerBtn-close">
              <i className="ri-close-line"></i>
            </button>
          </div>
          <div className="card__header-title">
            <h3 className="card__header-name">
              {name}, {country}
            </h3>
            <div className="card__header-weather">
              <span className="card__header-subtitle">{timezone}</span>
              <img
                src={iconUrlFromCode(icon)}
                alt="Icon"
                className="card__header-img"
              />
              <span className="card__header-subtitle">{description}</span>
            </div>
          </div>
          <h2 className="card__header-date">
            {formatToLocalTime(dt, timezone)}
            Date
          </h2>
        </div>

        <div className="card__content">
          <HourlyForecast
            title="Hourly Forecast"
            items={weather.getHourly}
            units={units}
          />
          <DailyForecast
            title="Daily Forecast"
            items={weather.getDaily}
            units={units}
          />
        </div>

        <div className="card__footer">
          <div className="card__footer-left">
            <h1 className="card__footer-temp">{Math.ceil(temp)}</h1>
            <div className="card__footer-units">
              <button
                className="card__footer-unit"
                onClick={(event) => handleChangeUnits(event)}
                name="metric"
              >
                °C
              </button>
              <hr />
              <button
                className="card__footer-unit"
                onClick={(event) => handleChangeUnits(event)}
                name="imperial"
              >
                °F
              </button>
            </div>
          </div>
          <p className="card__footer-feellikes">
            Feels Like:
            <span className="card__footer-feellike">
              {Math.ceil(feels_like)}
              {tempUnit}
            </span>
          </p>
          <div className="card__footer-right">
            <p className="card__footer-main">
              Wind:
              {Math.ceil(Number(speed))}
              {windUnit}
            </p>
            <p className="card__footer-main">
              Humidity:
              {humidity}%
            </p>
            <p className="card__footer-main">
              Pressure:
              {pressure}Pa
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentWeatherCard;
