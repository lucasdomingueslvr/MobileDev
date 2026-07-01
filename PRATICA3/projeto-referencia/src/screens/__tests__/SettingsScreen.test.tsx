import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { SettingsScreen } from '../SettingsScreen';
import { settingsRepository } from '../../repositories/settingsRepository';

jest.mock('../../repositories/settingsRepository', () => ({
  settingsRepository: {
    get: jest.fn(),
    save: jest.fn(),
  },
}));

const mockedRepo = settingsRepository as jest.Mocked<typeof settingsRepository>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SettingsScreen', () => {
  it('salva ajustes válidos chamando o repositório', async () => {
    mockedRepo.save.mockResolvedValue({
      nickname: 'Rafael',
      brokerHost: 'broker.hivemq.com',
      brokerPort: 8884,
      useSsl: true,
      clientId: 'id',
    });
    const onSaved = jest.fn();
    render(<SettingsScreen settings={null} onSaved={onSaved} />);
    fireEvent.changeText(screen.getByPlaceholderText('Seu apelido'), 'Rafael');
    fireEvent.press(screen.getByText('Salvar'));
    await waitFor(() => expect(mockedRepo.save).toHaveBeenCalled());
    await waitFor(() => expect(onSaved).toHaveBeenCalled());
  });

  it('apelido vazio bloqueia o salvamento com mensagem', () => {
    render(<SettingsScreen settings={null} onSaved={jest.fn()} />);
    fireEvent.changeText(screen.getByPlaceholderText('Seu apelido'), '');
    fireEvent.press(screen.getByText('Salvar'));
    expect(screen.getByText('Informe um apelido.')).toBeTruthy();
    expect(mockedRepo.save).not.toHaveBeenCalled();
  });

  it('host com esquema (RN11) é bloqueado com aviso', () => {
    render(<SettingsScreen settings={null} onSaved={jest.fn()} />);
    fireEvent.changeText(screen.getByPlaceholderText('Seu apelido'), 'Rafael');
    fireEvent.changeText(
      screen.getByPlaceholderText('broker.hivemq.com'),
      'wss://broker.hivemq.com'
    );
    fireEvent.press(screen.getByText('Salvar'));
    expect(
      screen.getByText('O host não pode conter esquema (ws://, wss://, http://).')
    ).toBeTruthy();
    expect(mockedRepo.save).not.toHaveBeenCalled();
  });

  it('host com espaço (RN11) é bloqueado com aviso', () => {
    render(<SettingsScreen settings={null} onSaved={jest.fn()} />);
    fireEvent.changeText(screen.getByPlaceholderText('Seu apelido'), 'Rafael');
    fireEvent.changeText(
      screen.getByPlaceholderText('broker.hivemq.com'),
      'broker hivemq com'
    );
    fireEvent.press(screen.getByText('Salvar'));
    expect(screen.getByText('O host não pode conter espaços.')).toBeTruthy();
    expect(mockedRepo.save).not.toHaveBeenCalled();
  });
});
