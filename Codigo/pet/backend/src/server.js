const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize, Funcionario } = require('./models');
require('dotenv').config();

// Importando as rotas
const tutorRoutes = require("./routes/tutorRoutes");
const petRoutes = require("./routes/petRoutes");
const petUpdateRoutes = require("./routes/petUpdateRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const funcionarioRoutes = require("./routes/funcionarioRoutes");
const acomodacaoRoutes = require("./routes/acomodacaoRoutes");
const boletimComportamentalRoutes = require("./routes/boletimComportamentalRoutes");
const formularioEntradaRoutes = require("./routes/formularioEntradaRoutes");
const enderecoRoutes = require("./routes/enderecoRoutes");
const servicosRoutes = require("./routes/servicosRoutes");
const loginRoutes = require("./routes/loginRoutes");
const pertenceRoutes = require("./routes/pertenceRoutes");

const verifyToken = require("./middlewares/verifyToken");
const authorizeFuncionario = require("./middlewares/authorizeFuncionario");

app.use(express.json());

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Usando as rotas
app.use("/api/login", loginRoutes);
app.use("/api/tutores", tutorRoutes);
app.use("/api/pets", verifyToken, petRoutes);
app.use("/api/pet-updates", verifyToken, petUpdateRoutes);
app.use("/api/reservas", verifyToken, reservaRoutes);
app.use(
  "/api/funcionarios",
  verifyToken,
  funcionarioRoutes
);
app.use(
  "/api/acomodacoes",
  verifyToken,
  authorizeFuncionario,
  acomodacaoRoutes
);
app.use("/api/boletins", verifyToken, boletimComportamentalRoutes);
app.use("/api/formularios", verifyToken, formularioEntradaRoutes);
app.use("/api/endereco", verifyToken, enderecoRoutes);
app.use("/api/servicos", verifyToken, authorizeFuncionario, servicosRoutes);
app.use("/api/pertences", verifyToken, authorizeFuncionario, pertenceRoutes);

async function createDefaultFuncionario() {
  try {
    const funcionario = await Funcionario.findByPk(1);

    if (!funcionario) {
      await Funcionario.create({
        idFuncionario: 1,
        cpf: "12345678900",
        nome: "Admin",
        cargo: "Administrador",
        telefone: "11999999999",
        email: "admin@admin.com",
        senha: "$2b$10$lareiixnzX6P06jxqQTtPegNKvqKQqnnnNWR3lwjz0OxDSqIhP0y.",
        tipo_usuario: "Funcionario"
      });
      console.log("✅ Funcionário padrão criado com sucesso!");
    } else {
      console.log("✅ Funcionário padrão já existe.");
    }
  } catch (error) {
    console.error("❌ Erro ao criar funcionário padrão:", error);
  }
}

// Sincroniza o banco de dados e inicia o servidor
sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("✅ Banco de dados sincronizado!");

    // Create default funcionario after database sync
    await createDefaultFuncionario();

    app.listen(process.env.PORT || 3060, () => {
      console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 3060}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao sincronizar o banco de dados:", error);
    process.exit(1);
  });
