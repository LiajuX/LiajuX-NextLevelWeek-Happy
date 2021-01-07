import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

import mapMarker from '../assets/images/map-marker.png';

import api from '../services/api';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  const { navigate } = useNavigation();

  /* useFocusEffect instead of useEffect to repeat the process every time the user returns to the map screen */
  useFocusEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  });

  function handleNavigateToOrphanageDetails(id: number) {
    navigate('OrphanageDetails', { id });
  }

  function handleNavigateToCreateOrphanage() {
    navigate('SelectMapPosition');
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} 
        style={styles.map} 
        initialRegion={{
          latitude: -23.5494991,
          longitude: -46.9381225,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >
        { orphanages.map(orphanage => {
          return(
            <Marker 
              key={orphanage.id}
              icon={mapMarker}
              calloutAnchor={{
                x: 2.7,
                y: 0.8,
              }}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
              }}
            >
              <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{ orphanage.name }</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {orphanages.length} orfanatos encontrados
        </Text>
      
        <RectButton
          style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('screen').height,
  },

  calloutContainer: {
    justifyContent: 'center',

    width: 160,
    height: 46,
    
    paddingHorizontal: 16,
    borderRadius: 16,
    
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },

  calloutText: {
    color: '#0089A5',
   
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },

  footer: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    left: 24,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    height: 56,
    paddingLeft: 24,
    borderRadius: 20,

    backgroundColor: '#FFF',

    elevation: 3,
  },

  footerText: {
    color: '#8FA7B3', 

    fontFamily: 'Nunito_700Bold',
  },

  createOrphanageButton: {
    alignItems: 'center',
    justifyContent: 'center',

    width: 56,
    height: 56,

    borderRadius: 20,

    backgroundColor: '#15C3DC',
  },
});

export default OrphanagesMap;