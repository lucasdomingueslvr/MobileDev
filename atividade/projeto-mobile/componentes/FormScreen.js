import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,ScrollView,ActivityIndicator,} from 'react-native';
import { db } from '../src/config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function FormScreen({ navigation }) {
  const [carName, setCarName] = useState('');
  const [clientName, setClientName] = useState('');
  const [rentValue, setRentValue] = useState('');
  const [rentDate, setRentDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!carName || !clientName || !rentValue || !rentDate) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const rentalData = {
      carName,
      clientName,
      rentValue: parseFloat(rentValue),
      rentDate,
      createdAt: new Date().toISOString(),
    };

    setLoading(true);
    try {
      await addDoc(collection(db, 'alugueis'), rentalData);
      Alert.alert('Sucesso', 'Aluguel registrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      setCarName('');
      setClientName('');
      setRentValue('');
      setRentDate('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Aluguel</Text>

      <Text style={styles.label}>Nome do Carro</Text>
      <TextInput
        style={styles.input}
        value={carName}
        onChangeText={setCarName}
        placeholder=""
      />

      <Text style={styles.label}>Nome do Cliente</Text>
      <TextInput
        style={styles.input}
        value={clientName}
        onChangeText={setClientName}
        placeholder=""
      />

      <Text style={styles.label}>Valor do Aluguel (R$)</Text>
      <TextInput
        style={styles.input}
        value={rentValue}
        onChangeText={setRentValue}
        placeholder=""
        keyboardType="numeric"
      />

      <Text style={styles.label}>Data do Aluguel</Text>
      <TextInput
        style={styles.input}
        value={rentDate}
        onChangeText={setRentDate}
        placeholder=""
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar Aluguel</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2196F3',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});