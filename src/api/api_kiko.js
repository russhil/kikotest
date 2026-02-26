import axios from "axios";
import { get } from "lodash";

const APIKIKO = axios.create({
  baseURL: process.env.REACT_APP_KIKO_API_V1,
  headers: {
    "access-control-allow-origin": "*",
    "content-type": "application/json",
    desktop: true,
  },
});
APIKIKO.interceptors.request.use(
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
APIKIKO.interceptors.response.use(
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

export default APIKIKO;
