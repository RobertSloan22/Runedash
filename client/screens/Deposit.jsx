import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Card, Nav, Table } from 'react-bootstrap';
import axios from 'axios';

const Deposit = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch the user's balance and transaction history when the component mounts
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = () => {
    // Call the API to get the user's balance
    // and update the state with the new balance
    const token = localStorage.getItem('userToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-api-key': 'MIIJKAIBAAKCAgEAlUAvcSUJqqMn7PmWFd/EB4ZLh5f1Yl3Sa',
      },
    };
    axios.get(`${API_URL}/api/user/balance`, config).then((response) => {
      setBalance(response.data.balance);
    });
  };

  const fetchTransactions = () => {
    // Call the API to get the user's transaction history
    // and update the state with the new transactions
    const token = localStorage.getItem('userToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-api-key': 'MIIJKAIBAAKCAgEAlUAvcSUJqqMn7PmWFd/EB4ZLh5f1Yl3Sa',
      },
    };
    axios.get(`https://octobercapstoneapi-56486337a847.herokuapp.com/api/transactions`, config).then((response) => {
      setTransactions(response.data.transactions);
    });
  };

  return (
    <div>
      <Card>
        <Card.Header>
          <Nav variant='pills' defaultActiveKey='#first'>
            <Nav.Item>
              <Nav.Link href='#first'>Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#link' active>
                Transactions
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#disabled' disabled>
                Welcome <strong>{userInfo?.firstName}!</strong>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Card.Title>Transaction History</Card.Title>
          <div>
            <h3>Your balance: {balance}</h3>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Deposit;