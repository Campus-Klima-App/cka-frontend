import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./dataView.css";

export default function DataView({
  visId,
  data,
  y_ID,
  unit,
  defaultYRange,
  margin,
  activeDot,
  minMax,
}) {
  let containerRef = useRef(),
    dotsContainerRef = useRef(),
    xAxisRef = useRef(),
    yAxisRef = useRef();
  const { width, height } = useContainerDimensions(containerRef);
  const [state, setState] = useState({
    dataArray: [],
    dataMinMax: [0, 0],
    minDate: null,
    maxDate: null,
    error: false,
  });

  if (!margin) margin = { left: 40, right: 30, top: 40, bottom: 35 };

  // Prepare the incoming data for later use - called when data is changing
  useEffect(() => {
    //Format the data for later use

    const datArr = data.map((d) => [new Date(d.time), d[y_ID]]);

    // Determine the minimum and maximum of the Y-axis
    if (defaultYRange) {
      let max = 0,
        min = 0;
      if (d3.max(data, (d) => d[y_ID]) > defaultYRange[1])
        max = Math.ceil(d3.max(data, (d) => d[y_ID]));
      else max = defaultYRange[1];

      if (d3.min(data, (d) => d[y_ID]) < defaultYRange[0])
        min = Math.floor(d3.min(data, (d) => d[y_ID]));
      else min = defaultYRange[0];

      setState((prevState) => ({
        ...prevState,
        dataMinMax: [min, max],
      }));
    }

    // tells the parent app the min/max for display
    minMax(
      d3.min(data, (d) => d[y_ID]) + " " + unit,
      d3.max(data, (d) => d[y_ID]) + " " + unit
    );

    // Determine the minimum and maximum of the X-axis
    setState((prevState) => ({
      ...prevState,
      dataArray: datArr,
      minDate: d3.min(datArr, (d) => d[0]),
      maxDate: d3.max(datArr, (d) => d[0]),
    }));
  }, [data]);

  function updateD3() {
    const w = width - (margin.left + margin.right);
    const h = height - (margin.top + margin.bottom);

    const count = calculateTickCount(w);
    const [labelText, xAxisMinMax, xScaling] = variableTicks(count);

    const xScale = d3.scaleTime().domain(xAxisMinMax).range([0, w]);

    const yScale = d3
      .scaleLinear()
      .domain(state.dataMinMax)
      .range([h - 20, 0]);

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

    d3.select(dotsContainerRef.current)
      .selectAll("circle")
      .data(state.dataArray)
      .join("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 5)
      .classed("dot", true)
      .on("mouseover", (d) => handleDotInfo(d, d3.event.target, xScaling))
      .on("click", (d) => handleDotInfo(d, d3.event.target, xScaling));
  }

  // Update of the d3 graphic - called when width or height of the container is changing
  useEffect(() => {
    if (
      state.minDate !== undefined &&
      state.maxDate !== undefined &&
      data.length !== 0
    ) {
      updateD3();
      setState((prevState) => ({ ...prevState, error: false }));
    } else {
      if (data.length === 0)
        setState((prevState) => ({ ...prevState, error: true }));
    }
  }, [width, height, state.dataArray, state.error]);

  function zeroPadFloat(num) {
    let splitted = num.toString().split(".", 2);
    let afterComma = 0;
    if (splitted.length > 1) afterComma = splitted[1];
    let s = "00" + afterComma;
    let padded = s.substr(s.length - 2);
    return splitted[0] + "." + padded;
  }

  function handleDotInfo(datum, element) {
    let valueWithUnit = zeroPadFloat(datum[1]) + " " + unit;
    if (datum[1] === undefined) valueWithUnit = "Keine Daten";
    activeDot(
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
  const variableTicks = (count) => {
    if (count < 1) return [[], [], ""];

    let scaling,
      yearInterval = 0,
      monInterval = 0,
      dayInterval = 0,
      hourInterval = 0,
      minInterval = 0;
    const minDate = state.minDate;
    const maxDate = state.maxDate;

    let axisMinMax;
    let newCount = 1;

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

    // values: x-axis label text
    // axisMinMax: x-axis domain (d3)
    // scaling: string that describes the x-axis format mode: minute, hour, day, month
    return [labelText, axisMinMax, scaling];
  };

  return (
    <div className="svgContainer" ref={containerRef}>
      {state.error === false ? (
        <svg height="100%" width="100%">
          <g transform={`translate(${margin.left},${margin.top})`}>
            <text x="-30" y="-20" textAnchor="middle" className="yLabel">
              {unit}
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

const multiFormat = (date, xScaling) => {
  if (xScaling === "minute") return locale.format("%-H:%M")(date);
  if (xScaling === "hour") return locale.format("%-H:%M")(date);
  if (xScaling === "day") return locale.format("%-d. %b")(date);
  if (xScaling === "month") return locale.format("%b")(date);
  if (xScaling === "year") return locale.format("%Y")(date);
};
