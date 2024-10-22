import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { SafeAreaView, StyleSheet, View, Image } from 'react-native';
import Home from '../page/Home';
import Profile from '../page/Profile';
import QrSection from '../page/QrSection';
import Scanner from '../page/Scanner'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#cf152d',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  logo: {
    width: 320,
    height: 70,
    resizeMode: 'contain',
  },
  drawerItem: {
    backgroundColor: '#cf152d',
  },
  drawerItemActive: {
    backgroundColor: '#555555',
  },
  drawerItemLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

const CustomDrawerContent = (props) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdminValue = await AsyncStorage.getItem('isAdmin');
      setIsAdmin(isAdminValue === 'true'); 
    };

    checkAdminStatus();
  }, []);

  return (
    <View style={styles.drawerContent}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: 'https://i.postimg.cc/5NMpp0rv/logo-jets.png' }} style={styles.logo} />
      </View>
      <DrawerItem
        label="Inicio"
        labelStyle={styles.drawerItemLabel}
        onPress={() => props.navigation.navigate('Home')}
        icon={({ color, size }) => <Icon name="home" color={color} size={size} />}
        style={[styles.drawerItem, props.state.routeNames[props.state.index] === 'Home' && styles.drawerItemActive]}
      />
      <DrawerItem
        label="Mi QR"
        labelStyle={styles.drawerItemLabel}
        onPress={() => props.navigation.navigate('QrSection')}
        icon={({ color, size }) => <Icon name="qrcode" color={color} size={size} />}
        style={[styles.drawerItem, props.state.routeNames[props.state.index] === 'QrSection' && styles.drawerItemActive]}
      />
      <DrawerItem
        label="Perfil"
        labelStyle={styles.drawerItemLabel}
        onPress={() => props.navigation.navigate('Profile')}
        icon={({ color, size }) => <Icon name="user" color={color} size={size} />}
        style={[styles.drawerItem, props.state.routeNames[props.state.index] === 'Profile' && styles.drawerItemActive]}
      />

      {isAdmin && (
        <DrawerItem
          label="Escáner"
          labelStyle={styles.drawerItemLabel}
          onPress={() => props.navigation.navigate('Scanner')} 
          icon={({ color, size }) => <Icon name="barcode" color={color} size={size} />}
          style={[styles.drawerItem, props.state.routeNames[props.state.index] === 'Scanner' && styles.drawerItemActive]}
        />
      )}
    </View>
  );
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: styles.drawerContent,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#ccc',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ title: 'Inicio' }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Perfil' }}
      />
      <Drawer.Screen
        name="QrSection"
        component={QrSection} 
        options={{ title: 'Mi QR' }}
      />
      <Drawer.Screen
        name="Scanner"
        component={Scanner} 
        options={{ title: 'Escáner' }}
      />
    </Drawer.Navigator>
  );
}
