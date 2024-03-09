"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import "./Theme.css";

export const Theme = () => {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(theme === "dark");
  }, [theme]);

  return (
    <button
      className={`btn ${checked ? "btn-checked" : ""}`}
      id="btn"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
    >
      <div className="ripple ripple-dark"></div>
      <div className="ripple ripple-light"></div>

      <div className="toggle toggle-dark"></div>
      <div className="toggle toggle-light"></div>
    </button>
  );
};
