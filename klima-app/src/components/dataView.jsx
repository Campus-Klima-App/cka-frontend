import React, {useEffect, useRef, useState} from 'react';
import * as d3 from "d3";

// Custom helper hook for calculating the width and height
const useContainerDimensions = (myRef) => {
    const getDimensions = () => ({
        width: myRef.current.offsetWidth,
        height: myRef.current.offsetHeight
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

export default function DataView({data, y_ID, unit, defaultYRange, margin}) {

    let containerRef = useRef(), dotsContainerRef = useRef(), xAxisRef = useRef(), yAxisRef = useRef()
    const tooltip = d3.select("#tooltip");

    const {width, height} = useContainerDimensions(containerRef);
    const [dataArray, setDataArray] = useState([]);
    const [dataMinMax, setDataMinMax] = useState([]);
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);

    if (!margin)
        margin = {left: 40, right: 30, top: 40, bottom: 35};

    useEffect(() => {
        updateData();
    }, [data]);

    // Prepare the incoming data for later use - called when data is changing
    function updateData() {

        const getEvery = 1; // Reduction of test data, only for testing purposes

        const datArr = data.map(d => [new Date(d.time), d[y_ID]])
            .filter((d, i) => i % getEvery === 0);

        setMinDate(d3.min(datArr, d => d[0]));
        setMaxDate(d3.max(datArr, d => d[0]));
        setDataArray(datArr);

        if (defaultYRange) {
            let max = 0, min = 0;
            if (d3.max(data, d => d[y_ID]) > defaultYRange[1])
                max = Math.ceil(d3.max(data, d => d[y_ID]));
            else
                max = defaultYRange[1];

            if (d3.min(data, d => d[y_ID]) < defaultYRange[0])
                min = Math.floor(d3.min(data, d => d[y_ID]));
            else
                min = defaultYRange[0];

            setDataMinMax([min, max]);

        } else
            setDataMinMax([0, 0]);

    }

    // Set all properties for rendering - called when width and/or height is changing
    useEffect(() => {

        const w = width - (margin.left + margin.right);
        const h = height - (margin.top + margin.bottom)

        const count = calculateTickCount(w);
        const [labelData, newDateMinMax, xScaling] = variableTicks(count);

        const xScale = d3.scaleTime()
            .domain(newDateMinMax)
            .range([20, w])

        const yScale = d3.scaleLinear()
            .domain(dataMinMax)
            .range([h - 20, 0])

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d => multiFormat(d, xScaling))
            .tickPadding(10)
            .tickValues(labelData)
            .tickSize(-h)

        const yAxis = d3.axisLeft(yScale)
            .ticks(5)
            .tickPadding(10)

        d3.select(xAxisRef.current)
            .attr("transform", `translate(${0}, ${h})`)
            .call(xAxis)

        d3.select(yAxisRef.current)
            .call(yAxis)

        d3.select(dotsContainerRef.current).selectAll("circle")
            .data(dataArray)
            .join("circle")
            .attr("cx", d => {
                return xScale(d[0])
            })
            .attr("cy", d => {
                return yScale(d[1])
            })
            .attr("r", 5)
            .classed("dot", true)
            .on("mouseover", d => {
                tooltipContent(tooltip, d, d3.event.target);
            })
            .on("click", d => {
                tooltipContent(tooltip, d, d3.event.target);
            })
            .on("mousemove", () => {
                tooltip
                    .style("top", (d3.event.pageY - 70) + "px")
                    .style("left", (d3.event.pageX - 55) + "px");
            })
            .on("mouseout", () => {
                d3.select(d3.event.target)
                    .classed("dotSelected", false)
                tooltip.style("display", "none")
            })

        tooltip.style("display", "none");

    }, [width, height]);

    // Properties for tooltip
    const tooltipContent = (tooltip, datum, dot) => {
        tooltip.text(
            datum[1] + ` ${unit} | ` + datum[0].toLocaleDateString() + " | " +
            datum[0].getHours() + ":" + zeroPad(datum[0].getMinutes(), 2) + " Uhr"
        );
        tooltip.style("display", "block");
        d3.select(dot)
            .classed("dotSelected", true)
    };

    // Helper function for correct minute representation for one digit
    const zeroPad = (num, size) => {
        let s = "00" + num;
        return s.substr(s.length - size);
    }

    // Tries to find an appropriate number of x-axis ticks
    // based on the width and the the amount of data-points
    function calculateTickCount(width) {

        const maxLabels = dataArray.length;
        const spacing = width / maxLabels
        return (
                spacing > 60 ? maxLabels
            :   spacing > 35 ? Math.floor(maxLabels/2)
            :   spacing > 10 ? Math.floor(maxLabels/4)
            :   Math.floor(maxLabels/6)
        );
    }

    // Tries to find nice x-axis values
    const variableTicks = (count) => {

        if (count<1) return [[], [], ""];
        let scaling = "", countInterval = 0, mon = 0, day = 0, hour = 0, min = 0, activeYear = 0, activeMon = 0,
            activeDay = 0, activeHour = 0, activeMin = 0;

        let newMinMax = []; // Given to d3 as x-scale domain

        let x = 1; // counter for the while loops

        if (count > d3.timeHour.count(minDate, maxDate)) {
            scaling = "minute";
            countInterval = d3.timeMinute.count(minDate, maxDate);
            activeMin = 1;
            activeHour = 1;
            activeDay = 1;
            activeMon = 1;
            activeYear = 1;
            while((x) * count < countInterval) {
                x++;
            }
            min = x;
            newMinMax = [d3.timeMinute.floor(minDate), d3.timeMinute.ceil(maxDate)];
        }

        else if (count > d3.timeDay.count(minDate, maxDate) && d3.timeDay.count(minDate, maxDate) < 2) {
            scaling = "hour";
            countInterval = d3.timeHour.count(minDate, maxDate);
            activeHour = 1;
            activeDay = 1;
            activeMon = 1;
            activeYear = 1;
            while(x * count < countInterval) {
                x++;
            }
            hour = x;
            newMinMax = [d3.timeHour.floor(minDate), d3.timeHour.ceil(maxDate)];
        }

        else if (count > d3.timeMonth.count(minDate, maxDate) && count > d3.timeWeek.count(minDate, maxDate)) {
            scaling = "day";
            countInterval = d3.timeDay.count(minDate, maxDate);
            activeDay = 1;
            activeMon = 1;
            activeYear = 1;
            while(x * count < countInterval) {
                x++;
            }
            day = x;
            newMinMax = [d3.timeDay.floor(minDate), d3.timeDay.ceil(maxDate)];
        }

        else if (count > d3.timeYear.count(minDate, maxDate)) {
            scaling = "month";
            countInterval = d3.timeMonth.count(minDate, maxDate);
            activeMon = 1;
            activeYear = 1;
            while(x * count < countInterval) {
                x++;
            }
            mon = x;
            newMinMax = [d3.timeWeek.floor(minDate), d3.timeWeek.ceil(maxDate)];
        }

        let values = new Array(count);

        for (let i=0; i<count; i++) {
            values[i] = new Date (
                activeYear * minDate.getFullYear(),
                activeMon * minDate.getMonth() + (i*mon),
                activeDay * minDate.getDate() + (i*day),
                activeHour * minDate.getHours() + (i*hour),
                activeMin * minDate.getMinutes() + (i*min)
            )
        }

        if (newMinMax[1] < d3.max(values))
            newMinMax[1] = d3.max(values);

        return [values, newMinMax, scaling];
    }

    // Formatting for german language
    d3.formatDefaultLocale({
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["", "\u00a0€"]
    });

    let locale = d3.timeFormatLocale({
        "dateTime": "%A, der %e. %B %Y, %X",
        "date": "%d.%m.%Y",
        "time": "%H:%M:%S",
        "periods": ["am", "pm"],
        "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
        "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
    });

    function multiFormat(date, xScaling) {
        if (xScaling === "minute")
            return locale.format("%-H:%M")(date);
        if (xScaling === "hour")
            return locale.format("%-H:00")(date);
        if (xScaling === "day")
            return locale.format("%-d. %b")(date);
        if (xScaling === "month")
            return locale.format("%b")(date);
        if (xScaling === "year")
            return locale.format("%Y")(date);
    }

    return (
        <div className="svgContainer" ref={containerRef}>
            <svg height="100%" width="100%">
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <text x="-10" y="-20" textAnchor="middle" className="yLabel">{unit}</text>
                    <g ref={xAxisRef} className="xAxis" />
                    <g ref={yAxisRef} className="yAxis" />
                    <g ref={dotsContainerRef} />
                </g>
            </svg>
        </div>
    );
}