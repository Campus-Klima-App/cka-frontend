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

export default function LineGraph({data, y_ID}) {

    let containerRef = useRef(), dotsContainerRef = useRef(), xAxisRef = useRef(), yAxisRef = useRef()
    const tooltip = d3.select("#tooltip");

    const {width, height} = useContainerDimensions(containerRef);
    const [dataArray, setDataArray] = useState([]);
    const [dataMinMax, setDataMinMax] = useState([]);

    const margin = {left: 40, right: 30, top: 40, bottom: 35};

    useEffect(() => {
        if (data == null) return (<div>NO DATA</div>);
        updateData();
    }, [data]);

    function updateData() {

        const getEvery = 1; // Reduction of test data, only for testing purposes

        const datArr = data.map(d => [new Date(d.time), d[y_ID]])
            .filter((d, i) => i % getEvery === 0);

        setDataArray(datArr);
        setDataMinMax([0, 30]);
    }

    useEffect(() => {

        const w = width - (margin.left + margin.right);
        const h = height - (margin.top + margin.bottom)


        const dateMinMax = d3.extent(dataArray, d => d[0]);
        const count = calculateLabelCount(w);
        const [labelData, newDateMinMax, xScaling] = variableTicks(count, dateMinMax);

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
            datum[1] + "°C  - " + new Date(datum[0]).getHours() + ":" +
            zeroPad(datum[0].getMinutes(), 2) + " Uhr"
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


    function calculateLabelCount(width) {

        const maxLabels = dataArray.length;
        const spacing = width / maxLabels;

        return (
            spacing > 50 ? maxLabels
            :   spacing > 30 ? Math.floor(maxLabels/2)
            :   spacing > 15 ? Math.floor(maxLabels/4)
            :   Math.floor(maxLabels/6)
        );
    }

    // Reduces or increases the number of rendered data-points and axis labels
    // based on the width of the svg
    const variableTicks = (count, dateMinMax) => {

        let scaling = "", countInterval = 0, mon = 0, day = 0, hour = 0, min = 0, activeYear = 0, activeMon = 0,
            activeDay = 0, activeHour = 0, activeMin = 0;

        const minDate = dateMinMax[0];
        const maxDate = dateMinMax[1];
        let newMinMax = [];

        let x = 1;

        if (count > d3.timeHour.count(minDate, maxDate)) {
            scaling = "minute";
            countInterval = d3.timeMinute.count(minDate, maxDate);
            activeMin = 1;
            activeHour = 1;
            activeDay = 1;
            activeMon = 1;
            activeYear = 1;
            while((x*5) * count < countInterval) {
                x++;
            }
            min = x * 5;
            newMinMax = [d3.timeMinute.floor(minDate), d3.timeMinute.ceil(maxDate)];
        }

        else if (count > d3.timeDay.count(minDate, maxDate) && d3.timeDay.count(minDate, maxDate) < 1) {
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

        else if (count > d3.timeMonth.count(minDate, maxDate) && d3.timeMonth.count(minDate, maxDate) < 1) {
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
            newMinMax = [d3.timeMonth.floor(minDate), d3.timeMonth.ceil(maxDate)];
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
        <div className="svgContainer" ref={containerRef} >
            <svg height="100%" width="100%" >
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <text x="-10" y="-20" textAnchor="middle" className="yLabel">°C</text>
                    <g ref={xAxisRef} className="xAxis">
                    </g>
                    <g ref={yAxisRef} className="yAxis">
                    </g>
                    <g ref={dotsContainerRef}>
                    </g >
                </g >
            </svg >
        </div >
    );
}