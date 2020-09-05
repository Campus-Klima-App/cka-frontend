import React, { useState } from "react";
import DataView from "./dataView";
import Menu from "./menu";
import RefreshButton from "./refreshButton";
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
    { id: 3, name: "Luftfeuchtigkeit", icon: Humid_Icon },
    { id: 4, name: "UV-Index", icon: UV_Icon },
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
    let headers = {
      from: dateToString(dateRange[0], fromTime),
      to: dateToString(dateRange[1], toTime),
    };
    axios
      .get("http://campus-klima-app.mi.medien.hs-duesseldorf.de/datapoints/", {
        headers,
      })
      .then((response) => {
        setData(response.data.datapoints);
      })
      .catch();
    setExpandTimeSel(false);
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
      if (prevState) {
        prevState.element.classList.remove("dotSelected");
      }
      el.classList.add("dotSelected");
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

  function handleExpandSelector(ev) {
    setExpandTimeSel((prevState) => !prevState);
    ev.preventDefault();
  }

  function showDataView() {
    if (!activePage) {
      handleMenuSelection(pages[1]); // Set start page
      return;
    }
    if (!data) return;

    let commonProps = {
      key: activePage.name,
      data: data,
      activeDot: handleActiveDot,
      minMax: handleMinMax,
    };

    if (activePage.id === 0)
      return (
        <DataView
          {...commonProps}
          dataProperty="co" // the property name in the raw data
          unit="ppm" // y-axis label
          defaultYRange={[0, 300]}
          margin={{ left: 60, right: 20, top: 40, bottom: 35 }}
        />
      );
    else if (activePage.id === 1)
      return (
        <DataView
          {...commonProps}
          dataProperty="temperature" // the property name in the raw data
          unit="°C" // y-axis label
          defaultYRange={[0, 30]}
          margin={{ left: 50, right: 20, top: 40, bottom: 35 }}
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
              onTouchEnd={(ev) => handleExpandSelector(ev)}
              onClick={handleExpandSelector}
            >
              <span>
                {dateRange[0].toLocaleDateString()} -{" "}
                {dateRange[1].toLocaleDateString()}
              </span>
              <div className="triangle" />
            </div>
            <Calendar
              onChange={handleDateSelect}
              value={dateRange}
              returnValue="range"
              selectRange={true}
              className={!expandTimeSel ? "hidden" : null} // Performancesteigerung ist noch fraglich...
            />
            <div>
              <TimeRangePicker
                onChange={handleTimeSelect}
                value={timeRange}
                disableClock={true}
              />
            </div>
          </div>
          <div className="bar">
            <RefreshButton clicked={() => fetchData(dateRange, timeRange)} />
          </div>
          <div className="dataView-wrapper">{showDataView()}</div>
          <div className="infoArea">
            <div className="infoCard light-border">
              <table>
                <tbody>
                  <tr>
                    <td className="infoCard-header">Datum</td>
                    <td className="infoCard-value space-l-20">
                      {activeDot ? activeDot.data[0].day : "Keine Auswahl"}
                    </td>
                  </tr>
                  <tr>
                    <td className="infoCard-header">Uhrzeit</td>
                    <td className="infoCard-value space-l-20">
                      {activeDot
                        ? activeDot.data[0].time + " Uhr"
                        : "Keine Auswahl"}
                    </td>
                  </tr>
                  <tr className="infoCard-value-big">
                    <td colSpan="2">{activeDot ? activeDot.data[1] : "--"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="infoCard infoCard-2 light-border">
              <div className="infoCard-group">
                <span className="infoCard-header">Minimum</span>
                <span className="infoCard-value">{minMax[0]}</span>
                <span className="infoCard-header">Maximum</span>
                <span className="infoCard-value">{minMax[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
