import axios from "axios";

const _API_INSTANCE = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
})

export default _API_INSTANCE