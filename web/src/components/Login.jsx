import React, { useEffect, useState } from "react";
import { Container, Row, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading ] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // prevent the default form submission behavior
    logInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <Container fluid>
      <Row>
        <h1>Sign In</h1>
      </Row>
      <Row>
        <Form onSubmit={handleSubmit}>
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
          <Button variant="success" type="submit">Sign In</Button>
        </Form>
      </Row>
      <Row>
        <h4>Don't have an account? <Button variant="primary" onClick={()=> navigate('/')}>Sign up here!</Button></h4>
      </Row>
    </Container>
  );
}

export default Login;