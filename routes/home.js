const express = require("express");
const router = express.Router()
const todoController = require("../controllers/todoController");

router.get("/", todoController.getTodos);

router.post("/", todoController.createTodo);

router.delete("/:todoID", todoController.deleteTodo);

router.put("/:todoID", todoController.editTodo);

router.patch("/:todoID", todoController.markTodoAsCompleted);

module.exports = router