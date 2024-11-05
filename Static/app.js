// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
   let metadata= data.metadata;
  
    // Filter the metadata for the object with the desired sample number
    let result= metadata.filter(OTU => OTU.id == sample);
    let sample1= result[0];
    console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel= d3.select(`#sample-metadata`);


    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key in sample1){
      panel.append("h6").text(`${key.toUpperCase()}: ${sample1[key]}`);
    };
    });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let samplenumber= samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids= samplenumber.otu_ids;
    let otu_labels= samplenumber.otu_labels;
    let sample_values= samplenumber.sample_values;
    
    // Build a Bubble Chart
    let trace1= {
      x: otu_ids,
      y: sample_values,
      type: 'bubble',
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Bluered'
      }
    };
    var data=[trace1];
    
    let layout = {
      height: 800,
      width: 800,
      title: 'Bacteria Cultures Per Sample'
    }

    // Render the Bubble Chart
    Plotly.newPlot('bubble', data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let trace2= {
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
        type: 'bar',
        orientation: 'h',
        marker: {
          color: 'slategray'
        },
        text: otu_labels.slice(0,10).reverse()
      };

    var otherdata = [trace2];

    let newlayout = {
      height: 800,
      width: 800,
      title: 'Top 10 Bacteria Cultures Found'
    }
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    Plotly.newPlot('bar', otherdata, newlayout);

    // Render the Bar Chart

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names= data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu= d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
        dropdownMenu.append('option')
              .text(name)
              .property('value', name);
    });

    // Get the first sample from the list
    let first= names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(first);
    buildMetadata(first);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


