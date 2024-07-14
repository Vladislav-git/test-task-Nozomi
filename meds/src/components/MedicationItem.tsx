import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MedicationDetailsModal from './MedicationDetailsModal';
import {Medication} from '../types/types';
import {useDispatch} from 'react-redux';
import {update} from '../redux/slice';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  medication: Medication;
}

const MedicationItem: React.FC<Props> = ({medication}) => {
  const dispatch = useDispatch();

  const [isModalVisible, setModalVisible] = useState(false);

  const handleIncrement = async () => {
    const token = await AsyncStorage.getItem('token');
    await api.updateMedication(
      medication.id,
      {
        name: medication.name,
        description: medication.description,
        count: medication.count + 1,
        destination_count: medication.destination_count,
      },
      String(token),
    );
    dispatch(update());
  };

  const handleDecrement = async () => {
    const token = await AsyncStorage.getItem('token');
    await api.updateMedication(
      medication.id,
      {
        name: medication.name,
        description: medication.description,
        count: medication.count - 1,
        destination_count: medication.destination_count,
      },
      String(token),
    );
    dispatch(update());
  };

  return (
    <View
      style={[
        styles.container,
        medication.count >= medication.destination_count && styles.fulfilled,
      ]}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => setModalVisible(true)}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{medication.name}</Text>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              {medication.count}/{medication.destination_count}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{medication.description}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.decrementButton]}
            onPress={handleDecrement}
            disabled={medication.count === 0}>
            <Icon
              name="remove-circle-outline"
              size={24}
              color={medication.count === 0 ? '#999' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.incrementButton]}
            onPress={handleIncrement}
            disabled={medication.count >= medication.destination_count}>
            <Icon
              name="add-circle-outline"
              size={24}
              color={
                medication.count >= medication.destination_count
                  ? '#999'
                  : '#fff'
              }
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <MedicationDetailsModal
        medicationId={medication.id}
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fulfilled: {
    backgroundColor: '#e0ffe0',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  countContainer: {
    backgroundColor: '#f0f0f5',
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  decrementButton: {
    backgroundColor: '#f44336',
  },
  incrementButton: {
    backgroundColor: '#4CAF50',
  },
});

export default MedicationItem;
