import axios from "axios";
import authHeader from "../../Authentication/services/auth-header";
import authService from "../../Authentication/services/auth.service";

const API_URL = "http://localhost:8080/";

const getUserProfile = () => {
    return axios.get(API_URL + "users/me", { headers: authHeader() });
};

const changeProfile = (username, email, profilePicture) => {
  const id=authService.getCurrentUser().id
  return axios.post(API_URL + "profile", {
    id,
    username,
    email,
    profilePicture,
  });
};

export default {
    changeProfile,
    getUserProfile
};