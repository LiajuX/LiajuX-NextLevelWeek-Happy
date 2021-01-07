import React, { useEffect, useState } from 'react';
import { 
  Image, 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Linking,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RectButton } from 'react-native-gesture-handler';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import mapMarkerImg from '../assets/images/map-marker.png';

import api from '../services/api';

interface OrphanageDetailsRouteParams {
  id: number;
}

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

function OrphanageDetails() {
  const route = useRoute();
  const params = route.params as OrphanageDetailsRouteParams;

  const [orphanage, setOrphanage] = useState<Orphanage>();

  useEffect(() => {
    api.get(`orphanages/${params.id}`).then(response => {
      setOrphanage(response.data);
    });
  }, [params.id]);

  if (!orphanage) {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>Carregando...</Text>
      </View>
    );
  }

  function handleOpenGoogleMapsRoutes() {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${orphanage?.latitude},${orphanage?.longitude}`);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imagesContainer}>
        {/* pagingEnabled = scroll view stops on multiples of the scroll view's size when scrolling */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator>
          { orphanage.images.map(image => {
            return (
              <Image 
                key={image.id}
                style={styles.image} 
                source={{ uri: image.url }} 
              />
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{ orphanage.name }</Text>
        <Text style={styles.description}>{ orphanage.about }</Text>
      
        <View style={styles.mapContainer}>
          <MapView 
            initialRegion={{
              latitude: orphanage.latitude,
              longitude: orphanage.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }} 
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            style={styles.mapStyle}
          >
            <Marker 
              icon={mapMarkerImg}
              coordinate={{ 
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
              }}
            />
          </MapView>

          <TouchableOpacity onPress={handleOpenGoogleMapsRoutes} style={styles.routesContainer}>
            <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
          </TouchableOpacity>
        </View>
      
        <View style={styles.separator} />

        <Text style={styles.title}>Instruções para visita</Text>
        <Text style={styles.description}>{ orphanage.instructions }</Text>

        <View style={styles.scheduleContainer}>
          <View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
            <Feather name="clock" size={40} color="#2AB5D1" />
            <Text style={[styles.scheduleText, styles.scheduleTextBlue]}>Segunda à Sexta { orphanage.opening_hours }</Text>
          </View>

          { orphanage.open_on_weekends ? (
            <View style={[styles.scheduleItem, styles.scheduleItemGreen]}>
              <Feather name="info" size={40} color="#39CC83" />
              <Text style={[styles.scheduleText, styles.scheduleTextGreen]}>Atendemos fim de semana</Text>
            </View>        
          ) : (
            <View style={[styles.scheduleItem, styles.scheduleItemRed]}>
              <Feather name="info" size={40} color="#FF669D" />
              <Text style={[styles.scheduleText, styles.scheduleTextRed]}>Não atendemos fim de semana</Text>
            </View>    
          )}
        </View>

        <RectButton style={styles.contactButton} onPress={() => {}}>
          <FontAwesome name="whatsapp" size={24} color="#FFF" />
          <Text style={styles.contactButtonText}>Entrar em contato</Text>
        </RectButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imagesContainer: {
    height: 240,
  },

  image: {
    width: Dimensions.get('window').width,
    height: 240,
    
    resizeMode: 'cover',
  },

  detailsContainer: {
    padding: 24,
  },

  title: {
    color: '#4D6F80',
    
    fontFamily: 'Nunito_700Bold',
    fontSize: 30,
  },

  description: {
    marginTop: 16,
    
    color: '#5c8599',
    
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 24,
  },

  mapContainer: {
    marginTop: 40,
    borderWidth: 1.2,
    borderColor: '#B3DAE2',
    borderRadius: 20,
    
    backgroundColor: '#E6F7FB',
    
    overflow: 'hidden',
  },

  mapStyle: {
    width: '100%',
    height: 150,
  },

  routesContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    padding: 16,
  },

  routesText: {
    color: '#0089a5',
    fontFamily: 'Nunito_700Bold',
  },

  separator: {
    height: 0.8,
    width: '100%',
    
    marginVertical: 40,
    
    backgroundColor: '#D3E2E6',
  },

  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    marginTop: 24,
  },

  scheduleItem: {
    width: '48%',
    padding: 20,
  },

  scheduleItemBlue: {
    borderWidth: 1,
    borderColor: '#B3DAE2',
    borderRadius: 20,
    
    backgroundColor: '#E6F7FB',
  },

  scheduleItemGreen: {
    borderWidth: 1,
    borderColor: '#A1E9C5',
    borderRadius: 20,
    
    backgroundColor: '#EDFFF6',
  },

  scheduleItemRed: {
    borderWidth: 1,
    borderColor: '#FFBCD4',
    borderRadius: 20,
    
    backgroundColor: '#FEF6F9',
  },

  scheduleText: {
    marginTop: 20,
    
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },

  scheduleTextBlue: {
    color: '#5C8599'
  },

  scheduleTextGreen: {
    color: '#37C77F'
  },

  
  scheduleTextRed: {
    color: '#FF669D'
  },

  contactButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    
    height: 56,
    
    marginTop: 40,
    borderRadius: 20,
    
    backgroundColor: '#3CDC8C',
  },

  contactButtonText: {
    marginLeft: 16,

    color: '#FFF',
    
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
  }
});

export default OrphanageDetails;