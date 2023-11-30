const express = require("express");
const playerRoutes = require("./routes/playerRoutes");

const app = express();
const port = process.env.PORT || 8080;

app.use("/player", playerRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
