import { StyleSheet, Text, View } from 'react-native';
import { Message } from '../types';

export function MessageBubble({ message }: { message: Message }) {
  const isSent = message.direction === 'sent';

  return (
    <View
      style={[
        styles.row,
        isSent ? styles.rowSent : styles.rowReceived,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isSent ? styles.bubbleSent : styles.bubbleReceived,
        ]}
      >
        {!isSent && <Text style={styles.sender}>{message.sender}</Text>}
        <Text style={styles.body}>{message.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  rowSent: {
    justifyContent: 'flex-end',
  },
  rowReceived: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bubbleSent: {
    backgroundColor: '#dcf8c6',
  },
  bubbleReceived: {
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  sender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0b6e4f',
    marginBottom: 2,
  },
  body: {
    fontSize: 15,
    color: '#222',
  },
});
