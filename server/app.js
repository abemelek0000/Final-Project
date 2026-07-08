const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const poemRoutes = require("./routes/poemRoutes");
const authRoutes = require("./routes/authRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const followRoutes=require("./routes/followRoutes");
const userRoutes=require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Getem Sitim API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/poems", poemRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follows",followRoutes);
app.use("/api/users",userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;