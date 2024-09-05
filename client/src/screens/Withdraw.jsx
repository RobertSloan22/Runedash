import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BalanceContext } from '../components/BalanceContext'; // Importing BalanceContext

const Withdraw = () => {
  const { balance, withdraw } = useContext(BalanceContext);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleWithdraw = () => {
    if (isNaN(withdrawAmount)) {
      setErrorMessage('Please enter a valid number.');
    } else if (Number(withdrawAmount) < 0) {
      setErrorMessage('Withdraw amount cannot be negative.');
    } else if (Number(withdrawAmount) > balance) {
      setErrorMessage('Insufficient balance.');
    } else {
      withdraw(withdrawAmount);
      setSuccessMessage('Withdraw processed successfully.');
      setWithdrawAmount('');
    }
  };
  

  return (
    <>
        <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Withdraw</h5>
          <p className="card-text">Balance: ${balance}</p>
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <form>
            <div className="form-group">
              <label htmlFor="withdrawAmount">Withdraw Amount</label>
              <input
                type="number"
                className="form-control"
                id="withdrawAmount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                    alert('Please enter a valid number.');
                  }
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleWithdraw}
              disabled={!withdrawAmount}
            >
              Withdraw
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Withdraw;