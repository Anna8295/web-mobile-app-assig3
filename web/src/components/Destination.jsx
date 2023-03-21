import React,  { useCallback, useEffect ,useState } from "react";
import { Container, Row, Form, Button, Offcanvas, Spinner, Card, ListGroup } from 'react-bootstrap'; 
import { Autocomplete } from '@react-google-maps/api';

import { useAuthState } from "react-firebase-hooks/auth";
import {  auth, db } from "../firebase";
import { query, collection, getDocs  } from "firebase/firestore";


const Destination = ({onPlaceChanged, onLoad, isLoading, weatherdata}) => {
    const [user] = useAuthState(auth);
    const [show, setShow] = useState(false);
    const [destination, setDestination] = useState([])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchUserDestination = useCallback(async () => {
        try {
            console.log("fetchUserDestination: user.uid =", user?.uid);
          const q = query(collection(db, "destinations", user.uid,"userDestination"));
          const querySnapshot = await getDocs(q);
          console.log(querySnapshot)
          let destination = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data };
                  });
                  console.log("fetchUserDestination: destination =", destination);
          setDestination(prevDestination => [...prevDestination, ...destination]);
          console.log(destination)
        } catch (err) {
          console.error(err);
        }
      }, [user]);

    useEffect(() => {
        if(user)fetchUserDestination()
    }, [user, fetchUserDestination]);

    return (
        <Container style={{ height: '100vh', width: '100%' }} className="overflow-scroll">
            <Row>
                <Button variant="primary" onClick={handleShow}>
                        Show Weather
                </Button>

                    <Offcanvas show={show} onHide={handleClose}>
                        <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Weather Forecast</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        {isLoading ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : ( 
                            <Card className="text-center">
                                <Card.Header>{weatherdata?.name} | {weatherdata?.sys.country}</Card.Header>
                                <Card.Body>
                                    <Card.Img src={`http://openweathermap.org/img/w/${weatherdata?.weather[0].icon}.png`} alt="imgicon" />
                                    <Card.Title>{Math.round(weatherdata?.main.temp)}°C</Card.Title>
                                </Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>Feels like: <span>{Math.round(weatherdata?.main.feels_like)}°C</span></ListGroup.Item>
                                    <ListGroup.Item>Wind: <span>{weatherdata?.wind.speed} m/s</span></ListGroup.Item>
                                    <ListGroup.Item>Humidity: <span>{weatherdata?.main.humidity}%</span></ListGroup.Item>
                                    <ListGroup.Item>Pressure: <span>{weatherdata?.main.pressure}hPa</span></ListGroup.Item>
                                </ListGroup>
                            </Card>
                        ) }       
                        </Offcanvas.Body>
                    </Offcanvas>
            </Row>
            <Row className="pt-4">
                <p>Find your next stop!</p>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <Form className="d-flex">
                            <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                />
                            </Form>
                </Autocomplete>
            </Row>
            <Row>
                <h4>My next destination</h4>
                <ListGroup>
                    {destination?.map((dest, i) => (
                        <ListGroup.Item key={i}>{dest.destination}</ListGroup.Item>
                    ))}
                </ListGroup>
            </Row>
        </Container>
)}

export default Destination;