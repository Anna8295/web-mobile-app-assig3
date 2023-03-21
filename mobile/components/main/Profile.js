import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableWithoutFeedback, RefreshControl, ActivityIndicator} from 'react-native'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import { connect } from 'react-redux'

 
function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => { 
    const { currentUser, posts } = props  
    console.log(currentUser, posts)
    setUser(currentUser)
    setUserPosts(posts)
  }, [props.currentUser, props.posts])

  useEffect(() => {
    loadUserData();
  }, []); 
 
  const loadUserData = () => {
    firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection('userPosts')
            .orderBy('creation', 'asc')
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })
                setUserPosts(posts)
                setRefreshing(false);
            })
  }

  const onRefresh = () => {
    //Clear old data of the list
    setUserPosts([]);
    //Call the Service to get the latest data
    loadUserData()
  };

  const onLogout = () => {
    firebase.auth().signOut()
  }

  if(user === null){
    return <View />
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        <Button 
          title='Logout'
          onPress={() => onLogout()}
        />
      </View>

      <View style={styles.containerGallery}> 
      {refreshing ? <ActivityIndicator /> : null}  
            <FlatList 
              numColumns={3}
              horizontal={false}
              data={userPosts}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => {
                  props.navigation.navigate('Post', { uri: item.downloadURL, text: item.caption, latitude: item.latitude, longitude: item.longitude  });
                }}>
                  <View style={styles.containerImage}>
                    <Image style={styles.image} source={{ uri: item.downloadURL }} />
                  </View>
                </TouchableWithoutFeedback>
              )} 
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
        />
      </View>
    </View>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40
  },
  containerInfo:{
    margin: 20
  },
  containerGallery:{
    flex: 1,
  },
  containerImage:{
    flex: 1/3
  },
  image:{
    flex: 1,
    aspectRatio: 1/1
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile)