import axios from "axios";
import { get } from "lodash";
const API = axios.create({
  baseURL: process.env.REACT_APP_API,
  headers: {
    "access-control-allow-origin": "*",
    "content-type": "application/json",
    desktop: true,
  },
});
API.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token && !config.headers.authorization) {
      config.headers.authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const err = get(error, "response.data.error", "");
    if (
      get(err, "statusCode", "") === 401 &&
      get(err, "error", "") === "Unauthorized"
    ) {
      localStorage.removeItem("auth");
    }
    return Promise.reject(error);
  }
);

export default API;
