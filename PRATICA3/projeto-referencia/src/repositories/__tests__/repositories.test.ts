import { FakeDatabase } from '../../database/__mocks__/fakeDatabase';

let mockDb: FakeDatabase;
let mockUuidCounter = 0;

jest.mock('../../database/database', () => ({
  getDatabase: () => Promise.resolve(mockDb),
}));

jest.mock('expo-crypto', () => ({
  randomUUID: () => `uuid-${++mockUuidCounter}`,
}));

import { settingsRepository } from '../settingsRepository';
import { conversationRepository } from '../conversationRepository';
import { messageRepository } from '../messageRepository';

beforeEach(() => {
  mockDb = new FakeDatabase();
  mockUuidCounter = 0;
});

describe('settingsRepository', () => {
  it('save primeira vez gera clientId e persiste os dados', async () => {
    const saved = await settingsRepository.save({ nickname: 'Rafael' });
    expect(saved.clientId).toBeTruthy();
    expect(saved.nickname).toBe('Rafael');
    const got = await settingsRepository.get();
    expect(got?.nickname).toBe('Rafael');
  });

  it('save segunda vez mantém o mesmo clientId', async () => {
    const first = await settingsRepository.save({ nickname: 'Rafael' });
    const second = await settingsRepository.save({ nickname: 'Marinho' });
    expect(second.clientId).toBe(first.clientId);
    expect(second.nickname).toBe('Marinho');
  });

  it('save sem nickname lança AppError INVALID_INPUT', async () => {
    await expect(settingsRepository.save({ nickname: '' })).rejects.toMatchObject(
      { code: 'INVALID_INPUT' }
    );
  });
});

describe('conversationRepository', () => {
  it('create válido retorna conversa com id e createdAt', async () => {
    const c = await conversationRepository.create({
      name: 'Sala 1',
      topic: 'mensagemmqtt/sala1',
    });
    expect(c.id).toBeTruthy();
    expect(c.createdAt).toBeTruthy();
  });

  it('create com tópico repetido lança TOPIC_ALREADY_EXISTS', async () => {
    await conversationRepository.create({ name: 'A', topic: 'sala/x' });
    await expect(
      conversationRepository.create({ name: 'B', topic: 'sala/x' })
    ).rejects.toMatchObject({ code: 'TOPIC_ALREADY_EXISTS' });
  });

  it('findAll vazio retorna []', async () => {
    expect(await conversationRepository.findAll()).toEqual([]);
  });

  it('findAll com duas ordena por created_at DESC', async () => {
    const a = await conversationRepository.create({ name: 'A', topic: 't/a' });
    await new Promise((r) => setTimeout(r, 2));
    const b = await conversationRepository.create({ name: 'B', topic: 't/b' });
    const all = await conversationRepository.findAll();
    expect(all[0].id).toBe(b.id);
    expect(all[1].id).toBe(a.id);
  });

  it('findByTopic retorna a conversa certa ou null', async () => {
    const a = await conversationRepository.create({ name: 'A', topic: 't/a' });
    expect((await conversationRepository.findByTopic('t/a'))?.id).toBe(a.id);
    expect(await conversationRepository.findByTopic('inexistente')).toBeNull();
  });

  it('delete remove a conversa e suas mensagens (cascata)', async () => {
    const c = await conversationRepository.create({ name: 'A', topic: 't/a' });
    await messageRepository.create({
      conversationId: c.id,
      sender: 'Rafael',
      body: 'oi',
      direction: 'sent',
    });
    await conversationRepository.delete(c.id);
    expect(await conversationRepository.findById(c.id)).toBeNull();
    expect(await messageRepository.findByConversation(c.id)).toEqual([]);
  });
});

describe('messageRepository', () => {
  it('create retorna mensagem com id e createdAt', async () => {
    const m = await messageRepository.create({
      conversationId: 'c1',
      sender: 'Rafael',
      body: 'oi',
      direction: 'sent',
    });
    expect(m.id).toBeTruthy();
    expect(m.createdAt).toBeTruthy();
  });

  it('findByConversation ordena por created_at ASC', async () => {
    const m1 = await messageRepository.create({
      conversationId: 'c1',
      sender: 'A',
      body: 'primeira',
      direction: 'sent',
    });
    await new Promise((r) => setTimeout(r, 2));
    const m2 = await messageRepository.create({
      conversationId: 'c1',
      sender: 'B',
      body: 'segunda',
      direction: 'received',
    });
    const list = await messageRepository.findByConversation('c1');
    expect(list.map((m) => m.id)).toEqual([m1.id, m2.id]);
  });

  // v1.1 — docs/05_desenvolvimento_backend_limpar_historico.md, seção 5.1
  describe('deleteByConversation (v1.1)', () => {
    it('com mensagens: findByConversation passa a retornar []', async () => {
      await messageRepository.create({
        conversationId: 'c1',
        sender: 'A',
        body: 'x',
        direction: 'sent',
      });
      await messageRepository.deleteByConversation('c1');
      expect(await messageRepository.findByConversation('c1')).toEqual([]);
    });

    it('a conversa permanece', async () => {
      const c = await conversationRepository.create({ name: 'A', topic: 't/a' });
      await messageRepository.create({
        conversationId: c.id,
        sender: 'A',
        body: 'x',
        direction: 'sent',
      });
      await messageRepository.deleteByConversation(c.id);
      expect(await conversationRepository.findById(c.id)).not.toBeNull();
    });

    it('não afeta outras conversas', async () => {
      await messageRepository.create({
        conversationId: 'c1',
        sender: 'A',
        body: 'x',
        direction: 'sent',
      });
      await messageRepository.create({
        conversationId: 'c2',
        sender: 'A',
        body: 'y',
        direction: 'sent',
      });
      await messageRepository.deleteByConversation('c1');
      expect(await messageRepository.findByConversation('c2')).toHaveLength(1);
    });

    it('sem mensagens não lança erro (idempotente)', async () => {
      await expect(
        messageRepository.deleteByConversation('vazia')
      ).resolves.toBeUndefined();
    });
  });
});
