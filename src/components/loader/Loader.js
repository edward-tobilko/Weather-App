import React from "react";
import { Spin } from "antd";
import "./loader.css";

const Loader = () => {
  return (
    <>
      <Spin size="large" className="loader" />
    </>
  );
};

export default Loader;
