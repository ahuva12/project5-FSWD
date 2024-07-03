import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './userContext';
import { useNavigate } from "react-router-dom";
import "../CSS/todos.css"; // Adjusted path to CSS/todos.css

function Todos() {
  const { current_user } = useContext(UserContext);
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [sortCriterion, setSortCriterion] = useState('serial');
  const [searchCriterion, setSearchCriterion] = useState('serial');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/todos/?userId=${current_user.id}`);
        const todosData = await response.json();
        setTodos(todosData);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };
    fetchTodos();
  }, [current_user]);

  async function add_todo(todo) {
    try {
      const response = await fetch(`http://localhost:3000/todos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (response.ok) {
        setTodos([...todos, todo]);
      }
    } catch (error) {
      console.error('Failed to update todos in DB:', error);
    }
  }

  async function update_todo(todo) {
    try {
      const response = await fetch(`http://localhost:3000/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (response.ok) {
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todo.id ? todo : t
          )
        );
      }
    } catch (error) {
      console.error('Failed to update todos in DB:', error);
    }
  }

  async function delete_todo(todoId) {
    try {
      const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }
    
  const sortTodos = (todos, criterion) => {
    let sortedTodos = [...todos];
    switch (criterion) {
      case 'serial':
        sortedTodos.sort((a, b) => a.id - b.id);
        break;
      case 'completed':
        sortedTodos.sort((a, b) => a.completed === b.completed ? 0 : a.completed ? -1 : 1);
        break;
      case 'alphabetical':
        sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'random':
        sortedTodos.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }
    return sortedTodos;
  };

  const filterTodos = (todos, criterion, value) => {
    if (!value) return todos;

    switch (criterion) {
      case 'serial':
        return todos.filter(todo => todo.id === value);
      case 'title':
        return todos.filter(todo => todo.title.toLowerCase().includes(value.toLowerCase()));
      case 'completed':
        return todos.filter(todo => (value === 'completed' ? todo.completed : !todo.completed));
      default:
        return todos;
    }
  };

  const sortedTodos = sortTodos(todos, sortCriterion);
  const filteredTodos = filterTodos(sortedTodos, searchCriterion, searchValue);

  const handleCheckboxChange = (todo) => {
    todo.completed = !todo.completed;
    update_todo(todo);
  };

  function handleAddTodo() {
    const input = document.getElementById('todoInput');
    const todoTitle = input.value.trim();        
    if (todoTitle) {
      const newTodo = {
        userId: parseInt(current_user.id),
        id: `${(2 ** parseInt(current_user.id)) * (2 * (todos.length + 1) + 194)}`,
        title: todoTitle,
        completed: false
      };
      add_todo(newTodo);
      input.value = ''; 
    }
  }

  function handleDeleteTodo() {
    if (selectedTodoId) {
      delete_todo(selectedTodoId);
      setSelectedTodoId('');
    }
  }

  function handleUpdateTodo() {
    const input = document.getElementById('updateInput');
    const newTitle = input.value.trim();
    
    if (newTitle && selectedTodoId) {
      const todoToUpdate = todos.find(todo => todo.id === selectedTodoId);
      if (todoToUpdate) {
        const updatedTodo = { ...todoToUpdate, title: newTitle };
        update_todo(updatedTodo);
        setSelectedTodoId('');
        input.value = ''; 
      }
    }
  }  

  return (
    <div className="todo-container">
      <h2>User Todos:</h2>
      <label>
        Sort by:
        <select value={sortCriterion} onChange={(e) => setSortCriterion(e.target.value)}>
          <option value="serial">Serial</option>
          <option value="completed">Completed</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="random">Random</option>
        </select>
      </label>
      <br />
      <label>
        Search by:
        <select value={searchCriterion} onChange={(e) => setSearchCriterion(e.target.value)}>
          <option value="serial">Serial</option>
          <option value="title">Title</option>
          <option value="completed">Completed</option>
        </select>
        <input 
          type="text" 
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)} 
          placeholder="Enter search value" 
        />
      </label>
      <br />
      <label>
        Add New Todo:
        <input 
          id="todoInput"
          type="text" 
          placeholder="Enter todo title" 
        />
        <br></br>
        <button onClick={handleAddTodo}>Add Todo</button>
      </label>
      <br />
      <label>
        Delete Todo:
        <select value={selectedTodoId} onChange={(e) => setSelectedTodoId(e.target.value)}>
          <option value="">Select a todo</option>
          {todos.map(todo => (
            <option key={todo.id} value={todo.id}>{todo.title}</option>
          ))}
        </select>
        <br></br>
        <button onClick={handleDeleteTodo}>Delete Todo</button>
      </label>
      <br />
      <label>
        Update Todo:
        <select value={selectedTodoId} onChange={(e) => setSelectedTodoId(e.target.value)}>
          <option value="">Update a todo</option>
          {todos.map(todo => (
            <option key={todo.id} value={todo.id}>{todo.title}</option>
          ))}
        </select>
        <input
          id="updateInput"
          type="text"
          placeholder="Enter Update Todo"
        />
        <button onClick={handleUpdateTodo}>Update Todo</button>
      </label>
      <br />
      <ul className="todo-list">
        {filteredTodos.map((todo, index) => (
          <li key={todo.id}>
            <span>{index+1}. </span>
            <strong>{todo.title}</strong> - 
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleCheckboxChange(todo)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
