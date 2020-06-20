import React, {useRef, useEffect, useState} from 'react';
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

    let containerRef = useRef();
    let { width, height } = useContainerDimensions(containerRef);

    // sieht scheiße aus...
    let marginsGroup = useRef();
    let dotsContainerRef = useRef();
    let textXRef = useRef();
    let textYRef = useRef();
    let xAxisRef = useRef();
    let yAxisRef = useRef();
    let tooltipRef = useRef();
    let pathRef = useRef();

    const margin = {left: 40, right: 30, top: 10, bottom: 25};

    useEffect(() => {

        const w = width - (margin.left + margin.right);
        const h = height - (margin.top + margin.bottom)

        let endDate = new Date(2020,0,0,0);
        let startDate = new Date(2020,12,24,0);
        data.forEach(d => {
            const date = new Date(d.time);
            if(date.getTime() >= endDate.getTime())
                endDate = date;
            if(date.getTime() <= startDate.getTime())
                startDate = date;
        });

        const data_array = data.map(d => [new Date(d.time), d[y_ID]]);

        d3.select(marginsGroup.current)
            .attr("transform", `translate(${margin.left},${margin.top})`)

        d3.select(textXRef.current)
            .attr("x", w/2)
            .attr("y", h+40)

        d3.select(textYRef.current)
            .attr("y", -margin.left+25)
            .attr("x", -h/2)
            .attr("transform", "rotate(-90)")

        const xScale = d3.scaleTime()
            .domain([startDate, endDate])
            .range([20, w])
            .nice()

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data_array, d => +d[1]))
            .range([h-20, 0])
            .nice()

        const xAxis = d3.axisBottom(xScale)
            .tickArguments([d3.timeMinute.every(10)])

        const yAxis = d3.axisLeft(yScale)
            .ticks(5)
            .tickFormat(d3.format(",.1f"))

        d3.select(xAxisRef.current)
            .attr("transform", `translate(${0}, ${h})`)
            .call(xAxis)
            //.select(".domain").remove();

        d3.select(yAxisRef.current)
            .call(yAxis)
            //.select(".domain").remove();

        const line = d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
            .curve(d3.curveBasis)

        d3.select(pathRef.current)
            .datum(data_array)
            .attr("d", line)
            .attr("class","line");


        const tooltip = d3.select(tooltipRef.current)
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#fff")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("font-size", "14px")
            .style("padding", "10px")
            .text("nothing...");

        d3.select(dotsContainerRef.current).selectAll("circle")
            .data(data_array)
            .join("circle")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 3)
            .classed("dot", true)
            .on("mouseover", d => {
                tooltip.text(d[1]+"°C  - " + new Date(d[0]).getHours() + ":" + new Date(d[0]).getMinutes() + " Uhr");
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", () => {
                return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
            })
            .on("mouseout", () => {
                return tooltip.style("visibility", "hidden");
            });

    }, [data, width, height]);


    return (
        <div className="svgContainer" ref={containerRef}>
            <svg height="100%" width="100%">
                <g ref={marginsGroup}>
                    <g ref={xAxisRef}>
                    </g>
                    <g ref={yAxisRef}>
                    </g>
                    <g ref={dotsContainerRef}>
                    </g>
                    <path ref={pathRef}>
                    </path>
                </g>
            </svg >
            <div ref={tooltipRef} />
        </div>
    );
}