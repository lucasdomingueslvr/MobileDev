import { render, screen } from '@testing-library/react-native';
import { MessageBubble } from '../MessageBubble';
import { Message } from '../../types';

function makeMessage(over: Partial<Message>): Message {
  return {
    id: '1',
    conversationId: 'c1',
    sender: 'Ana',
    body: 'olá',
    direction: 'received',
    createdAt: '2026-06-03T00:00:00.000Z',
    ...over,
  };
}

describe('MessageBubble', () => {
  it('sent alinha à direita', () => {
    render(<MessageBubble message={makeMessage({ direction: 'sent' })} />);
    const row = screen.getByText('olá').parent?.parent;
    expect(row).toBeTruthy();
    // mensagem própria não exibe o remetente
    expect(screen.queryByText('Ana')).toBeNull();
  });

  it('received alinha à esquerda e mostra o sender', () => {
    render(
      <MessageBubble
        message={makeMessage({ direction: 'received', sender: 'Ana' })}
      />
    );
    expect(screen.getByText('Ana')).toBeTruthy();
    expect(screen.getByText('olá')).toBeTruthy();
  });
});
