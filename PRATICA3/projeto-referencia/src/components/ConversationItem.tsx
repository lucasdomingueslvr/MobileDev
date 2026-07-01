import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Conversation } from '../types';

interface Props {
  conversation: Conversation;
  onPress: (conversation: Conversation) => void;
  onLongPress: (conversation: Conversation) => void;
}

export function ConversationItem({ conversation, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(conversation)}
      onLongPress={() => onLongPress(conversation)}
    >
      <Text style={styles.name}>{conversation.name}</Text>
      <Text style={styles.topic}>{conversation.topic}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  topic: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});
