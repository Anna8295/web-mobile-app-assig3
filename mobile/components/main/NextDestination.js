import React, {useState, useEffect} from 'react'
import { View, SafeAreaView, Button,  RefreshControl, ActivityIndicator, FlatList, Text } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY} from '@env'
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'


const NextDestination = () => {
    const [destination, setDestination] = useState(null);
    const navigation = useNavigation();
    const [userDestination, setUserDestination] = useState([]);
    const [refreshing, setRefreshing] = useState(true);

    const handlePress = () => {
    navigation.navigate('Map', {destination});
  };

  useEffect(() => {
    loadUserDestination();
  }, []); 

  const loadUserDestination = () => {
    firebase.firestore()
            .collection('destinations')
            .doc(firebase.auth().currentUser.uid)
            .collection('userDestination')
            .get()
            .then((snapshot) => {
                let destination = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })
                setUserDestination(destination)
                setRefreshing(false);
            })
  }

  const onRefresh = () => {
    //Clear old data of the list
    setUserDestination([]);
    //Call the Service to get the latest data
    loadUserDestination()
  };

    return(
        <SafeAreaView>
                <GooglePlacesAutocomplete 
                    placeholder='Next spot...'
                    styles={{
                        container: {
                        flex: 0,
                        },
                        textInput: {
                        fontSize: 18,
                        },
                    }}
                    onPress={(data, details = null) => {
                        setDestination({
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                        });
                      }}
                    fetchDetails={true}
                    returnKeyType={'search'}
                    enablePoweredByContainer={false}
                    minLength={2}
                    query={{
                        key: GOOGLE_MAPS_APIKEY,
                        language: 'en'
                    }}
                    nearbyPlacesApi='GooglePLacesSearch'
                    debounce={400}
                    onFail={error => console.error(error)}
                />
                <Button
                    title='Go to Map'
                    onPress={handlePress}
                    disabled={!destination}
                />

            <View> 
            {refreshing ? <ActivityIndicator /> : null}  
            <FlatList 
              data={userDestination}
              renderItem={({ item }) => (
                <View style={{ padding: 10 }}>
                    <Text>{item.destination}</Text>
                </View>
              )} 
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
         </View>
        </SafeAreaView>
    
    )
}

export default NextDestination