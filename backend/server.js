const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/dummyData");
const connectToDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandling");

dotenv.config();
connectToDB();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Api started !!");
});

app.use("/api/user", userRoutes);
app.use(notFound);
app.use(errorHandler);
app.listen(port, console.log(`Server started at${port}`));
