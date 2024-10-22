import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, Image, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import BASE_URL from '../config/Config';

export default function Profile({ route }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [certificados, setCertificados] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [noCertificados, setNoCertificados] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerNombreCompleto = async () => {
      try {
        const nombre = await AsyncStorage.getItem('nombre_completo');
        setNombreCompleto(nombre || '');
      } catch (error) {
        console.error('Error al obtener el nombre completo:', error);
      }
    };

    obtenerNombreCompleto();
    obtenerCertificados();
  }, []);

  const obtenerCertificados = async () => {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      const response = await fetch(`${BASE_URL}/get_certificado.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario }),
      });
      const data = await response.json();
      if (data.success) {
        const certificados = data.certificados || [];
        setCertificados(certificados);
        setNoCertificados(certificados.length === 0);
      } else {
        console.error('Error al obtener los certificados:', data.message);
        setCertificados([]);
        setNoCertificados(true);
      }
    } catch (error) {
      console.error('Error al obtener los certificados:', error);
      setCertificados([]);
      setNoCertificados(true);
    }
  };

  const handleCertificadoClick = async (nro_certificado) => {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      const url = `${BASE_URL}/download_certificado.php?usuario=${usuario}&nro_certificado=${nro_certificado}`;
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Error al descargar el certificado:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('nombre_completo'); 
      await AsyncStorage.removeItem('usuario');
      await AsyncStorage.removeItem('id_usuario');

      setNombreCompleto('');
      setCertificados([]);
      setNoCertificados(false);

      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await obtenerCertificados();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Perfil',
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
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        <View style={styles.nombreCompletoContainer}>
          <Text style={styles.nombreCompleto}>{nombreCompleto}</Text>
          <Ionicons name="school" size={50} color="#cf152d" style={styles.icon} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
        <Text style={styles.sectionText}>Sección de Certificados</Text>
        {noCertificados ? (
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <Text style={styles.noCertificadosText}>Sin registro de certificados</Text>
          </ScrollView>
        ) : (
          <FlatList
            data={certificados}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCertificadoClick(item.nro_certificado)}>
                <View style={styles.certificadoContainer}>
                  <Image source={require('../assets/pdf_download.png')} style={styles.certificadoImage} />
                  <Text style={styles.gestionText}>{item.gestion}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            contentContainerStyle={styles.certificadosContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nombreCompletoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nombreCompleto: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    marginBottom: 5,
    marginTop: 30,
  },
  button: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  sectionText: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 20,
  },
  certificadosContainer: {
    justifyContent: 'center',
    marginTop: 10,
  },
  certificadoContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  certificadoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  gestionText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noCertificadosText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  scrollViewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
