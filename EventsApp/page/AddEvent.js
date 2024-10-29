import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  Platform, 
  StatusBar, 
  Alert 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import  BASE_URL  from '../config/Config';

const AddEvent = () => {
  const navigation = useNavigation();
  const [hora, setHora] = useState(new Date());
  const [descripcion, setDescripcion] = useState('');
  const [aula, setAula] = useState('');
  const [expositor, setExpositor] = useState('');
  const [fecha, setFecha] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const dateOptions = {
    'Día 1': '2024-06-22',
    'Día 2': '2024-06-25',
    'Día 3': '2024-06-26',
    'Día 4': '2024-06-27',
    'Día 5': '2024-06-28'
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

  const handleDateChange = (selectedDate) => {
    setFecha(selectedDate);
  };

  const handleSubmit = async () => {
    if (!descripcion || !aula || !expositor || !fecha) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/addEvent.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hora: hora.toTimeString().split(' ')[0],
          descripcion,
          aula,
          expositor,
          fecha
        })
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Evento agregado correctamente');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo agregar el evento');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error al agregar el evento');
    }
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Evento</Text>
        </View>
        
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
          />
          <TextInput
            style={styles.input}
            placeholder="Aula"
            value={aula}
            onChangeText={setAula}
          />
          <TextInput
            style={styles.input}
            placeholder="Expositor"
            value={expositor}
            onChangeText={setExpositor}
          />

          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeButton}>
            <Text style={styles.timeButtonText}>Seleccionar Hora</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={hora}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <Text style={styles.dateTitle}>Seleccionar Fecha:</Text>
          {Object.keys(dateOptions).map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.checkboxContainer}
              onPress={() => handleDateChange(dateOptions[key])}
            >
              <View style={styles.checkbox}>
                {fecha === dateOptions[key] && <View style={styles.checkboxSelected} />}
              </View>
              <Text style={styles.checkboxLabel}>{key}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Agregar Evento</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#cf152d' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cf152d',
    paddingHorizontal: 20,
    paddingBottom: 15,
    marginBottom: 20,
  },
  backButton: { marginRight: 15, marginTop: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginTop: 5 },
  content: { flex: 1, paddingHorizontal: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 8, fontSize: 16 },
  timeButton: {
    backgroundColor: '#cf152d',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  timeButtonText: { color: '#FFFFFF', fontSize: 16 },
  dateTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#cf152d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxSelected: { width: 12, height: 12, backgroundColor: '#cf152d' },
  checkboxLabel: { fontSize: 16 },
  submitButton: {
    backgroundColor: '#cf152d',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default AddEvent;
