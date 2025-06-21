import { useEffect, useState } from "react";

import { fetchData } from "./api/api";

import CurrentWeatherCard from "./components/weatherCard/CurrentWeatherCard";
import SearchCity from "./components/search-city/SearchCity";
import Loader from "./components/loader/Loader";

import HotWrapper from "./assets/Hot.jpg";
import ColdWrapper from "./assets/Cold.jpg";

// helper func
const getFromLocalStorage = (key, value) => {
  try {
    const item = localStorage.getItem(key);

    return item ? JSON.parse(item) : value;
  } catch (error) {
    return value;
  }
};

const App = () => {
  const [weather, setWeather] = useState(() =>
    getFromLocalStorage("weather", null),
  );

  const [query, setQuery] = useState(() =>
    getFromLocalStorage("QueryCity", { q: "Paris" }),
  );

  const [units, setUnits] = useState(() =>
    getFromLocalStorage("units", "metric"),
  );

  const [isLoading, setIsLoading] = useState(false);

  const [background, setBackground] = useState(() =>
    getFromLocalStorage("background", HotWrapper),
  );

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);

      const data = await fetchData({ ...query, units });

      if (!data || typeof data.temp === "undefined") {
        console.error("Невалідні дані погоди:", data);
        setIsLoading(false);
        return;
      }

      setWeather(data);

      // Dynamic background
      const changeBackgroundThemes = units === "metric" ? 20 : 60;

      if (data.temp <= changeBackgroundThemes) {
        setBackground(ColdWrapper);
      } else {
        setBackground(HotWrapper);
      }

      localStorage.setItem("QueryCity", JSON.stringify(query));
      localStorage.setItem("weather", JSON.stringify(data));
      localStorage.setItem("units", JSON.stringify(units));
      localStorage.setItem(
        "background",
        JSON.stringify(
          data.temp <= changeBackgroundThemes ? ColdWrapper : HotWrapper,
        ),
      );

      setIsLoading(false);
    };

    fetchWeather();
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
