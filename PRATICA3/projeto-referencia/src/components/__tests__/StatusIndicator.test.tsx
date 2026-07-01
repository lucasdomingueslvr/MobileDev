import { render, screen } from '@testing-library/react-native';
import { StatusIndicator } from '../StatusIndicator';
import { ConnectionStatus } from '../../types';

const CASES: Array<[ConnectionStatus, string]> = [
  ['connected', 'Conectado'],
  ['connecting', 'Conectando…'],
  ['disconnected', 'Desconectado'],
  ['error', 'Erro de conexão'],
];

describe('StatusIndicator', () => {
  it.each(CASES)('renderiza o rótulo de %s', (status, label) => {
    render(<StatusIndicator status={status} />);
    expect(screen.getByText(label)).toBeTruthy();
  });
});
