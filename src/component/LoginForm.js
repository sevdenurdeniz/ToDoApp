import React, { useRef } from "react";
import { useAuth } from "../context/authContext";
import swal from "sweetalert"; 

function LoginForm({ onLoginSuccess }) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(emailRef.current.value, passwordRef.current.value);
      swal("Login!", "Login is successfully !", "success");
      onLoginSuccess();
    } catch (error) {
      console.log(error);
      swal("error!", "Login is error !", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center my-3">
        <h3>Log In</h3>
      </div>

      <div className="my-4 input-container">
        <i className="fa fa-envelope icon"></i>

        <input
          placeholder="Email"
          type="email"
          className="input-field "
          ref={emailRef}
          required
        />
      </div>

      <div className="input-container my-4">
        <i className="fa fa-key icon"></i>
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          ref={passwordRef}
          required
        />
      </div>
      <div className="text-center">
        <button className="btn btn-login" type="submit">
          Log In
        </button>
      </div>

      {/* <div className="form-group">
        <input
          className="form-input"
          type="email"
          placeholder="Email"
          ref={emailRef}
          required
        />
      </div>
      <input
        type="password"
        placeholder="Password"
        ref={passwordRef}
        required
      /> */}
    </form>
  );
}

export default LoginForm;
