import React, { useState } from "react";
import "./refreshButton.css";

export default function RefreshButton(props) {
  const [state, setState] = useState(false);

  function handleClick() {
    setState(true);
    if (typeof props.clicked === "function") props.clicked();
  }

  return (
    <div className="refreshButton" onClick={handleClick}>
      <div
        className={"refresh-icon" + (state ? " anim" : "")}
        onAnimationEnd={() => setState(false)}
      />
    </div>
  );
}
