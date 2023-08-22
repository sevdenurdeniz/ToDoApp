import React, { useRef } from "react";
import { useAuth } from "../context/authContext";
import { db,set,ref, push } from "../firebase.js"; 
import { useNavigate } from "react-router-dom";
import swal from "sweetalert"; 

function RegisterForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user } = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );

      if (user) {
        const usersRef = ref(db, "users");
        const newUserRef = push(usersRef);

        await set(newUserRef, {
          name: nameRef.current.value,
          email: emailRef.current.value,
          uid: user.uid,
        });
        swal("Register!", "Register is successfully !", "success");
        navigate("/todolist");
      }
      
    } catch (error) {
      console.log(error);
      swal("Error!", "Register error !", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
          <div className="text-center my-3">
            <h3>Create Account</h3>
          </div>
          <div className="input-container my-4">
          <i className="fa fa-user icon"></i>
            <input
              type="text"
              className="input-field"
              id="name"
              placeholder="Username"
              ref={nameRef}
              required
            />
          </div>
          <div className="input-container my-4">
          <i className="fa fa-envelope icon"></i>
            <input
              type="email"
              className="input-field"
              placeholder="E mail"
              id="exampleInputEmail1"
              ref={emailRef}
              required
            />
          </div>
          <div className="input-container my-4">
          <i className="fa fa-key icon"></i>
            <input
              type="password"
              placeholder="Password"
              ref={passwordRef}
              required
              className="input-field"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-register">
              Sign Up
            </button>
        
      </div>

      {/* <input type="email" placeholder="Email" ref={emailRef} required />
      <input type="password" placeholder="Password" ref={passwordRef} required /> */}
    </form>
  );
}

export default RegisterForm;
