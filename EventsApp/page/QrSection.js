import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 

export default function QrSection() {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const id_usuario = await AsyncStorage.getItem('id_usuario'); 
            const usuario = await AsyncStorage.getItem('usuario');
            const nombre_completo = await AsyncStorage.getItem('nombre_completo');
            if (id_usuario && usuario && nombre_completo) {
              setUserData({ id_usuario, usuario, nombre_completo });
            }
          } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
          }
        };

    fetchUserData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Mi QR',
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

  return (
    <View style={styles.container}>
      {userData ? (
        <>
        <Text style={styles.text}>Datos del usuario:</Text>
        <Text style={styles.text}>Usuario: {userData.usuario}</Text>
        <Text style={styles.text}>Nombre: {userData.nombre_completo}</Text>
        <QRCode
            value={JSON.stringify(userData)}
            size={200}
        />
        </>
      ) : (
        <Text>Cargando datos del usuario...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
