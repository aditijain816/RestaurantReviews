import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const Restaurant = props => {
    const initialRestaurantState = {
        id: null,
        name: "",
        address: {},
        cuisine: "",
        reviews: []
      };
    
    //1: using initialRestaurantState values to define each restaurant record
    const [restaurant, setRestaurant] = useState(initialRestaurantState);
    
    //1: loading restaurant 
    const getRestaurant = id => {
        RestaurantDataService.get(id) //1: getting id
            .then(response => {
                setRestaurant(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };
    
    //1: called when the component is first rendered
    useEffect(() => {
        getRestaurant(props.match.params.id);
    }, [props.match.params.id]); //1: useEffect will only be called if id is updated
                                 //1: so, getRestaurant will only be called with updated id
    
    //1: need reviewId and index of review in review array 
    const deleteReview = (reviewId, index) => {
        RestaurantDataService.deleteReview(reviewId, props.user.id)
            .then(response => {
                //1: removing and returning preState after removing that review
                setRestaurant((prevState) => {
                    prevState.reviews.splice(index, 1)
                    return({
                        ...prevState
                    })
                })
            })
            .catch(e => {
                console.log(e);
            });
    };
    
    return (
        <div>
          {restaurant ? ( /*1: checking if there's a restaurant*/
            <div>
              <h5>{restaurant.name}</h5>
              <p>
                <strong>Cuisine: </strong>{restaurant.cuisine}<br/>
                <strong>Address: </strong>{restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
              </p>
              <Link to={"/restaurants/" + props.match.params.id + "/review"} className="btn btn-primary"> {/*1: route to add review*/}
                Add Review
              </Link>
              <h4> Reviews </h4>
              <div className="row">
                {restaurant.reviews.length > 0 ? ( /*1: checking for reviews */
                 restaurant.reviews.map((review, index) => {
                   return (
                     <div className="col-lg-4 pb-1" key={index}>
                       <div className="card">
                         <div className="card-body">
                           <p className="card-text">
                             {review.text}<br/>
                             <strong>User: </strong>{review.name}<br/>
                             <strong>Date: </strong>{review.date}
                           </p>
                           {props.user && props.user.id === review.user_id && /*if user is logged in and userId matches review's userId*/
                              <div className="row">
                                <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                                <Link to={{
                                  pathname: "/restaurants/" + props.match.params.id + "/review",
                                  state: {
                                    currentReview: review
                                  }
                                }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                              </div>                   
                           }
                         </div>
                       </div>
                     </div>
                   );
                 })
                ) : (
                <div className="col-sm-4">
                  <p>No reviews yet.</p> {/*1: case of no reviews */}
                </div>
                )}
    
              </div>
    
            </div>
          ) : (
            <div>
              <br />
              <p>No restaurant selected.</p> {/*1: case of no restaurant */}
            </div>
          )}
        </div>
    );
    };

export default Restaurant;