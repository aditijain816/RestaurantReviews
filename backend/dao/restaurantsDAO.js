//1: create variable to store reference to db
let restaurants

export default class RestaurantsDAO {
    //1: first method: helps connect to db so call this as soon as server starts
    static async injectDB(conn){
        if(restaurants){
            return
        }
        try{
            //1: mentioning restaurants because sample_restaurants has neighbourhoods as well (see mongodb atlas)
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        }
        catch(e){
            console.error(`couldn't establish a collection handle in restaurantsDAO: ${e}`,)
        }
    }

    //1: second method: will get called when we want a list of all restaurants
    static async getRestaurants({
        filters = null, //1: sorting, zipcode, cuisine, etc filters
        page = 0,
        restaurantsPerPage = 20, //1: will only get 20 restaurants per page
    } = {}) {

        //1: in case getRestaurants has been called with filters
        let query
        if(filters){
            if("name" in filters){
                //1: no db field. we're doing a text search so need to set this up in mongodb atlas later
                query = { $text: { $search: filters["name"] } }
            } else if("cuisine" in filters){
                query = { "cuisine": { $eq: filters["cuisine"] } }
            } else if("zipcode" in filters){
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }

        let cursor
        try {
            //1: finding all retaurants that we found through the query we passed 
            cursor = await restaurants
                .find(query)
        }catch(e){
            //1: returning error, empty list, and 0 number of restaurants when not able to find
            console.error(`Couldn't issue find command, ${e}`)
            return{restaurantsList: [], totalNumRestaurants: 0}
        }

        //1: In case of no error, we will return some information. So limiting entries per page
        //1: using skip to reload to our current page and not some other
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage*page)
        try {
            const restaurantsList = await displayCursor.toArray() //1: list of restaurants to array
            const totalNumRestaurants = await restaurants.countDocuments(query) //1: number of restaurants
            return {restaurantsList, totalNumRestaurants} //1: returning values
        }catch(e) {
            console.error(`Cannot convert cursor to array/Cannot count occurences, ${e}`,)
            return {restaurantsList: [], totalNumRestaurants: 0}
        }

    }

    static async getRestaurantByID(id) {
        try {
            //2: pipelines help match different collections together
            const pipeline = [
                {
                    $match: { //2: attempting to match id of restaurant
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: { //2: want to lookup reviews to add to the result
                        from: "reviews",
                        let: {
                            id: "$_id",
                        },
                        pipeline: [ //2: creating pipeline from reviews collection
                            {
                                $match: {
                                    $expr: {
                                        //2: matching restaurant id to get all reviews
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                     date: -1,
                                },
                            },
                        ],
                        as: "reviews", //2: setting it as reviews in the result
                    },
                },
                {
                    $addFields: {
                        reviews: "$reviews", //2: adding new field of 'reviews'
                    },
                },
            ]
            return await restaurants.aggregate(pipeline).next() //2: aggregating; everything together
        } catch (e) {
            console.error(`Something went wrong in getRestaurantByID: ${e}`)
            throw e
        }
    }

    static async getCuisines() {
        let cuisines = [] //2: intialising empty array for storing cuisines 
        try {
            cuisines = await restaurants.distinct("cuisine") //2: getting unique cuisines
            return cuisines
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }
}