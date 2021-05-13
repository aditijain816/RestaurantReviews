import express from "express"
import cors from "cors"
//1: our routes will be present here
import restaurants from "./api/restaurants.route.js"

//1: making our express app to make server
const app = express()
//1: applying and setting middleware
app.use(cors())
//1: express.json() ensures that requests are able to read json format
app.use(express.json())

//1: specifying routes
app.use("/api/v1/restaurants", restaurants)
//1: wild card in case route hasn't been mentioned in routes file
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

//1: exporting app as a module so that it can imported in the file that accesses database 
//1: the database file will be the one that will actually get the server running
export default app