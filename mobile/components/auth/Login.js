import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

export class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password: '',
            uid: ''
        }

        this.onSingnUp = this.onSingnUp.bind(this)
    }

    onSingnUp(){
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {  
            this.setState({ uid: result.user.uid })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
        <View>
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
                title = 'Sign In'
            />
        </View>
        )
    }
}

export default Login