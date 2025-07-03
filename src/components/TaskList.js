import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faCheck, faUndo } from "@fortawesome/free-solid-svg-icons";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  // Load from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save to localStorage
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

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) =>
          filter === "completed" ? task.completed : !task.completed
        );

  return (
    <div>
      <h2>Task Dashboard</h2>
      <TaskForm onAddTask={handleAddTask} />

      <div className="filter-buttons">
        <button onClick={() => handleFilterChange("all")}>All</button>
        <button onClick={() => handleFilterChange("completed")}>Completed</button>
        <button onClick={() => handleFilterChange("pending")}>Pending</button>
      </div>

      {filteredTasks.length === 0 ? (
        <p style={{ textAlign: "center" }}>No tasks yet</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? "completed-task" : ""}
            >
              <strong>{task.title}</strong> — {task.description || "No description"}
              <br />
              <small>Created: {new Date(task.createdAt).toLocaleString()}</small>
              <br />
              <div className="task-buttons">
                <button onClick={() => handleToggleComplete(task.id)}>
                  <FontAwesomeIcon icon={task.completed ? faUndo : faCheck} />{" "}
                  {task.completed ? "Pending" : "Done"}
                </button>
                <button onClick={() => handleEditTask(task.id)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button onClick={() => handleDeleteTask(task.id)}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
