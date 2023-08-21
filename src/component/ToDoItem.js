import React, { useState } from "react";
import ReactHtmlParser from "html-react-parser";
import ToDoShow from "./ToDoShow";
import ToDoForm from "./ToDoForm";

const ToDoItem = ({ todo, onDelete, setTodos }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const stateClass =
    todo.state === "New"
      ? "bg-1"
      : todo.state === "Processing"
      ? "bg-2"
      : todo.state === "Completed"
      ? "bg-3"
      : todo.state === "Cancelled"
      ? "bg-4"
      : "";

  const handleDelete = () => {
    onDelete(todo.id);
  };
  const handleView = () => {
    setShowModal(true);
  };
  const handleEdit = () => {
    setShowEditForm(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditForm(false);
  };
  return (
    <div className="col-12 col-lg-4 my-4" key={todo.id}>
      <div className="card p-3">
        <div className="title">
          <h4>{todo.title}</h4>
        </div>
        <hr />
        <div className="text">{ReactHtmlParser(todo.content)}</div>
        <hr />
        <div className="row">
          <div className={`state col-4 ${stateClass}`}>
            <span>{todo.state}</span>
          </div>
          <div className="date col-8 text-right">
            <i className="fa fa-regular fa-calendar"></i>
            <span>
              &nbsp;{todo.startDate} - {todo.endDate}
            </span>
          </div>
        </div>

        <ul className="icon">
          <li>
            <a onClick={handleView} className="fa fa-solid fa-eye"></a>
          </li>
          <li>
            <a onClick={handleEdit} className="fa fa-solid fa-pen"></a>
          </li>
          <li>
            <a onClick={handleDelete} className="fa fa-solid fa-trash"></a>
          </li>
        </ul>
      </div>
      <ToDoShow show={showModal} onHide={handleCloseModal} todo={todo} onEdit={handleEdit} />
      {showEditForm && (
        <ToDoForm
          modalShow={showEditForm}
          setModalShow={setShowEditForm}
          selectedTodo={todo}
          setTodos={setTodos}
          mode="Edit" 
        />
      )}
    </div>
  );
};

export default ToDoItem;
