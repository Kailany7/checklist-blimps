module.exports = function (req, res, next) {
  const key = req.headers["x-app-key"];

  if (!key || key !== process.env.APP_KEY) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  next();
};
