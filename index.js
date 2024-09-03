require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

//middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(checkUser);

// view engine
app.set("view engine", "ejs");

const PORT = 3000;

const db = process.env.DBURI;

// mongoose
//   .connect(process.env.DBURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(PORT, () => {
//       console.log(`Server is running on ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("Failed to connect to MongoDB", err);
//   });

//routes
app.get("/", (req, res) => res.render("login"));
app.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", {
    user: res.locals.user,
  });
});
app.use(authRoutes);

app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
      });
