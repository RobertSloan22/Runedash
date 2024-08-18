export async function trainModel(X, Y, window_size, n_epochs, learning_rate, n_layers, callback) {
    const batch_size = 32;
  
    // Input dense layer
    const input_layer_neurons = 64;
  
    // LSTM
    const rnn_output_neurons = 16;
  
    // Output dense layer
    const output_layer_neurons = 1;
  
    try {
      // Load data into tensor and normalize data
      const inputTensor = tf.tensor2d(X, [X.length, X[0].length]);
      const labelTensor = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]);
  
      const [xs, inputMax, inputMin] = normalizeTensorFit(inputTensor);
      const [ys, labelMax, labelMin] = normalizeTensorFit(labelTensor);
  
      // Define model
      const model = tf.sequential();
  
      model.add(tf.layers.dense({ units: input_layer_neurons, inputShape: [window_size] }));
      model.add(tf.layers.reshape({ targetShape: [window_size, input_layer_neurons] }));
  
      for (let index = 0; index < n_layers; index++) {
        model.add(tf.layers.lstm({ units: rnn_output_neurons, returnSequences: index < n_layers - 1 }));
      }
  
      model.add(tf.layers.dense({ units: output_layer_neurons }));
  
      // Compile model
      model.compile({
        optimizer: tf.train.adam(learning_rate),
        loss: 'meanSquaredError'
      });
  
      // Train model
      await model.fit(xs, ys, {
        batchSize: batch_size,
        epochs: n_epochs,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            if (callback) callback(epoch, logs);
          }
        }
      });
  
      return model;
    } catch (error) {
      console.error('Error in model training:', error);
      throw error;
    }
  }