import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

export class Register extends Component {
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password: '',
            name: ''
        }

        this.onSingnUp = this.onSingnUp.bind(this)
    }

    onSingnUp(){
        const { email, password, name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            firebase.firestore().collection('users')
                .doc(firebase.auth().currentUser.uid)
                .set({
                    name,
                    email,
                    uid: firebase.auth().currentUser.uid
                })
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
        <View>
            <TextInput 
                placeholder='name'
                onChangeText={(name) => this.setState({name})}
            />
            <TextInput 
                placeholder='email'
                onChangeText={(email) => this.setState({email})}
            />
            <TextInput 
                placeholder='password'
                secureTextEntry={true}
                onChangeText={(password) => this.setState({password})}
            />

            <Button 
                onPress={() => this.onSingnUp()}
                title = 'Sign Up'
            />
        </View>
        )
    }
}

export default Register