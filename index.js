import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { UserController, PostController } from "./controllers/index.js";
import multer from "multer";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import cors from "cors";

mongoose
  .connect(
    "mongodb+srv://admin:wwwww@cluster0.dwpow.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

//хранилище для хранения картинок
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); //позволяет читать json
app.use(cors());
app.use("/uploads", express.static("uploads"));

//поиск пользователя в базе данных
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
//создание пользователя
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
//получение пользователем информации о себе
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//получение тэгов
app.get("/tags", PostController.getLastTags);
app.get("/posts/tags", PostController.getLastTags);
//получение всех статей
app.get("/posts", PostController.getAll);
//получение одной статьи
app.get("/posts/:id", PostController.getOne);
//создание статьи
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
//удаление статьи
app.delete("/posts/:id", checkAuth, PostController.remove);
//редактирование/обновление статьи
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

//на какой порт прикрепить наше приложение (тут 4444)
app.listen(4444, (err) => {
  if (err) {
    //если сервер не смог запуститься, то мы вернём сообщение об этом (ошибка)
    return console.log(err);
  }
  console.log("Server OK"); //это если сервер запустился
});

//для запуска сервера ввести в терминале nodemon start
