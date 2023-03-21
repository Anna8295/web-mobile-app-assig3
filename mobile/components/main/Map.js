import React, { useEffect, useRef, useState } from 'react';
import  MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { StyleSheet, View } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAPS_APIKEY} from '@env'

export default function Map({route}) {
  const [mapRegion, setMapRegion] = useState({ })
  const { destination } = route.params;
  console.log(destination)
  const mapRef = useRef(null)

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
      setErrorMsg('Permission to access location was denied');
    }
    let currentLocation = await Location.getCurrentPositionAsync({})
    setMapRegion({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.4,
      longitudeDelta: 0.9
    })
  }

  useEffect(() => {
    userLocation();
  }, [])

  useEffect(() => {
    mapRef.current.fitToSuppliedMarkers(['mapRegion', 'destination'], {
      edgePadding: {top: 50, right: 50, bottom: 50, left: 50}
    })
  }, [mapRegion, destination])

  return (
      <MapView 
        ref={mapRef}
        style={styles.map} 
        region={mapRegion}
      >
        {mapRegion && destination && (
          <MapViewDirections 
            origin={mapRegion}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor='black'
          />
        )}

        {mapRegion?.latitude && <Marker coordinate={mapRegion} title='Marker' identifier='mapRegion'/>}
        {destination?.latitude && <Marker coordinate={destination} title='Marker' identifier='destination'/>}
      </MapView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%'
  },
});