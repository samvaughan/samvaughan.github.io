let margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

let svg = d3.select("div#example")
    .append("svg")
    .attr("width", 500)
    .attr("height", 350);

let m=3.0, c=15.0;
let points = d3.range(1, 10).map(function(i) {
    let x_val=i * width / 10;
    let noise=Math.random()*500;
    let y_val=m*x_val+c + noise;
    return {
        x:x_val,
        y:y_val

    };
});

let x = d3.scaleLinear()
    .rangeRound([0, width]);

let y = d3.scaleLinear()
    .rangeRound([height, 0]);

let xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

let line = d3.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

let drag = d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .subject(function(d){ return {x: x(d.x), y: y(d.y)} })
    .on('end', dragended);

svg.append('rect')
    .attr('class', 'zoom')
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

let focus = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(points, function(d) { return d.x; }));
y.domain(d3.extent(points, function(d) { return d.y; }));

focus.append("path")
    .datum(points)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);

focus.selectAll('circle')
    .data(points)
    .enter()
    .append('circle')
    .attr('r', 5.0)
    .attr('cx', function(d) { return x(d.x);  })
    .attr('cy', function(d) { return y(d.y); })
    .style('cursor', 'pointer')
    .style('fill', 'steelblue')
    .append("title");


focus.selectAll('circle')
    .call(drag);

focus.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

focus.append('g')
    .attr('class', 'axis axis--y')
    .call(yAxis);



function dragstarted(d) {
    d3.select(this).raise().classed('active', true);
}

function dragged(d) {
    d.x = x.invert(d3.event.x);
    d.y = y.invert(d3.event.y);
    d3.select(this)
        .attr('cx', x(d.x))
        .attr('cy', y(d.y));
    focus.select('path').attr('d', line);
}

function dragended(d) {
    d3.select(this).classed('active', false);
}