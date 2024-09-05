import React, { useState } from 'react';
import axios from 'axios';

const RuneSelect = () => {
  const [runeName, setRuneName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleInputChange = (event) => {
    setRuneName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('Processing...');
    setPrediction(null);

    // Format the rune name
    const formattedRuneName = runeName.toUpperCase().replace(/\s+/g, '•');
    
    try {
      const response = await axios.post('https://cdaf3b7a6b8f740b.ngrok.app/api4/forecast', {
        rune_name: formattedRuneName,
      });
      setMessage('Prediction completed successfully');
      setPrediction(response.data.data);
    } catch (error) {
      setMessage('Error during prediction');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Rune Prediction</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Rune Name:
          <input type="text" value={runeName} onChange={handleInputChange} />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <div>
        {message && <p>{message}</p>}
        {prediction && (
          <div>
            <h2>Prediction Data</h2>
            <pre>{JSON.stringify(prediction, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default RuneSelect;
