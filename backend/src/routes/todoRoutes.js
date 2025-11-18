const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  addTodo,
  getTodos,
  toggleTodo,
  deleteTodo,
} = require("../controllers/todoController");

// Add
router.post("/add", auth, addTodo);

// Get user todos
router.get("/", auth, getTodos);

// Toggle complete
router.put("/toggle/:id", auth, toggleTodo);

// Delete
router.delete("/:id", auth, deleteTodo);

module.exports = router;
