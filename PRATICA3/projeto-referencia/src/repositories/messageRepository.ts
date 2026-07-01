import * as Crypto from 'expo-crypto';
import { getDatabase } from '../database/database';
import {
  CreateMessageInput,
  Message,
  MessageDirection,
} from '../types';

interface MessageRow {
  id: string;
  conversation_id: string;
  sender: string;
  body: string;
  direction: MessageDirection;
  created_at: string;
}

export interface MessageRepository {
  create(input: CreateMessageInput): Promise<Message>;
  findByConversation(conversationId: string): Promise<Message[]>;
  // (v1.1) Apaga todas as mensagens da conversa, mantendo a conversa. RN10.
  deleteByConversation(conversationId: string): Promise<void>;
}

function rowToMessage(row: MessageRow): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    sender: row.sender,
    body: row.body,
    direction: row.direction,
    createdAt: row.created_at,
  };
}

async function create(input: CreateMessageInput): Promise<Message> {
  const db = await getDatabase();

  const message: Message = {
    id: Crypto.randomUUID(),
    conversationId: input.conversationId,
    sender: input.sender,
    body: input.body,
    direction: input.direction,
    createdAt: new Date().toISOString(),
  };

  await db.runAsync(
    `INSERT INTO messages (id, conversation_id, sender, body, direction, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      message.id,
      message.conversationId,
      message.sender,
      message.body,
      message.direction,
      message.createdAt,
    ]
  );

  return message;
}

async function findByConversation(
  conversationId: string
): Promise<Message[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<MessageRow>(
    `SELECT id, conversation_id, sender, body, direction, created_at
     FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`,
    [conversationId]
  );
  return rows.map(rowToMessage);
}

async function deleteByConversation(conversationId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM messages WHERE conversation_id = ?', [
    conversationId,
  ]);
}

export const messageRepository: MessageRepository = {
  create,
  findByConversation,
  deleteByConversation,
};
