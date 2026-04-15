import React, { useState, useEffect } from 'react';
import {View,Text,FlatList,StyleSheet,ActivityIndicator,} from 'react-native';
import { db } from '../src/config/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function ListScreen() {
  const [alugueis, setAlugueis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'alugueis'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlugueis(lista);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar aluguéis:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.carName}>{item.carName}</Text>
      <Text style={styles.client}>Cliente: {item.clientName}</Text>
      <Text style={styles.value}>Valor: R$ {item.rentValue?.toFixed(2)}</Text>
      <Text style={styles.date}>Data: {item.rentDate}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Aluguéis Registrados</Text>
      {alugueis.length === 0 ? (
        <Text style={styles.empty}>Nenhum aluguel cadastrado.</Text>
      ) : (
        <FlatList
          data={alugueis}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#2196F3',
    color: '#fff',
    textAlign: 'center',
  },
  listContent: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  client: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  value: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 3,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});