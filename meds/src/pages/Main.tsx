import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import api from '../api/api';
import MedicationItem from '../components/MedicationItem';
import AddMedicationModal from '../components/AddMedicationModal';
import {Medication, RootStackParamList} from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAuth} from '../context/context';
import type {RootState} from '../redux/store';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

type MainNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface Props {
  navigation: MainNavigationProp;
}

const Main: React.FC<Props> = () => {
  const updateStatus = useSelector((state: RootState) => state.update);

  const {setAuthToken} = useAuth();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchMedications();
  }, []);

  useEffect(() => {
    fetchMedications();
  }, [updateStatus]);

  function sortMedications(medicationsData: Medication[]) {
    let nonFulfilled = medicationsData.filter(
      med => med.count < med.destination_count,
    );
    let fulfilled = medicationsData.filter(
      med => med.count >= med.destination_count,
    );
    nonFulfilled.sort(
      (a, b) => Date.parse(b.created_date) - Date.parse(a.created_date),
    );
    fulfilled.sort(
      (a, b) => Date.parse(b.created_date) - Date.parse(a.created_date),
    );

    return [...nonFulfilled, ...fulfilled];
  }

  const fetchMedications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const meds = await api.getMedications(token);
      setMedications(sortMedications(meds));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMedication = () => {
    setModalVisible(true);
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    setAuthToken(null);
  };

  const renderItem = ({item}: {item: Medication}) => (
    <MedicationItem medication={item} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Medications</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMedication}>
          <Icon name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Medication</Text>
        </TouchableOpacity>
        <FlatList
          data={medications}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Icon name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <AddMedicationModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={fetchMedications}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Main;
