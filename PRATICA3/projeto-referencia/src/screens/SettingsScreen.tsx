import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { settingsRepository } from '../repositories/settingsRepository';
import { DEFAULT_BROKER } from '../config';
import { Settings } from '../types';

interface Props {
  settings: Settings | null;
  onSaved: (settings: Settings) => void;
  onBack?: () => void;
}

// RN11: host é só domínio ou IP — sem espaços e sem esquema (ws://, wss://, http://) nem caminho.
function hostError(host: string): string | null {
  if (!host.trim()) return 'Informe o host do broker.';
  if (/\s/.test(host)) return 'O host não pode conter espaços.';
  if (/:\/\//.test(host)) {
    return 'O host não pode conter esquema (ws://, wss://, http://).';
  }
  if (host.includes('/')) return 'O host não pode conter caminho (/).';
  return null;
}

export function SettingsScreen({ settings, onSaved, onBack }: Props) {
  const [nickname, setNickname] = useState(settings?.nickname ?? '');
  const [host, setHost] = useState(settings?.brokerHost ?? DEFAULT_BROKER.host);
  const [port, setPort] = useState(
    String(settings?.brokerPort ?? DEFAULT_BROKER.port)
  );
  const [useSsl, setUseSsl] = useState(settings?.useSsl ?? DEFAULT_BROKER.useSsl);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!nickname.trim()) {
      setError('Informe um apelido.');
      return;
    }
    const hErr = hostError(host);
    if (hErr) {
      setError(hErr);
      return;
    }
    const portNumber = Number(port);
    if (!portNumber || Number.isNaN(portNumber)) {
      setError('Informe uma porta numérica válida.');
      return;
    }

    try {
      const saved = await settingsRepository.save({
        nickname: nickname.trim(),
        brokerHost: host.trim(),
        brokerPort: portNumber,
        useSsl,
      });
      setError(null);
      onSaved(saved);
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível salvar as configurações.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajustes</Text>

      <Text style={styles.label}>Apelido</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="Seu apelido"
      />

      <Text style={styles.label}>Host do broker</Text>
      <TextInput
        style={styles.input}
        value={host}
        onChangeText={setHost}
        autoCapitalize="none"
        placeholder="broker.hivemq.com"
      />

      <Text style={styles.label}>Porta</Text>
      <TextInput
        style={styles.input}
        value={port}
        onChangeText={setPort}
        keyboardType="numeric"
        placeholder="8884"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Usar SSL (WSS)</Text>
        <Switch value={useSsl} onValueChange={setUseSsl} />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.primary} onPress={save}>
        <Text style={styles.primaryText}>Salvar</Text>
      </TouchableOpacity>

      {onBack && (
        <TouchableOpacity style={styles.secondary} onPress={onBack}>
          <Text style={styles.secondaryText}>Voltar</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  error: {
    color: '#c62828',
    marginTop: 12,
  },
  primary: {
    backgroundColor: '#0b6e4f',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondary: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryText: {
    color: '#0b6e4f',
    fontSize: 15,
  },
});
