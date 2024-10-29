import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  Platform, 
  StatusBar 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BASE_URL from '../config/Config';

const EditSelectedEvent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { event } = route.params;

  const [descripcion, setDescripcion] = useState(event.descripcion);
  const [hora, setHora] = useState(new Date(`1970-01-01T${event.hora}:00`)); // Convierte `hora` a tipo Date
  const [aula, setAula] = useState(event.aula);
  const [expositor, setExpositor] = useState(event.expositor);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

  const updateEvent = () => {
    fetch(`${BASE_URL}/update_event.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: event.id,
        descripcion,
        hora: hora.toTimeString().slice(0, 5), // Guarda solo la hora y minutos
        aula,
        expositor,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success) {
        Alert.alert('Evento actualizado con éxito');
        navigation.navigate('EditEvent');
      } else {
        Alert.alert('Error', responseJson.message);
      }
    })
    .catch((error) => {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar el evento');
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Evento</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput 
            style={styles.input} 
            value={descripcion} 
            onChangeText={setDescripcion} 
          />

          <Text style={styles.label}>Hora</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
            <Text>{hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={hora}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          <Text style={styles.label}>Lugar</Text>
          <TextInput 
            style={styles.input} 
            value={aula} 
            onChangeText={setAula} 
          />

          <Text style={styles.label}>Expositor</Text>
          <TextInput 
            style={styles.input} 
            value={expositor} 
            onChangeText={setExpositor} 
          />

          <TouchableOpacity style={styles.saveButton} onPress={updateEvent}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#cf152d',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cf152d',
    paddingHorizontal: 20,
    paddingBottom: 15,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EditSelectedEvent;
