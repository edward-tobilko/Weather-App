import "swiper/css";

import { iconUrlFromCode } from "../../api/api";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";

const DailyForecast = ({ items, title, units }) => {
  const tempUnit = units === "metric" ? "°C" : "°F";

  return (
    <>
      <h1 className="forecast-title"> {title} </h1>
      <div className="forecast__notSwiper">
        <div className="forecast">
          {items.map((item, index) => (
            <div className="forecast__item" key={index}>
              <p className="forecast__item-title"> {item.date} </p>
              <img
                src={iconUrlFromCode(item.icon)}
                alt="Icon"
                className="forecast__item-img"
              />
              <p className="forecast__item-temp">
                {Math.ceil(item.temp)} {tempUnit}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Swiper
        className="forecast__swiper"
        spaceBetween={20}
        slidesPerView={4}
        // scrollbar={{ draggable: true }}
        // navigation
        // pagination={{ clickable: true }}
      >
        <div className="forecast">
          {items.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="forecast__item">
                <p className="forecast__item-title"> {item.date} </p>
                <img
                  src={iconUrlFromCode(item.icon)}
                  alt="Icon"
                  className="forecast__item-img"
                />
                <p className="forecast__item-temp">
                  {" "}
                  {Math.ceil(item.temp)} {tempUnit}{" "}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </>
  );
};

export default DailyForecast;
