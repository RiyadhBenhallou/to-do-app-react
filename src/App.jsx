import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]); // Initialize with empty array
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const apiUrl = "https://todo-app-react-backend-6z0f.onrender.com"                    

  // Fetch todos only on initial mount
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(apiUrl + "/api-todos");
        setTodos(data);
      } catch (error) {
        console.error("error", error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!todo.trim()) return; // Skip empty submissions

    setIsLoading(true);

    try {
      // Send POST request with todo title
      const { data } = await axios.post(apiUrl + "/api-todos", { title: todo });
      setTodos([...todos, data]); // Add the newly created todo to the state
      setTodo("");
    } catch (error) {
      console.error("Error submitting todo:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);

    try {
      // Send DELETE request to delete a todo item by id
      await axios.delete(apiUrl + `/api-todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTodos = () =>
    todos.map((todo, index) => (
      <div className="item" key={index}>
        <li>{todo.title}</li>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleDelete(todo._id);
        }}>
          <button type="submit" className="btn del-btn">
            Delete
          </button>
        </form>
      </div>
    ));

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Add a new todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button type="submit" className="btn">
            <span>Add</span>
          </button>
        </form>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <ul>{renderTodos()}</ul>
        </div>
      )}
    </div>
  );
}

export default App;
