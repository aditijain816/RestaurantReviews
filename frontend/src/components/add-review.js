import React, { useState } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const AddReview = props => {
  //1: intially going to be empty; we will fill
  let initialReviewState = ""
  //1: for keeping track of whether it's new or not
  //1: this is because we're keeping one place for editing and adding
  let editing = false;

  //1: checking if state and currentReview in state exist for doing so
  //1: if so and we are making edits, editing = true
  if (props.location.state && props.location.state.currentReview) {
    editing = true;
    initialReviewState = props.location.state.currentReview.text
  }

  //1: review value will either be empty state or the text we just entered
  const [review, setReview] = useState(initialReviewState);
  //1: checking if the text was submitted or not; defualt: false
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    var data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      //1: we're getting restaurantid from url and setting
      restaurant_id: props.match.params.id 
    };

    if (editing) {
      //1: getting current reviewid and saving it in the data structure defined above
      data.review_id = props.location.state.currentReview._id
      //1: calling updateReview with data as parameter since it contains everything
      RestaurantDataService.updateReview(data)
        .then(response => {
          //1: setting submitted to true 
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      //1: if not editing, we're adding review 
      //1: So calling createReview with data as parameter
      RestaurantDataService.createReview(data)
        .then(response => {
          //1: setting submitted to true 
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/restaurants/" + props.match.params.id} className="btn btn-success">
              Back to Restaurant
            </Link>
          </div>
        ) : (
          /*1: if not submitted, form for either editing or adding new */
          <div>
            <div className="form-group">
              {/*1: printing text according to whether we're editing or creatinbg */}
              <label htmlFor="description">{ editing ? "Edit" : "Create" } Review</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <button onClick={saveReview} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in. {/*1: if no user, ask them to login */}
      </div>
      )}

    </div>
  );
};

export default AddReview;