import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  StyleSheet, 
  Switch, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import api from '../../services/api';

interface OrphanageDataRouteParams {
  position: {
    latitude: number;
    longitude: number;
  }
}

function OrphanageData() {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const navigation = useNavigation();

  const route = useRoute();
  const params = route.params as OrphanageDataRouteParams;

  async function handleCreateOrphanage() {
    const { latitude, longitude } = params.position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image
      } as any);
    });

    await api.post('orphanages', data);

    navigation.navigate('OrphanagesMap');
  }

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    if (status !== 'granted') {
      alert('Precisamos de acesso às suas fotos...');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.cancelled) {
      return;
    }

    /* Get the image uri if the user didn't cancelled the operation */
    const { uri: image } = result

    /* Keep the images set previously and add the Uri of the new one in the [] */
    setImages([...images, image]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        value={about}
        onChangeText={setAbout}
        multiline
      />

      {/* <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      /> */}

      <Text style={styles.label}>Fotos</Text>

      <View style={styles.uploadedImagesContainer}>
        { images.map(image => {
          return (
            <Image 
              key={image}
              source={{ uri: image }}
              style={styles.uploadedImage}
            />
          );
        })}
      </View>

      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={opening_hours}
        onChangeText={setOpeningHours}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch 
          thumbColor="#fff" 
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={open_on_weekends}
          onValueChange={setOpenOnWeekends}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6',
    
    color: '#5c8599',
    
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
  },

  label: {
    marginBottom: 8,
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
  },

  comment: {
    color: '#8fa7b3',
    fontSize: 11,
  },

  input: {
    height: 56,

    marginBottom: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,

    backgroundColor: '#fff',
    
    textAlignVertical: 'top',
  },
  
  uploadedImagesContainer: {
    flexDirection: 'row',
  },

  uploadedImage: {
    width: 64,
    height: 64,

    marginRight: 8,
    marginBottom: 32, 
    borderRadius: 20,
  },

  imagesInput: {
    justifyContent: 'center',
    alignItems: 'center',
    
    height: 56,
    
    marginBottom: 32,
    borderWidth: 1.4,
    borderColor: '#96D2F0',
    borderStyle: 'dashed',
    borderRadius: 20,
    
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 16,
  },

  nextButton: {
    justifyContent: 'center',
    alignItems: 'center',
    
    height: 56,
    
    marginTop: 32,
    borderRadius: 20,

    backgroundColor: '#15c3d6',
  },

  nextButtonText: {
    color: '#FFF',
   
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
  }
});


export default OrphanageData;