import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  Dimensions, 
  TouchableOpacity, 
  Platform, 
  StatusBar,
  ActivityIndicator,
  RefreshControl, 
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../config/Config';

const screenWidth = Dimensions.get('window').width;

const EditEvent = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('2024-06-22'); 
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  
  const [isRefreshing, setIsRefreshing] = useState(false); 

  useEffect(() => {
    fetchEvents(selectedDate); 
  }, []);

  const fetchEvents = (date) => {
    setIsLoading(true); 
    fetch(`${BASE_URL}/get_events.php?fecha=${date}`)
      .then((response) => response.json())
      .then((responseJson) => {
        setIsLoading(false);  
        setIsRefreshing(false); 
        if (responseJson.success) {
          setEvents(responseJson.events);
        } else {
          console.error(responseJson.message);
        }
      })
      .catch((error) => {
        setIsLoading(false); 
        setIsRefreshing(false);
        console.error(error);
      });
  };

  const handleEditEvent = (event) => {
    navigation.navigate('EditSelectedEvent', { event });
  };

  const handleDeleteEvent = (eventId) => {
    Alert.alert(
      'Eliminar Evento',
      '¿Estás seguro de que deseas eliminar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          onPress: () => {
            setIsLoading(true);
            fetch(`${BASE_URL}/deleteEvent.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: eventId })
            })
            .then(response => response.json())
            .then(responseJson => {
              setIsLoading(false);
              if (responseJson.success) {
                Alert.alert("Éxito", "Evento eliminado correctamente");
                fetchEvents(selectedDate);
              } else {
                Alert.alert("Error", "No se pudo eliminar el evento");
              }
            })
            .catch(error => {
              setIsLoading(false);
              console.error(error);
              Alert.alert("Error", "Ocurrió un error al eliminar el evento");
            });
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.descripcion}</Text>
      <Text style={styles.text}>Hora: {item.hora}</Text>
      <Text style={styles.text}>Lugar: {item.aula}</Text>
      <Text style={styles.text}>Expositor: {item.expositor}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditEvent(item)}>
          <Icon name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEvent(item.id)}>
          <Icon name="trash" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  const dateMapTop = {
    'Día 1': '2024-06-22',
    'Día 2': '2024-06-25',
    'Día 3': '2024-06-26',
  };

  const dateMapBottom = {
    'Día 4': '2024-06-27',
    'Día 5': '2024-06-28',
  };

  const formatDate = (date) => {
    const months = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    const [year, month, day] = date.split('-');
    return `${day} DE ${months[parseInt(month, 10) - 1]}`;
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchEvents(selectedDate);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Eventos</Text>
        </View>

        <View style={styles.dateButtons}>
          <View style={styles.row}>
            {Object.entries(dateMapTop).map(([day, date]) => (
              <TouchableOpacity 
                key={day}
                style={[styles.dateButton, isLoading ? styles.disabledDateButton : null]}  
                onPress={() => {
                  if (!isLoading) {  
                    setSelectedDate(date);
                    fetchEvents(date);
                  }
                }}
                disabled={isLoading}  
              >
                <Text style={styles.dateButtonText}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.row}>
            {Object.entries(dateMapBottom).map(([day, date]) => (
              <TouchableOpacity 
                key={day}
                style={[styles.dateButton, isLoading ? styles.disabledDateButton : null]}  
                onPress={() => {
                  if (!isLoading) {  
                    setSelectedDate(date);
                    fetchEvents(date);
                  }
                }}
                disabled={isLoading}  
              >
                <Text style={styles.dateButtonText}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedDate && (
          <Text style={styles.selectedDateText}>Eventos del {formatDate(selectedDate)}</Text>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#cf152d" />
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        )}
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
  listContent: {
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    width: screenWidth - 40,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateButtons: {
    marginHorizontal: 20,  
    marginBottom: 20,  
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateButton: {
    paddingHorizontal: 10,  
    paddingVertical: 10,  
    borderRadius: 15,  
    backgroundColor: '#cf152d',
    flex: 1, 
    marginHorizontal: 5,  
  },
  disabledDateButton: {
    backgroundColor: '#e0e0e0', 
  },
  dateButtonText: {
    textAlign: 'center',  
    fontSize: 14,  
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cf152d',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditEvent;
