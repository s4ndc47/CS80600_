function _1(md){return(
  md`<div style="color: "#cbcbcb"; font: 13px/25.5px var(--Merriweather); text-transform: uppercase;"><h1 style="display: none;">Bar chart transitions</h1></div>
  `
  )}
  
  function _order(Inputs)
  {
    const select = Inputs.select(
      new Map([
        ["Alphabetical", (a, b) => a.country.localeCompare(b.country)],
        ["Descending", (a, b) => a.number - b.number],
        ["Ascending", (a, b) => b.number - a.number]
      ]),
      { label: "Order" }
    );
    
    return select;
  }
  
  
  function _chart(d3,data)
  {
  
    const width = window.innerWidth * 0.5;
    const height = window.innerHeight * 1;
    const marginTop = 20;
    const marginRight = 50;
    const marginBottom = 30;
    const marginLeft = 40;
    
   
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.number)]).nice()
      .range([marginLeft, width - marginRight]);
  
    const xAxis = d3.axisTop(x).tickSizeOuter(0);

    const y = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, height - marginBottom])
      .padding(0.9);
  
    const yAxis = d3.axisLeft(y).tickSizeOuter(0);


    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("style", `width: auto; height: auto; font: 5px sans-serif; overflow: visible;`);
  
  
    // Create a bar for each letter.
    const bar = svg.append("g")
      .attr("fill", "#cb6666")
      .attr("fill-opacity", 0.6)
      .selectAll("rect")
      .data(data)
      .join("rect")
      .style("mix-blend-mode", "multiply") 
      .attr("height", 5)
      .attr("width", d => x(d.number));
  
      const labels = svg.selectAll("text")
        .data(data)
        .join("text")
        .attr("class", "label")
        .attr("x", d => x(d.number) + 2) 
        .attr("y", d => y(d.country))
        .attr("fill", "black")
        .style('font-size', '5px')
        .text(d => `${d.number}`); 


    const gx = svg.append("g")
      .attr("transform", `translate(0, ${height - marginTop})`) 
      .style('font-size', '5px') 
      .call(d3.axisBottom(x).tickSizeOuter(0));

    const gy = svg.append("g")
      .attr("transform", `translate(${marginLeft}, 0)`) 
      .style('font-size', '5px')
      .call(d3.axisLeft(y).tickFormat((x) => (x * 100).toFixed()))
      .call(g => g.select(".domain").remove())
      .call(yAxis);

  
    // Return the chart, with an update function that takes as input a domain
    // comparator and transitions the x axis and bar positions accordingly. 
    return Object.assign(svg.node(), {
      update(order) {
        y.domain(data.sort(order).map(d => d.country));
  
        const t = svg.transition()
            .duration(750);
  
        bar.data(data, d => d.country)
            .order()
            .transition(t)
            .delay((d, i) => i * 20)
            .attr("y", d => y(d.country));
        
        labels.data(data, d => d.country) // Bind updated data to labels
            .order() 
            .transition(t)
            .delay((d, i) => i * 20) 
            .attr("y", d => y(d.country) + y.bandwidth() / 2 + 5); 
  
        gy.transition(t)
            .call(yAxis)
          .selectAll(".tick")
            .delay((d, i) => i * 20);
        
        gx.transition(t)
            .call(xAxis)
          .selectAll(".tick")
            .delay((d, i) => i * 20);

      }
    });
  }
  
  
  function _update(chart,order){return(
  chart.update(order)
  )}
  
  function _data(FileAttachment){return(
  FileAttachment("alphabet.csv").csv({typed: true})
  )}
  
  function _6(md){return(
  md``
  )}
  
  function _trigger($0,d3,Event,invalidation)
  {
    const input = $0.input;
    const interval = d3.interval(() => {
      input.selectedIndex = (input.selectedIndex + 1) % input.length;
      input.dispatchEvent(new Event("input", {bubbles: true}));
    }, 4000);
    const clear = () => interval.stop();
    input.addEventListener("change", clear, {once: true});
    invalidation.then(() => (clear(), input.removeEventListener("change", clear)));
  }
  
  
  function _8(md){return(
  md``
  )}
  
  export default function define(runtime, observer) {
    const main = runtime.module();
    function toString() { return this.url; }
    const fileAttachments = new Map([
      ["alphabet.csv", {url: new URL("./files/09f63bb9ff086fef80717e2ea8c974f918a996d2bfa3d8773d3ae12753942c002d0dfab833d7bee1e0c9cd358cd3578c1cd0f9435595e76901508adc3964bbdc.csv", import.meta.url), mimeType: "text/csv", toString}]
    ]);
    main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
    main.variable(observer()).define(["md"], _1);
    main.variable(observer("viewof order")).define("viewof order", ["Inputs"], _order);
    main.variable(observer("order")).define("order", ["Generators", "viewof order"], (G, _) => G.input(_));
    main.variable(observer("chart")).define("chart", ["d3","data"], _chart);
    main.variable(observer("update")).define("update", ["chart","order"], _update);
    main.variable(observer("data")).define("data", ["FileAttachment"], _data);
    main.variable(observer()).define(["md"], _6);
    main.variable(observer()).define(["md"], _8);
    return main;
  }