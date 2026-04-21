import React, { useEffect } from "react";
import logo from "../assets/splendid.png";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = title;

    let favicon = document.querySelector('link[rel="icon"]');

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    favicon.type = "image/png";
    favicon.href = logo;
  }, [title]);
  return null;
};

export default PageTitle;
