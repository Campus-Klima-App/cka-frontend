import React, {useEffect, useState} from "react";
import DataView from "./dataView";
import Menu from "./menu";
import "./app.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

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
    dateRange: [new Date(), new Date()],
    expandTimeSel: false,
  });

  if (state.allowFetch) {
    fetchData(state.dateRange);
    setState((prevState) => ({ ...prevState, allowFetch: false }));
  }

  function fetchData(dateRange) {
    axios
      .get("http://campus-klima-app.mi.medien.hs-duesseldorf.de/datapoints/", {
        headers: {
          from: dateToString(dateRange[0]),
          to: dateToString(dateRange[1]),
        },
      })
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          data: response.data.datapoints,
        }));
        console.log(response.data.datapoints);
      })
      .catch((error) => console.log(error));
  }

  function dateToString(date) {
    console.log("convert date: ", date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let timeshift = -date.getTimezoneOffset() / 60;
    let shiftSign = timeshift < 0 ? "-" : "+";
    let string = `${year}-${zeroPad(month)}-${zeroPad(day)}T${zeroPad(
      hour
    )}:${zeroPad(minutes)}${shiftSign}${zeroPad(timeshift)}:00`;
    console.log(string);
    return string;
  }

  function zeroPad(num) {
    let s = "00" + num;
    return s.substr(s.length - 2);
  }

  function handleActiveDot(dat, el) {
    setState((prevState) => {
      if (prevState.activeDot !== null)
        prevState.activeDot.element.classList.remove("dotSelected");
      el.classList.add("dotSelected");
      el.parentNode.append(el);
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

  const handleDateSelect = (dates) => {
    setState((prevState) => ({ ...prevState, dateRange: dates }));
    fetchData(dates);
  };

  const handleExpandSelector = () => {
    setState((prevState) => ({ ...prevState, expandTimeSel: !prevState.expandTimeSel }));
  };

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
    else if (id === 2)
      return (
          <DataView
              key={state.activePage.name}
              visId={id}
              data={state.data}
              y_ID="humidity" // the property name in the raw data
              unit="%" // y-axis label
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
          <div id="timeSelect">
            <div className="dateDisplay light-border" onClick={handleExpandSelector}>
              <span>
                {state.dateRange[0].toLocaleDateString()} -{" "}
                {state.dateRange[1].toLocaleDateString()}
              </span>
              <div className="triangle"></div>
            </div>
            {state.expandTimeSel ? (
              <Calendar
                onChange={handleDateSelect}
                value={state.dateRange}
                returnValue="range"
                selectRange={true}
              />
            ) : null}
          </div>
          <div className="vis">{showDataView()}</div>
          <div className="infoArea">
            <div className="infoBox light-border">
              <table>
                <tbody>
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
                    <td colSpan="2">
                      {state.activeDot ? state.activeDot.data[1] : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="infoBox infoBox-2 text-center">
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
