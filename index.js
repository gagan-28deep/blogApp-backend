const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const Post = require("./api/models/Post.js");

const cron = require("node-cron");

const path = require("path");
const cors = require("cors");
const app = express();

// Routes
const authRouter = require("./api/routes/auth");
const userRouter = require("./api/routes/user");
const postRouter = require("./api/routes/post");
const categoryRouter = require("./api/routes/category");

dotenv.config({ path: __dirname + "/.env" });
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log(`Connected to DB`))
  .catch((err) => console.log(`Error connecting to DB`));

// Middleware
app.use(express.json());
app.use(fileUpload());
// app.use(
//   cors({
//     allowedHeaders: ["sessionId", "Content-Type"],
//     exposedHeaders: ["sessionId"],
//     origin: "*",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//   })
// );

app.use(cors());
// cron.schedule("*/10 * * * * *", function (req, res, next) {
//   console.log("Running after 10 secs");
//   res.send("Server is running");
//   next();
// });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/category", categoryRouter);

// THis is dummy route
app.get("/api/v1/hello", function (req, res, next) {
  res.send("Hello from server");
});

app.use("/images", express.static(path.join(__dirname, "/uploads/")));

app.post("/api/v1/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  console.log(req.files);

  let filename = req.files.uploadFile.name;
  console.log("filename", filename);
  let file = req.files.uploadFile;
  console.log("file", file);
  let uploadPath = __dirname + "/uploads/" + filename;
  console.log("Upload Path " + uploadPath);
  file.mv(uploadPath, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    }
  });
  res.status(200).json({
    result: file,
    msg: "File Uploaded",
  });
});

// Get all images
app.get("/api/v1/image", async (req, res) => {
  try {
    const images = await Post.find({} , {"photo" : 4});
    res.status(200).json({ images });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server error",
    });
    console.log("error" , err);
  }
});

app.use(function (req, res) {
  res.send("<h1>Backend API</h1>");
});

// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

app.listen(process.env.PORT, function () {
  console.log(`Server is running on port -- ${process.env.PORT}`);
});
