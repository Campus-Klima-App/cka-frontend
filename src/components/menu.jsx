import React from "react";
import "./menu.css";

export default function Menu({ entries, active, select }) {
  // Helper function to add a class when a certain condition is fulfilled
  const conditionClass = (Class, appendClass, condition) => {
    if (Class === "") return condition ? appendClass : null;
    else return condition ? Class + " " + appendClass : Class;
  };

  return (
    <div className="menu">
      <ul className="menuList">
        {
          // Go through all menu entries that are given by the main component
          // and create the menu entries including click event and icon
          entries.map((entry) => {
            return (
              <li
                key={entry.name}
                className={conditionClass("", "activeEntry", active === entry)}
                onClick={() => {
                  select(entry);
                }}
              >
                <img className="modeImg" src={entry.icon} alt={entry.id} />
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}
