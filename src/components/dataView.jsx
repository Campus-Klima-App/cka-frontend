import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./dataView.css";

export default function DataView(props) {
  let containerRef = useRef(),
    dotsContainerRef = useRef(),
    xAxisRef = useRef(),
    yAxisRef = useRef();
  const { width, height } = useContainerDimensions(containerRef);

  const [dataArray, setDataArray] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [dataMinMax, setDataMinMax] = useState([0, 0]);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [error, setError] = useState(false);
  const [activeDotDatum, setActiveDotDatum] = useState(null);

  if (!props.margin)
    props.margin = { left: 40, right: 30, top: 40, bottom: 35 };

  // Reaction to change in data
  useEffect(() => {
    // Format the data for later use
    const datArr = props.data.map((d) => [
      new Date(d.time),
      d[props.dataProperty],
    ]);
    setDataArray(datArr);
    setMinDate(d3.min(datArr, (d) => d[0]));
    setMaxDate(d3.max(datArr, (d) => d[0]));

    // return the min and max to the parent app for display
    props.minMax(
      d3.min(props.data, (d) => d[props.dataProperty]) + " " + props.unit,
      d3.max(props.data, (d) => d[props.dataProperty]) + " " + props.unit
    );

    // Set the minimum and maximum of the Y-axis
    if (props.defaultYRange) {
      let min =
        d3.min(props.data, (d) => d[props.dataProperty]) <
        props.defaultYRange[0]
          ? Math.floor(d3.min(props.data, (d) => d[props.dataProperty]))
          : props.defaultYRange[0];

      let max =
        d3.max(props.data, (d) => d[props.dataProperty]) >
        props.defaultYRange[1]
          ? Math.ceil(d3.max(props.data, (d) => d[props.dataProperty]))
          : props.defaultYRange[1];

      setDataMinMax([min, max]);
    }
  }, [props.data, width]);

  // Update of the d3 graphic - called when width or height of the container is changing
  useEffect(() => {
    if (
      minDate !== undefined &&
      maxDate !== undefined &&
      props.data.length !== 0
    ) {
      updateD3();
      setError(false);
    } else {
      if (props.data.length === 0) setError(true);
    }
  }, [width, height, dataArray, error, activeDotDatum]);

  // START OF MAIN RENDERING FUNCTION ==============================================================

  function updateD3() {
    const w = width - (props.margin.left + props.margin.right);
    const h = height - (props.margin.top + props.margin.bottom);

    const count = calculateTickCount(w);
    const [labelText, xAxisMinMax, xScaling] = variableTicks(count);

    const xScale = d3.scaleTime().domain(xAxisMinMax).range([0, w]);
    const yScale = d3.scaleLinear().domain(dataMinMax).range([h, 0]);

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((d) => multiFormat(d, xScaling))
      .tickPadding(10)
      .tickSize(-h)
      .tickValues(labelText);

    const yAxis = d3.axisLeft(yScale).ticks(5).tickPadding(20);

    d3.select(xAxisRef.current)
      .attr("transform", `translate(${0}, ${h})`)
      .call(xAxis);

    const yDOM = d3.select(yAxisRef.current).call(yAxis);

    yDOM.selectAll("line").remove();
    yDOM.select(".domain").remove();

    let lastPoint = { x: 0, y: 0 };
    let filterData = dataArray.filter((d, i) => {
      if (i === 0) return true;
      const diffX = Math.ceil(xScale(d[0])) - lastPoint.x;
      const diffY = Math.ceil(yScale(d[1])) - lastPoint.y;
      if (diffX > 10 || diffY > 10) {
        lastPoint.x = Math.ceil(xScale(d[0]));
        lastPoint.y = Math.ceil(yScale(d[1]));
        return true;
      }
      return false;
    });

    d3.select(dotsContainerRef.current)
      .selectAll("circle")
      .filter((d, i, nodes) =>
        nodes[i].hasAttribute("id") ? nodes[i].id !== "activeDot" : true
      )
      // remove the active dot from the selection
      .data(filterData)
      .join("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 5)
      .classed("dot", true)
      .on("mouseover", (d) => handleDotInfo(d, d3.event.target))
      .on("click", (d) => handleDotInfo(d, d3.event.target));

    if (activeDotDatum) {
      const dotEl = window.document.getElementById("activeDot");
      d3.select(dotEl)
        .attr("cx", xScale(activeDotDatum[0]))
        .attr("cy", yScale(activeDotDatum[1]));
      dotEl.parentNode.appendChild(dotEl);
    }
  }

  // END OF MAIN RENDERING FUNCTION ==============================================================

  // Converts a floating point number to a string where a single digit
  // number after the comma is padded with a zero
  function zeroPadFloat(num) {
    let splitted = num.toString().split(".", 2);
    let afterComma = 0;
    if (splitted.length > 1) afterComma = splitted[1];
    let s = "00" + afterComma;
    let padded = s.substr(s.length - 2);
    return splitted[0] + "." + padded;
  }

  // Event handler for hovering or clicking on a dot/point in the graphic:
  // - Saves the datum of the current active point for correct overriding of the position in the rendering
  // - Returns information about the current active point to the parent app-Component
  function handleDotInfo(datum, element) {
    setActiveDotDatum(datum);
    let valueWithUnit =
      datum[1] === undefined
        ? "Kein Wert"
        : zeroPadFloat(datum[1]) + " " + props.unit;
    props.activeDot(
      [
        {
          day: multiFormat(datum[0], "day"),
          time: multiFormat(datum[0], "minute"),
        },
        valueWithUnit,
      ],
      element
    );
  }

  // Tries to find final time-axis values and scaling
  function variableTicks(count) {
    if (count < 1) return [[], [], ""];

    let scaling,
      yearInterval = 0,
      monInterval = 0,
      dayInterval = 0,
      hourInterval = 0,
      minInterval;

    let axisMinMax;
    let newCount;

    scaling = "minute";
    [axisMinMax, minInterval, newCount] = minuteTicks(count, minDate, maxDate);

    if (minInterval > 60) {
      minInterval = 0;
      scaling = "hour";
      [axisMinMax, hourInterval, newCount] = hourTicks(count, minDate, maxDate);

      if (d3.timeDay.count(axisMinMax[0], axisMinMax[1]) > 1) {
        hourInterval = 0;
        scaling = "day";
        [axisMinMax, dayInterval, newCount] = dayTicks(count, minDate, maxDate);

        if (dayInterval > 16) {
          dayInterval = 0;
          scaling = "month";
          [axisMinMax, monInterval, newCount] = monthTicks(
            count,
            minDate,
            maxDate
          );
          if (d3.timeYear.count(axisMinMax[0], axisMinMax[1]) > 1) {
            [axisMinMax, yearInterval, newCount] = yearTicks(
              count,
              minDate,
              maxDate
            );
          }
        }
      }
    }

    // Create an array for all the X-axis tick labels
    const labelText = new Array(newCount + 1);
    for (let i = 0; i <= newCount; i++) {
      labelText[i] = new Date(
        axisMinMax[0].getFullYear() + i * yearInterval,
        axisMinMax[0].getMonth() + i * monInterval,
        axisMinMax[0].getDate() + i * dayInterval,
        axisMinMax[0].getHours() + i * hourInterval,
        axisMinMax[0].getMinutes() + i * minInterval
      );
    }
    return [labelText, axisMinMax, scaling]; // scaling is later used for the formatting of the labels
  }

  return (
    <div className="svgContainer" ref={containerRef}>
      {error === false ? (
        <svg height="100%" width="100%">
          <g transform={`translate(${props.margin.left},${props.margin.top})`}>
            <text x="-30" y="-20" textAnchor="middle" className="yLabel">
              {props.unit}
            </text>
            <g ref={xAxisRef} className="xAxis" />
            <g ref={yAxisRef} className="yAxis" />
            <g ref={dotsContainerRef} />
          </g>
        </svg>
      ) : (
        <div className="dataError">
          <p className="center">Für den Zeitraum liegen keine Daten vor</p>
        </div>
      )}
    </div>
  );
}

// Custom helper hook for calculating the width and height of the view-container
const useContainerDimensions = (myRef) => {
  const getDimensions = () => ({
    width: myRef.current.offsetWidth,
    height: myRef.current.offsetHeight,
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () => setDimensions(getDimensions());
    if (myRef.current) setDimensions(getDimensions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [myRef]);
  return dimensions;
};

// Sets the optimal number of ticks for the given width and needed space per tick-label
function calculateTickCount(width) {
  return Math.floor(width / 60);
}

// - Calculate the actual number of ticks for the X-axis
// based on the optimal number of ticks (count)
// and the minimum and maximum date (min, max)
// - Calculate the step size/interval for the minute labels (minInterval)
// - Calculate the minimum and maximum of the labels (newMin, newMax)
const minuteTicks = (count, min, max) => {
  let counter = 0;

  while ((max.getMinutes() + counter) % 5 !== 0) counter++;
  const newMax = new Date(
    max.getFullYear(),
    max.getMonth(),
    max.getDate(),
    max.getHours(),
    max.getMinutes() + counter
  );
  counter = 0;
  while ((min.getMinutes() - counter) % 5 !== 0) counter++;
  const newMin = new Date(
    min.getFullYear(),
    min.getMonth(),
    min.getDate(),
    min.getHours(),
    min.getMinutes() - counter
  );

  const timeSpan = d3.timeMinute.count(newMin, newMax);
  counter = 1;
  while (counter * 5 * count < timeSpan) counter++;
  const minInterval = counter * 5;
  const newCount = Math.floor(timeSpan / minInterval);

  return [[newMin, newMax], minInterval, newCount];
};

const hourTicks = (count, min, max) => {
  const newMinMax = [d3.timeHour.floor(min), d3.timeHour.ceil(max)];
  const timeSpan = d3.timeHour.count(newMinMax[0], newMinMax[1]);
  const hourInterval = Math.ceil(timeSpan / count);
  const newCount = Math.floor(timeSpan / hourInterval);
  return [newMinMax, hourInterval, newCount];
};

const dayTicks = (count, min, max) => {
  const newMinMax = [d3.timeDay.floor(min), d3.timeDay.ceil(max)];
  const timeSpan = d3.timeDay.count(newMinMax[0], newMinMax[1]);
  const dayInterval = Math.ceil(timeSpan / count);
  const newCount = Math.floor(timeSpan / dayInterval);
  return [newMinMax, dayInterval, newCount];
};

const monthTicks = (count, min, max) => {
  const newMinMax = [d3.timeMonth.floor(min), d3.timeMonth.ceil(max)];
  const timeSpan = d3.timeMonth.count(newMinMax[0], newMinMax[1]);
  const monthInterval = Math.ceil(timeSpan / count);
  const newCount = Math.floor(timeSpan / monthInterval);
  return [newMinMax, monthInterval, newCount];
};

const yearTicks = (count, min, max) => {
  const newMinMax = [d3.timeYear.floor(min), d3.timeYear.ceil(max)];
  const timeSpan = d3.timeYear.count(newMinMax[0], newMinMax[1]);
  const yearInterval = Math.ceil(timeSpan / count);
  const newCount = Math.floor(timeSpan / yearInterval);
  return [newMinMax, yearInterval, newCount];
};

// Sets the locale time format for german language
// Used by the multiFormat function
const locale = d3.timeFormatLocale({
  dateTime: "%A, der %e. %B %Y, %X",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["am", "pm"],
  days: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
  shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  months: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  shortMonths: [
    "Jan",
    "Feb",
    "Mrz",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ],
});

// Format the incoming date object based on the locale and return a string
const multiFormat = (date, xScaling) => {
  if (xScaling === "minute") return locale.format("%-H:%M")(date);
  if (xScaling === "hour") return locale.format("%-H:%M")(date);
  if (xScaling === "day") return locale.format("%-d. %b")(date);
  if (xScaling === "month") return locale.format("%b")(date);
  if (xScaling === "year") return locale.format("%Y")(date);
};
