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
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../config/Config';

const screenWidth = Dimensions.get('window').width;

const EnableSurvey = () => {
  const navigation = useNavigation();
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Día 1'); 

  const dateMap = {
    'Día 1': '2024-06-22',
    'Día 2': '2024-06-25',
    'Día 3': '2024-06-26',
    'Día 4': '2024-06-27',
    'Día 5': '2024-06-28',
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${BASE_URL}/getEvents.php`);
      const data = await response.json();
      setEvents(data);
      handleFilterEvents(selectedDate, data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleEnableEvent = (eventId) => {
    navigation.navigate('SelectSurveyScreen', { eventId });
  };

  const handleFilterEvents = (dateKey, allEvents = events) => {
    const date = dateMap[dateKey];
    if (date) {
      const filtered = allEvents.filter(event => event.fecha === date);
      setFilteredEvents(filtered);
    }
    setSelectedDate(dateKey); 
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventText}>Descripción: {item.descripcion}</Text>
      <Text style={styles.eventText}>Aula: {item.aula}</Text>
      <Text style={styles.eventText}>Expositor: {item.expositor}</Text>
      <Text style={styles.eventText}>Fecha: {item.fecha}</Text>
      <TouchableOpacity 
        style={styles.enableButton} 
        onPress={() => handleEnableEvent(item.id)}
      >
        <Text style={styles.buttonText}>Habilitar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Habilitar Encuesta</Text>
        </View>

        <View style={styles.filterButtonsContainer}>
          {Object.keys(dateMap).map(dateKey => (
            <TouchableOpacity
              key={dateKey}
              style={[
                styles.filterButton,
                selectedDate === dateKey && styles.selectedFilterButton
              ]}
              onPress={() => handleFilterEvents(dateKey)}
            >
              <Text style={styles.filterButtonText}>{dateKey}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.content}
          refreshing={refreshing}
          onRefresh={fetchEvents}
        />
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
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#cf152d',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  selectedFilterButton: {
    backgroundColor: '#a0121f',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  eventCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  eventText: {
    fontSize: 16,
    color: '#333333',
  },
  enableButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#cf152d',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default EnableSurvey;