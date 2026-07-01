import './src/polyfills';

import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { settingsRepository } from './src/repositories/settingsRepository';
import { conversationRepository } from './src/repositories/conversationRepository';
import { useMqtt } from './src/hooks/useMqtt';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ConversationsScreen } from './src/screens/ConversationsScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import {
  Conversation,
  CreateConversationInput,
  Settings,
} from './src/types';

type Screen = 'settings' | 'conversations' | 'chat';

export default function App() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [screen, setScreen] = useState<Screen>('conversations');
  const [active, setActive] = useState<Conversation | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const { status, sendMessage, subscribe, unsubscribe, onIncoming } = useMqtt(
    settings,
    conversations
  );

  useEffect(() => {
    settingsRepository.get().then((saved) => {
      setSettings(saved);
      setScreen(saved ? 'conversations' : 'settings');
      setLoadingSettings(false);
    });
    conversationRepository.findAll().then((all) => {
      setConversations(all);
      setLoadingConversations(false);
    });
  }, []);

  const handleSaved = useCallback((saved: Settings) => {
    setSettings(saved);
    setScreen('conversations');
  }, []);

  const handleCreate = useCallback(
    async (input: CreateConversationInput) => {
      const conversation = await conversationRepository.create(input);
      setConversations((prev) => [conversation, ...prev]);
      subscribe(conversation.topic);
    },
    [subscribe]
  );

  const handleDelete = useCallback(
    async (conversation: Conversation) => {
      await conversationRepository.delete(conversation.id);
      unsubscribe(conversation.topic);
      setConversations((prev) => prev.filter((c) => c.id !== conversation.id));
      if (active?.id === conversation.id) {
        setActive(null);
        setScreen('conversations');
      }
    },
    [unsubscribe, active]
  );

  const openConversation = useCallback((conversation: Conversation) => {
    setActive(conversation);
    setScreen('chat');
  }, []);

  if (loadingSettings) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {screen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onSaved={handleSaved}
          onBack={settings ? () => setScreen('conversations') : undefined}
        />
      )}
      {screen === 'conversations' && (
        <ConversationsScreen
          conversations={conversations}
          status={status}
          loading={loadingConversations}
          onOpen={openConversation}
          onOpenSettings={() => setScreen('settings')}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
      )}
      {screen === 'chat' && active && (
        <ChatScreen
          conversation={active}
          onBack={() => setScreen('conversations')}
          sendMessage={sendMessage}
          onIncoming={onIncoming}
        />
      )}
    </SafeAreaProvider>
  );
}
