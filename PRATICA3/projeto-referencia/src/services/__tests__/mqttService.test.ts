type Handler = (...args: any[]) => void;

class FakeClient {
  handlers: Record<string, Handler[]> = {};
  subscribe = jest.fn();
  unsubscribe = jest.fn();
  publish = jest.fn();
  end = jest.fn();

  on(event: string, cb: Handler) {
    (this.handlers[event] ||= []).push(cb);
    return this;
  }

  emit(event: string, ...args: any[]) {
    (this.handlers[event] || []).forEach((cb) => cb(...args));
  }
}

let lastClient: FakeClient;
let connectCalls: number;

const mockConnect = jest.fn((..._args: any[]) => {
  lastClient = new FakeClient();
  connectCalls += 1;
  return lastClient;
});

jest.mock('mqtt', () => ({
  __esModule: true,
  default: { connect: (...args: any[]) => mockConnect(...args) },
}));

import { MqttConnectConfig, MqttPayload } from '../../types';

const CONFIG: MqttConnectConfig = {
  host: 'broker.hivemq.com',
  port: 8884,
  useSsl: true,
  clientId: 'me',
};

let mqttService: typeof import('../mqttService').mqttService;

beforeEach(() => {
  jest.resetModules();
  connectCalls = 0;
  mockConnect.mockClear();
  mqttService = require('../mqttService').mqttService;
});

describe('MqttService', () => {
  it('connect com sucesso: status connected e só uma conexão', async () => {
    const promise = mqttService.connect(CONFIG);
    lastClient.emit('connect');
    await promise;
    expect(mqttService.getStatus()).toBe('connected');
    expect(connectCalls).toBe(1);
  });

  it('connect com falha inicial rejeita com CONNECTION_FAILED', async () => {
    const promise = mqttService.connect(CONFIG);
    lastClient.emit('error', new Error('refused'));
    await expect(promise).rejects.toMatchObject({ code: 'CONNECTION_FAILED' });
    expect(mqttService.getStatus()).toBe('error');
  });

  it('subscribe / unsubscribe chamam o método do cliente', async () => {
    const promise = mqttService.connect(CONFIG);
    lastClient.emit('connect');
    await promise;
    mqttService.subscribe('sala/a');
    mqttService.unsubscribe('sala/a');
    expect(lastClient.subscribe).toHaveBeenCalledWith('sala/a');
    expect(lastClient.unsubscribe).toHaveBeenCalledWith('sala/a');
  });

  it('publish publica o payload serializado em JSON', async () => {
    const promise = mqttService.connect(CONFIG);
    lastClient.emit('connect');
    await promise;
    const payload: MqttPayload = {
      clientId: 'me',
      sender: 'Rafael',
      body: 'oi',
      sentAt: '2026-06-03T00:00:00.000Z',
    };
    mqttService.publish('sala/a', payload);
    expect(lastClient.publish).toHaveBeenCalledWith(
      'sala/a',
      JSON.stringify(payload)
    );
  });

  it('onMessage com payload válido entrega (topic, payload) desserializado', async () => {
    const promise = mqttService.connect(CONFIG);
    lastClient.emit('connect');
    await promise;
    const cb = jest.fn();
    mqttService.onMessage(cb);
    const payload: MqttPayload = {
      clientId: 'other',
      sender: 'Ana',
      body: 'olá',
      sentAt: '2026-06-03T00:00:00.000Z',
    };
    lastClient.emit('message', 'sala/a', Buffer.from(JSON.stringify(payload)));
    expect(cb).toHaveBeenCalledWith('sala/a', payload);
  });

  it('onMessage com JSON inválido não quebra e não chama callback', async () => {
    const promise = mqttService.connect(CONFIG);
    lastClient.emit('connect');
    await promise;
    const cb = jest.fn();
    mqttService.onMessage(cb);
    expect(() =>
      lastClient.emit('message', 'sala/a', Buffer.from('not json'))
    ).not.toThrow();
    expect(cb).not.toHaveBeenCalled();
  });

  it('onStatusChange notifica e o cancelamento funciona', async () => {
    const cb = jest.fn();
    const off = mqttService.onStatusChange(cb);
    const promise = mqttService.connect(CONFIG);
    lastClient.emit('connect');
    await promise;
    expect(cb).toHaveBeenCalledWith('connecting');
    expect(cb).toHaveBeenCalledWith('connected');
    cb.mockClear();
    off();
    mqttService.disconnect();
    expect(cb).not.toHaveBeenCalled();
  });
});
