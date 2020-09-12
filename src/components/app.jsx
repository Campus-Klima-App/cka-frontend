import React, { useEffect, useState } from "react";
import DataView from "./dataView";
import Menu from "./menu";
import Button from "./button";
import Calendar from "react-calendar";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import axios from "axios";
import "./app.css";
import "react-calendar/dist/Calendar.css";
import CO_Icon from "../icons/CO_Icon.svg";
import Temp_Icon from "../icons/Temp_Icon.svg";
import Humid_Icon from "../icons/Humid_Icon.svg";
//import UV_Icon from "../icons/UV_Icon.svg";
import Refresh_Icon from "../icons/Refresh_Icon.svg";
import Imprint_Icon from "../icons/Imprint_Icon.svg";

function App() {
  /* states of the app - when a new function call is made,
     these are the only values that are preserved and not overridden */
  const [pages] = useState([
    { id: 0, name: "Kohlenstoffmonoxid", icon: CO_Icon },
    { id: 1, name: "Temperatur", icon: Temp_Icon },
    { id: 2, name: "Luftfeuchtigkeit", icon: Humid_Icon },
    //{ id: 3, name: "UV-Index", icon: UV_Icon }, UV is only necesarry if a Sensor is installed
  ]);
  const [activePage, setActivePage] = useState(pages[0]);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [timeRange, setTimeRange] = useState([null, null]);
  const [minMaxAvg, setMinMaxAvg] = useState({ min: "-", max: "-", avg: "-" });
  const [activeDot, setActiveDot] = useState(null);
  const [expandDateSel, setExpandDateSel] = useState(false);
  const [showImpress, setShowImpress] = useState(false);

  /* One time action that is executed when site is first loaded or reloaded */
  useEffect(() => {
    fetchData(dateRange, timeRange);
    setInterval(() => {
      fetchData(dateRange, timeRange);
    }, 60000 * 5);
  }, []);

  /* Request new data via GET-Request */
  function fetchData(dateRange, timeRange) {
    let fromTime =
      timeRange === null || timeRange[0] === null ? "00:00" : timeRange[0];
    let toTime =
      timeRange === null || timeRange[1] === null ? "23:59" : timeRange[1];
    let headers = {
      from: dateToString(dateRange[0], fromTime),
      to: dateToString(dateRange[1], toTime),
    };
    try {
      axios
        .get(
          "http://campus-klima-app.mi.medien.hs-duesseldorf.de/datapoints/",
          {
            headers,
          }
        )
        .then((response) => {
          setData(response.data.datapoints);
        });
    } catch (e) {}
    setExpandDateSel(false);
  }

  /* Create the string representation for a date which can be parsed by the backend */
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

  /* Convert a number to a string where to a single digit number a leading zero is added */
  function zeroPad(num) {
    let s = "00" + num;
    return s.substr(s.length - 2);
  }

  /* Callback function of DataView-Component:
     - Set the currently active point in form of attached data : [{day, time}, valueWithUnit]
     and the element */
  function handleActiveDot(dat, el) {
    setActiveDot((prevState) => {
      if (prevState) {
        prevState.element.removeAttribute("id");
      }
      el.id = "activeDot";
      return {
        data: dat,
        element: el,
      };
    });
  }

  /* Callback function of DataView-Component:
      - Set the calculated minimum and maximum of the data */
  function handleMinMaxAvg(min, max, avg) {
    setMinMaxAvg({ min: min, max: max, avg: avg });
  }

  /* Callback function of Menu-Component:
     - Set the active page based on the selected page in the menu
     - Reset the current active dot */
  function handleMenuSelection(selection) {
    setActivePage(selection);
    setActiveDot(null);
    setShowImpress(false);
  }

  /* Callback function of Calendar-Component:
     - Set dateRange to the returned array : [startDate, endDate] based on the selection
     - Update the data with the new date range */
  function handleDateSelect(dates) {
    setDateRange(dates);
    fetchData(dates, timeRange);
  }

  /* Callback function of TimeRangePicker-Component:
     - Set timeRange to the returned array : [startTime, endTime] based on the selection
     - Update the data with the new time range */
  function handleTimeSelect(times) {
    setTimeRange(times);
    fetchData(dateRange, times);
  }

  /*  Event handler for clicking on the date selection button:
      - Toggle the value of expandDateSel and therefore expand or close the Calendar-Component */
  function handleExpandSelector() {
    setExpandDateSel((prevState) => !prevState);
  }

  if (showImpress)
    return (
      <div className="app">
        <Menu
          entries={pages}
          active={activePage}
          select={(selection) => handleMenuSelection(selection)}
        />
        <div id="content">
          <div id="wrapper">
            <span id="impress-text">
              <h3>Impressum</h3>
              <p>
                Diese Applikation ist im Rahmen einer Projektarbeit im
                Sommersemester 2020 unter Leitung von Frau Prof. Dr. Gundula
                Dörries an der Hochschule Düsseldorf entstanden.
                <br />
              </p>
              <h4>Technische Umsetzung</h4>
              <p>
                <i>Front-End:</i> <br />
                Jakob Weirich (jakob.weirich@study.hs-duesseldorf.de)
              </p>
              <p>
                <i>Back-End:</i> <br />
                Robert Deppe (robert.deppe@study.hs-duesseldorf.de)
                <br />
                Michel Schwarz (michel.schwarz@study.hs-duesseldorf.de)
              </p>
              <p>
                <i>Hardware:</i> <br />
                Michel Schwarz <br />
                Robert Deppe <br />
                Jakob Weirich
              </p>
            </span>
          </div>
        </div>
      </div>
    );
  else
    return (
      <div className="app">
        <Menu
          entries={pages}
          active={activePage}
          select={(selection) => handleMenuSelection(selection)}
        />
        <div id="content">
          <div id="wrapper">
            <div id="section1">
              <div id="logoBar">
                <div id="logo" />
              </div>
              <div id="timeBar">
                <div className="timeBar-items">
                  <div className="timeBar-item-group">
                    <span className="timeBar-item-label">Datum</span>
                    <div className="dateSelect">
                      <div
                        className="dateSelect-button light-border"
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
                        className={!expandDateSel ? "hidden" : null} // Performancesteigerung ist noch fraglich...
                      />
                    </div>
                  </div>
                  <div className="timeBar-item-group">
                    <span className="timeBar-item-label">Uhrzeit</span>
                    <TimeRangePicker
                      onChange={handleTimeSelect}
                      value={timeRange}
                      disableClock={true}
                    />
                  </div>
                </div>
              </div>
              <div className="bar">
                <Button
                  clicked={() => fetchData(dateRange, timeRange)}
                  icon={Refresh_Icon}
                  rotate={true}
                />
                <Button
                  clicked={() => {
                    setShowImpress(true);
                    setActivePage(null);
                  }}
                  icon={Imprint_Icon}
                />
              </div>
            </div>
            <div className="dataView-wrapper">
              {activePage && data
                ? (function () {
                    // Some properties are the same for all components and can be listed once
                    let commonProps = {
                      key: activePage.name,
                      data: data,
                      activeDot: handleActiveDot,
                      minMaxAvg: handleMinMaxAvg,
                    };
                    return activePage.id === 0 ? (
                      <DataView
                        {...commonProps}
                        dataProperty="co" // the property name in the raw data
                        unit="ppm" // Y-axis label
                        defaultYRange={[0, 300]} // the default range of the Y-Axis
                        margin={{ left: 60, right: 25, top: 40, bottom: 35 }} // spacing for axis labels
                      />
                    ) : activePage.id === 1 ? (
                      <DataView
                        {...commonProps}
                        dataProperty="temperature"
                        unit="°C"
                        defaultYRange={[0, 30]}
                        margin={{ left: 50, right: 25, top: 40, bottom: 35 }}
                      />
                    ) : activePage.id === 2 ? (
                      <DataView
                        {...commonProps}
                        dataProperty="humidity"
                        unit="%"
                        defaultYRange={[0, 100]}
                        margin={{ left: 50, right: 25, top: 40, bottom: 35 }}
                      />
                    ) : null;
                  })()
                : null}
            </div>
            <div id="section2">
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
                      <td colSpan="2">
                        {activeDot ? activeDot.data[1] : "--"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="infoCard infoCard-2 light-border">
                <div className="infoCard-group">
                  <span className="infoCard-header">Minimum</span>
                  <span className="infoCard-value">{minMaxAvg.min}</span>
                  <span className="infoCard-header">Maximum</span>
                  <span className="infoCard-value">{minMaxAvg.max}</span>
                  <span className="infoCard-header">Mittelwert</span>
                  <span className="infoCard-value">{minMaxAvg.avg}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default App;
