import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

//1: using props as part of function
const RestaurantsList = props => {

    //1: react hooks to create state variables 
    const [restaurants, setRestaurants] = useState([]);
    const [searchName, setSearchName ] = useState("");
    const [searchZip, setSearchZip ] = useState("");
    const [searchCuisine, setSearchCuisine ] = useState("");
    const [cuisines, setCuisines] = useState(["All Cuisines"]);

    useEffect(() => { //1: telling react that component has to do something after render
        retrieveRestaurants(); //1: calling two functions
        retrieveCuisines();
    }, []);
    
    const onChangeSearchName = e => { //1: take value in searchbox/dropdown and use that as filter
        const searchName = e.target.value;
        setSearchName(searchName);
    };
    
    const onChangeSearchZip = e => {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    };
    
    const onChangeSearchCuisine = e => {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
    };
    
    const retrieveRestaurants = () => {
        RestaurantDataService.getAll()
            .then(response => {
                console.log(response.data);
                setRestaurants(response.data.restaurants); //1: setting to restaurants state variavble
            })
            .catch(e => {
                console.log(e);
            });
    };
    
    const retrieveCuisines = () => {
        RestaurantDataService.getCuisines()
            .then(response => {
                console.log(response.data);
                setCuisines(["All Cuisines"].concat(response.data)); //1: starting with all cuisines option a
            })                                                 //1: then concatinating rest options to state variable array
            .catch(e => {
                console.log(e);
            });
    };
    
    const refreshList = () => {
        retrieveRestaurants();
    };
    
    const find = (query, by) => {
        RestaurantDataService.find(query, by)
            .then(response => {
                console.log(response.data);
                setRestaurants(response.data.restaurants);
            })
            .catch(e => {
                console.log(e);
            });
    };
    
    const findByName = () => {
        find(searchName, "name")
    };
    
    const findByZip = () => {
        find(searchZip, "zipcode")
    };
    
    const findByCuisine = () => {
        if (searchCuisine === "All Cuisines") {
            refreshList();
        } else {
            find(searchCuisine, "cuisine")
        }
    };
    
    return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4"> {/*1: three input boxes for queries*/}
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName} /*1: by name*/
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={searchZip} /*1: by zipcode*/
            onChange={onChangeSearchZip}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByZip}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">

          <select onChange={onChangeSearchCuisine}>
             {cuisines.map(cuisine => {
               return (
                 <option value={cuisine}> {cuisine.substr(0, 20)} </option> /*1: first 21 character only to avoid spill*/
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCuisine} /*1: by cuisine*/
            >
              Search
            </button>
          </div>

        </div>
      </div>
      <div className="row">
        {/* some js code */}
        {restaurants.map((restaurant) => {
          const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
          return (
            /* creating cards for retaurants */ 
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                    <strong>Address: </strong>{address}
                  </p>
                  <div className="row">
                  <Link to={"/restaurants/"+restaurant._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                  <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}


      </div>
    </div>
    );
}

export default RestaurantsList;
