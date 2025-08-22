import axios from "axios";

export const url = "https://real-time-chat-application-4571.onrender.com";

export const axiosInstance = axios.create({
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }

});
