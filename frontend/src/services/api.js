import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("insurehub_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("insurehub_token");

      localStorage.removeItem("insurehub_user");
    }

    return Promise.reject(error);
  },
);

export const authApi = {
  register: (data) => api.post("/auth/register", data),

  login: (data) => api.post("/auth/login", data),

  google: (credential) =>
    api.post("/auth/google", {
      credential,
    }),

  me: () => api.get("/auth/me"),
};

export const planApi = {
  list: () => api.get("/plans"),

  get: (id) => api.get(`/plans/${id}`),

  create: (data) => api.post("/plans", data),

  update: (id, data) => api.put(`/plans/${id}`, data),

  remove: (id) => api.delete(`/plans/${id}`),
};

export const quoteApi = {
  calculate: (data) => api.post("/quotes/calculate", data),
};

export const policyApi = {
  purchase: (data) => api.post("/policies", data),

  mine: () => api.get("/policies/my"),

  get: (id) => api.get(`/policies/${id}`),

  history: (id) => api.get(`/policies/${id}/history`),

  renew: (id) => api.post(`/policies/${id}/renew`),

  cancel: (id) => api.post(`/policies/${id}/cancel`),
};

export const adminApi = {
  stats: () => api.get("/admin/stats"),

  users: () => api.get("/admin/users"),

  updateDiscount: (id, discountPercent) =>
    api.put(`/admin/users/${id}/discount`, {
      discountPercent,
    }),

  policies: () => api.get("/admin/policies"),

  cancellations: () => api.get("/admin/cancellation-requests"),

  approve: (id) => api.put(`/admin/cancellation-requests/${id}/approve`),

  reject: (id) => api.put(`/admin/cancellation-requests/${id}/reject`),

  plans: () => api.get("/admin/plans"),

  claims: () => api.get("/admin/claims"),

  updateClaim: (id, data) => api.put(`/admin/claims/${id}/status`, data),

};

export const paymentApi = {
  order: (policyId) => api.post("/payments/order", { policyId }),

  renewalOrder: (policyId) =>
    api.post(`/payments/renewal-order?policyId=${policyId}`),

  verify: (data) => api.post("/payments/verify", data),

  forPolicy: (id) => api.get(`/payments/policy/${id}`),
};

export const claimApi = {
  create: (data) => api.post("/claims", data),

  mine: () => api.get("/claims/my"),

  get: (id) => api.get(`/claims/${id}`),
};  

export default api;
