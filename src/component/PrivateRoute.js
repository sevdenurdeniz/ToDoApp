import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./AuthPage";
import ToDoList from "./ToDoList";

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<AuthPage />} />
      <Route path="/todolist" element={<ToDoList />} />
    </Routes>
  );
}

export default App;
