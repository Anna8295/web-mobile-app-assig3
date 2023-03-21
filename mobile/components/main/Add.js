import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function Add({navigation}) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(null);
    const cameraRef = useRef(null)
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState({})
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermission(galleryStatus.status === 'granted');

            const locationStatus = await Location.requestForegroundPermissionsAsync();
            setHasLocationPermission(locationStatus.status === 'granted');

        })();
    }, []);

    const takePicture = async () => {
        if(cameraRef.current){
            const data = await cameraRef.current.takePictureAsync();
            setImage(data.uri)

            // Get the device's current location
            let locationUser = null;
            const locationSubscription = await Location.watchPositionAsync(
              { accuracy: Location.Accuracy.High, timeInterval: 2000 },
              (location) => {
                console.log(location);
                locationUser = location;
                const latitude = locationUser.coords.latitude;
                const longitude = locationUser.coords.longitude;
                setLocation({ latitude, longitude });
                locationSubscription.remove(); // remove the subscription
              }
            )
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
          exif: true // Request EXIF data (including location) for the image
        });
        
        console.log(result.assets[0].exif)

        if (!result.canceled) {
            const { uri } = result.assets[0];
            console.log(uri)
            const exifData = result.assets[0].exif;
            const { GPSLatitude, GPSLongitude } = exifData;

            const latitude = exifData.GPSLatitudeRef === "S" ? -1 * GPSLatitude : GPSLatitude;
            const longitude = exifData.GPSLongitudeRef === "W" ? -1 * GPSLongitude : GPSLongitude;
            
            console.log(latitude, longitude);
            setLocation({latitude, longitude})
            setImage(uri);
          }
        }

  if (!hasCameraPermission || !hasGalleryPermission || !hasLocationPermission){
    return <View />;
  } 

  if (hasCameraPermission === false || hasGalleryPermission === false || hasLocationPermission === false ){
    return <Text>No access to camera, gallery or location</Text>;
  } 

  return (
    <View style={{ flex: 1 }}>
        <View style={styles.cameraContainer}>
            <Camera 
                style={styles.fixedRatio} 
                type={type}
                ratio={'1:1'}
                ref={cameraRef} />
                {image && <Image source={{uri: image}} style={{flex: 1}}/>}
        </View> 
        <View style={styles.buttonContainer}>
            <View >
                <MaterialCommunityIcons.Button 
                    name='folder-image'
                    size={75}
                    title='Pick Image From Gallery'
                    onPress={() => pickImage()}
                    style={styles.button}
                />
            </View>
            <View >
                <MaterialCommunityIcons.Button
                    name='circle-outline' 
                    size={75}
                    title='Take Picture'
                    onPress={() => takePicture()}
                    style={styles.button}
                />
            </View>
            <View>
                <MaterialCommunityIcons.Button
                    name='camera-flip'
                    size={75}
                    title = 'Flip Camera'
                    onPress={() => {
                        setType(
                            type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                    }}
                    style={styles.button}
                    >
                </MaterialCommunityIcons.Button> 
            </View>
            <View >
                <MaterialCommunityIcons.Button
                    name='upload' 
                    size={75}
                    title='Save'
                    onPress={() => navigation.navigate('Save', {image, location})}
                    style={styles.button}
                />
            </View>
        </View>
    </View>
  )
} 

    const styles = StyleSheet.create({
        cameraContainer: {
            flex: 1,
        },
        fixedRatio: {
            flex: 1,
            //aspectRatio: 1
        },
        buttonContainer: {
            flexDirection: 'row',
            marginBottom: 50,
        },
        button: {
            height: 95,
            width: 95,
        },
    })