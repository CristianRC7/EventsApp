import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions, 
  TouchableOpacity, 
  Platform, 
  StatusBar,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Icono from '../assets/icono.png';

const screenWidth = Dimensions.get('window').width;

const Support = () => {
  const navigation = useNavigation();

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Soporte</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Bienvenido a la aplicación JETS UTEPSA</Text>
          <Image source={Icono} style={styles.icono} />
          <Text style={styles.text}>En caso de presentar algún inconveniente puedes contactarte al siguiente correo:</Text>
          <Text style={styles.email}>soporte.campusvirtual@utepsa.edu</Text>
          <Text style={styles.text}>Santa Cruz - 2024</Text>
          <Text style={styles.text}>CTE</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  icono: {
    width: 150,
    height: 150, 
    marginVertical: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#cf152d',
    marginVertical: 5,
  },
});

export default Support;
