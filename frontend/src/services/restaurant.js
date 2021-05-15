import http from "../http-common.js";

class RestaurantDataService {
    //1: functions that will make api calls and return info
    getAll(page = 0) {
      return http.get(`?page=${page}`); //1: getting info from specific page url
    }
  
    get(id) {
      return http.get(`/id/${id}`); //1: getting info from specific id
    }
  
    find(query, by = "name", page = 0) {
      return http.get(`?${by}=${query}&page=${page}`); //1: query based results (could be zipcode, name, etc)
    } 
  
    createReview(data) {
      return http.post("/review", data);
    }
  
    updateReview(data) {
      return http.put("/review", data);
    }
  
    deleteReview(id, userId) {
      return http.delete(`/review?id=${id}`);
    }
  
    getCuisines(id) {
      return http.get(`/cuisines`);
    }
  
  }
  
  export default new RestaurantDataService();