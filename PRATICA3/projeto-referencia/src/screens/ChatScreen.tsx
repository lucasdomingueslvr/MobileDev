import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageBubble } from '../components/MessageBubble';
import { messageRepository } from '../repositories/messageRepository';
import { Conversation, Message } from '../types';

interface Props {
  conversation: Conversation;
  onBack: () => void;
  sendMessage: (conversation: Conversation, body: string) => Promise<Message>;
  onIncoming: (cb: (message: Message) => void) => () => void;
}

export function ChatScreen({
  conversation,
  onBack,
  sendMessage,
  onIncoming,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<Message>>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let active = true;
    messageRepository.findByConversation(conversation.id).then((loaded) => {
      if (active) {
        setMessages(loaded);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [conversation.id]);

  useEffect(() => {
    return onIncoming((message) => {
      if (message.conversationId === conversation.id) {
        setMessages((prev) => [...prev, message]);
      }
    });
  }, [conversation.id, onIncoming]);

  async function send() {
    const body = input.trim();
    if (!body) return; // RN09: não envia corpo vazio ou só com espaços.

    const message = await sendMessage(conversation, body);
    setMessages((prev) => [...prev, message]);
    setInput('');
  }

  function clearHistory() {
    Alert.alert(
      'Limpar histórico',
      'Apagar todas as mensagens desta conversa? A conversa será mantida.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await messageRepository.deleteByConversation(conversation.id);
            setMessages([]);
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {conversation.name}
        </Text>
        <TouchableOpacity onPress={clearHistory}>
          <Text style={styles.clear}>🗑</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma mensagem ainda.</Text>
          }
        />
      )}

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Mensagem"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={send}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ece5dd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0b6e4f',
  },
  back: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  clear: {
    fontSize: 18,
  },
  loading: {
    marginTop: 24,
  },
  list: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  input: {
    flex: 1,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#0b6e4f',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});
