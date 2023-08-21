import React, { useEffect } from 'react';
import './App.css';
import { db, ref, get } from './firebase.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from './component/AuthPage';
import ToDoList from './component/ToDoList';
import PrivateRoute from "./component/PrivateRoute";
 

function App() {
  useEffect(() => {
    const testConnection = async () => {
      const todosRef = ref(db, 'todos');
      try {
 
        const snapshot = await get(todosRef);
        console.log("Connection successful!", snapshot.val());
      } catch (error) {
        console.error("Error connecting to Firebase:", error);
      }
    };

    testConnection();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/todolist" element={<ToDoList />} />
      </Routes>
    </Router>
  );
}

export default App;
