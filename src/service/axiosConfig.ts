import axios from "axios";

//process.env.REACT_APP_API_URL
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
  },
});

const get = async (path: string, config = {}) => {
  const res = await instance.get(path, config);
  return res.data;
};

const post = async (path: string, data: object, config: any = {}) => {
  const res = await instance.post(path, data, config);
  return res.data;
};

export { get, post };
