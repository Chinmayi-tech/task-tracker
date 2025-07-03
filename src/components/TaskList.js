import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCheck, faUndo, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleToggleComplete = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Delete this task?")) {
      const updated = tasks.filter((task) => task.id !== id);
      setTasks(updated);
    }
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    const newTitle = prompt("Edit title:", taskToEdit.title);
    const newDescription = prompt("Edit description:", taskToEdit.description);
    if (newTitle && newTitle.trim() !== "") {
      const updated = tasks.map((task) =>
        task.id === id
          ? { ...task, title: newTitle, description: newDescription }
          : task
      );
      setTasks(updated);
    }
  };

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const filteredTasks = tasks
    .filter((task) =>
      filter === "all"
        ? true
        : filter === "completed"
        ? task.completed
        : !task.completed
    )
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className={darkMode ? "dark" : ""}>
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        style={{ margin: "1rem" }}
      >
        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />{" "}
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h2>Task Dashboard</h2>

      <TaskForm onAddTask={handleAddTask} />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-buttons">
        <button onClick={() => handleFilterChange("all")}>All</button>
        <button onClick={() => handleFilterChange("completed")}>Completed</button>
        <button onClick={() => handleFilterChange("pending")}>Pending</button>
      </div>

      {filteredTasks.length === 0 ? (
        <p style={{ textAlign: "center" }}>No tasks yet</p>
      ) : (
        <AnimatePresence>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {filteredTasks.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={task.completed ? "completed-task" : ""}
              >
                <strong>{task.title}</strong> —{" "}
                {task.description || "No description"}
                <br />
                <small>
                  Created: {new Date(task.createdAt).toLocaleString()}
                </small>
                <br />
                <div className="task-buttons">
                  <button onClick={() => handleToggleComplete(task.id)}>
                    <FontAwesomeIcon
                      icon={task.completed ? faUndo : faCheck}
                    />{" "}
                    {task.completed ? "Pending" : "Done"}
                  </button>
                  <button onClick={() => handleEditTask(task.id)}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
};

export default TaskList;
