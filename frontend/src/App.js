import React from "react";
import {Switch, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import AddReview from "./components/add-review";
import Restaurant from "./components/restaurants";
import RestaurantsList from "./components/restaurants-list";
import Login from "./components/login";

function App() {
  /*1: Creating state variable user, setting to null. Can update using setUser*/
  
  const [user, setUser] = React.useState(null);

  /*1: Updating user values according to login or logout*/
  async function login(user=null) {
    setUser(user);
  }
  async function logout() {
    setUser(null);
  }

  return (
    <div>
      {/*1: navbar taken from bootstrap doc*/}
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand">
        &nbsp; &nbsp; Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            {/*1: Link to Restaurants using react-router-dom*/}
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item" >
            {/*1: Link will be based on if we are logged in/out; ternary in {}*/}
            { user ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name} {/*1: Will show logout <name> if user is true*/}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        {/*1: Using Switch to switch between a few different routes*/}
        <Switch>
          <Route exact path={["/", "/restaurants"]} component={RestaurantsList} />
          <Route 
            path="/restaurants/:id/review"
            render={(props) => ( /*1: render because we can pass props to component we're loading*/
              <AddReview {...props} user={user} />
            )}
          />
          <Route 
            path="/restaurants/:id"
            render={(props) => ( 
              <Restaurant {...props} user={user} />
            )}
          />
          <Route 
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
