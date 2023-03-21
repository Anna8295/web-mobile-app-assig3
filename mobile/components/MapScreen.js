import React from 'react'
import { StyleSheet, View } from 'react-native'
import NextDestination from './main/NextDestination'

const MapScreen = () => {
    return(
        <View style={styles.container}>
            <View >
                <NextDestination />
            </View>
        </View>
    )
}
  
export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1/2,
      },
})
