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
  Image,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const Exhibitors = () => {
  const navigation = useNavigation();

  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight}]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Conferencistas</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.speakerContainer}>
            <Image 
              source={{ uri: 'https://i.postimg.cc/ZqvCgG0J/david-capistran.png' }} 
              style={styles.speakerImage} 
            />
            <Text style={styles.speakerName}>Conferencista: David Capistán</Text>
            <Text style={styles.speakerInfo}>Doctor en Ciencias Administrativas</Text>
            <Text style={styles.speakerInfo}>Tec. de Monterrey - México 🇲🇽</Text>
          </View>
          <View style={styles.speakerContainer}>
            <Image 
              source={{ uri: 'https://i.postimg.cc/zGZzvyfY/javier-aroztegui.png' }} 
              style={styles.speakerImage} 
            />
            <Text style={styles.speakerName}>Conferencista: Javier Aroztegui</Text>
            <Text style={styles.speakerInfo}>Doctor en Psicología</Text>
            <Text style={styles.speakerInfo}>UCM - España 🇪🇸</Text>
          </View>
          <View style={styles.speakerContainer}>
            <Image 
              source={{ uri: 'https://i.postimg.cc/SN5BN3DX/ken-singer.png' }} 
              style={styles.speakerImage} 
            />
            <Text style={styles.speakerName}>Conferencista: Ken Singer</Text>
            <Text style={styles.speakerInfo}>Chief Learning Officer And MD</Text>
            <Text style={styles.speakerInfo}>Berkeley CA - EE.UU. 🇺🇸</Text>
          </View>
          <View style={styles.speakerContainer}>
            <Image 
              source={{ uri: 'https://i.postimg.cc/YS10x1h3/gustavo-perez.png' }} 
              style={styles.speakerImage} 
            />
            <Text style={styles.speakerName}>Conferencista: Gustavo Pérez</Text>
            <Text style={styles.speakerInfo}>MSc. en Telecomunicaciones y Telemática</Text>
            <Text style={styles.speakerInfo}>Utepsa - Bolivia 🇧🇴</Text>
          </View>
          <View style={styles.speakerContainer}>
            <Image 
              source={{ uri: 'https://i.postimg.cc/9M769p0m/raul-eduardo-rodriguez.png' }} 
              style={styles.speakerImage} 
            />
            <Text style={styles.speakerName}>Conferencista: Raúl Eduardo Rodríguez</Text>
            <Text style={styles.speakerInfo}>Doctor en Educación</Text>
            <Text style={styles.speakerInfo}>Universidad Simón Bolívar - Colombia 🇨🇴</Text>
          </View>
          <View style={styles.speakerContainer}>
            <Image 
              source={{ uri: 'https://i.postimg.cc/mkdygx4t/diana-marcela-pantaleon.png' }} 
              style={styles.speakerImage} 
            />
            <Text style={styles.speakerName}>Conferencista: Diana Marcela Pantaleon</Text>
            <Text style={styles.speakerInfo}>Doctora en Educación</Text>
            <Text style={styles.speakerInfo}>Universidad Simón Bolívar - Colombia 🇨🇴</Text>
          </View>
        </ScrollView>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  speakerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  speakerImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 10,
  },
  speakerName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  speakerInfo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
  },
});

export default Exhibitors;
