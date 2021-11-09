require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mainRoutes = require("./routes");

app.use("/", mainRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
