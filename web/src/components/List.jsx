import React , { useState, useEffect, createRef } from "react";
import { Container, Col, Card, Form, Spinner } from "react-bootstrap";

import PlaceDetails from './PlaceDetails'

const List = ({ places, isLoading, childClicked, type, setType}) => {
    const [elRefs, setElRefs] = useState([]);

    useEffect(() => {
        setElRefs((refs) => Array(places?.length).fill().map((_, i) => refs[i] || createRef()));
    }, [places]);

    return (
        <Container style={{ height: '100vh', width: '100%' }} className="overflow-scroll" >
            <Col>
                <h5>Restaurants, Hotels & Attractions</h5>
            </Col>
            <Col>
                <Form.Select value={type} onChange={(e) => setType(e.target.value)} aria-label="Default select example">
                    <option>Choose:</option>
                    <option value="restaurants">Restaurants</option>
                    <option value="hotels">Hotels</option>
                    <option value="attractions">Attractions</option>
                </Form.Select>
            </Col>        
            {isLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : ( 
                <>
                    <Col>
                        {places?.map((place, i) => (
                            <Card ref={elRefs[i]} key={i}>
                                <PlaceDetails selected={Number(childClicked) === i} place={place} refProp={elRefs[i]}/>
                            </Card>
                        ))}
                    </Col>
                </>    
            )}
        </Container>
    );
}

export default List;