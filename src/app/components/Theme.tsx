"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import "./Theme.css";

export const Theme = ({ isDark }: { isDark: boolean }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [checked, setChecked] = useState(isDark);

  useEffect(() => {
    setChecked(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return (
    <button
      className={`btn ${checked ? "btn-checked" : ""}`}
      id="btn"
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
    >
      <div className="ripple ripple-dark"></div>
      <div className="ripple ripple-light"></div>

      <div className="toggle toggle-dark"></div>
      <div className="toggle toggle-light"></div>
    </button>
  );
};
