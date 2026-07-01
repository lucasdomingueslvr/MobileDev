import { Alert } from 'react-native';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { ChatScreen } from '../ChatScreen';
import { messageRepository } from '../../repositories/messageRepository';
import { Conversation, Message } from '../../types';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default
);

jest.mock('../../repositories/messageRepository', () => ({
  messageRepository: {
    findByConversation: jest.fn(),
    deleteByConversation: jest.fn().mockResolvedValue(undefined),
    create: jest.fn(),
  },
}));

const mockedRepo = messageRepository as jest.Mocked<typeof messageRepository>;

const conversation: Conversation = {
  id: 'c1',
  name: 'Sala 1',
  topic: 'mensagemmqtt/sala1',
  createdAt: '2026-06-03T00:00:00.000Z',
};

function makeMessage(over: Partial<Message>): Message {
  return {
    id: 'm1',
    conversationId: 'c1',
    sender: 'Ana',
    body: 'olá',
    direction: 'received',
    createdAt: '2026-06-03T00:00:00.000Z',
    ...over,
  };
}

function renderScreen(
  props: Partial<React.ComponentProps<typeof ChatScreen>> = {}
) {
  const defaults = {
    conversation,
    onBack: jest.fn(),
    sendMessage: jest.fn(),
    onIncoming: jest.fn(() => () => {}),
  };
  const merged = { ...defaults, ...props };
  render(<ChatScreen {...merged} />);
  return merged;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedRepo.findByConversation.mockResolvedValue([]);
});

describe('ChatScreen', () => {
  it('abrir conversa mostra o histórico daquela conversa', async () => {
    mockedRepo.findByConversation.mockResolvedValue([
      makeMessage({ id: 'm1', body: 'mensagem antiga' }),
    ]);
    renderScreen();
    await waitFor(() =>
      expect(screen.getByText('mensagem antiga')).toBeTruthy()
    );
  });

  it('enviar mensagem: aparece na lista e o campo é limpo', async () => {
    const sent = makeMessage({
      id: 's1',
      direction: 'sent',
      body: 'minha mensagem',
      sender: 'Eu',
    });
    const sendMessage = jest.fn().mockResolvedValue(sent);
    renderScreen({ sendMessage });

    await waitFor(() => expect(screen.getByPlaceholderText('Mensagem')).toBeTruthy());
    const input = screen.getByPlaceholderText('Mensagem');
    fireEvent.changeText(input, 'minha mensagem');
    fireEvent.press(screen.getByText('Enviar'));

    await waitFor(() =>
      expect(sendMessage).toHaveBeenCalledWith(conversation, 'minha mensagem')
    );
    await waitFor(() => expect(screen.getByText('minha mensagem')).toBeTruthy());
    expect(screen.getByPlaceholderText('Mensagem').props.value).toBe('');
  });

  it('mensagem vazia (RN09): não publica corpo só com espaços', async () => {
    const sendMessage = jest.fn().mockResolvedValue(makeMessage({}));
    renderScreen({ sendMessage });
    await waitFor(() => expect(screen.getByPlaceholderText('Mensagem')).toBeTruthy());
    fireEvent.changeText(screen.getByPlaceholderText('Mensagem'), '   ');
    fireEvent.press(screen.getByText('Enviar'));
    expect(sendMessage).not.toHaveBeenCalled();
  });

  // v1.1 — docs/06_desenvolvimento_frontend_limpar_historico.md, seção 5.1
  describe('limpar histórico (v1.1)', () => {
    it('confirmar limpeza esvazia a lista de mensagens', async () => {
      mockedRepo.findByConversation.mockResolvedValue([
        makeMessage({ id: 'm1', body: 'apagável' }),
      ]);
      const alertSpy = jest
        .spyOn(Alert, 'alert')
        .mockImplementation((_t, _m, buttons) => {
          buttons?.find((b) => b.text === 'Limpar')?.onPress?.();
        });
      renderScreen();
      await waitFor(() => expect(screen.getByText('apagável')).toBeTruthy());
      fireEvent.press(screen.getByText('🗑'));
      await waitFor(() => {
        expect(mockedRepo.deleteByConversation).toHaveBeenCalledWith('c1');
        expect(screen.queryByText('apagável')).toBeNull();
      });
      alertSpy.mockRestore();
    });

    it('cancelar limpeza mantém as mensagens', async () => {
      mockedRepo.findByConversation.mockResolvedValue([
        makeMessage({ id: 'm1', body: 'fica' }),
      ]);
      const alertSpy = jest
        .spyOn(Alert, 'alert')
        .mockImplementation((_t, _m, buttons) => {
          buttons?.find((b) => b.text === 'Cancelar')?.onPress?.();
        });
      renderScreen();
      await waitFor(() => expect(screen.getByText('fica')).toBeTruthy());
      fireEvent.press(screen.getByText('🗑'));
      expect(mockedRepo.deleteByConversation).not.toHaveBeenCalled();
      expect(screen.getByText('fica')).toBeTruthy();
      alertSpy.mockRestore();
    });
  });
});
