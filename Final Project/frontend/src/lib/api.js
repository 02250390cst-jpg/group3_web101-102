const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const buildUrl = (path) => {
  if (!path) {
    return API_BASE_URL;
  }
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const getErrorMessage = async (response) => {
  try {
    const data = await response.json();
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.map((error) => error.msg).join(", ");
    }
    return data?.message || response.statusText;
  } catch (error) {
    return response.statusText;
  }
};

export const apiRequest = async (path, options = {}) => {
  const { method = "GET", body, headers = {}, token } = options;
  const requestHeaders = { ...headers };

  let requestBody = body;
  if (body && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const login = (payload) =>
  apiRequest("/api/auth/login", {
    method: "POST",
    body: payload,
  });

export const register = (payload) =>
  apiRequest("/api/auth/register", {
    method: "POST",
    body: payload,
  });

export const listMenuItems = ({ restaurantId, token }) =>
  apiRequest(`/api/restaurants/${restaurantId}/menu`, {
    token,
  });

export const createMenuItem = ({ restaurantId, token, payload }) =>
  apiRequest(`/api/restaurants/${restaurantId}/menu`, {
    method: "POST",
    token,
    body: payload,
  });

export const updateMenuItem = ({ restaurantId, itemId, token, payload }) =>
  apiRequest(`/api/restaurants/${restaurantId}/menu/${itemId}`, {
    method: "PATCH",
    token,
    body: payload,
  });

export const deleteMenuItem = ({ restaurantId, itemId, token }) =>
  apiRequest(`/api/restaurants/${restaurantId}/menu/${itemId}`, {
    method: "DELETE",
    token,
  });

  export const listRestaurants = ({ q, location} = {}) => {
    const params = new URLSearchParams();

    if (q) {
      params.set("q", q);
    }

    if (location) {
      params.set("location", location);
    }

    const queryString = params.toString();
    return apiRequest(`/api/restaurants${queryString ? `?${queryString}` : ""}`);
  }