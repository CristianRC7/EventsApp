import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BASE_URL from '../config/Config';

export default function Scanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [idUsuario, setIdUsuario] = useState('');
  const [isFocused, setIsFocused] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Escáner', 
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

  useFocusEffect(
    useCallback(() => {
      const fetchPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      };

      fetchPermission();

      return () => {
        setScanned(false);
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    try {
      const qrData = JSON.parse(data);
      setIdUsuario(qrData.id_usuario);
      Alert.alert('Escaneo exitoso', `Usuario: ${qrData.usuario}, Nombre: ${qrData.nombre_completo}`);
      navigation.navigate('SelectEventScreen', { idUsuario: qrData.id_usuario });
    } catch (error) {
      Alert.alert('Error', 'Código QR no válido.');
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para acceder a la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Escanea el código QR para registrar asistencia</Text>

      {isFocused && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {scanned && (
        <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});