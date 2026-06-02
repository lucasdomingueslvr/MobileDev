import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ title, onPress, variant = 'primary' }) {
  return (
    <TouchableOpacity 
      style={[styles.button, variant === 'secondary' ? styles.secondary : styles.primary]} 
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10, width: '100%' },
  primary: { backgroundColor: '#1e3a8a' },
  secondary: { backgroundColor: '#64748b' },
  text: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});