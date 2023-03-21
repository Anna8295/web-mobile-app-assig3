import React, { useCallback ,useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { saveAs } from 'file-saver';

import Header from "./Header";
import {  auth, db, logout } from "../firebase";
import { query, collection, getDocs, where, orderBy } from "firebase/firestore";

function Dashboard() {
    const [user] = useAuthState(auth);
    const [name, setName] = useState("");
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
  
    const fetchUserName = useCallback(async () => {
      try {
        const q = query(collection(db, "users"), where( 'uid', "==", user?.uid));
        const querySnapshot = await getDocs(q);
        //console.log(querySnapshot)
        querySnapshot.forEach((doc) => {
          setName(doc.data().name);
        })
      } catch (err) {
        console.error(err);
      }
    }, [user]);
  
    const fetchUserPosts = useCallback(async () => {
      try {
        const q = query(collection(db, "posts", user?.uid,"userPosts"), orderBy('creation', 'asc'));
        const querySnapshot = await getDocs(q);
        let posts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return {id, ...data}
      });
        setPosts(prevPosts => [...prevPosts, ...posts]);
      } catch (err) {
        console.error(err);
      }
    }, [user]);

    useEffect(() => {
      if (!user) return navigate("/");
      fetchUserName().then(() => {
        fetchUserPosts();
      });
    }, [user, navigate, fetchUserName, fetchUserPosts]);
  
    return (
      <Container fluid>
          <Header />
        <Row className="align-items-center">
        <Col sm={8}>
          <Card>
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Card.Title>{user?.email}</Card.Title>
              <Button onClick={logout}>Logout</Button>
            </Card.Body>
          </Card>
        </Col>
        </Row>
        <Row>
          {posts?.map((post, i) => (
          <Card style={{ width: '18rem' }} key={i}>
            <Card.Img variant="top" src={post.downloadURL} />
            <Card.Body>
              <Card.Title>{post.caption}</Card.Title>
              <Button variant="primary" onClick={() => saveAs(post.downloadURL, 'pictureFromApp')}>Download Picture</Button>
            </Card.Body>
          </Card>
          ))}
        </Row>
      </Container>
    );
  }
  
  export default Dashboard;