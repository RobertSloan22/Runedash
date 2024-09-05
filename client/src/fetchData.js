export async function fetchForecastData() {
    try {
      const response = await fetch('https://2c4aa82d171c44a8.ngrok.app/api1/forecast');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }
  