import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4 offset-lg-4">
            <div className="loginCard p-3 my-5">
              <div className="col-12 ">
                <div className="logo logoLogin mb-3">
                  <img className="img-fluid" src={Logo} />
                  <span>To Do App </span>
                </div>
                {showLogin ? (
                  <LoginForm onLoginSuccess={() => navigate("/todolist")} />
                ) : (
                  <RegisterForm />
                )}
                {showLogin ? (
                  <span className="loginBtn">
                    New User?
                    <button
                      className=" btn"
                      onClick={() => setShowLogin(!showLogin)}
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span className="loginBtn">
                    Already a User?
                    <button
                      className=" btn"
                      onClick={() => setShowLogin(!showLogin)}
                    >
                      Log in
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthPage;
