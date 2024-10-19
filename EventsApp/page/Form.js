import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions, 
  TouchableOpacity, 
  Platform, 
  StatusBar,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/Config';

const screenWidth = Dimensions.get('window').width;

const Form = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const formatAMPM = (timeString) => {
    const time = timeString.split(':');
    let hours = parseInt(time[0]);
    let minutes = parseInt(time[1]);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  };

  const fetchEventos = async () => {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      const response = await fetch(`${BASE_URL}/get_form.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario }),
      });

      const data = await response.json();

      if (data.success) {
        setEventos(data.eventos);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Hubo un error al obtener los eventos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchEventos();
      return () => {
      };
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true); 
    fetchEventos(); 
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Formulario de Eventos</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> 
          }
        >
          {loading ? (
            <ActivityIndicator size="large" color="#cf152d" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : eventos.length > 0 ? (
            eventos.map((evento) => (
              <View key={evento.id} style={styles.eventContainer}>
                <Text style={styles.eventTitle}>{evento.descripcion}</Text>
                <Text style={styles.eventTime}>Hora: {formatAMPM(evento.hora)}</Text>
                {evento.status === 'Responder Encuesta' && (
                    <TouchableOpacity
                        style={styles.encuestaButton}
                        onPress={() => navigation.navigate('Encuesta', { evento })}
                    >
                        <Text style={styles.encuestaButtonText}>{evento.status}</Text>
                    </TouchableOpacity>
                    )}
                {evento.status === 'Encuesta Enviada' && (
                  <Text style={styles.encuestaEnviada}>{evento.status}</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>No tienes eventos registrados</Text>
          )}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  eventContainer: {
    width: screenWidth - 40,
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginVertical: 20,
  },
  noEventsText: {
    fontSize: 16,
    marginVertical: 20,
  },
  encuestaButton: {
    backgroundColor: '#cf152d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  encuestaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  encuestaEnviada: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default Form;
