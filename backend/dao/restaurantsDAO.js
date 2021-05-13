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
}