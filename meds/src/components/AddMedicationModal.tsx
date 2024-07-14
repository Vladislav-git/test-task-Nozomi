import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {update} from '../redux/slice';

interface AddMedicationModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [initialCount, setInitialCount] = useState(0);
  const [destinationCount, setDestinationCount] = useState(0);

  const handleAdd = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await api.addMedication(
        {
          name,
          description,
          count: initialCount,
          destination_count: destinationCount,
        },
        token,
      );
      dispatch(update());
      onAdd();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Medication</Text>
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
          <Text style={styles.inputTitle}>Initial Count</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter initial count"
            keyboardType="numeric"
            value={initialCount.toString()}
            onChangeText={text => {
              if (text === '') {
                setInitialCount(0);
              } else if (Number(text) < destinationCount) {
                setInitialCount(parseInt(text));
              } else {
                setInitialCount(destinationCount);
              }
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Destination Count</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination count"
            keyboardType="numeric"
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
            onPress={handleAdd}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
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

export default AddMedicationModal;
