import { useState } from "react";

import "./search-city.css";

const SearchCity = ({ setQuery }) => {
  const [locationInput, setLocationInput] = useState("");

  const handleSearchChange = (event) => {
    event.preventDefault();
    setLocationInput(event.currentTarget.value);
  };

  const handleSearchClick = () => {
    if (locationInput.trim()) {
      setQuery({ q: locationInput.trim() });
      setLocationInput("");
    }
  };

  const handlePressed = (e) => {
    if (e.key === "Enter" && locationInput.trim()) {
      setQuery({ q: locationInput });
      setLocationInput("");
    }
  };

  function handleMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setQuery({ lat, lon });
        setLocationInput("");
      });
    }
  }

  return (
    <>
      <div className="weather__form">
        <input
          onKeyDown={handlePressed}
          name="locationInput"
          type="text"
          className="weather__input"
          placeholder="Search city..."
          autoComplete="on"
          value={locationInput}
          onChange={handleSearchChange}
        />
        <span className="weather__search" onClick={handleSearchClick}>
          <i className="ri-search-line"></i>
        </span>

        <span className="weather__location" onClick={handleMyLocation}>
          <i className="ri-map-pin-line"></i>
        </span>
      </div>
    </>
  );
};

export default SearchCity;
