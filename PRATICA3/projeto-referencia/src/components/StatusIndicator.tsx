import { StyleSheet, Text, View } from 'react-native';
import { ConnectionStatus } from '../types';

const LABELS: Record<ConnectionStatus, string> = {
  connected: 'Conectado',
  connecting: 'Conectando…',
  disconnected: 'Desconectado',
  error: 'Erro de conexão',
};

const COLORS: Record<ConnectionStatus, string> = {
  connected: '#2e7d32',
  connecting: '#f9a825',
  disconnected: '#9e9e9e',
  error: '#c62828',
};

export function StatusIndicator({ status }: { status: ConnectionStatus }) {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: COLORS[status] }]} />
      <Text style={styles.label}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    color: '#444',
  },
});
