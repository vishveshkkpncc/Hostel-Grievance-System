export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

export const requireAuth = (navigate, role = null) => {
  if (!isAuthenticated()) {
    navigate("/");
    return false;
  }

  if (role) {
    const user = getUser();
    if (user?.role !== role) {
      navigate("/");
      return false;
    }
  }

  return true;
};
