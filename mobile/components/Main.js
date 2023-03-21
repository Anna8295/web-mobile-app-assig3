import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, clearData } from '../redux/actions/index'

import Map from './main/Map'
//import Add from './main/Add'
//import CurrentLoc from './main/CurrentLoc'
import Profile from './main/Profile'
import MapScreen from './MapScreen';


const Tab = createMaterialBottomTabNavigator();

const Empty = () => {
    return(null)
}

export class Main extends Component {
    componentDidMount(){
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
    } 
    render() {
        return (
            <Tab.Navigator initialRouteName='Profile' labeled={false}>
                <Tab.Screen name='Profile' component={Profile} 
                    options={{
                        tabBarIcon: ({color, size})=> (
                            <MaterialCommunityIcons name='account-circle' color={color} size={26} />
                        ),
                    }}    
                />
                <Tab.Screen name="MapScreen" component={MapScreen} 
                    options={{
                        tabBarIcon: ({color, size})=> (
                            <MaterialCommunityIcons name='map-marker' color={color} size={26} />
                        ),
                    }}    
                />
                <Tab.Screen name="MainAdd" component={Empty} 
                    listeners={({navigation}) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate('Add')
                        }
                    })}
                    options={{
                        tabBarIcon: ({color, size})=> (
                            <MaterialCommunityIcons name='plus-box' color={color} size={26} />
                        ),
                    }}    
                />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, clearData}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Main);