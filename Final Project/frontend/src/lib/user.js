import { apiRequest } from "./api";

export const fetchCurrentUser = async (token) => {
  return apiRequest("/api/profile", {
    method: "GET",
    token,
  });
};
