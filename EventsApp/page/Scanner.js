import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function Scanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [idUsuario, setIdUsuario] = useState('');
  const [isScanning, setIsScanning] = useState(false);

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
        if (status === 'granted') {
          setHasPermission(true);
        } else {
          setHasPermission(false);
          Alert.alert(
            'Permisos necesarios',
            'Se necesita acceso a la cámara para escanear códigos QR. ¿Deseas abrir la configuración para habilitar los permisos?',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'Ir a Configuración',
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
      };

      fetchPermission();

      return () => {
        setIsScanning(false);
        setScanned(false);
      };
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
    return null; 
  }

  return (
    <View style={styles.container}>
      {isScanning ? (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
          )}
        </>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Comenzar a escanear" onPress={() => setIsScanning(true)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
