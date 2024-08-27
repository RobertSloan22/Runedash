import axios from 'axios';

const PROMETHEUS_URL = 'http://localhost:9090/api/v1';

const prometheusService = {
  query: async (query) => {
    try {
      const response = await axios.get(`${PROMETHEUS_URL}/query`, {
        params: {
          query,
        },
      });
      return response.data.data.result;
    } catch (error) {
      console.error('Error querying Prometheus:', error);
      return [];
    }
  },
};

export default prometheusService;
