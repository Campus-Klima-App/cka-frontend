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
    const [xScaling, setXScaling] = useState(null);

    const margin = {left: 40, right: 30, top: 40, bottom: 35};

    useEffect(() => {
        if (data == null) return (<div>NO DATA</div>);
        updateData();
    }, [data]);

    function updateData() {

        const getEvery = 1; // Reduction of test data, only for testing purposes

        const datArr = data.map(d => [new Date(d.time), d[y_ID]])
            .filter((d, i) => i % getEvery === 0);

        const dateMin = d3.min(datArr, d => d[0]);
        const dateMax = d3.max(datArr, d => d[0]);

        setXScaling(
            d3.timeYear.count(dateMin, dateMax) > 1 ? "year"
            :   d3.timeMonth.count(dateMin, dateMax) > 1 ? "month"
            :   d3.timeDay.count(dateMin, dateMax) > 1 ? "day"
            :   d3.timeHour.count(dateMin, dateMax) > 1 ? "hour"
            :   "minute"
        );

        setDataArray(datArr);
        setDataMinMax([0, 30]);
    }

    useEffect(() => {

        const w = width - (margin.left + margin.right);
        const h = height - (margin.top + margin.bottom)

        const xScale = d3.scaleTime()
            .domain(d3.extent(dataArray, d => d[0]))
            .range([20, w])

        if (!xScaling) return;
        const filterData = variableTicks(w, dataArray.length, xScale);

        const yScale = d3.scaleLinear()
            .domain(dataMinMax)
            .range([h - 20, 0])

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(multiFormat)
            .tickPadding(10)
            .tickValues(filterData.map(d => d[0]))
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

    // Reduces or increases the number of rendered data-points and axis labels
    // based on the width of the svg
    const variableTicks = (width, timeCount, xScale) => {

        let prev;

        const filterData = dataArray.filter((datum, i) => {
            if (i > 0) {
                if (xScale(datum[0]) - xScale(prev) > 50)
                    return datum;
            } else {
                return datum;
            }
            prev = datum[0];
        })

        /*
        const spacing = Math.floor(width / timeCount);

        let breakSpace = 55;
        let counter = 1;

        if (xScaling === "minute" || xScaling === "hour") {
            while (spacing < breakSpace) {
                if (counter < 2) counter += 1;
                else counter += 2;
                breakSpace = breakSpace/1.8;
            }
            return (dataArray.filter((d, i) => i % counter === 0));
        }
        if (xScaling === "day") {
            while (spacing < breakSpace) {
                if (counter < 2) counter += 1;
                else counter += 2;
                breakSpace = breakSpace/1.8;
            }
            return (dataArray.filter((d, i) => i % counter === 0));
        }
*/
        return filterData;
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

    function multiFormat(date) {
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