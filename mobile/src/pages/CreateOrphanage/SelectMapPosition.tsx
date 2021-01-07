import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { MapEvent, Marker } from 'react-native-maps';

import mapMarkerImg from '../../assets/images/map-marker.png';

function SelectMapPosition() {
  const navigation = useNavigation();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 }); 

  function handleNextStep() {
    navigation.navigate('OrphanageData', { position });
  }

  function handleSelectMapPosition(event: MapEvent) {
    /* Get the coordinates of the position the user is pressing */
    setPosition(event.nativeEvent.coordinate);
  }

  return (
    <View style={styles.container}>
      <MapView 
        initialRegion={{
          latitude: -23.5494991,
          longitude: -46.9381225,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        onPress={handleSelectMapPosition}
        style={styles.mapStyle}
      >  

      { position.latitude !== 0 && (
        <Marker 
          icon={mapMarkerImg}
          coordinate={{
            latitude: position.latitude,
            longitude: position.longitude,
          }}
        />
      )}

      </MapView>

      { position.latitude !== 0 && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </RectButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  
  nextButton: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,

    justifyContent: 'center',
    alignItems: 'center',
    
    height: 56,
    
    borderRadius: 20,
    
    backgroundColor: '#15c3d6',
  },

  nextButtonText: {
    color: '#FFF',

    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
  }
});

export default SelectMapPosition;