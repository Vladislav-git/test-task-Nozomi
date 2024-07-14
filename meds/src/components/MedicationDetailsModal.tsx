import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Medication} from '../types/types';
import {useDispatch} from 'react-redux';
import {update} from '../redux/slice';

interface MedicationDetailsModalProps {
  medicationId: number;
  visible: boolean;
  onClose: () => void;
}

const MedicationDetailsModal: React.FC<MedicationDetailsModalProps> = ({
  medicationId,
  visible,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [medication, setMedication] = useState<Medication | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currentCount, setCurrentCount] = useState(0);
  const [destinationCount, setDestinationCount] = useState(0);
  const [authToken, setAuthToken] = useState('');

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      setAuthToken(token);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (visible) {
      fetchMedicationDetails();
    }
  }, [visible]);

  const fetchMedicationDetails = async () => {
    try {
      const med = await api.getMedicationById(medicationId, authToken);
      setMedication(med);
      setName(med.name);
      setDescription(med.description);
      setCurrentCount(med.count);
      setDestinationCount(med.destination_count);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      if (medication) {
        await api.updateMedication(
          medication.id,
          {
            name,
            description,
            count: currentCount,
            destination_count: destinationCount,
          },
          authToken,
        );
        dispatch(update());
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (medication) {
        await api.deleteMedication(medication.id, authToken);
        dispatch(update());
        onClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!medication) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Medication Details</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Medication Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter medication name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter medication description"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Current Count</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter current count"
            value={currentCount.toString()}
            onChangeText={text => {
              if (text === '') {
                setCurrentCount(0);
              } else if (Number(text) < medication.destination_count) {
                setCurrentCount(parseInt(text));
              } else {
                setCurrentCount(medication.destination_count);
              }
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Destination Count</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination count"
            value={destinationCount.toString()}
            onChangeText={text => {
              if (text === '') {
                setDestinationCount(0);
              } else {
                setDestinationCount(parseInt(text));
              }
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#FF3B30',
  },
  tertiaryButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 14,
    fontSize: 18,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
});

export default MedicationDetailsModal;
