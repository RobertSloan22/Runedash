import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Card, Nav, Form, Button } from 'react-bootstrap';
// import the useDepositMutation and useWithdrawMutation from the generated hooks in userApi
import { useDepositMutation, useWithdrawMutation, useGetUserBalanceQuery } from '../app/services/auth/userApi';



const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: userBalance } = useGetUserBalanceQuery();
  const [balance, setBalance] = useState(userBalance?.balance);
  const [deposit, depositMutation] = useDepositMutation();
  const [withdraw, withdrawMutation] = useWithdrawMutation();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');


      const handleDeposit = (e) => {
        e.preventDefault();
        deposit(depositAmount).then((result) => {
          setBalance(result.data.balance);
      setDepositAmount('');
        }
        );
      };

      const handleWithdraw = (e) => {
        e.preventDefault();
        withdraw(withdrawAmount).then((result) => {
          setBalance(result.data.balance);
      setWithdrawAmount('');
        }
        );
      };

      

  return (
    <div>
      <Card>
        <Card.Header>
          <Nav variant='pills' defaultActiveKey='#first'>
            <Nav.Item>
              <Nav.Link href='#first'>Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#link'>transactions </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href='#disabled' disabled>
                Welcome <strong>{userInfo?.firstName}!</strong>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Card.Title></Card.Title>
          <Card.Text>
            Welcome <strong>{userInfo?.firstName}!</strong> You can view this page because you're logged in
          </Card.Text>
          <Form onSubmit={handleDeposit}>
            <Form.Group className='row'>
              <Form.Label className='col-sm-2'>Deposit</Form.Label>
              <div className='col-sm-10'>
                <Form.Control
                  type='number'
                  placeholder='Enter amount'
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
                />
              </div>
            </Form.Group>
            <Button variant='primary' type='submit'>
              Deposit
            </Button>
          </Form>
          <Form onSubmit={handleWithdraw}>
            <Form.Group className='row'>
              <Form.Label className='col-sm-2'>Withdraw</Form.Label>
              <div className='col-sm-10'>
                <Form.Control
                  type='number'
                  placeholder='Enter amount'
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                />
              </div>
            </Form.Group>
            <Button variant='primary' type='submit'>
              Withdraw
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileScreen;