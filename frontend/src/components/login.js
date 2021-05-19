import React, { useState } from "react";

const Login = props => {

  //1: information needed for dummy auth
  const initialUserState = {
    name: "",
    id: "",
  };
  //1: userstate will initially be blank name and id
  const [user, setUser] = useState(initialUserState);

  //1: called when user or id is entered to save them 
  //2: userState is changed accordingly for that user
  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  //1: when login is clicked, login user and update url
  //1: called props.login(user) is different from this login (check App.js)
  const login = () => {
    props.login(user)
    props.history.push('/');
  }

  return (
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="user">Username</label>
          {/*1: input field1 for name */}
          <input 
            type="text"
            className="form-control"
            id="name"
            required
            value={user.name}
            onChange={handleInputChange}
            name="name" /*1: helps identify if it is name or id */
          />
        </div>

        <div className="form-group">
          <label htmlFor="id">ID</label>
          {/*1: input field2 for id */}
          <input
            type="text"
            className="form-control"
            id="id"
            required
            value={user.id}
            onChange={handleInputChange}
            name="id"
          />
        </div>
    
        <button onClick={login} className="btn btn-success">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;