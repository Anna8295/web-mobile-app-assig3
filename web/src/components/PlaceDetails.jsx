import React from "react";
import { Card, ListGroup, Badge, Button } from "react-bootstrap";
import { BsFillGeoAltFill, BsFillTelephoneFill } from "react-icons/bs";

import { useAuthState } from "react-firebase-hooks/auth";
import {  auth, db  } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const PlaceDetails = ({ place, selected, refProp, type }) => {
    if (selected) refProp?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const [user] = useAuthState(auth);

    const setDestination = async (destination) => {
        try {
          if (!user) throw new Error('User is not logged in');
          await addDoc(collection(db, "destinations", user?.uid, "userDestination"), {
            destination,
          });
          console.log(`Destination ${destination} saved for user ${user.uid}`);
        } catch (err) {
          console.error(err);
        }
      }; 

    return (
        <Card>
            <Card.Img variant="top"  src={place.photo ? place.photo.images.large.url : 'https://unsplash.com/photos/poI7DelFiVA'}/>
            <Card.Body>
                <Card.Title>{place.name}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item >Price: <strong>{place.price_level}</strong></ListGroup.Item>
                <ListGroup.Item >Ranking: <strong>{place.ranking}</strong></ListGroup.Item>
            </ListGroup>
            <Card.Body>
                {place?.cuisine?.map(({ name }) => (
                    <Badge pill bg="info" key={name}>
                        {name}
                    </Badge>
                ))}
            </Card.Body>
            <ListGroup className="list-group-flush">
            {place.address && (
                <Button variant="link" onClick={() => setDestination(place.address)}><ListGroup.Item ><BsFillGeoAltFill /><strong>{place.address}</strong></ListGroup.Item></Button>
            )}
            {place.phone && (
                <ListGroup.Item ><BsFillTelephoneFill /> <strong>{place.phone}</strong></ListGroup.Item>
            )}
            </ListGroup>
            <Card.Body>
                <Card.Link href={place.web_url} target="_blank">Trip Adviser</Card.Link>
                <Card.Link href={place.website} target="_blank">Website</Card.Link>
            </Card.Body>
        </Card>
    );
};

export default PlaceDetails;