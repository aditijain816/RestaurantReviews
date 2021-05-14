import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class RestaurantsController {
    static async apiGetRestaurants(req, res, next){
        //1: setting restaurnatsPerPage to whatever value has been mentioned/passed in the url
        //1: if it exists, we convert the value into an int. Otherwise, it will be 20 by default
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10):20
        //1: doing same for page number 
        const page = req.query.page ? parseInt(req.query.page, 10):0

        let filters = {}
        if(req.query.cuisine){
            filters.cuisine = req.query.cuisine
        } else if(req.query.zipcode){
            filters.zipcode = req.query.zipcode
        } else if(req.query.name){
            filters.name = req.query.name
        }

        //1: Calling function we created in restaurantsDAO. will return restaurantsList and totalNumRestaurants
        const {restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage
        })

        //1: creating response to send to the person who sent the query url
        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }
        res.json(response)
    }

    static async apiGetRestaurantById(req, res, next) {
        try {
            //2: looking for id parameter 
            //2: query comes after ?, parameter comes after /
            let id = req.params.id || {}
            let restaurant = await RestaurantsDAO.getRestaurantByID(id)
            if (!restaurant) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(restaurant)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
    
    static async apiGetRestaurantCuisines(req, res, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines()
            res.json(cuisines)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
}