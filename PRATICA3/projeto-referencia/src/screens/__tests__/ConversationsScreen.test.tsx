import { Alert } from 'react-native';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { ConversationsScreen } from '../ConversationsScreen';
import { Conversation, createAppError } from '../../types';

function makeConversation(over: Partial<Conversation> = {}): Conversation {
  return {
    id: 'c1',
    name: 'Sala 1',
    topic: 'mensagemmqtt/sala1',
    createdAt: '2026-06-03T00:00:00.000Z',
    ...over,
  };
}

function renderScreen(props: Partial<React.ComponentProps<typeof ConversationsScreen>> = {}) {
  const defaults = {
    conversations: [],
    status: 'connected' as const,
    loading: false,
    onOpen: jest.fn(),
    onOpenSettings: jest.fn(),
    onCreate: jest.fn().mockResolvedValue(undefined),
    onDelete: jest.fn().mockResolvedValue(undefined),
  };
  const merged = { ...defaults, ...props };
  render(<ConversationsScreen {...merged} />);
  return merged;
}

describe('ConversationsScreen', () => {
  it('estado vazio mostra "nenhuma conversa"', () => {
    renderScreen({ conversations: [] });
    expect(screen.getByText('Nenhuma conversa ainda.')).toBeTruthy();
  });

  it('com itens renderiza a lista de conversas', () => {
    renderScreen({ conversations: [makeConversation()] });
    expect(screen.getByText('Sala 1')).toBeTruthy();
    expect(screen.getByText('mensagemmqtt/sala1')).toBeTruthy();
  });

  it('criar conversa submete o modal e chama onCreate', async () => {
    const props = renderScreen();
    fireEvent.press(screen.getByText('+ Nova conversa'));
    fireEvent.changeText(screen.getByPlaceholderText('Ex.: Sala 1'), 'Sala 2');
    fireEvent.changeText(
      screen.getByPlaceholderText('Ex.: mensagemmqtt/sala1'),
      'sala/dois'
    );
    fireEvent.press(screen.getByText('Criar'));
    await waitFor(() =>
      expect(props.onCreate).toHaveBeenCalledWith({
        name: 'Sala 2',
        topic: 'sala/dois',
      })
    );
  });

  it('tópico duplicado mostra aviso e não duplica', async () => {
    const onCreate = jest
      .fn()
      .mockRejectedValue(createAppError('TOPIC_ALREADY_EXISTS', 'Já existe.'));
    renderScreen({ onCreate });
    fireEvent.press(screen.getByText('+ Nova conversa'));
    fireEvent.changeText(screen.getByPlaceholderText('Ex.: Sala 1'), 'X');
    fireEvent.changeText(
      screen.getByPlaceholderText('Ex.: mensagemmqtt/sala1'),
      'sala/x'
    );
    fireEvent.press(screen.getByText('Criar'));
    await waitFor(() => expect(screen.getByText('Já existe.')).toBeTruthy());
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('tópico inválido (RN08) é bloqueado com aviso', async () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    renderScreen({ onCreate });
    fireEvent.press(screen.getByText('+ Nova conversa'));
    fireEvent.changeText(screen.getByPlaceholderText('Ex.: Sala 1'), 'X');
    fireEvent.changeText(
      screen.getByPlaceholderText('Ex.: mensagemmqtt/sala1'),
      'sala invalida'
    );
    fireEvent.press(screen.getByText('Criar'));
    expect(
      screen.getByText('O tópico não pode conter espaços.')
    ).toBeTruthy();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('tópico com curinga # (RN08) é bloqueado', () => {
    const onCreate = jest.fn().mockResolvedValue(undefined);
    renderScreen({ onCreate });
    fireEvent.press(screen.getByText('+ Nova conversa'));
    fireEvent.changeText(screen.getByPlaceholderText('Ex.: Sala 1'), 'X');
    fireEvent.changeText(
      screen.getByPlaceholderText('Ex.: mensagemmqtt/sala1'),
      'sala/#'
    );
    fireEvent.press(screen.getByText('Criar'));
    expect(
      screen.getByText('O tópico não pode conter os curingas # ou +.')
    ).toBeTruthy();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('excluir conversa (RF11): toque longo + confirmação chama onDelete', () => {
    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation((_t, _m, buttons) => {
        const confirm = buttons?.find((b) => b.text === 'Excluir');
        confirm?.onPress?.();
      });
    const conversation = makeConversation();
    const props = renderScreen({ conversations: [conversation] });
    fireEvent(screen.getByText('Sala 1'), 'longPress');
    expect(props.onDelete).toHaveBeenCalledWith(conversation);
    alertSpy.mockRestore();
  });

  it('botão Ajustes funciona mesmo com status error (RNF07)', () => {
    const props = renderScreen({ status: 'error' });
    fireEvent.press(screen.getByText('Ajustes'));
    expect(props.onOpenSettings).toHaveBeenCalled();
  });
});
