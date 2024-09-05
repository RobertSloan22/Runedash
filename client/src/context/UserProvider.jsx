import React, { useState } from 'react';

export const BalanceContext = React.createContext();
export const AuthContext = React.createContext();

// user context definition
export const UserContext = React.createContext({
  users: [],
  loggedInUser: null,
  addUser: (user) => {},
  setLoggedInUser: (user) => {},
});

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        loggedInUser,
        setLoggedInUser, // pass the function to the context provider
      }}
    >
      {children}
    </UserContext.Provider>
  );
};







export function Card(props) {
  function classes() {
    const bg = props.bgcolor ? ' bg-' + props.bgcolor : ' ';
    const txt = props.txtcolor ? ' text-' + props.txtcolor : ' text-white';
    return 'card mb-3 ' + bg + txt;
  }

  return (
    <div className={classes()} style={{maxWidth: "18rem"}}>
      <div className="card-header">{props.header}</div>
      <div className="card-body">
        {props.title && (<h5 className="card-title">{props.title}</h5>)}
        {props.text && (<p className="card-text">{props.text}</p>)}
        {props.body}
        {props.status && (<div id='createStatus'>{props.status}</div>)}
      </div>
    </div>      
  );
}