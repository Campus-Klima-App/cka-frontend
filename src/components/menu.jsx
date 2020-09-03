import React from "react";
import "./menu.css";

export default function Menu({ entries, active, select }) {
  return (
    <div className="menu">
      <ul className="menuList">
        {entries.map((entry) => (
          <li
            key={entry.name}
            className={active === entry ? "activeEntry" : null}
            onClick={() => select(entry)}
          >
            <img className="modeImg" src={entry.icon} alt={entry.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
