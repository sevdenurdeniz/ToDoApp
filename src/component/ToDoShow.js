import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CustomEditor from "./Quill.js";

const ToDoShow = ({ show, onHide, todo, onEdit }) => {
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = () => {
    setEditMode(true);
    onHide();
    onEdit();
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{todo.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={todo.title}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <input
              type="text"
              className="form-control"
              id="state"
              value={todo.state}
              readOnly
            />
          </div>

          <div className="row justify-content-center mb-3">
            <div className="col-lg-6">
              <label className="form-label" htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                className="form-control"
                type="text"
                value={todo.startDate}
                readOnly
              />
            </div>
            <div className="col-lg-6">
              <label className="form-label" htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                className="form-control"
                type="text"
                value={todo.endDate}
                readOnly 
              />
            </div>
          </div>
          <div className="showEditor">
          <CustomEditor value={todo.content} readOnly  />
          </div>
          <div className="mb-3">
            {todo.fileNames && todo.fileNames.length > 0 && (
              <div>
                <label htmlFor="fileList" className="form-label">
                  Files
                </label>
                 
                  {todo.fileNames.map((fileName, index) => (
                    <div className="fileDiv my-3 py-2" key={index}>
                      <a
                        href={todo.fileDownloadURLs[index]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                       <i className="fa fa-solid fa-download fileIcon"></i> {fileName}
                      </a>
                    </div>
                  ))}
                 
              </div>
            )}
          </div>
        </form>
        <div>
          <button className="btn btnOnEdit" onClick={handleEditClick}>
            Edit
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ToDoShow;
