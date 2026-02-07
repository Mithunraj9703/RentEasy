import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3002/api/listing",
  withCredentials: true, // important for cookies!
});



export const getListing = async () => {
  const res = await API.get('/');
  return res.data;
}

export const searchListing = async (data) => {
    const res = await API.get(`/search/${encodeURIComponent(data)}`);
    return res.data;
};
