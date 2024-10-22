import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BASE_URL from '../config/Config';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function SelectEventScreen({ route }) {
  const { idUsuario } = route.params;
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Seleccionar Evento', 
      headerTitleAlign: 'right', 
      headerStyle: {
        backgroundColor: '#cf152d',
      },
      headerTintColor: '#FFFFFF', 
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
    });
  }, [navigation]);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_habilitated_events.php`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error('Error fetching eventos:', error);
      Alert.alert('Error', 'No se pudieron cargar los eventos habilitados.');
    }
  };

  const registrarAsistencia = async () => {
    if (!selectedEvento) {
      Alert.alert('Error', 'Debe seleccionar un evento.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/registrar_asistencia.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, id_evento: selectedEvento }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Éxito', data.message);
        navigation.goBack(); 
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error registrando asistencia:', error);
      Alert.alert('Error', 'Hubo un problema al registrar la asistencia.');
    }
  };

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: 35 }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seleccionar Evento</Text>
        </View>
        <Text style={styles.text}>Seleccione un evento:</Text>
        <View style={styles.eventListContainer}>
          <ScrollView>
            {eventos.map((evento) => (
              <View key={evento.id} style={styles.checkboxContainer}>
                <Text style={styles.eventDescription}>
                  {evento.descripcion.split('\n').map((line, index) => (
                    <Text key={index}>{line}{'\n'}</Text>
                  ))}
                </Text>
                <Button
                  title={selectedEvento === evento.id ? "✓" : "Seleccionar"}
                  onPress={() => setSelectedEvento(evento.id)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
        <Button title="Registrar asistencia" onPress={registrarAsistencia} />
      </View>
    </SafeAreaView>
  );
}  

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
  text: {
    fontSize: 18,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  eventListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    justifyContent: 'space-between',
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 10,
    padding: 15, 
    backgroundColor: '#f9f9f9', 
  },
  eventDescription: {
    flex: 1,
    marginRight: 10,
    fontSize: 16, 
  },
  button: {
    backgroundColor: '#cf152d', 
    borderRadius: 5,
    paddingVertical: 10, 
    paddingHorizontal: 20, 
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center', 
  },
});