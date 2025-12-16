import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7000/api/auth",
  withCredentials: true, // important for cookies!
});


export const signup = (data) => API.post("/signup", data);

export const login = (data) => API.post("/login", data);
