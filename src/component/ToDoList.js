import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import ToDoItem from "./ToDoItem";
import ToDoForm from "./ToDoForm";
import Logo from "../images/logo.png";
import { db, ref, get, remove } from "../firebase.js";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Loading } from "./Loader";

const ToDoList = () => {
  const [loading, setLoading] = useState(true);

  const [modalShow, setModalShow] = useState(false);
  const [todos, setTodos] = useState([]);
  const { currentUser } = useAuth();
  const { uid } = currentUser || {}; 
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { logout } = useAuth();

  const [username, setUsername] = useState("");

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "New", value: "New" },
    { label: "Processing", value: "Processing" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (currentUser) {
      const todosRef = ref(db, "todos");
      setLoading(true);
      get(todosRef).then((snapshot) => {
        const todosData = [];
        snapshot.forEach((childSnapshot) => {
          const todo = childSnapshot.val();
          if (todo.userId === currentUser.uid) {
            //userın todoları gelsin
            todosData.push({ id: childSnapshot.key, ...todo });
          }
        });
        setTodos(todosData);
        setLoading(false);
      });
      get(ref(db, `users/${uid}`)).then((userSnapshot) => {
        if (userSnapshot.exists()) {
          setUsername(userSnapshot.val().name);
        }
      });
    }
   }, [currentUser, uid]);

  const getFilteredTodos = () => {
    if (selectedFilter === "All") {
      return todos.filter((todo) => todo.title.includes(searchTerm));
    } else {
      return todos.filter((todo) => todo.state === selectedFilter);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteToDo = async (todoId) => {
    try {
      await remove(ref(db, `todos/${todoId}`));
      const updateTodos = todos.filter((todo) => todo.id !== todoId);
      setTodos(updateTodos);
      swal("Delete To Do!", "Todo is deleted successfully !", "success");
    } catch (error) {
      console.log("error delete", error);
    }
  };
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      swal({
        title: "Logout",
        text: "Successfully logged out.",
        icon: "success",
        timer: 1000,  
        buttons: false,  
      });
      setTimeout(async () => {
        await logout();
        navigate("/");
      }, 1000);
    } catch (error) {
      console.log("Error during logout", error);
    }
  };
  return (
    <>
      <div className="container-fluid bar mb-4">
        <div className="container">
          <div className="row my-3">
            <div className="col-9 order-0 order-lg-0 col-lg-2 mb-3 mb-lg-0">
              <div className="logo">
                <img className="img-fluid" src={Logo} />
                <span>To Do App </span>
              </div>
            </div>
            <div className="col-12 order-2 order-lg-1 col-lg-9 d-inline-flex justify-content-center">
              <div className="form-group has-search">
                <span className="fa fa-search form-control-feedback"></span>
                <input
                  type="text"
                  className="form-control searchInput"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-3 order-1 order-lg-2 col-lg-1 text-right">
              <div className="userName">
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic">
                    <i className="fa fa-solid fa-user barUser"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="text-center">
                 
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="fa fa-solid fa-arrow-right-from-bracket"></i>
                      Çıkış Yap
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-9  my-3 stateWeb">
            <button
              className={`btn stateBtn mx-lg-1  ${
                selectedFilter === "All" ? "active" : ""
              }`}
              onClick={() => setSelectedFilter("All")}
            >
              <i className="fa fa-solid fa-list"></i>
              All
            </button>
            <button
              className={`btn stateBtn mx-lg-1 ${
                selectedFilter === "New" ? "active" : ""
              }`}
              onClick={() => setSelectedFilter("New")}
            >
              <i className="fa fa-regular fa-clipboard"></i>
              New
            </button>
            <button
              className={`btn stateBtn mx-lg-1 ${
                selectedFilter === "Processing" ? "active" : ""
              }`}
              onClick={() => setSelectedFilter("Processing")}
            >
              <i className="fa fa-solid fa-spinner"></i>
              Processing
            </button>
            <button
              className={`btn stateBtn mx-lg-1 ${
                selectedFilter === "Completed" ? "active" : ""
              }`}
              onClick={() => setSelectedFilter("Completed")}
            >
              <i className="fa fa-solid fa-check"></i>
              Completed
            </button>
            <button
              className={`btn stateBtn mx-lg-1 ${
                selectedFilter === "Cancelled" ? "active" : ""
              }`}
              onClick={() => setSelectedFilter("Cancelled")}
            >
              <i className="fa fa-solid fa-ban"></i>
              Cancellend
            </button>
          </div>

          <div className="col-6 col-lg-3  my-3">
            <Button
              className="addBtn float-left float-lg-right"
              onClick={() => setModalShow(true)}
            >
              <span>
                <i className="fa fa-solid fa-plus"></i>
              </span>
              &nbsp; Add New To Do
            </Button>
          </div>
          <div className="col-6 my-3 text-right stateMobil">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">State</Dropdown.Toggle>
              <Dropdown.Menu className="text-center">
                {filterOptions.map((option) => (
                  <Dropdown.Item
                    key={option.value}
                    onClick={() => setSelectedFilter(option.value)}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {loading && <Loading />}
          <ToDoForm
            modalShow={modalShow}
            setModalShow={setModalShow}
            setTodos={setTodos}
          />
        </div>

        <div className="row">
          {getFilteredTodos().map((todo) => (
            <React.Fragment key={todo.id}>
              <ToDoItem
                todo={todo}
                onDelete={handleDeleteToDo}
                setTodos={setTodos}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default ToDoList;
