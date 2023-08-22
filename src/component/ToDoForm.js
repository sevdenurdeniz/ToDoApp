import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CustomEditor from "./Quill.js";

import { db, ref, push, set, get, storage } from "../firebase.js";
import { useAuth } from "../context/authContext";
import swal from "sweetalert";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as sRef } from "firebase/storage";

const ToDoForm = ({ modalShow, setModalShow, setTodos, selectedTodo }) => {
  const [mode, setMode] = useState("Add");

  const readOnly = mode === "View";
  const editable = mode === "Edit" || mode === "Add";

  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");
  const [state, setState] = useState("New");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [file, setFile] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (selectedTodo) {
      //update
      setIsEditing(true);
      setTitle(selectedTodo.title);
      setState(selectedTodo.state);
      setStartDate(selectedTodo.startDate);
      setEndDate(selectedTodo.endDate);
      setEditorContent(selectedTodo.content);

      if (selectedTodo.fileNames) {
        const prevFiles = selectedTodo.fileNames.map((fileName) => ({
          name: fileName,
          file: null,
        }));
        setSelectedFiles(prevFiles);
        setMode("View");
      }
    } else {
      setIsEditing(false);
      setTitle("");
      setState("New");
      setStartDate(new Date().toISOString().slice(0, 10));
      setEndDate(new Date().toISOString().slice(0, 10));
      setEditorContent("");
      setMode("Add");
    }
  }, [selectedTodo]);

  const handleEditorChange = (content) => {
    // console.log("editör çalışıyo muuuğğ?", content);
    setEditorContent(content);
  };
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    let newFiles = [];
    let totalSize = 0;

    selectedFiles.forEach((file) => {
      if (file.size <= 5 * 1024 * 1024) {
        newFiles.push({
          name: file.name,
          file: file,
        });
        totalSize += file.size;
      }
    });

    if (totalSize > 5 * 1024 * 1024) {
      swal(
        "File Size Warning",
        "Total file size should be less than 5 MB.",
        "warning"
      );
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileDelete = (fileName) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = null;
    }
  };
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    if (newStartDate <= endDate) {
      setStartDate(newStartDate);
    }
  };
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (newEndDate >= startDate) {
      setEndDate(newEndDate);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["jpeg", "jpg", "png"].includes(extension)) {
      return <i className="far fa-image"></i>;
    } else {
      return <i className="far fa-file"></i>;
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (currentUser) {
        const todosRef = ref(db, "todos");
        const newTodoRef = isEditing
          ? ref(db, `todos/${selectedTodo.id}`)
          : push(todosRef);
        const newTodoKey = newTodoRef.key;

        const fileDownloadURLs = [];
        if (selectedFiles.length > 0) {
          const fileUploadPromises = selectedFiles.map(async (file) => {
            const storageRef = sRef(
              storage,
              `files/${newTodoKey}/${file.name}`
            );
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            fileDownloadURLs.push(downloadURL);
          });
          await Promise.all(fileUploadPromises);
        }

        const todoData = {
          title,
          state,
          startDate,
          endDate,
          content: editorContent,
          userId: currentUser.uid,
          fileNames: selectedFiles.map((file) => file.name),
        };

        if (fileDownloadURLs.length > 0) {
          todoData.fileDownloadURLs = fileDownloadURLs;
        }

        await set(newTodoRef, todoData);

        swal(
          isEditing ? "To Do Update!" : "Add New To Do!",
          isEditing
            ? "To Do is successfully updated!"
            : "New To Do is successfully added!",
          "success"
        );

        const updatedTodos = [];
        const todosSnapshot = await get(todosRef);
        todosSnapshot.forEach((childSnapshot) => {
          const todo = childSnapshot.val();
          if (todo.userId === currentUser.uid) {
            updatedTodos.push({ id: childSnapshot.key, ...todo });
          }
        });
        setTodos(updatedTodos);

        setEditorContent("");
        setTitle("");
        setState("New");
        setStartDate(new Date().toISOString().slice(0, 10));
        setEndDate(new Date().toISOString().slice(0, 10));
        setSelectedFiles([]);
        setModalShow(false);
      } else {
        console.log("Kullanıcı oturum açmamış.");
      }
    } catch (error) {
      console.error("Görev eklenirken/güncellenirken hata:", error);
    }
  };
  return (
    <>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-center">
            {isEditing ? "Edit To Do" : "Add New To Do"}
          </Modal.Title>
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="state" className="form-label">
                State
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="New">New</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="row justify-content-center mb-3">
              <div className="col-lg-6 ">
                <label className="form-label" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  id="startDate"
                  className="form-control"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
                <span id="startDateSelected"></span>
              </div>
              <div className="col-lg-6">
                <label className="form-label" htmlFor="endDate">
                  End Date
                </label>
                <input
                  id="endDate"
                  className="form-control"
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={handleEndDateChange}
                />
                <span id="endDateSelected"></span>
              </div>
            </div>

            <CustomEditor value={editorContent} onChange={handleEditorChange} />

            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label">
              Appendices
              </label>

              <div className="file-chooser">
                <label className="file-chooser__label">
                  <span className="file-chooser__button">
                    <i className="fa fa-solid fa-plus"></i>&nbsp; Select Files
                  </span>
                  <input
                    className="form-control file-chooser__input visually-hidden"
                    type="file"
                    id="fileInput"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {selectedFiles.length === 0 ? (
                <p className="warningText mt-1">
                  You have not uploaded any files yet ! You can choose by
                  clicking the upload file button.
                </p>
              ) : (
                <div className="file-list row p-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-list__item col-12">
                      <span className="file-list__name">
                        {getFileIcon(file.name)}&nbsp;{file.name}
                      </span>
                      <button
                        className="removal-button"
                        type="button"
                        onClick={() => handleFileDelete(file.name)}
                      ></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-3"></div>
            <button className="btn my-1 btnSubmit" onClick={handleSubmit}>
              {isEditing ? "Save Changes" : "Submit"}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ToDoForm;
