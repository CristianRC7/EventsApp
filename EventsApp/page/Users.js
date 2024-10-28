import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Dimensions, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StatusBar, 
  Platform, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../config/Config';

const screenWidth = Dimensions.get('window').width;

const Users = () => {
  const navigation = useNavigation();
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/searchUsers.php`);
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = users.filter(user =>
      user.usuario.toLowerCase().includes(text.toLowerCase()) || 
      user.nombre_completo.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  const handleDeleteUser = (userId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Eliminación cancelada'),
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const response = await fetch(`${BASE_URL}/deleteUser.php`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId }),
              });
              const result = await response.json();
              if (result.success) {
                Alert.alert('Éxito', 'Usuario eliminado correctamente');
                fetchUsers(); 
              } else {
                Alert.alert('Error', result.message);
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Ocurrió un problema al eliminar el usuario.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Usuarios</Text>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Buscar por usuario o nombre completo"
          value={searchText}
          onChangeText={handleSearch}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#cf152d" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <Text style={styles.userText}>Usuario: {item.usuario}</Text>
                <Text style={styles.userText}>Nombre Completo: {item.nombre_completo}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.editButton} 
                    onPress={() => navigation.navigate('EditUser', { userId: item.id })}
                  >
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={() => handleDeleteUser(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
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
  searchBar: {
    margin: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  userCard: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#eeeeee',
    borderRadius: 10,
  },
  userText: {
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#cf152d',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#ff0000',
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Users;
