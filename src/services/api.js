import axios from "axios"

export const api = axios.create({
  baseURL: "" // akan diisi dari input textfield API URL
})