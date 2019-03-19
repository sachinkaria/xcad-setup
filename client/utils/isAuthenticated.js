const isAuthenticated = () => {
  return !!localStorage.token;
};

export default isAuthenticated;
