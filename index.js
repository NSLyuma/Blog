import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

mongoose
  .connect(
    "mongodb+srv://admin:wwwww@cluster0.dwpow.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json()); //позволяет читать json

//поиск пользователя в базе данных
app.post("/auth/login", loginValidation, UserController.login);
//создание пользователя
app.post("/auth/register", registerValidation, UserController.register);
//получение пользователем информации о себе
app.get("/auth/me", checkAuth, UserController.getMe);

//получение всех статей
app.get("/posts", PostController.getAll);
//получение одной статьи
app.get("/posts/:id", PostController.getOne);
//создание статьи
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
//удаление статьи
app.delete("/posts/:id", checkAuth, PostController.remove);
//редактирование/обновление статьи
app.patch("/posts/:id", checkAuth, PostController.update);

//на какой порт прикрепить наше приложение (тут 4444)
app.listen(4444, (err) => {
  if (err) {
    //если сервер не смог запуститься, то мы вернём сообщение об этом (ошибка)
    return console.log(err);
  }

  console.log("Server OK"); //это если сервер запустился
});

//для запуска ввести в терминале npm run start:dev
