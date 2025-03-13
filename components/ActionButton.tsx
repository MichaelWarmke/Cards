import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TableColors } from '../constants/TableStyles';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[styles.button, disabled && styles.disabledButton]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: TableColors.woodBrown,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: TableColors.goldAccent,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TableColors.white,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
    borderColor: '#999',
    opacity: 0.7,
  }
});

export default ActionButton;