let input_dataset = [];
let result = [];
let data_raw = [];
let sma_vec = [];
let window_size = 7;
let trainingsize = 70;
let data_temporal_resolutions = 'Weekly';

$(document).ready(function(){
  $('select').formSelect();
});

function onClickChangeDataFreq(freq){
  console.log(freq.value);
  data_temporal_resolutions = freq.value;
}

function onClickFetchData(){
  let ticker = document.getElementById("input_ticker").value;

  $("#btn_fetch_data").hide();
  $("#load_fetch_data").show();

  let requestUrl = `http://localhost:3030/rune-data?rune_name=${ticker}&limit=100`;

  $.getJSON(requestUrl, function(data) {
      let message = "";
      $("#div_container_linegraph").show();

      if(data.length > 0){
        data_raw = [];
        sma_vec = [];

        data.forEach(entry => {
          data_raw.push({ timestamp: entry.timestamp, price: entry.price_sats });
        });

        message = `Symbol: ${ticker} (last refreshed ${new Date().toISOString()})`;

        $("#btn_fetch_data").show();
        $("#load_fetch_data").hide();
        $("#div_linegraph_data_title").text(message);

        if(data_raw.length > 0){
          let timestamps = data_raw.map(val => val['timestamp']);
          let prices = data_raw.map(val => val['price']);

          let graph_plot = document.getElementById('div_linegraph_data');
          Plotly.newPlot(graph_plot, [{ x: timestamps, y: prices, name: "Rune Prices" }], { margin: { t: 0 } });
        }

        $("#div_container_getsma").show();
        $("#div_container_getsmafirst").hide();
      } else {
        $("#div_linegraph_data").text("No data found");
        $("#btn_fetch_data").show();
        $("#load_fetch_data").hide();
      }
  }).fail(function() {
    $("#div_linegraph_data").text("Error fetching data");
    $("#btn_fetch_data").show();
    $("#load_fetch_data").hide();
  });
}

function onClickDisplaySMA(){
  $("#btn_draw_sma").hide();
  $("#load_draw_sma").show();
  $("#div_container_sma").show();

  window_size = parseInt(document.getElementById("input_windowsize").value);

  sma_vec = ComputeSMA(data_raw, window_size);

  let sma = sma_vec.map(val => val['avg']);
  let prices = data_raw.map(val => val['price']);

  let timestamps_a = data_raw.map(val => val['timestamp']);
  let timestamps_b = data_raw.map(val => val['timestamp']).splice(window_size, data_raw.length);

  let graph_plot = document.getElementById('div_linegraph_sma');
  Plotly.newPlot(graph_plot, [{ x: timestamps_a, y: prices, name: "Rune Price" }], { margin: { t: 0 } });
  Plotly.plot(graph_plot, [{ x: timestamps_b, y: sma, name: "SMA" }], { margin: { t: 0 } });

  $("#div_linegraph_sma_title").text(`Rune Price and Simple Moving Average (window: ${window_size})`);
  $("#btn_draw_sma").show();
  $("#load_draw_sma").hide();

  $("#div_container_train").show();
  $("#div_container_trainfirst").hide();

  displayTrainingData();
}

function displayTrainingData(){
  $("#div_container_trainingdata").show();

  let set = sma_vec.map(val => val['set']);
  let data_output = "";
  for (let index = 0; index < 25; index++){
    data_output += `<tr><td width="20px">${index + 1}</td><td>[${set[index].map(val => (Math.round(val['price'] * 10000) / 10000).toString()).toString()}]</td><td>${sma_vec[index]['avg']}</td></tr>`;
  }

  data_output = `<table class='striped'><thead><tr><th scope='col'>#</th><th scope='col'>Input (X)</th><th scope='col'>Label (Y)</th></thead><tbody>${data_output}</tbody></table>`;

  $("#div_trainingdata").html(data_output);
}

async function onClickTrainModel(){
  let epoch_loss = [];

  $("#div_container_training").show();
  $("#btn_draw_trainmodel").hide();

  document.getElementById("div_traininglog").innerHTML = "";

  let inputs = sma_vec.map(inp_f => inp_f['set'].map(val => val['price']));
  let outputs = sma_vec.map(outp_f => outp_f['avg']);

  trainingsize = parseInt(document.getElementById("input_trainingsize").value);
  let n_epochs = parseInt(document.getElementById("input_epochs").value);
  let learningrate = parseFloat(document.getElementById("input_learningrate").value);
  let n_hiddenlayers = parseInt(document.getElementById("input_hiddenlayers").value);

  inputs = inputs.slice(0, Math.floor(trainingsize / 100 * inputs.length));
  outputs = outputs.slice(0, Math.floor(trainingsize / 100 * outputs.length));

  let callback = function(epoch, log) {
    let logHtml = document.getElementById("div_traininglog").innerHTML;
    logHtml = `<div>Epoch: ${epoch + 1} (of ${n_epochs}), loss: ${log.loss}</div>${logHtml}`;

    epoch_loss.push(log.loss);

    document.getElementById("div_traininglog").innerHTML = logHtml;
    document.getElementById("div_training_progressbar").style.width = `${Math.ceil(((epoch + 1) * (100 / n_epochs)))}%`;
    document.getElementById("div_training_progressbar").innerHTML = `${Math.ceil(((epoch + 1) * (100 / n_epochs)))}%`;

    let graph_plot = document.getElementById('div_linegraph_trainloss');
    Plotly.newPlot(graph_plot, [{x: Array.from({length: epoch_loss.length}, (v, k) => k+1), y: epoch_loss, name: "Loss" }], { margin: { t: 0 } });
  };

  result = await trainModel(inputs, outputs, window_size, n_epochs, learningrate, n_hiddenlayers, callback);

  let logHtml = document.getElementById("div_traininglog").innerHTML;
  logHtml = "<div>Model train completed</div>" + logHtml;
  document.getElementById("div_traininglog").innerHTML = logHtml;

  $("#div_container_validate").show();
  $("#div_container_validatefirst").hide();
  $("#div_container_predict").show();
  $("#div_container_predictfirst").hide();
}

function onClickValidate() {
  $("#div_container_validating").show();
  $("#load_validating").show();
  $("#btn_validation").hide();

  let inputs = sma_vec.map(inp_f => inp_f['set'].map(val => val['price']));

  // validate on training
  let val_train_x = inputs.slice(0, Math.floor(trainingsize / 100 * inputs.length));
  let val_train_y = makePredictions(val_train_x, result['model'], result['normalize']);

  // validate on unseen
  let val_unseen_x = inputs.slice(Math.floor(trainingsize / 100 * inputs.length), inputs.length);
  let val_unseen_y = makePredictions(val_unseen_x, result['model'], result['normalize']);

  let timestamps_a = data_raw.map(val => val['timestamp']);
  let timestamps_b = data_raw.map(val => val['timestamp']).splice(window_size, (data_raw.length - Math.floor((100-trainingsize) / 100 * data_raw.length)));
  let timestamps_c = data_raw.map(val => val['timestamp']).splice(window_size + Math.floor(trainingsize / 100 * inputs.length), inputs.length);

  let sma = sma_vec.map(val => val['avg']);
  let prices = data_raw.map(val => val['price']);
  sma = sma.slice(0, Math.floor(trainingsize / 100 * sma.length));

  let graph_plot = document.getElementById('div_validation_graph');
  Plotly.newPlot(graph_plot, [{ x: timestamps_a, y: prices, name: "Actual Price" }], { margin: { t: 0 } });
  Plotly.plot(graph_plot, [{ x: timestamps_b, y: sma, name: "Training Label (SMA)" }], { margin: { t: 0 } });
  Plotly.plot(graph_plot, [{ x: timestamps_b, y: val_train_y, name: "Predicted (train)" }], { margin: { t: 0 } });
  Plotly.plot(graph_plot, [{ x: timestamps_c, y: val_unseen_y, name: "Predicted (test)" }], { margin: { t: 0 } });

  $("#load_validating").hide();
}

async function onClickPredict() {
  $("#div_container_predicting").show();
  $("#load_predicting").show();
  $("#btn_prediction").hide();

  let inputs = sma_vec.map(inp_f => inp_f['set'].map(val => val['price']));
  let pred_X = [inputs[inputs.length-1]];
  pred_X = pred_X.slice(Math.floor(trainingsize / 100 * pred_X.length), pred_X.length);
  let pred_y = makePredictions(pred_X, result['model'], result['normalize']);

  window_size = parseInt(document.getElementById("input_windowsize").value);

  let timestamps_d = data_raw.map(val => val['timestamp']).splice((data_raw.length - window_size), data_raw.length);

  // date
  let last_date = new Date(timestamps_d[timestamps_d.length-1]);
  let add_days = 1;
  if(data_temporal_resolutions == 'Weekly'){
    add_days = 7;
  }
  last_date.setDate(last_date.getDate() + add_days);
  let next_date = await formatDate(last_date.toString());
  let timestamps_e = [next_date];

  let graph_plot = document.getElementById('div_prediction_graph');
  Plotly.newPlot(graph_plot, [{ x: timestamps_d, y: pred_X[0], name: "Latest Trends" }], { margin: { t: 0 } });
  Plotly.plot(graph_plot, [{ x: timestamps_e, y: pred_y, name: "Predicted Price" }], { margin: { t: 0 } });

  $("#load_predicting").hide();
}

function ComputeSMA(data, window_size) {
  let r_avgs = [], avg_prev = 0;
  for (let i = 0; i <= data.length - window_size; i++){
    let curr_avg = 0.00, t = i + window_size;
    for (let k = i; k < t && k <= data.length; k++){
      curr_avg += data[k]['price'] / window_size;
    }
    r_avgs.push({ set: data.slice(i, i + window_size), avg: curr_avg });
    avg_prev = curr_avg;
  }
  return r_avgs;
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

// TensorFlow.js specific functions
document.addEventListener('DOMContentLoaded', () => {
    let model;

    // Load the TensorFlow.js model
    async function loadModel() {
        model = await tf.loadLayersModel('model.js');
        updateStatus('Model loaded');
    }

    // Function to preprocess the data
    async function preprocessData(data) {
        updateStatus('Preprocessing data...');

        // Convert timestamps to Date objects and sort by time
        data.forEach(d => d.timestamp = new Date(d.timestamp));
        data.sort((a, b) => a.timestamp - b.timestamp);

        // Group data by hour and calculate OHLC
        const groupedData = {};
        data.forEach(d => {
            const hour = new Date(d.timestamp).setMinutes(0, 0, 0);
            if (!groupedData[hour]) {
                groupedData[hour] = {
                    Open: d.price_sats,
                    High: d.price_sats,
                    Low: d.price_sats,
                    Close: d.price_sats,
                    Volume: 1
                };
            } else {
                groupedData[hour].High = Math.max(groupedData[hour].High, d.price_sats);
                groupedData[hour].Low = Math.min(groupedData[hour].Low, d.price_sats);
                groupedData[hour].Close = d.price_sats;
                groupedData[hour].Volume += 1;
            }
        });

        // Convert grouped data to array
        const processedData = Object.keys(groupedData).map(hour => ({
            Hour: new Date(Number(hour)),
            ...groupedData[hour]
        }));

        // Fill missing values by forward filling
        for (let i = 1; i < processedData.length; i++) {
            if (!processedData[i].Close) {
                processedData[i].Close = processedData[i - 1].Close;
            }
        }

        // Normalize the data
        const closeValues = processedData.map(d => d.Close);
        const scaler = tf.scalar(1 / Math.max(...closeValues));
        const normalizedData = closeValues.map(v => scaler.mul(tf.scalar(v)));

        // Prepare sequences
        const sequenceLength = 30; // Adjust to match the input shape
        const X = [];
        for (let i = sequenceLength; i < normalizedData.length; i++) {
            X.push(normalizedData.slice(i - sequenceLength, i));
        }

        updateStatus('Data preprocessed');
        return tf.tensor3d(X, [X.length, sequenceLength, 1]);
    }

    // Function to run predictions
    async function predict(preprocessedData) {
        updateStatus('Running predictions...');
        const predictions = model.predict(preprocessedData);
        predictions.print();

        // Display predictions
        const output = document.getElementById('output');
        output.innerHTML = 'Predictions: <br>' + predictions.arraySync().map(pred => pred[0]).join('<br>');
        updateStatus('Predictions complete');
    }

    // Function to update status
    function updateStatus(message) {
        const status = document.getElementById('status');
        status.innerHTML = message;
    }

    // Load the model when the page is loaded
    loadModel();

    // Fetch data and run prediction on button click
    document.getElementById('fetch-predict-button').addEventListener('click', () => {
        axios.get('http://localhost:3030/rune-data?rune_name=BILLION•DOLLAR•CAT&limit=100')
            .then(async response => {
                const responseData = response.data.map(item => ({
                    timestamp: item.timestamp,
                    price_sats: item.price_sats
                }));
                const preprocessedData = await preprocessData(responseData);
                predict(preprocessedData);
            })
            .catch(error => {
                console.error('Error fetching historical data:', error);
                updateStatus('Error fetching historical data');
            });
    });
});
