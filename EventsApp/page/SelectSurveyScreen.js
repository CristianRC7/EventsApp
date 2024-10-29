import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import BASE_URL from '../config/Config';

const SelectSurveyScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(true); 

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      setDate(selectedDate || date); 
    }
  };

  const handleSaveDate = async () => {
    if (!date) {
      Alert.alert('Error', 'Por favor, selecciona una fecha'); 
      return;
    }

    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(`${BASE_URL}/saveEventDate.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_evento: eventId,
          fecha_habilitada: formattedDate,
        }),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('Fecha guardada exitosamente');
        navigation.navigate('EnableSurvey');
      } else {
        Alert.alert('Error', 'No se pudo guardar la fecha');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al guardar la fecha');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Evento Seleccionado</Text>
      <Text style={styles.eventDetails}>ID de Evento: {eventId}</Text>

      <Text style={styles.selectedDate}>
        Fecha seleccionada: {date.toLocaleDateString()}
      </Text>

      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveDate}>
        <Text style={styles.saveButtonText}>Guardar Fecha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.navigate('EnableSurvey')}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  eventDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  selectedDate: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  saveButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    padding: 15,
    backgroundColor: '#cf152d',
    borderRadius: 30,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SelectSurveyScreen;
