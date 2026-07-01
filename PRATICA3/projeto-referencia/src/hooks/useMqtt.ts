import { useCallback, useEffect, useRef, useState } from 'react';
import { mqttService } from '../services/mqttService';
import { conversationRepository } from '../repositories/conversationRepository';
import { messageRepository } from '../repositories/messageRepository';
import {
  ConnectionStatus,
  Conversation,
  Message,
  MqttPayload,
  Settings,
} from '../types';

type IncomingListener = (message: Message) => void;

export interface UseMqtt {
  status: ConnectionStatus;
  sendMessage(conversation: Conversation, body: string): Promise<Message>;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  onIncoming(cb: IncomingListener): () => void;
}

export function useMqtt(
  settings: Settings | null,
  conversations: Conversation[]
): UseMqtt {
  const [status, setStatus] = useState<ConnectionStatus>(
    mqttService.getStatus()
  );

  const settingsRef = useRef<Settings | null>(settings);
  settingsRef.current = settings;

  const incomingListeners = useRef(new Set<IncomingListener>());

  const onIncoming = useCallback((cb: IncomingListener) => {
    incomingListeners.current.add(cb);
    return () => {
      incomingListeners.current.delete(cb);
    };
  }, []);

  // Conexão única: abre quando há settings válidos. Falha não derruba o app (RNF07).
  useEffect(() => {
    if (!settings) return;

    const offStatus = mqttService.onStatusChange(setStatus);

    mqttService
      .connect({
        host: settings.brokerHost,
        port: settings.brokerPort,
        useSsl: settings.useSsl,
        clientId: settings.clientId,
      })
      .catch(() => setStatus('error'));

    return () => {
      offStatus();
      mqttService.disconnect();
    };
  }, [settings?.brokerHost, settings?.brokerPort, settings?.useSsl, settings?.clientId]);

  // Recebe mensagens de qualquer tópico, descarta o eco próprio (RN04) e salva.
  useEffect(() => {
    const off = mqttService.onMessage(async (topic, payload: MqttPayload) => {
      const own = settingsRef.current?.clientId;
      if (own && payload.clientId === own) return;

      const conversation = await conversationRepository.findByTopic(topic);
      if (!conversation) return;

      const message = await messageRepository.create({
        conversationId: conversation.id,
        sender: payload.sender,
        body: payload.body,
        direction: 'received',
      });

      incomingListeners.current.forEach((cb) => cb(message));
    });

    return off;
  }, []);

  // Assina o tópico de cada conversa salva na conexão existente.
  useEffect(() => {
    if (status !== 'connected') return;
    conversations.forEach((c) => mqttService.subscribe(c.topic));
  }, [status, conversations]);

  const subscribe = useCallback((topic: string) => {
    mqttService.subscribe(topic);
  }, []);

  const unsubscribe = useCallback((topic: string) => {
    mqttService.unsubscribe(topic);
  }, []);

  const sendMessage = useCallback(
    async (conversation: Conversation, body: string): Promise<Message> => {
      const current = settingsRef.current;
      if (!current) {
        throw new Error('Configurações ausentes.');
      }

      const sentAt = new Date().toISOString();
      const payload: MqttPayload = {
        clientId: current.clientId,
        sender: current.nickname,
        body,
        sentAt,
      };

      mqttService.publish(conversation.topic, payload);

      return messageRepository.create({
        conversationId: conversation.id,
        sender: current.nickname,
        body,
        direction: 'sent',
      });
    },
    []
  );

  return { status, sendMessage, subscribe, unsubscribe, onIncoming };
}
