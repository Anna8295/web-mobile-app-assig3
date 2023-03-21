import React, { useEffect, useState } from "react";
import { Container, Row, Form, Button } from 'react-bootstrap';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  auth,
  registerWithEmailAndPassword,
} from "../firebase";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading ] = useAuthState(auth);
  const navigate = useNavigate();

  const register = (e) => {
    e.preventDefault();
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <Container fluid>
      <Row>
          <h1>Sign up</h1>
      </Row>
      <Row>
          <Form onSubmit={register}>
              <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="name" placeholder="Enter nema" value={name}
                      onChange={(e) => setName(e.target.value)}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email adress</Form.Label>
                  <Form.Control type="email" placeholder="Enter Email" value={email}
                      onChange={(e) => setEmail(e.target.value)}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={password}
                      onChange={(e) => setPassword(e.target.value)}/>
              </Form.Group>
              <Button variant="success" type="submit">Sign up</Button>
          </Form>
      </Row>
      <Row>
          <h4>Already have an account? <Button variant="primary" onClick={() => navigate('/login')}>Sign In</Button></h4>
      </Row>
    </Container>
  );
}

export default Register;