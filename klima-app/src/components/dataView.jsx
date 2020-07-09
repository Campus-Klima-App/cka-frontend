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

export default function DataView({visId, data, y_ID, unit, defaultYRange, margin, activeDot}) {

    let containerRef = useRef(), dotsContainerRef = useRef(), xAxisRef = useRef(), yAxisRef = useRef()
    const tooltip = d3.select("#tooltip");

    const {width, height} = useContainerDimensions(containerRef);
    const [dataState, setDataState] = useState({
        dataArray: [],
        dataMinMax: [],
        minDate: null,
        maxDate: null
    });

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

            setDataState({
                dataMinMax: [min, max],
                dataArray: datArr,
                minDate: d3.min(datArr, d => d[0]),
                maxDate: d3.max(datArr, d => d[0])
            });

        } else
            setDataState({
                dataMinMax: [0, 0],
                dataArray: datArr,
                minDate: d3.min(datArr, d => d[0]),
                maxDate: d3.max(datArr, d => d[0])
            });
    }

    // Update of the d3 graphic - called when width or height of the container is changing
    useEffect(() => {

        const w = width - (margin.left + margin.right);
        const h = height - (margin.top + margin.bottom)

        const count = calculateTickCount(w);
        if (dataState.minDate === null || dataState.maxDate === null) return;
        const [labelData, newDateMinMax, xScaling] = variableTicks(count);

        const xScale = d3.scaleTime()
            .domain(newDateMinMax)
            .range([0, w])

        const yScale = d3.scaleLinear()
            .domain(dataState.dataMinMax)
            .range([h - 20, 0])

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d => multiFormat(d, xScaling))
            .tickPadding(0)
            .tickValues(labelData)

        const yAxis = d3.axisLeft(yScale)
            .ticks(5)
            .tickPadding(20)
            .tickSize(-w)

        d3.select(xAxisRef.current)
            .attr("transform", `translate(${0}, ${h})`)
            .call(xAxis)
            .selectAll('line').remove()

        d3.select(yAxisRef.current)
            .call(yAxis)

        d3.selectAll(".domain").remove()

        d3.select(dotsContainerRef.current).selectAll("circle")
            .data(dataState.dataArray)
            .join("circle")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 5)
            .classed("dot", true)
            .on("mouseover", d => handleDotInfo(d, d3.event.target, xScaling))
            .on("click", d => handleDotInfo(d, d3.event.target, xScaling))

    }, [width, height]);

    const zeroPad = (num, size) => {
        let s = "00" + num;
        return s.substr(s.length - size);
    }

    function handleDotInfo(datum, element, xScaling) {
        let value_with_unit = datum[1] + " " + unit;
        if (datum[1] === undefined)
            value_with_unit = "Keine Daten";
        if (xScaling === "minute" || xScaling === "hour")
            activeDot([multiFormat(datum[0] , xScaling) + " Uhr", value_with_unit], element);
        else {
            const appendString = " um " + datum[0].getHours() + ":" + zeroPad(datum[0].getMinutes(), 2) + " Uhr";
            activeDot([multiFormat(datum[0] , "day") + appendString, value_with_unit], element);
        }
    }

    // Sets the optimal number of ticks for the given width and needed space per tick-label
    function calculateTickCount(width) {
        return Math.floor(width/60);
    }

    // Tries to find final time-axis values
    const variableTicks = (count) => {

        if (count<1) return [[], [], ""];
        let scaling, monInterval = 0, dayInterval = 0, hourInterval = 0, minInterval = 0;
        const minDate = dataState.minDate;
        const maxDate = dataState.maxDate;

        let axisMinMax; // Given to d3 as x-scale domain
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
                    [axisMinMax, monInterval, newCount] = monthTicks(count, minDate, maxDate);
                }
            }
        }

        const values = new Array(newCount+1);
        for (let i=0; i<=newCount; i++) {
            values[i] = new Date (
                axisMinMax[0].getFullYear(),
                axisMinMax[0].getMonth() + (i*monInterval),
                axisMinMax[0].getDate() + (i*dayInterval),
                axisMinMax[0].getHours() + (i*hourInterval),
                axisMinMax[0].getMinutes() + (i*minInterval)
            );
        }

        return [values, axisMinMax, scaling];
    }

    // Determines time-axis minimum and maximum as well as the minute step size
    // and the reduced number of actual drawn ticks
    const minuteTicks = (count, min, max) => {
        let counter = 0;

        while ((max.getMinutes() + counter) % 5 !== 0)
            counter++;
        const newMax = new Date(max.getFullYear(), max.getMonth(), max.getDate(),
            max.getHours(), max.getMinutes()+counter);
        counter = 0;
        while ((min.getMinutes() - counter) % 5 !== 0)
            counter++;
        const newMin = new Date(min.getFullYear(), min.getMonth(), min.getDate(),
            min.getHours(), min.getMinutes()-counter);

        const timeSpan = d3.timeMinute.count(newMin, newMax);
        counter = 1;
        while((counter*5) * count < timeSpan)
            counter++;
        const minInterval = counter*5;
        const newCount = Math.floor(timeSpan/minInterval);

        return [[newMin, newMax], minInterval, newCount];
    };

    // Determines time-axis minimum and maximum as well as the hour step size
    // and the reduced number of actual drawn ticks
    const hourTicks = (count, min, max) => {
        const newMinMax = [d3.timeHour.floor(min), d3.timeHour.ceil(max)];
        const timeSpan = d3.timeHour.count(newMinMax[0], newMinMax[1]);
        const hourInterval = Math.ceil(timeSpan/count);
        const newCount = Math.floor(timeSpan/hourInterval);
        return [newMinMax, hourInterval, newCount];
    };

    // Determines time-axis minimum and maximum as well as the day step size
    // and the reduced number of actual drawn ticks
    const dayTicks = (count, min, max) => {
        const newMinMax = [d3.timeDay.floor(min), d3.timeDay.ceil(max)];
        const timeSpan = d3.timeDay.count(newMinMax[0], newMinMax[1]);
        const dayInterval = Math.ceil(timeSpan/count);
        const newCount = Math.floor(timeSpan/dayInterval);
        return [newMinMax, dayInterval, newCount];
    };

    // Determines time-axis minimum and maximum as well as the month step size
    // and the reduced number of actual drawn ticks
    const monthTicks = (count, min, max) => {
        const newMinMax = [d3.timeMonth.floor(min), d3.timeMonth.ceil(max)];
        const timeSpan = d3.timeMonth.count(newMinMax[0], newMinMax[1]);
        const monthInterval = Math.ceil(timeSpan/count);
        const newCount = Math.floor(timeSpan/monthInterval);
        return [newMinMax, monthInterval, newCount];
    };

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
            return locale.format("%-H:%M")(date);
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
                    <text x="-30" y="-20" textAnchor="middle" className="yLabel">{unit}</text>
                    <g ref={xAxisRef} className="xAxis" />
                    <g ref={yAxisRef} className="yAxis" />
                    <g ref={dotsContainerRef} />
                </g>
            </svg>
        </div>
    );
}