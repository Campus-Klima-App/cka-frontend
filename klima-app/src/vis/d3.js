

/*
const svg = d3.selectAll(".lineGraph");
svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 100);





var line;

var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 1700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var positionOffset = 30; // offset for each diagramm to visulize the headline

d3.json("https://gist.githubusercontent.com/mickey175/bb19eff9e1625f9db89b68cff9cb5aed/raw/f710ad6374e04fc5bcaf69852a34fd9c35f6831c/data.json").then(function(data){

    var svg = d3.select("#lineGraph").append("svg")
        .data(data)
        .attr("class", "temperature")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = selectX_axisRange(data,svg); // select the range when document is loaded
    var yScale = selectY_axisRange(data,svg); // select the range when document is loaded

    var g = svg.append("g")
        .attr("transform","translate(50,0)");

    /*
    * when document is loaded show the first lines and the get the sensor/date data
    **/
/*
    drawLine(xScale,yScale,g,data); // draw the first line when document is loaded
    createBarChart("white", "yellow",data);
    createDonutChart(data);
});

function createBarChart(fontColor, color, data){

    var width = 200;
    var height = 300;


    var x = d3.scaleBand()
        .domain(d3.range(1))
        .range([margin.left, 100])
        .padding(0.1);

    // get highest value from all data
    var batteryStatus = 0;
    var batteryMin = 0;
    var batteryMax = 4500;
    var batteryMaxPercent = (4500*100)/4500;

    data.forEach(function(data){
        if(data.battery >= batteryStatus){
            batteryStatus = data.battery;
        }
    });

    var y = d3.scaleLinear()
        .domain([batteryMin, d3.max(data, function(d) { return d.battery*100/batteryMax; })]).nice()
        .range([height - margin.bottom, margin.top]);

    var xAxis = g => g
        .attr("transform", `translate(0,${height-margin.bottom+positionOffset})`)
        .attr("fill",fontColor)
        .call(d3.axisBottom(x).tickFormat(i => data[i].device_id).tickSizeOuter(0));

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},${positionOffset})`)
        .attr("stroke",fontColor)
        .call(d3.axisLeft(y));

    var svg = d3.select("#barGraph").append("svg")
        .data(data)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + ",0)")
        .attr("class", "col col-lg-5");

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("class","axis_Text")
        .attr("x", width/1.35)
        .attr("y", height/10)
        .text("Batteriezustand");

    var tooltip = d3.select("#barGraph")
        .append("div")
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

    svg.append("rect")
        .attr("fill", color)
        .data(data)
        .attr("x", (d, i) => x(i))
        .attr("y", d => y((d.battery*100)/batteryMax))
        .attr("height", d => y(0) - y((d.battery*100)/batteryMax))
        .attr("width", 50)
        .attr("transform", "translate(0,"+positionOffset+")")
        .on("mouseover", function(d){tooltip.text("Batteriestatus: "+(d.battery*100)/batteryMax+" %"); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    svg.append("g")
        .call(xAxis)
        .attr("stroke",fontColor);

    svg.append("g")
        .call(yAxis)
        .attr("stroke",fontColor);



    return svg.node();
}

function createDonutChart(data){
    var width = 300,
        height = 300;

    var highestValue = 0;
    data.forEach(function(data){
        if(data.light >= highestValue){
            highestValue = data.light;
        }
    });

    var svg = d3.select("#barGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left*2 + ",0)")
        .attr("class", "col col-lg-5");

    var arc = d3.arc()
        .innerRadius(80)
        .outerRadius(120)
        .startAngle(0 * (Math.PI/180)) //converting from degs to radians
        .endAngle(highestValue* (Math.PI/180));

    var arcShape = d3.arc()
        .innerRadius(80)
        .outerRadius(120)
        .startAngle(0 * (Math.PI/180)) //converting from degs to radians
        .endAngle(360* (Math.PI/180));

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("class","axis_Text")
        .attr("x", width/2)
        .attr("y", height/10)
        .text("Lichtverhältnisse");

    var tooltip = d3.select("#barGraph")
        .append("div")
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

    svg.append("path")
        .attr("d", arcShape)
        .attr("d", arcShape)
        .attr("class", "arc-shape")
        .attr("transform", "translate(150,"+(positionOffset+150)+")");

    svg.append("path")
        .data(data)
        .attr("d", arc)
        .attr("d", arc)
        .attr("class", "arc")
        .attr("transform", "translate(150,"+(positionOffset+150)+")")
        .on("mouseover", function(d){tooltip.text("Lichtverhältnisse: "+d.light); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});


}
*/

/* draw a single line depending on id, unit and data*/
/*
function drawLine(xScale,yScale,g,data){

    var data_array = [];
    var x = 0;
    data.forEach(function(dataset){
        data_array[x] = [new Date(dataset.time),dataset.temperature];
        x++;
    });

    line = d3.line()
        .x(function(d) {
            var date = new Date(d[0]);
            return xScale(date)
        })
        .y(function(d) {
            return yScale(d[1])
        });

    g.append("path")
        .datum(data_array)
        .attr("id","lineId")
        .attr("transform", "translate(25,0)")
        .attr("class","line")
        .attr("d",line);

    var tooltip = d3.select(".App-body")
        .append("div")
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

    g.selectAll(".dot")
        .data(data_array)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("transform", "translate(25,0)")
        .attr("cx", line.x())
        .attr("cy", line.y())
        .attr("r", 6)
        .on("mouseover", function(d){tooltip.text(d[1]+"°C  - "+new Date(d[0]).getHours()+":"+new Date(d[0]).getMinutes()+" Uhr"); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    return line;
}
*/
/*get x-axis range by month*/
/*
function selectX_axisRange(data,svg){

    var endDate = new Date(2020,0,0,0);
    var startdate = new Date(2020,12,24,0);
    data.forEach(function(dataset){
        if(new Date(dataset.time).getTime() >= new Date(endDate).getTime()){
            endDate = dataset.time;
        }
        if(new Date(dataset.time).getTime() <= new Date(startdate).getTime()){
            startdate = dataset.time;
        }
    });

    var xScale = d3.scaleTime()
        .domain([new Date(startdate), new Date(endDate)]).nice()
        .range([0,width]);

    var x_axis = d3.axisBottom()
        .scale(xScale);

    svg.append("g")
        .attr("transform", "translate("+75+"," + (height+positionOffset) + ")")
        .attr("id","x_axis")
        .attr("class","axis_color")
        .call(x_axis);

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("class","axis_Text")
        .attr("x", width+75)
        .attr("y", height + margin.top + 20)
        .text("Stunden");

    return xScale;
}

function selectY_axisRange(data,svg){

    var y_offset = 0.25; // just to visulize the data

    //get highest value
    var highValue = 0;
    var lowValue = 30;
    data.forEach(function(dataset){
        if(dataset.temperature > highValue ){
            highValue = dataset.temperature;
        }
        if(dataset.temperature < lowValue ){
            lowValue = dataset.temperature;
        }
    });

    var yScale = d3.scaleLinear()
        .domain([lowValue - y_offset, highValue + y_offset]).nice()
        .range([height,0]);

    var y_axis = d3.axisLeft()
        .scale(yScale);

    svg.append("g")
        .attr("transform", "translate(" +75 + ","+(positionOffset)+")")
        .attr("id","y_axis")
        .attr("class","axis_color")
        .call(y_axis);

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left-45)
        .attr("x", margin.top-25)
        .attr("class","axis_Text")
        .text("Temperatur")

    return yScale;
}
*/
/*choose random colors for the lines*/
/*
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
*/