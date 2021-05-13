//1: connecting database and starting server
import app from "./server.js"
import mongodb from "mongodb"

//1: for environment variables
import dotenv from "dotenv"
//2: importing
import RestaurantsDAO from "./dao/restaurantsDAO.js"

//1: configuring .env 
dotenv.config()

//1: Getting access to our MondoClient from MongoDB
const MongoClient = mongodb.MongoClient
//1: Setting PORT value from environment variable file .env. If not accessed, use 8000
const port = process.env.PORT || 8000

//1: Connect to database 
MongoClient.connect(
    //1: environment variable name mentioned in .env file
    process.env.RESTREVIEWS_DB_URI,
    {
        poolSize: 50, //1: only 50 people can connect at a time
        wtimeout: 2500, //1: at 2500ms, request will timeout
        useNewUrlParse: true
    }
)
.catch(err => { //1: checking for errors in connection. if present, console log and exit
    console.error(err.stack)
    process.exit(1)
})
.then(async client => { 
    //2: initial reference to restaurants collection in db before starting server
    await RestaurantsDAO.injectDB(client)
    //1: after checking for errors and not finding any, do this to start web server using app.listen
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})