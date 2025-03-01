import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // make sure this matches django's api url

export const fetchTestData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/test/`); // this should match your django api route
        return response.data;
    } catch (error) {
        console.error("error fetching test data:", error);
        return null;
    }
};
