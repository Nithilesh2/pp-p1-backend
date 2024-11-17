import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bcrypt from "bcrypt"
import connnetDB from "./db/index.js"
import User from "./models/user.model.js"

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config({
  path: "./.env",
})

connnetDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port " + process.env.PORT)
    })
  })
  .catch((err) => {
    console.error(err)
  })

app.get("/", async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: `failed to get data : ${error}` })
  }
})

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const checkUser = await User.findOne({ email: email })
    if (checkUser) {
      return res.status(409).json({ message: "User already exists" })
    }

    const newUser = User({
      name: name,
      email: email,
      password: hashedPassword,
    })

    await newUser.save()

    return res.status(201).json({
      message:
        "Got your credentials🥳 Bingo! You're now part of the family. Cheers! 🥂",
      userId: newUser._id,
      name: newUser.name,
    })
  } catch (error) {
    return res.status(500).json({ message: `error while signing: ${error}` })
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const checkUser = await User.findOne({ email: email })
    if (!checkUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const checkPass = await bcrypt.compare(password, checkUser.password)
    if (checkPass) {
      return res
        .status(200)
        .json({
          message: "Login successful",
          userId: checkUser._id,
          userName: checkUser.name,
        })
    }
    return res.status(401).json({ message: "Invalid password" })
  } catch (error) {
    return res.status(500).json({ message: `error while login: ${error}` })
  }
})
