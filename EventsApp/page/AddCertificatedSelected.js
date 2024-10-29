import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  StatusBar,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import BASE_URL from '../config/Config';

const AddCertificatedSelected = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [gestiones, setGestiones] = useState([]);
  const [selectedGestion, setSelectedGestion] = useState(null);
  const [nroCertificado, setNroCertificado] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGestiones();
  }, []);

  const fetchGestiones = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getGestiones.php`);
      const data = await response.json();
      setGestiones(data);
    } catch (error) {
      console.error("Error fetching gestiones: ", error);
    }
  };

  const handleSubmit = async () => {
    if (!nroCertificado.trim()) {
      Alert.alert("Error", "El número de certificado es obligatorio");
      return;
    }
    if (!selectedGestion) {
      Alert.alert("Error", "Debe seleccionar una gestión");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/addCertificate.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, nroCertificado, gestiones: [selectedGestion] })
      });
      const result = await response.json();

      if (result.success) {
        Alert.alert("Éxito", "Certificado agregado con éxito");
        navigation.goBack();
      } else {
        Alert.alert("Error", result.message || "Ocurrió un error");
      }
    } catch (error) {
      console.error("Error adding certificate: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Certificado</Text>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Número de Certificado"
          value={nroCertificado}
          onChangeText={setNroCertificado}
        />

        <Text style={styles.sectionTitle}>Seleccione Gestión:</Text>
        <RadioButton.Group
          onValueChange={value => setSelectedGestion(value)}
          value={selectedGestion}
        >
          {gestiones.map(gestion => (
            <View key={gestion.id_gestion} style={styles.radioContainer}>
              <RadioButton value={gestion.id_gestion.toString()} />
              <Text style={styles.radioLabel}>{gestion.gestion}</Text>
            </View>
          ))}
        </RadioButton.Group>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Guardando..." : "Guardar Certificado"}
          </Text>
        </TouchableOpacity>
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
    input: {
      marginVertical: 20,
      padding: 10,
      borderRadius: 10,
      backgroundColor: '#f2f2f2',
      fontSize: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 20,
    },
    radioContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
    },
    radioLabel: {
      marginLeft: 8,
      fontSize: 16,
    },
    submitButton: {
      marginTop: 30,
      paddingVertical: 12,
      backgroundColor: '#cf152d',
      borderRadius: 5,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    disabledButton: {
      backgroundColor: '#ccc',
    },
  });

export default AddCertificatedSelected;
