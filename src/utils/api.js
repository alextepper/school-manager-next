import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DOMAIN_URL, // Your Django REST server URL
});

const attachTokenToHeader = (config) => {
  const accessToken = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).tokens.access
    : null;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

const refreshToken = async () => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  if (!user) {
    return Promise.reject("No refresh token available");
  }

  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_DOMAIN_URL + "/token/refresh/", {
      refresh: user.tokens.refresh,
    });

    const newUser = {
      ...user,
      tokens: {
        access: response.data.access,
        refresh: response.data.refresh, // Assuming the new refresh token is also sent by your backend
      },
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data.access;
  } catch (error) {
    // Handle error - e.g., redirect to login page
    return Promise.reject(error);
  }
};

api.interceptors.request.use(attachTokenToHeader);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();
        processQueue(null, newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
