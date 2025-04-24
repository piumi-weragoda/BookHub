import express from "express";

const router = express.Router();


router.post("/register", async (req, res) => {
  // Handle login logic here
  res.send("Register");
});

router.post("/login", async (req, res) => {
  // Handle registration logic here
  res.send("Login");
});





export default router;
//NOTE - Router, which is like a mini version of your app