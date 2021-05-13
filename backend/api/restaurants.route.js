import express from "express"
//2: controller file we're about to create. route will use this
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"
//1: Getting access to express router since we're mentioning all routes here
const router = express.Router()

//1: Just a demo route
router.route("/").get(RestaurantsCtrl.apiGetRestaurants)
//2: Adding more requests for reviews
router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router