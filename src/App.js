import React, { useEffect, useState } from "react";

import { fetchData } from "./api/api";

import CurrentWeatherCard from "./components/weatherCard/CurrentWeatherCard";
import SearchCity from "./components/search-city/SearchCity";
import Loader from "./components/loader/Loader";

import HotWrapper from "./assets/Hot.jpg";
import ColdWrapper from "./assets/Cold.jpg";

const App = () => {
  const [weather, setWeather] = useState(() => {
    const saveData = localStorage.getItem("weather");
    if (saveData) {
      return JSON.parse(saveData);
    } else {
      return null;
    }
  });

  const [query, setQuery] = useState(() => {
    const saveData = localStorage.getItem("QueryCity");
    if (saveData) {
      return JSON.parse(saveData);
    } else {
      return { q: "Paris" };
    }
  });

  const [units, setUnits] = useState(() => {
    const saveData = localStorage.getItem("units");
    if (saveData) {
      const result = JSON.parse(saveData);
      return result;
    } else {
      return "metric";
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const [background, setBackground] = useState(() => {
    const saveData = localStorage.getItem("background");
    if (saveData) {
      return JSON.parse(saveData);
    } else {
      return HotWrapper;
    }
  });

  useEffect(() => {
    const fetchWeather = async () => {
      await fetchData({ ...query, units }).then((data) => {
        setIsLoading(true);
        setWeather(data);
        setIsLoading(false);

        // Dynamic background
        const changeBackgroundThemes = units === "metric" ? 20 : 60;
        if (data.temp <= changeBackgroundThemes) {
          setBackground(ColdWrapper);
        } else {
          setBackground(HotWrapper);
        }
      });
    };

    fetchWeather();

    // localStorage.setItem("weather", JSON.stringify(query));
    // localStorage.setItem("units", JSON.stringify(units));
    // localStorage.setItem("background", JSON.stringify(background));
  }, [query, units]);

  return (
    <main className="main" style={{ backgroundImage: `url(${background})` }}>
      <div className="main__container">
        <SearchCity setQuery={setQuery} />
        <div className="main__container-content">
          {isLoading ? (
            <div className="main__container-isLoading">
              <Loader />
            </div>
          ) : (
            <>
              {weather && (
                <CurrentWeatherCard
                  weather={weather}
                  units={units}
                  setUnits={setUnits}
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
