const Sequelize = require("sequelize");
const sequelize = new Sequelize("restaurant", "postgres", "admin", {
  dialect: "postgres",
  host: "localhost",
  define: {
    timestamps: false
  }
});