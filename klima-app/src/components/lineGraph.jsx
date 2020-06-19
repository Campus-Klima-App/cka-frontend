import React, {useRef, useEffect, useState} from 'react';
import * as d3 from "d3";

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

export default function LineGraph({data, xProp, yProp}) {

    const svgRef = useRef();
    const containerRef = useRef();
    const { width, height } = useContainerDimensions(containerRef);

    useEffect(() => {

        const svg = d3.select(svgRef.current);

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, datum => +datum[xProp]))
            .rangeRound([0, width])

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, datum => +datum[yProp]))
            .rangeRound([height, 0])

        const line = d3.line()
            .x(d => xScale(d[xProp]))
            .y(d => yScale(d[yProp]))
            .curve(d3.curveMonotoneX)

        const group = svg.append("g")

        group.append("path")
            .attr("d", line(data))
            .attr("fill", "none")
            .attr("stroke", "#808080")

        group.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => xScale(d[xProp]))
            .attr("cy", d => yScale(d[yProp]))
            .attr("r", 3)
            .attr("fill", "white")

        return(() => {
            group.remove()
        })
    });

    return (
        <div className="lineContainer" ref={containerRef}>
            <svg width={width} height={height} ref={svgRef}>
            </svg>
        </div>
    );
}