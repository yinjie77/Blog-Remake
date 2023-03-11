import axios from "axios";
const baseURL = '/api/users'

//拉取所有用户信息
const getALL = async () => {
    const response = await axios.get(baseURL)
    return response.data
}
//注册
const register = async (info) => {
    const response = await axios.post(baseURL, info)
    return response.data
}
export default {
    getALL,
    register
}