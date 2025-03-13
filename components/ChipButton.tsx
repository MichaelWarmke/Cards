import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { TableColors } from '../constants/TableStyles';

interface ChipButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  size?: number;
}

const ChipButton: React.FC<ChipButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  color = TableColors.chipRed,
  size = 40
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      style={[
        styles.chipButton, 
        { backgroundColor: color, width: size, height: size, borderRadius: size/2 },
        disabled && styles.disabledChip
      ]}
    >
      <View style={styles.chipInner}>
        <Text style={styles.chipText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chipButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: TableColors.white,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  chipInner: {
    width: '80%',
    height: '80%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    color: TableColors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  disabledChip: {
    opacity: 0.5,
    backgroundColor: '#888',
  }
});

export default ChipButton;