let cyclistDataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(cyclistDataUrl, function cyclistData(dataset) {
  dataset.forEach(function(dataPoint) {
    let timeParser = dataPoint.Time.split(':');
    dataPoint.Time = new Date(Date.UTC(1970, 0, 1, 0, timeParser[0], timeParser[1]));
  });
    
    const padding = {
        top: 110,
        bottom: 80,
        left: 80,
        right: 80
    },
          width = 800,
          height = 600;
    
    let x = d3.scaleLinear().range([0, width - padding.left - padding.right]),
        y = d3.scaleTime().range([0, height - padding.top - padding.bottom]),
        xAxis = d3.axisBottom(x).tickFormat(d3.format("d")),
        yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));
    
    x.domain([d3.min(dataset, (d) => d.Year) - 1, d3.max(dataset, (d) => d.Year) + 1]);
    y.domain(d3.extent(dataset, (d) => d.Time));
  
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // Title text
    svg.append("text")
    .text("Doping in Professional Bicycle Racing")
    .attr("id", "title")
    .attr("x", "50%")
    .attr("y", "6%")
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", "middle")
    .style("font-size", 28);
  
  svg.append("text")
    .text("35 Fastest times up Alpe d'Huez")
    .attr("x", "50%")
    .attr("y", "12%")
    .attr("alignment-baseline", "middle")
    .attr("text-anchor", "middle")
    .style("font-size", 18);
  
 // Axes text
    svg.append("text")
    .text("Time in Minutes")
    .attr("x", "-50%")
    .attr("y", "5%")
    .attr("transform", "rotate(-90)")
    .style("font-size", 14);
  
  svg.append("text")
    .text("Calendar Year")
    .attr("y", "94%")
    .attr("x", "50%")
    .attr("transform", "rotate(0)")
    .style("font-size", 14);
    
  // Legend definition
  const gLegend = svg.append("g")
    .attr("id", "legend");
  
  gLegend.append("text")
    .text("- No doping allegations")
    .attr("x", "90.5%")
    .attr("y", "30.8%")
    .attr("text-anchor", "end")
    .style("font-size", 11);
    
   gLegend.append("circle")
    .attr("cx", "75%")
    .attr("cy", "30%")
    .attr("r", 8)
    .style("fill", "green");
  
  gLegend.append("text")
    .text("- Riders with doping allegations")
    .attr("x", "95.5%")
    .attr("y", "36%")
    .attr("text-anchor", "end")
    .style("font-size", 11);
    
  gLegend.append("circle")
    .attr("cx", "75%")
    .attr("cy", "35.5%")
    .attr("r", 8)
    .style("fill", "red");
  
  // To be refactored from here
  const circle = svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 7.5)
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.Time))
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .style("fill", (d) => d.Doping === "" ? "green" : "red")
    .attr("transform", "translate(" + padding.left + ", " + padding.top + ")");
  
  svg.append("g")
    .attr("transform", "translate(" + padding.left + ", " + (height - padding.bottom)  +")")
    .attr("id", "x-axis")
    .attr("class", "x axis")
    .call(xAxis);
  
  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding.left + ", " + padding.top + ")")
    .attr("id", "y-axis")
    .call(yAxis);
  
  
  const tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip");
    
  circle.on("mouseover", (d) => { 
      return tooltip
          .style("visibility", "visible")
          .attr("data-year", d.Year)
          .html(d.Name + ': ' + d.Nationality + '<br /> Year: ' + d.Year + ', Time: ' + d3.timeFormat("%M:%S")(d.Time) + (d.Doping === "" ? '' : '<br /><br />' + d.Doping));
  })
      .on("mousemove", () => {
        return tooltip
            .style("top", (d3.event.pageY-20)+"px")
            .style("left", (d3.event.pageX+20)+"px");})
      .on("mouseout", ()=> tooltip.style("visibility", "hidden"));
});