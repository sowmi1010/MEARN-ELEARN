const Todo = require("../models/Todo");

// ➤ Add new To-Do
exports.addTodo = async (req, res) => {
  try {
    const { text, date, month, year } = req.body;

    if (!text || !date || !month || !year) {
      return res.status(400).json({ message: "All fields required" });
    }

    const todo = await Todo.create({
      user: req.user.id,
      text,
      date,
      month,
      year,
    });

    res.status(201).json({ message: "Todo added", todo });
  } catch (err) {
    console.error("addTodo error:", err);
    res.status(500).json({ message: "Failed to add todo" });
  }
};

// ➤ Get all To-Dos of logged in user
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });

    const completed = todos.filter((t) => t.completed).length;
    const remaining = todos.length - completed;

    res.json({ completed, remaining, todos });
  } catch (err) {
    console.error("getTodos error:", err);
    res.status(500).json({ message: "Failed to fetch todos" });
  }
};

// ➤ Toggle Complete/Incomplete
exports.toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.completed = !todo.completed;
    await todo.save();

    res.json({ message: "Updated", todo });
  } catch (err) {
    console.error("toggleTodo error:", err);
    res.status(500).json({ message: "Failed to update todo" });
  }
};

// ➤ Delete To-Do
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.deleteOne();
    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error("deleteTodo error:", err);
    res.status(500).json({ message: "Failed to delete todo" });
  }
};
