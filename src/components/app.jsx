import React, { useState } from "react";
import DataView from "./dataView";
import Menu from "./menu";
import Calendar from "react-calendar";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import axios from "axios";
import "./app.css";
import "react-calendar/dist/Calendar.css";
import CO_Icon from "../icons/CO_Icon.svg";
import Temp_Icon from "../icons/Temp_Icon.svg";
import Humid_Icon from "../icons/Humid_Icon.svg";
import UV_Icon from "../icons/UV_Icon.svg";

function App() {
  const [pages] = useState([
    { id: 0, name: "Kohlenstoffmonoxid", icon: CO_Icon },
    { id: 1, name: "Temperatur", icon: Temp_Icon },
    { id: 2, name: "Luftfeuchtigkeit", icon: Humid_Icon },
    //{ id: 3, name: "UV-Index", icon: UV_Icon }, UV is only necesarry if a Sensor is installed
  ]);
  const [activePage, setActivePage] = useState(null);
  const [data, setData] = useState(null);
  const [allowDataFetch, setAllowDataFetch] = useState(true);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [timeRange, setTimeRange] = useState([null, null]);
  const [minMax, setMinMax] = useState(["-", "-"]);
  const [activeDot, setActiveDot] = useState(null);
  const [expandTimeSel, setExpandTimeSel] = useState(false);

  if (allowDataFetch) {
    fetchData(dateRange, timeRange);
    setAllowDataFetch(false);
  }

  function fetchData(dateRange, timeRange) {
    let fromTime =
      timeRange === null || timeRange[0] === null ? "00:00" : timeRange[0];
    let toTime =
      timeRange === null || timeRange[1] === null ? "23:59" : timeRange[1];
    axios
      .get("http://campus-klima-app.mi.medien.hs-duesseldorf.de/datapoints/", {
        headers: {
          from: dateToString(dateRange[0], fromTime),
          to: dateToString(dateRange[1], toTime),
        },
      })
        .then((response) => setData(response.data.datapoints))
        .catch();
  }

  function dateToString(date, time) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let shift = -date.getTimezoneOffset() / 60;
    let shiftSign = shift < 0 ? "-" : "+";
    return `${year}-${zeroPad(month)}-${zeroPad(
      day
    )}T${time}${shiftSign}${zeroPad(shift)}:00`;
  }

  function zeroPad(num) {
    let s = "00" + num;
    return s.substr(s.length - 2);
  }

  function handleActiveDot(dat, el) {
    setActiveDot((prevState) => {
      if (prevState !== null) prevState.element.classList.remove("dotSelected");
      el.classList.add("dotSelected");
      el.parentNode.append(el);
      return {
        data: dat,
        element: el,
      };
    });
  }

  function handleMinMax(min, max) {
    setMinMax([min, max]);
  }

  function handleMenuSelection(selection) {
    setActivePage(selection);
    setActiveDot(null);
  }

  function handleDateSelect(dates) {
    setDateRange(dates);
    fetchData(dates, timeRange);
  }

  function handleTimeSelect(times) {
    setTimeRange(times);
    fetchData(dateRange, times);
  }

  function handleExpandSelector() {
    setExpandTimeSel((prevState) => !prevState);
  }

  function showDataView() {
    if (!activePage) {
      handleMenuSelection(pages[1]); // Set start page
      return;
    }
    if (!data) return;

    if (activePage.id === 0)
      return (
        <DataView
          key={activePage.name}
          data={data}
          y_ID="co" // the property name in the raw data
          unit="ppm" // y-axis label
          defaultYRange={[0, 300]}
          margin={{ left: 60, right: 30, top: 40, bottom: 35 }}
          activeDot={handleActiveDot}
          minMax={handleMinMax}
        />
      );
    else if (activePage.id === 1)
      return (
        <DataView
          key={activePage.name}
          data={data}
          y_ID="temperature" // the property name in the raw data
          unit="°C" // y-axis label
          defaultYRange={[0, 20]}
          margin={{ left: 50, right: 30, top: 40, bottom: 35 }}
          activeDot={handleActiveDot}
          minMax={handleMinMax}
        />
      );
    else if (activePage.id === 2)
      return (
          <DataView
              key={activePage.name}
              data={data}
              y_ID="humidity" // the property name in the raw data
              unit="%" // y-axis label
              defaultYRange={[0, 20]}
              margin={{ left: 50, right: 30, top: 40, bottom: 35 }}
              activeDot={handleActiveDot}
              minMax={handleMinMax}
          />
      );
  }

  return (
    <div className="app">
      <Menu
        entries={pages}
        active={activePage}
        select={(selection) => handleMenuSelection(selection)}
      />
      <div id="content">
        <div id="wrapper">
          <div id="logoBar">
            <div id="logo" />
          </div>
          <div id="timeSelect">
            <div
              className="dateSelect light-border"
              onClick={handleExpandSelector}
            >
              <span>
                {dateRange[0].toLocaleDateString()} -{" "}
                {dateRange[1].toLocaleDateString()}
              </span>
              <div className="triangle" />
            </div>
            {expandTimeSel ? (
              <Calendar
                onChange={handleDateSelect}
                value={dateRange}
                returnValue="range"
                selectRange={true}
              />
            ) : null}
            <div>
              <TimeRangePicker
                onChange={handleTimeSelect}
                value={timeRange}
                disableClock={true}
              />
            </div>
          </div>
          <div className="dataView-wrapper">{showDataView()}</div>
          <div className="infoArea">
            <div className="infoCard light-border">
              <table>
                <tbody>
                  <tr>
                    <td className="infoCard-header">Datum</td>
                    <td className="infoCard-value space-l-20">
                      {activeDot ? activeDot.data[0].day : ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="infoCard-header">Uhrzeit</td>
                    <td className="infoCard-value space-l-20">
                      {activeDot ? activeDot.data[0].time + " Uhr" : ""}
                    </td>
                  </tr>
                  <tr className="infoCard-value-big">
                    <td colSpan="2">{activeDot ? activeDot.data[1] : "--"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="infoCard infoCard-dark space-l-60">
              <span className="infoCard-header">Minimum</span>
              <span className="infoCard-value">{minMax[0]}</span>
              <span className="infoCard-header">Maximum</span>
              <span className="infoCard-value">{minMax[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
