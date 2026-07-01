import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CreateConversationInput } from '../types';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (input: CreateConversationInput) => Promise<void>;
}

// RN08: tópico não pode ser vazio, conter espaços ou os curingas MQTT # e +.
function topicError(topic: string): string | null {
  if (!topic.trim()) return 'Informe um tópico.';
  if (/\s/.test(topic)) return 'O tópico não pode conter espaços.';
  if (topic.includes('#') || topic.includes('+')) {
    return 'O tópico não pode conter os curingas # ou +.';
  }
  return null;
}

export function NewConversationModal({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName('');
    setTopic('');
    setError(null);
  }

  function close() {
    reset();
    onClose();
  }

  async function submit() {
    if (!name.trim()) {
      setError('Informe um nome para a conversa.');
      return;
    }
    const tErr = topicError(topic);
    if (tErr) {
      setError(tErr);
      return;
    }

    try {
      await onCreate({ name: name.trim(), topic: topic.trim() });
      close();
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível criar a conversa.');
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Nova conversa</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex.: Sala 1"
          />

          <Text style={styles.label}>Tópico</Text>
          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
            autoCapitalize="none"
            placeholder="Ex.: mensagemmqtt/sala1"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={close}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.primary]}
              onPress={submit}
            >
              <Text style={[styles.buttonText, styles.primaryText]}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#555',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
  },
  error: {
    color: '#c62828',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 8,
  },
  primary: {
    backgroundColor: '#0b6e4f',
  },
  buttonText: {
    fontSize: 15,
    color: '#333',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
