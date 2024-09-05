import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { depositMoney, withdrawMoney } from '../app/services/user/userActions';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getUserDetails } from '../app/services/user/userActions';
import  Deposit  from '../components/Deposit';
import  Withdraw  from '../screens/Withdraw';


const BankingScreen = () => {
  const dispatch = useDispatch();
  const { balance } = useSelector(state => state.user);
  const { data, isLoading, isError } = getUserDetails();

  const [depositAmount, setDepositAmount] = React.useState('');
  const [withdrawAmount, setWithdrawAmount] = React.useState('');
  const [depositError, setDepositError] = React.useState('');
  const [withdrawError, setWithdrawError] = React.useState('');

  const handleDeposit = (event) => {
    event.preventDefault();
    if (!isValidAmount(depositAmount)) {
      setDepositError('Invalid amount');
      return;
    }
    dispatch(depositMoney(Number(depositAmount)));
    setDepositAmount('');
    setDepositError('');
  };

  const handleWithdraw = (event) => {
    event.preventDefault();
    if (!isValidAmount(withdrawAmount)) {
      setWithdrawError('Invalid amount');
      return;
    }
    dispatch(withdrawMoney(Number(withdrawAmount)));
    setWithdrawAmount('');
    setWithdrawError('');
  };

  const isValidAmount = (amount) => {
    return /^\d+(\.\d{1,2})?$/.test(amount);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form onSubmit={handleDeposit}>
            <Form.Group controlId="depositAmount">
              <Form.Label>Deposit Amount</Form.Label>
              <Form.Control
                type="text"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                isInvalid={depositError !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {depositError}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Deposit
            </Button>
          </Form>
        </Col>
        <Col>
        <Deposit />
        </Col>
      </Row>
      <Row>
        <Col>
        <Withdraw />
        </Col>
        <Col>
          <Form onSubmit={handleWithdraw}>
            <Form.Group controlId="withdrawAmount">
              <Form.Label>Withdraw Amount</Form.Label>
              <Form.Control
                type="text"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                isInvalid={withdrawError !== ''}
              />
              <Form.Control.Feedback type="invalid">
                {withdrawError}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Withdraw
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Current Balance: {balance}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default BankingScreen;