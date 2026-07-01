// Banco fake em memória para os testes dos repositórios: implementa apenas o
// subconjunto da API assíncrona do expo-sqlite que os repositórios usam.
interface ConversationRow {
  id: string;
  name: string;
  topic: string;
  created_at: string;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  sender: string;
  body: string;
  direction: string;
  created_at: string;
}

interface SettingsRow {
  id: number;
  nickname: string;
  broker_host: string;
  broker_port: number;
  use_ssl: number;
  client_id: string;
}

export class FakeDatabase {
  conversations: ConversationRow[] = [];
  messages: MessageRow[] = [];
  settings: SettingsRow | null = null;

  async execAsync(_sql: string): Promise<void> {}

  async getFirstAsync<T>(sql: string, params: any[] = []): Promise<T | null> {
    if (sql.includes('FROM settings')) {
      return (this.settings as unknown as T) ?? null;
    }
    if (sql.includes('FROM conversations')) {
      if (sql.includes('WHERE topic')) {
        const found = this.conversations.find((c) => c.topic === params[0]);
        return (found as unknown as T) ?? null;
      }
      if (sql.includes('WHERE id')) {
        const found = this.conversations.find((c) => c.id === params[0]);
        return (found as unknown as T) ?? null;
      }
    }
    return null;
  }

  async getAllAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (sql.includes('FROM conversations')) {
      const rows = [...this.conversations].sort((a, b) =>
        b.created_at.localeCompare(a.created_at)
      );
      return rows as unknown as T[];
    }
    if (sql.includes('FROM messages')) {
      const rows = this.messages
        .filter((m) => m.conversation_id === params[0])
        .sort((a, b) => a.created_at.localeCompare(b.created_at));
      return rows as unknown as T[];
    }
    return [];
  }

  async runAsync(sql: string, params: any[] = []): Promise<void> {
    if (sql.includes('INSERT INTO settings')) {
      this.settings = {
        id: 1,
        nickname: params[0],
        broker_host: params[1],
        broker_port: params[2],
        use_ssl: params[3],
        client_id: params[4],
      };
      return;
    }
    if (sql.includes('INSERT INTO conversations')) {
      this.conversations.push({
        id: params[0],
        name: params[1],
        topic: params[2],
        created_at: params[3],
      });
      return;
    }
    if (sql.includes('INSERT INTO messages')) {
      this.messages.push({
        id: params[0],
        conversation_id: params[1],
        sender: params[2],
        body: params[3],
        direction: params[4],
        created_at: params[5],
      });
      return;
    }
    if (sql.includes('DELETE FROM conversations')) {
      this.conversations = this.conversations.filter((c) => c.id !== params[0]);
      // ON DELETE CASCADE (RN06)
      this.messages = this.messages.filter(
        (m) => m.conversation_id !== params[0]
      );
      return;
    }
    if (sql.includes('DELETE FROM messages')) {
      this.messages = this.messages.filter(
        (m) => m.conversation_id !== params[0]
      );
      return;
    }
  }
}
