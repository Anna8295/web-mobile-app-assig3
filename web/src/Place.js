import React, { useState, useEffect } from "react";
import {Container, Row, Col} from 'react-bootstrap';

import { getPlacesData, getWeatherData } from "./api/index";
import Header from './components/Header';
import List from './components/List';
import Map from './components/Map';
import Destination from "./components/Destination";


const Place = () => {
    const [ places, setPLaces ] = useState([]);
    const [weatherdata, setWeatherData] = useState(null);

    const [coordinates, setCordinates] = useState({});
    const [bounds, setBounds] = useState({});

    const [ isLoading ,setIsLoading] = useState(false);
    const [childClicked, setChildClicked] = useState(null);
    const [type, setType] = useState();
    const [autocomplete, setAutocomplete] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude} }) => {
            setCordinates({ lat: latitude, lng: longitude });
        })
    }, []);
    
    useEffect(() => {
        if(bounds.sw && bounds.ne){
            setIsLoading(true)
            getPlacesData(type, bounds.sw, bounds.ne)
                .then((data) => {
                    setPLaces(data?.filter((place) => place.name));
                    setIsLoading(false);
                })
            getWeatherData(coordinates)
                .then((data) => {
                    setWeatherData(data)
                    setIsLoading(false);
                })
        }
    }, [type, bounds, coordinates]);

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        // const lat = autocomplete.getPlace().geometry.location.lat();
        // const lng = autocomplete.getPlace().geometry.location.lng();

        // setCordinates({lat, lng});

        const place = autocomplete.getPlace();
        // Update the coordinates state
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCordinates({ lat, lng });

        // Update the bounds state to include the new location
        const sw = {
            lat: place.geometry.viewport.getSouthWest().lat(),
            lng: place.geometry.viewport.getSouthWest().lng(),
        };
        const ne = {
            lat: place.geometry.viewport.getNorthEast().lat(),
            lng: place.geometry.viewport.getNorthEast().lng(),
        };
        setBounds({ sw, ne });
  
    }

    return(
        <Container fluid>
            <Header />
            <Row >
                <Col xs={12} md={3} > <Destination onPlaceChanged={onPlaceChanged} onLoad={onLoad} weatherdata={weatherdata} isLoading={isLoading}/> </Col>
                <Col xs={12} md={3} > <List places={places} isLoading={isLoading} type={type} setType={setType} childClicked={childClicked} /> </Col>
                <Col xs={12} md={6} > <Map setChildClicked={setChildClicked} setCordinates={setCordinates} setBounds={setBounds} coordinates={coordinates} places={places}/> 
                </Col>
            </Row>
        </Container>
    );
}

export default Place;