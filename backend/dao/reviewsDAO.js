//1. getting access to ObjectId to covert string to mongodb ObjectId
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID

//1: create variable to store reference to db
let reviews

export default class ReviewsDAO {
    //1: first method: helps connect to db so call this as soon as server starts
    static async injectDB(conn) {
        if (reviews) {
            return
        }
        try {
            //1: accessing reviews. since reviews doesn't exist, it'll get created
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
        } catch (e) {
            console.error(`Unable to establish collection handles in userDAO: ${e}`)
        }
    }

    //1: second method: adding review
    //1: different values it will take for all reviews passed as parameters
    static async addReview(restaurantId, user, review, date) {
        try {
            //1: creating reviewDoc
            const reviewDoc = { 
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                restaurant_id: ObjectId(restaurantId), }
            
                //1: after converting request Id into mongodb OnjectId, insert into the db
            return await reviews.insertOne(reviewDoc)
        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return { error: e }
        }
    }

    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                //1: ensuring review and user Id are same. only then will allow update
                { user_id: userId, _id: ObjectId(reviewId)},
                //1: updating text and date
                { $set: { text: text, date: date  } },
            )
            return updateResponse
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return { error: e }
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            //1: ensuring review and user Id are same. only then will allow deletion
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            })
            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }
}