import React, { useState } from 'react'
import { View, TextInput, Image, Button  } from 'react-native'
import Profile from './Profile'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

export default function Save(props) {
    const [caption, setCaption] = useState('')

    const {latitude, longitude} = props.route.params.location
    console.log(latitude, longitude)

    const uploadImage = async() => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)
        const response = await fetch(uri);
        const blob = await response.blob();
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on('state_changed', taskProgress, taskError, taskCompleted)

    }

    const savePostData = (downloadURL) => {
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .add({
                downloadURL,
                caption,
                latitude,
                longitude,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                props.navigation.navigate('Profile', { image: downloadURL });
            })
            .catch((error) => {
              console.log(error);
            })
    }

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Image 
        style={{ width: 200, height: 200 }}
        source={{uri: props.route.params.image}}
      />
      <TextInput 
        placeholder='Write a Caption ...'
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button 
        title='Save'
        onPress={() => uploadImage()}
      />
    </View>
  )
}

