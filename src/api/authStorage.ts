export const authStorage = {
  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },
  getToken: () => {
    return localStorage.getItem("token");
  },
  clear: () => {
    localStorage.removeItem("token");
  },
};
