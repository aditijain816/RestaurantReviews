import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api/v1/restaurants", //1: base url of backend server
  headers: {
    "Content-type": "application/json"
  }
});