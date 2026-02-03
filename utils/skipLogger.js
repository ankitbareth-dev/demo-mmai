export const skipLog = (req, res) => {
  const ignoredPaths = ["/favicon.ico", "/robots.txt"];
  return (
    ignoredPaths.includes(req.path) ||
    req.method === "OPTIONS" ||
    req.path === "/"
  );
};
