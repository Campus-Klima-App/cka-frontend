import React, { useEffect, useState } from "react";
import DataView from "./dataView";
import Menu from "./menu";
import "./app.css";
import { testdata } from "../testdata.js";
import * as d3 from "d3";

import CO_Icon from "../icons/CO_Icon.svg";
import Temp_Icon from "../icons/Temp_Icon.svg";
import Humid_Icon from "../icons/Humid_Icon.svg";
import UV_Icon from "../icons/UV_Icon.svg";

function App() {
  const [state, setState] = useState({
    activePage: null,
    activeDot: null,
    pages: [
      { id: 0, name: "Kohlenstoffmonoxid", icon: CO_Icon },
      { id: 1, name: "Temperatur", icon: Temp_Icon },
      { id: 3, name: "Luftfeuchtigkeit", icon: Humid_Icon },
      { id: 4, name: "UV-Index", icon: UV_Icon },
    ],
    data: null,
    allowFetch: true,
    minMax: ["-", "-"],
  });

  if (state.allowFetch) {
    d3.json(
      "https://gist.githubusercontent.com/mickey175/bb19eff9e1625f9db89b68cff9cb5aed/raw/f710ad6374e04fc5bcaf69852a34fd9c35f6831c/data.json"
    ).then((d) => setState((prevState) => ({ ...prevState, data: d })));
    setState((prevState) => ({ ...prevState, allowFetch: false }));
  }

  function handleActiveDot(dat, el) {
    setState((prevState) => {
      if (prevState.activeDot !== null)
        prevState.activeDot.element.classList.remove("dotSelected");
      el.classList.add("dotSelected");
      return {
        ...prevState,
        activeDot: {
          data: dat,
          element: el,
        },
      };
    });
  }

  function handleMinMax(min, max) {
    setState((prevState) => ({
      ...prevState,
      minMax: [min, max],
    }));
  }

  function handleMenuSelection(selection) {
    setState((prevState) => ({
      ...prevState,
      activePage: selection,
      activeDot: null,
    }));
  }

  function showDataView() {
    if (state.activePage === null) {
      handleMenuSelection(state.pages[1]); // Set start page
      return;
    }
    const id = state.activePage.id;
    if (state.data === null) return;
    if (id === 0)
      return (
        <DataView
          key={state.activePage.name}
          visId={id}
          data={state.data}
          y_ID="co" // the property name in the raw data
          unit="ppm" // y-axis label
          defaultYRange={[0, 300]}
          margin={{ left: 60, right: 30, top: 40, bottom: 35 }}
          activeDot={handleActiveDot}
          minMax={handleMinMax}
        />
      );
    else if (id === 1)
      return (
        <DataView
          key={state.activePage.name}
          visId={id}
          data={state.data}
          y_ID="temperature" // the property name in the raw data
          unit="°C" // y-axis label
          defaultYRange={[0, 30]}
          margin={{ left: 50, right: 30, top: 40, bottom: 35 }}
          activeDot={handleActiveDot}
          minMax={handleMinMax}
        />
      );
  }

  return (
    <div className="app">
      <div id="content">
        <div id="wrapper">
          <div id="logoBar">
            <div id="logo" />
          </div>
          <div id="timeSelect"></div>
          <div className="vis">{showDataView()}</div>
          <div className="infoArea">
            <div className="infoBox">
              <table>
                <tr>
                  <td className="info-header">Datum</td>
                  <td className="info-value space-l-20">
                    {state.activeDot
                      ? state.activeDot.data[0].day
                      : "Keine Auswahl"}
                  </td>
                </tr>
                <tr>
                  <td className="info-header">Uhrzeit</td>
                  <td className="info-value space-l-20">
                    {state.activeDot
                      ? state.activeDot.data[0].time + " Uhr"
                      : "Keine Auswahl"}
                  </td>
                </tr>
                <tr className="info-big">
                  <td colspan="2">
                    {state.activeDot ? state.activeDot.data[1] : "--"}
                  </td>
                </tr>
              </table>
            </div>
            <div className="infoBox text-center">
              <span className="info-header">Minimum</span>
              <span className="info-value">{state.minMax[0]}</span>
              <span className="info-header">Maximum</span>
              <span className="info-value">{state.minMax[1]}</span>
            </div>
          </div>
        </div>
      </div>
      <Menu
        entries={state.pages}
        active={state.activePage}
        select={(selection) => handleMenuSelection(selection)}
      />
    </div>
  );
}

export default App;
