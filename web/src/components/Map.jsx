import React from "react";
import GoogleMapReact from "google-map-react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsFillGeoAltFill } from "react-icons/bs";

const Map = ({ setCordinates, setBounds, coordinates, places, setChildClicked }) => {

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY}}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={{disableDefaultUI: true, zoomControl:true}}
                onChange={(e) => {
                    setCordinates({ lat: e.center.lat, lng: e.center.lng });
                    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
                }}
                onChildClick={(child) => setChildClicked(child)}
                >

                {places?.map((place, i) => (
                    <div
                        lat={Number(place.latitude)}
                        lng={Number(place.longitude)}
                        key={i}
                    >
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id="tooltip-top">
                                  {place.name}
                                </Tooltip>
                            }
                        >
                            <Button variant="success"><BsFillGeoAltFill /></Button>
                        </OverlayTrigger>
                    </div>
                ))}
            </GoogleMapReact>
        </div>
    );
}

export default Map;