import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions, 
  TouchableOpacity, 
  Platform, 
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const Inscription = () => {
  const navigation = useNavigation();

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Puntos de Inscripción</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.highlightedText}>
            Costo de tu adhesión es de 130.- bolivianos, lo que te da derecho a participar de todas las actividades, el certificado y una polera conmemorativa del evento.
          </Text>
          <Text style={styles.title}>Servicio de Atención Estudiantil</Text>
          <Text style={styles.text}>
            Servicio de Atención Estudiantil está ubicado en la planta baja del bloque Este. Sus horarios de atención son: 08:00 AM - 19:00 PM
          </Text>
          <Text style={styles.title}>Secretaría de tu Facultad</Text>
          <Text style={styles.text}>
            Las secretarías de todas las facultades se encuentran en el 2do piso del bloque Este. Con los horarios de atención de 09:00 AM a 16:00 PM
          </Text>
          <Text style={styles.title}>Laboratorio de Sistemas</Text>
          <Text style={styles.text}>
            Se encuentra en el Segundo piso del Bloque Norte. Con los horarios de atención de 08:00 AM A 13:00 PM Y DE 18:00 PM A 21:00 PM
          </Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#cf152d', 
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
  highlightedText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#cf152d',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cf152d',
  },
});

export default Inscription;
