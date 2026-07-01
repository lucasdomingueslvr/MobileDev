import mqtt from 'mqtt';
import type { MqttClient } from 'mqtt';
import {
  ConnectionStatus,
  MqttConnectConfig,
  MqttPayload,
  createAppError,
} from '../types';

type MessageListener = (topic: string, payload: MqttPayload) => void;
type StatusListener = (status: ConnectionStatus) => void;

export interface MqttService {
  connect(config: MqttConnectConfig): Promise<void>;
  disconnect(): void;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, payload: MqttPayload): void;
  onMessage(cb: MessageListener): () => void;
  getStatus(): ConnectionStatus;
  onStatusChange(cb: StatusListener): () => void;
}

let client: MqttClient | null = null;
let status: ConnectionStatus = 'disconnected';

const messageListeners = new Set<MessageListener>();
const statusListeners = new Set<StatusListener>();

function setStatus(next: ConnectionStatus): void {
  status = next;
  statusListeners.forEach((cb) => cb(status));
}

function buildUrl(config: MqttConnectConfig): string {
  const scheme = config.useSsl ? 'wss' : 'ws';
  return `${scheme}://${config.host}:${config.port}/mqtt`;
}

function connect(config: MqttConnectConfig): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      if (client) {
        client.end(true);
        client = null;
      }

      setStatus('connecting');

      const c = mqtt.connect(buildUrl(config), {
        clientId: config.clientId,
        reconnectPeriod: 5000,
      });
      client = c;

      let settled = false;

      c.on('connect', () => {
        setStatus('connected');
        if (!settled) {
          settled = true;
          resolve();
        }
      });

      c.on('reconnect', () => setStatus('connecting'));

      c.on('close', () => {
        if (settled) setStatus('disconnected');
      });

      c.on('error', (err) => {
        setStatus('error');
        if (!settled) {
          settled = true;
          reject(
            createAppError(
              'CONNECTION_FAILED',
              err?.message || 'Falha ao conectar ao broker.'
            )
          );
        }
      });

      c.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString()) as MqttPayload;
          messageListeners.forEach((cb) => cb(topic, payload));
        } catch {
          // payload inválido é ignorado
        }
      });
    } catch (err) {
      // connect nunca lança síncrono: host malformado vira Promise rejeitada (RNF07).
      setStatus('error');
      reject(
        createAppError(
          'CONNECTION_FAILED',
          err instanceof Error ? err.message : 'Falha ao conectar ao broker.'
        )
      );
    }
  });
}

function disconnect(): void {
  if (client) {
    client.end(true);
    client = null;
  }
  setStatus('disconnected');
}

function subscribe(topic: string): void {
  client?.subscribe(topic);
}

function unsubscribe(topic: string): void {
  client?.unsubscribe(topic);
}

function publish(topic: string, payload: MqttPayload): void {
  client?.publish(topic, JSON.stringify(payload));
}

function onMessage(cb: MessageListener): () => void {
  messageListeners.add(cb);
  return () => messageListeners.delete(cb);
}

function getStatus(): ConnectionStatus {
  return status;
}

function onStatusChange(cb: StatusListener): () => void {
  statusListeners.add(cb);
  return () => statusListeners.delete(cb);
}

export const mqttService: MqttService = {
  connect,
  disconnect,
  subscribe,
  unsubscribe,
  publish,
  onMessage,
  getStatus,
  onStatusChange,
};
