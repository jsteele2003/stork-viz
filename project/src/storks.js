d3.json("./assets/data/storkData.json", function (error, data){
      if (error) console.log(error);
      else{
        setup(data);
      }
    });
  
  function setup(storkData){
    // console.log(storkData.storks)
    var storks = [];
    var uplift = [];
    var feature = "distance";
   

    //prep data for d3 selection
    function fillData(){
    Object.entries(storkData.storks).forEach(
    ([key, value]) => {
      if(key != "DER AP925"){
      let stork = {};
      stork.name = key;
      stork.status = value.status;
      stork.distance = value.distance;
      stork.uplift = d3.mean(value.uplift);
      stork.temp = d3.mean(value.temp) - 273;
      stork.veg = d3.mean(value.veg);
      stork.population = value.population;
      stork.energy = value.energy[value.energy.length - 1]/ value.energy.length;
      uplift.push(stork.uplift)
      storks.push(stork);} else{console.log(key)} 
    });
    }
    fillData();
    console.log(d3.max(uplift))
    console.log(d3.min(uplift))
    
    
  d3.select('#sortAscending')
    .on('click', function(){
      svg.selectAll(".line").sort(function(x, y) {
        console.log(feature);
      return d3.ascending(+y[feature], +x[feature]);
      })
      .transition().duration(500)
      .attr("x1", function(d, i) {
        return 45 + ((window.innerWidth-75)/70)* i;
      })
      .attr("x2", function(d, i) {
        return 45 + ((window.innerWidth-75)/70)* i;
      })
    });
  
  d3.select('#sortPop')
    .on('click', function() {
      svg.selectAll(".line").sort(function(x, y) {
      return d3.ascending(y.population, x.population);
      })
      .transition().duration(500)
      .attr("x1", function(d, i) {
        return 35 + ((window.innerWidth-75)/70)* i;
      })
      .attr("x2", function(d, i) {
        return 35 + ((window.innerWidth-75)/70)* i;
      })
  });
  d3.select('#distLabel')
    .on('click', function() {
      feature = "distance";
      svg.selectAll(".line").sort(function(x, y) {
      return d3.ascending(y.population, x.population);
      })
      var legend = svg.select("#legend");
      legend.transition().duration(2000).style("fill", "url(#dist-gradient)");
      updateLegend(distLegend, "dist-gradient");
      updateData(dist_colour);
  });
  
  d3.select('#tempLabel')
    .on('click', function() {
      feature = "temp";
      svg.selectAll(".line").sort(function(x, y) {
      return d3.ascending(y.population, x.population);
      })
      var legend = svg.select("#legend");
      legend.transition().duration(2000).style("fill", "url(#temp-gradient)");
      updateLegend(tempLegend, "temp-gradient");
      updateData(temp_colour);
  });
  
  d3.select('#energyLabel')
    .on('click', function() {
      feature = "energy";
      var legend = svg.select("#legend");
      legend.transition().duration(2000).style("fill", "url(#energy-gradient)");
      updateLegend(energyLegend, "energy-gradient");
      updateData(energy_colour);
  });
  
  d3.select('#upliftLabel')
    .on('click', function() {
      feature = "uplift";
      var legend = svg.select("#legend");
      legend.transition().duration(2000).style("fill", "url(#uplift-gradient)");
      updateLegend(upliftLegend, "uplift-gradient");
      updateData(uplift_colour);
  });
  
   //start flight at 779, end at 1452            
    var myScrollTop = 0;
    d3.select(window)
    .on("scroll.scroller", function (){
      myScrollTop = window.pageYOffset;
    })
    
    function updateData(colourScale){
      storks.sort(function(x, y) {
        console.log(feature);
      return d3.ascending(+y[feature], +x[feature]);
      })
     
      var lines = svg.selectAll('line').data(storks, function(d){
        return d.name;
      });
      lines.transition().duration(500)
                        .style('shape-rendering','crispEdges')
                        .attr("stroke-width", 1)
                        .attr("stroke", function(d,i){return colourScale(+d[feature])})
                        .attr("x1", function(d,i){return 45 + ((window.innerWidth-75)/70)* i;})
                        .attr("x2", function(d,i){return 45 + ((window.innerWidth-75)/70)* i;} ) ;
                        
      var linesEnter = lines.enter().append('line');
      linesEnter.attr("class", "line")
                .attr("id", function(d){return d.name})
                .attr("y1", 20)
                .attr("y2", 20)
                .style('shape-rendering','crispEdges')
                .attr("stroke-width", 1)
                .attr("stroke", "lightgray")
                .attr("x1", function(d,i){return 45 + ((window.innerWidth-75)/70)* i;})
                .attr("x2", function(d,i){return 45 + ((window.innerWidth-75)/70)* i;} )
                .transition()
                  .duration(2500)
                  .attr("y2", function(d,i){return 35+ distScale(+d.distance)})
                  .attr("stroke", function(d,i){return colourScale(+d[feature])});
    }

    function renderLines(){
        if(myScrollTop > 1280){
          updateData(dist_colour);
        } else{
          window.requestAnimationFrame(renderLines)
        }                           
      }
      window.requestAnimationFrame(renderLines);
   
  }    
    var height = window.innerHeight - 40;
    var svg = d3.select(".chartContainer1")
                                    .append("svg")
                                    .attr("width", window.innerWidth)
                                    .attr("height", height);
       //Gradient Legend
    var distScale = d3.scaleLinear()
        .range([0, height - 80])
        .domain([0, 9997.63953184151]);
    
        
    var dist_colour = d3.scaleLinear().domain([0, 10000]).range(["#f7fcb9", "#31a354"]);
    var temp_colour = d3.scaleLinear().domain([11, 32]).range(["#91bfdb", "#fc8d59"]);
    var energy_colour = d3.scaleLinear().domain([8520, 866525]).range(["#fff7f3","#49006a"]);
    var uplift_colour = d3.scaleLinear().domain([0.5535697422771073, 1.2894062842865606]).range(['#f7fbff','#08306b']);
    
    var distLegend = ["10000km","0km" ];
    var tempLegend = ['32°C','11°C' ];
    var energyLegend = ["866,525(OBDA)", "8520", ];
    var upliftLegend = ["1.30m/s", "0.50 m/s"]
    
    var defs = svg.append("defs");
    
    var distanceGradient = defs.append("linearGradient")
                                  .attr("id", "dist-gradient");
    var tempGradient = defs.append("linearGradient")
                                  .attr("id", "temp-gradient");
    var energyGradient = defs.append("linearGradient")
                                  .attr("id", "energy-gradient");
    
    var upliftGradient = defs.append("linearGradient")
                                  .attr("id", "uplift-gradient");
    
    
    distanceGradient
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%");
    
    distanceGradient.append("stop") 
                          .attr("offset", "0%")   
                          .attr("stop-color", "#f7fcb9");
                          
    distanceGradient.append("stop") 
                          .attr("offset", "100%")   
                          .attr("stop-color", "#31a354");
    
    tempGradient
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%");
    
    tempGradient.append("stop") 
                          .attr("offset", "0%")   
                          .attr("stop-color", "#91bfdb");
                          
    tempGradient.append("stop") 
                          .attr("offset", "100%")   
                          .attr("stop-color", "#fc8d59");
    
    energyGradient
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%");
    
    energyGradient.append("stop") 
                          .attr("offset", "0%")   
                          .attr("stop-color", "#fff7f3");
                          
    energyGradient.append("stop") 
                          .attr("offset", "100%")   
                          .attr("stop-color", "#49006a"); 
                          
    upliftGradient
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "0%");
    
    upliftGradient.append("stop") 
                          .attr("offset", "0%")   
                          .attr("stop-color", '#f7fbff');
                          
    upliftGradient.append("stop") 
                          .attr("offset", "100%")   
                          .attr("stop-color", "#08306b");  
    
    //initialise the static attributes of the legend's group
    svg.append("g")
    .attr("id", "legendGroup")
    .attr("transform", function() { return "translate(25,"+(height -20) + ")"; })
    .append("rect")
            .attr("width", window.innerWidth - 35)
            .attr("height", 10)
            .attr("id", "legend")
            .style("fill", "url(#dist-gradient)");
    
    //constant distance bar     
    var distBar = svg.append("g").attr("transform", function() { return "translate(20,20)"; });
    distBar
    .append("rect")
            .attr("width", 10)
            .attr("height", height - 40)
            .attr("id", "staticLegend")
            .attr("hidden", true)
            .style("fill", "gray");
    
    distBar.append("text")
              .style('fill', "white")
              .style("text-anchor", "middle")
              .attr("dy", "-.35em")
              .text("0km");
              
    distBar.append("text")
              .style('fill', "white")
              .style("text-anchor", "middle")
              .attr("dy", "-.35em")
              .text("0km");
            
    function updateLegend(data, url){
    var group = svg.select("#legendGroup").selectAll("text");
       
    var labels = group.data(data).enter()
            .append("text")
            .attr("dy", "-.35em")
            .attr("transform", function(d,i){return 'translate(' + i * (window.innerWidth - 80) +',-5)';})
            .style('fill', "white")
            .merge(group)
            .text(function(d, i) { return d; });
    
    labels.exit().remove();   
    
    }
    updateLegend(distLegend, "distance-gradient");