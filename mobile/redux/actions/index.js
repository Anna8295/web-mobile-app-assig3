import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, CLEAR_DATA } from '../constants/index'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'


export function clearData() {
    return ((dispacth) => {
        dispacth({type: CLEAR_DATA})
    })
}

export function fetchUser(){
    return((dispacth) => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    dispacth({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
                }else {
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts(){
    return((dispacth) => {
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
                dispacth({type: USER_POSTS_STATE_CHANGE, posts})
            })
    })
}