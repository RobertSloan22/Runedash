import React, { useState, createContext } from 'react';

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const deposit = (amount) => {
    setBalance((prevBalance) => prevBalance + Number(amount));
    setTransactionHistory((prevTransactions) => [
      ...prevTransactions,
      { type: 'Deposit', amount, date: new Date() },
    ]);
  };

  const withdraw = (amount) => {
    setBalance((prevBalance) => prevBalance - Number(amount));
    setTransactionHistory((prevTransactions) => [
      ...prevTransactions,
      { type: 'Withdrawal', amount, date: new Date() },
    ]);
  };

  return (
    <BalanceContext.Provider
      value={{ balance, deposit, withdraw, transactionHistory }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
export default BalanceContext;