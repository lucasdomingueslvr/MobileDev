import * as Crypto from 'expo-crypto';
import { getDatabase } from '../database/database';
import {
  Conversation,
  CreateConversationInput,
  createAppError,
} from '../types';

interface ConversationRow {
  id: string;
  name: string;
  topic: string;
  created_at: string;
}

export interface ConversationRepository {
  create(input: CreateConversationInput): Promise<Conversation>;
  findAll(): Promise<Conversation[]>;
  findById(id: string): Promise<Conversation | null>;
  findByTopic(topic: string): Promise<Conversation | null>;
  delete(id: string): Promise<void>;
}

function rowToConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    name: row.name,
    topic: row.topic,
    createdAt: row.created_at,
  };
}

async function create(
  input: CreateConversationInput
): Promise<Conversation> {
  const db = await getDatabase();

  const existing = await findByTopic(input.topic);
  if (existing) {
    throw createAppError(
      'TOPIC_ALREADY_EXISTS',
      `Já existe uma conversa com o tópico "${input.topic}".`
    );
  }

  const conversation: Conversation = {
    id: Crypto.randomUUID(),
    name: input.name,
    topic: input.topic,
    createdAt: new Date().toISOString(),
  };

  await db.runAsync(
    'INSERT INTO conversations (id, name, topic, created_at) VALUES (?, ?, ?, ?)',
    [conversation.id, conversation.name, conversation.topic, conversation.createdAt]
  );

  return conversation;
}

async function findAll(): Promise<Conversation[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ConversationRow>(
    'SELECT id, name, topic, created_at FROM conversations ORDER BY created_at DESC'
  );
  return rows.map(rowToConversation);
}

async function findById(id: string): Promise<Conversation | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ConversationRow>(
    'SELECT id, name, topic, created_at FROM conversations WHERE id = ?',
    [id]
  );
  return row ? rowToConversation(row) : null;
}

async function findByTopic(topic: string): Promise<Conversation | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ConversationRow>(
    'SELECT id, name, topic, created_at FROM conversations WHERE topic = ?',
    [topic]
  );
  return row ? rowToConversation(row) : null;
}

async function remove(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM conversations WHERE id = ?', [id]);
}

export const conversationRepository: ConversationRepository = {
  create,
  findAll,
  findById,
  findByTopic,
  delete: remove,
};
