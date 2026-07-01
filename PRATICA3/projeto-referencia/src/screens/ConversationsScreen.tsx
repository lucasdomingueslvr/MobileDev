import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusIndicator } from '../components/StatusIndicator';
import { ConversationItem } from '../components/ConversationItem';
import { NewConversationModal } from '../components/NewConversationModal';
import {
  ConnectionStatus,
  Conversation,
  CreateConversationInput,
} from '../types';

interface Props {
  conversations: Conversation[];
  status: ConnectionStatus;
  loading: boolean;
  onOpen: (conversation: Conversation) => void;
  onOpenSettings: () => void;
  onCreate: (input: CreateConversationInput) => Promise<void>;
  onDelete: (conversation: Conversation) => Promise<void>;
}

export function ConversationsScreen({
  conversations,
  status,
  loading,
  onOpen,
  onOpenSettings,
  onCreate,
  onDelete,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  function confirmDelete(conversation: Conversation) {
    Alert.alert(
      'Excluir conversa',
      `Excluir "${conversation.name}"? O histórico será removido.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            onDelete(conversation);
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversas</Text>
        <TouchableOpacity onPress={onOpenSettings}>
          <Text style={styles.settings}>Ajustes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusRow}>
        <StatusIndicator status={status} />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <ConversationItem
              conversation={item}
              onPress={onOpen}
              onLongPress={confirmDelete}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma conversa ainda.</Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+ Nova conversa</Text>
      </TouchableOpacity>

      <NewConversationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={onCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  settings: {
    fontSize: 15,
    color: '#0b6e4f',
    fontWeight: '600',
  },
  statusRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loading: {
    marginTop: 24,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#0b6e4f',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
  },
  fabText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
