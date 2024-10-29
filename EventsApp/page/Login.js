import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BASE_URL from '../config/Config';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const checkSession = async () => {
        try {
          const usuarioGuardado = await AsyncStorage.getItem('usuario');
          if (usuarioGuardado) {
            navigation.navigate('Drawer', { screen: 'Profile', params: { usuario: usuarioGuardado } });
          }
        } catch (error) {
          console.error('Error al verificar la sesión:', error);
        }
      };
      checkSession();
    }, [])
  );

  const handleLogin = async () => {
    setLoading(true);
  
    try {
      const response = await fetch(`${BASE_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contrasena }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        await AsyncStorage.setItem('usuario', usuario);
        await AsyncStorage.setItem('nombre_completo', data.nombre_completo);
        await AsyncStorage.setItem('id_usuario', data.id.toString());
        await AsyncStorage.setItem('isAdmin', data.isAdmin.toString()); 
        navigation.navigate('Drawer', { screen: 'Profile', params: { usuario } });
      } else {
        Alert.alert('Error', 'Datos incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'Hubo un error al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nro. de Agenda"
        value={usuario}
        onChangeText={setUsuario}
        placeholderTextColor="#888"
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Nro. de CI"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry={!passwordVisible}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={24} color="#cf152d" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[styles.button, loading ? styles.buttonDisabled : null]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cf152d',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    borderRadius: 8,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: '#333',
  },
  eyeButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#cf152d',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#f6a4af',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
