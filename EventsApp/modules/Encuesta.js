import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import  BASE_URL  from '../config/Config';

const Encuesta = ({ route, navigation }) => {
  const { evento } = route.params;
  const [calificacion, setCalificacion] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const handleCalificacion = (valor) => {
    setCalificacion(valor);
  };

  const enviarCalificacion = async () => {
    if (calificacion) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/enviar_calificacion.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_evento: evento.id,
            calificacion: calificacion,
          }),
        });

        const data = await response.json();

        if (data.success) {
          Alert.alert('Éxito', 'Calificación enviada exitosamente');
          navigation.goBack();
        } else {
          Alert.alert('Error', 'Hubo un error al enviar la calificación');
        }
      } catch (error) {
        console.error('Error al enviar la calificación:', error);
        Alert.alert('Error', 'Hubo un error al enviar la calificación');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Por favor seleccione una calificación');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.titulo}>{evento.descripcion}</Text>
        <Text style={styles.pregunta}>¿Qué te pareció el evento? Califica del 1 al 5</Text>
        <View style={styles.botonesContainer}>
          {[1, 2, 3, 4, 5].map((valor) => (
            <TouchableOpacity
              key={valor}
              style={[styles.boton, calificacion === valor && styles.botonSeleccionado]}
              onPress={() => handleCalificacion(valor)}
            >
              <Text style={[styles.textoBoton, calificacion === valor && styles.textoBotonSeleccionado]}>{valor}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.botonesContainer}>
          <Button title="Cancelar" onPress={() => navigation.goBack()} color="#cf152d" />
          <Button title="Enviar" onPress={enviarCalificacion} disabled={loading} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pregunta: {
    fontSize: 18,
    marginBottom: 20,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  boton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  botonSeleccionado: {
    backgroundColor: '#cf152d',
  },
  textoBoton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  textoBotonSeleccionado: {
    color: '#fff',
  },
});

export default Encuesta;
