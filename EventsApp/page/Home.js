import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Dimensions, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function Home({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Inicio', 
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

  const openWebLink = () => {
    Linking.openURL('https://www.utepsa.edu/jets/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Event')}>
            <Icon name="calendar" size={50} color="#cf152d" />
            <Text style={styles.boxText}>Eventos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Exhibitors')}>
            <Icon name="address-card" size={50} color="#cf152d" />
            <Text style={styles.boxText}>Conferencistas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Inscription')}>
            <Icon name="map-signs" size={50} color="#cf152d" />
            <Text style={styles.boxText}>Puntos de inscripción</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Form')}>
            <Icon name="wpforms" size={50} color="#cf152d" />
            <Text style={styles.boxText}>Formulario de eventos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={openWebLink}>
            <Icon name="globe" size={50} color="#cf152d" />
            <Text style={styles.boxText}>Visitar Página Web</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Support')}>
            <Icon name="life-ring" size={50} color="#cf152d" />
            <Text style={styles.boxText}>Soporte</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#555555',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth - 40, 
  },
  box: {
    width: (screenWidth - 40) / 2 - 15, 
    height: 120,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  boxText: {
    marginTop: 10,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
