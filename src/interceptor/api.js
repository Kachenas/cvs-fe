import axios from "axios";

const baseURL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
})

api.interceptors.request.use((config) => {
    return config
})

api.interceptors.response.use(
    (res) => {
        return res
    },
    (err) => {
        return err
    }
)

export default api