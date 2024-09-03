const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const returnSignUpPage = async (req, res) => {
  res.render("signup");
};

const returnLoginPage = (req, res) => {
  res.render("login");
};

const createUser = async (req, res) => {
  try {
    //check if email already exists
    const exisitingUser = await User.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(400)
        .json({ errors: { email: "Email already exists" } });
    }

    // create a user in db
    const user = await User.create(req.body);

    //generate a token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", token);

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        password: user.password,
      },
      token,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      res.status(400).json({ errors });
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        res.cookie("jwt", token);

        res.status(201).json({
          user: {
            id: user._id,
            email: user.email,
            password: user.password,
          },
          token,
        });
      } else {
        return res
          .status(400)
          .json({ errors: { password: "Incorrect password" } });
      }
    } else {
      return res
        .status(400)
        .json({ errors: { email: "No user found with this email" } });
    }
  } catch (error) {
    res.status(500).json({ message: "Login is failed" });
  }
};

const logOutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
};

module.exports = {
  createUser,
  loginUser,
  returnLoginPage,
  returnSignUpPage,
  logOutUser,
};
