
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(sampleNames);

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    // buildCharts(firstSample);
    buildMetadata(firstSample);
    buildCharts(firstSample);
    buildGauge(firstSample);
  });
}

// Initialize the dashboard
init();

// option changed
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildGauge(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = samplesArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).reverse().map((id) => `OTU ${id}`);
    console.log(otu_ids.slice(0, 10));

    // 8. Create the trace for the bar chart. 
    var barData = {
    	type:'bar',
    	x: sample_values.slice(0,10).reverse(),
    	y: yticks,
    	orientation: 'h',
    	marker: {
    		color: 'rgb(2, 2, 252, .7',
    		width: 1.4
    	},
    	text: otu_labels.slice(0, 10).reverse(),
      hovermode:'closest'
    };
    	
    // 9. Create the layout for the bar chart. 
    var barLayout = {
    	title: {text: "Top bacteria cultures found", font: {size: 19}}
    };

    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bar', [barData], barLayout);

    // DELIVERABLE 2
    // =============

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        hovermode:'closest',
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "Bacteria Culture per Sample", font: {size: 19}}
    }

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  }
)};

// deliverable 3
// =============
// build gauge
function buildGauge(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var sampleMetadata = metadataArray[0];

    // 3. Create a variable that holds the washing frequency.
    var wfreq = sampleMetadata.wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wfreq, 
      title: {text: "Belly Button Washing Frequency<br>(Scrubs per Week)", font: {size: 19}},
      gauge: {
        axis: {range: [null, 10], tickwidth: 2, tickcolor: "lightgray"},
        bar: { color: "#000" },
        bgcolor: "white",
        borderwidth: 1,
        bordercolor: "lightgray",
        steps: [
          {range: [0, 2], color: "rgb(242, 42, 42, .7)"},
          {range: [2, 4], color: "rgb(242, 142, 42, .7)"},
          {range: [4, 6], color: "rgb(242, 242, 42, .7)"},
          {range: [6, 8], color: "rgb(42, 242, 42, .7)"},
          {range: [8, 10], color: "rgb(24, 204, 24, .7)"}
        ],
      }
    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 35 },
      paper_bgcolor: "#fff",
      font: { color: "darkblue", family: "Open Sans", size: 14 }
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });

}