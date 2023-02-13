import axios from "axios";
import { start, close } from "@/utils/nporgress";

const requests = axios.create({
  baseURL: "http://localhost:9527",
  timeout: 5000,
  responseType: "json",
});

requests.interceptors.request.use((config)=> {
  start()
  return config;
}, (err)=>{
  return Promise.reject(err);
});

requests.interceptors.response.use( (response)=> {
  close()
  return response;
}, (err)=>{
  return Promise.reject(err);
});

export default requests;
