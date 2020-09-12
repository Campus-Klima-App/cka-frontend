import React, { useState } from "react";
import "./button.css";

export default function Button(props) {
  const [state, setState] = useState(false);

  function handleClick() {
    setState(true);
    if (typeof props.clicked === "function") props.clicked();
    if (!props.rotate) setState(false);
  }

  return (
    <div className="button" onClick={handleClick}>
      <img
        src={props.icon}
        className={"button-icon" + (state && props.rotate ? " anim" : "")}
        onAnimationEnd={() => setState(false)}
        alt=""
      />
    </div>
  );
}
