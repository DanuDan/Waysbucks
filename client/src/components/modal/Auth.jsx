import React, { useState, useContext } from "react";
import { Modal, Alert } from "react-bootstrap";
import { UserContext } from "../../context/useContext";
import { useMutation } from "react-query";
import { API } from "../../config/api";

export default function ModalAuth({ show, setShow }) {
  const handleShowLogin = () => setShow(true);
  const handleShow = () => setShows(true);
  const handleClose = () => setShow(false);
  const [shows, setShows] = useState(false);

  const [message, setMessage] = useState(null);
  
  const switchRegister = () => {
    setShow(false);
    setShows(true);
  };

  const switchLogin = () => {
    setShows(false);
    setShow(true);
  };

  //-------LOGIN--------
  const [state, dispatch] = useContext(UserContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(form);

      const response = await API.post("/login", body, config);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data,
      });

      setShow(false);
    } catch (error) {
      console.log(error);
    }
  });

  //-------REGISTER--------
  const [formRegister, setFormRegister] = useState({
    email: "",
    password: "",
    name: "",
  });

  const changeRegister = (e) => {
    setFormRegister({
      ...formRegister,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitRegister = useMutation(async (e) => {
    try {
    e.preventDefault();

    // Configuration Content-type
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    // Data body
    const body = JSON.stringify(formRegister);
    // Insert data user to database
    const response = await API.post("/register", body, config);
    
    setShows(false);

     // Handling response here
    if (response.data.status === 'success...') {
      const alert = (
        <Alert variant="success" className="py-1">
          Success
        </Alert>
      );
      setMessage(alert);
      setFormRegister({
        name: '',
        email: '',
        password: '',
      });
    } else {
      const alert = (
        <Alert variant="success" className="py-1">
          Success Register
        </Alert>
      );
      setMessage(alert);
    }} catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  });

  return (
    <>
      <>
        <button className="btnNavbar login" onClick={handleShowLogin}>
          Login
        </button>
        <Modal show={show} onHide={handleClose}>
          <form onSubmit={(e) => handleSubmit.mutate(e)}>
            <div className="authContainer">
              <h1 className="authTitle">Login</h1>
              <input
                type="email"
                className="inputAuth p-2"
                placeholder="Email"
                name="email"
                id="email"
                onChange={handleChange}
              />
              <input
                type="password"
                className="inputAuth p-2"
                placeholder="Password"
                name="password"
                id="password"
                onChange={handleChange}
              />
              <button className="btnAuth">Login</button>
              <p className="toRegist">
                Don't have an account ? Click{" "}
                <strong onClick={switchRegister}>Here</strong>
              </p>
            </div>
          </form>
        </Modal>
      </>

      <>
        <button className="btnNavbar register" onClick={handleShow}>
          Register
        </button>
        <Modal show={shows} onHide={handleClose} id="modalRegister">
          <form onSubmit={(e) => handleSubmitRegister.mutate(e)}>
            <div className="authContainer">
              <h1 className="authTitle">Register</h1>
              {message && message} 
              <input
                type="email"
                className="inputAuth p-2"
                placeholder="Email"
                name="email"
                onChange={changeRegister}
              />
              <input
                type="password"
                className="inputAuth p-2"
                placeholder="Password"
                name="password"
                onChange={changeRegister}
              />
              <input
                type="text"
                className="inputAuth p-2"
                placeholder="Full Name"
                name="name"
                onChange={changeRegister}
              />
              <button className="btnAuth" type="submit">
                Register
              </button>
              <p className="toRegist">
                Already have an account ? Click{" "}
                <strong onClick={switchLogin}>Here</strong>
              </p>
            </div>
          </form>
        </Modal>
      </>
    </>
  );
}
