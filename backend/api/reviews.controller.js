import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
    static async apiPostReview(res, req, next){
        try{
            //1: getting information about retaurant, review text, and user from the body of the request
            const restaurantId = req.body.restaurant_id
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date()
            
            //1: ReviewsDAO will help send this review information to the database 
            const ReviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date,
            )
            res.json({status: "success"}) //1: success if it worked
        } catch(e) {
            res.status(500).json({error:e.message}) //1: error if didn't work
        }
    }

    static async apiUpdateReview(res, req, next){
        try{
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

            //1: again, sending information back to database so that review can be updated there 
            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id,
                text,
                date,
            )
            
            var {error} = reviewResponse
            if(error) {
                res.status(400).json({MediaStreamError})
            }

            //1: if there was no update and no error, show this error message
            if(reviewResponse.modifiedCount===0){
                throw new Error("Cannot update.")
            }

            res.json({status: "success"})
        } catch(e){
            res.status(500).json({error:e.message})
        }
    }

    static async apiDeleteReview(res, req, next){
        try{
            const reviewId = req.query._id
            //1: simple auth: making sure deleter's user id is same as creator's
            const userId = req.body.user_id
            console.log(reviewId)
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            )
            res.json({status: "success"})
        } catch(e){
            res.status(500).json({error:e.message})
        }
    }
}