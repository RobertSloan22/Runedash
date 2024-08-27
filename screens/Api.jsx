import axios from 'axios';

const API_URL = 'https://2l7TWTU3TDf2nU3WiRt7MNS3EkB.ngrok.app';

export const deposit = async (amount) => {
  const token = localStorage.getItem('userToken');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-api-key': 'MIIJKAIBAAKCAgEAlUAvcSUJqqMn7PmWFd/EB4ZLh5f1Yl3Sa',
    },
  };
  const data = { amount };
  const response = await axios.post(`${API_URL}/api/user/profile`, data, config);
  const { balance } = response.data;
  alert(`Deposit successful. Your new balance is ${balance}.`);
  return balance;
};

export const withdraw = async (amount) => {
  const token = localStorage.getItem('userToken');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-api-key': 'MIIJKAIBAAKCAgEAlUAvcSUJqqMn7PmWFd/EB4ZLh5f1Yl3Sa',
    },
  };
  const data = { amount };
  const response = await axios.post(`${API_URL}/api/user/withdraw`, data, config);
  const { balance } = response.data;
  alert(`Withdrawal successful. Your new balance is ${balance}.`);
  return balance;
};