module.exports = function (req, res, next) {
  if (req.user && req.user.tipo === "Funcionario") {
    next();
  } else {
    res.status(403).json({ error: "Acesso restrito aos funcionários" });
  }
};
