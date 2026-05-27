# Modelagem de banco de dados

## 1. Objetivo da modelagem
A modelagem define como os dados do sistema serão armazenados no Firebase Firestore. O foco é garantir estrutura de coleções compatível com eventos privados, visibilidade por participante, notificações agendadas e sincronização por polling.

## 2. Entidades principais
No Firestore, os dados são organizados em coleções e documentos.

usuarios
- uid: string (ID do Firebase Authentication)
- nome: string
- email: string
- dataCriacao: Timestamp
- fcmToken: string? (token para Firebase Cloud Messaging)

eventos
- titulo: string
- descricao: string
- local: string
- criadorId: string
- dataHoraInicio: Timestamp
- dataHoraFim: Timestamp? (opcional)
- criadoEm: Timestamp
- atualizadoEm: Timestamp
- notificacoesPadrao: map
  - habilitado: boolean
  - agendamentos: array [86400, 3600] (segundos antes do evento)
- participantesCount: number
- sobreposicaoAlertada: boolean

/ eventos/{eventoId}/participantes
- usuarioId: string
- nome: string
- status: string (pendente | aceito | recusado)
- convidadoPor: string
- convidadoEm: Timestamp

notificacoes
- usuarioId: string
- eventoId: string
- tipo: string (convite | lembrete)
- mensagem: string
- agendadoPara: Timestamp
- enviadoEm: Timestamp? (null até envio)
- status: string (pendente | enviado | falha)
- criadoEm: Timestamp

## 3. Relacionamentos
No Firestore não existem joins como em banco relacional, então os relacionamentos são feitos por referência de IDs.

Um usuário pode criar vários eventos → evento.criadorId = usuarios.uid
Um evento possui participantes → coleção /eventos/{eventoId}/participantes
Notificações são vinculadas a usuários e eventos por IDs.

Estratégia recomendada:

- Usar subcoleção de participantes dentro de cada evento para controle de acesso
- Armazenar dados essenciais duplicados quando necessário para reduzir leituras
- Manter `participantesCount` e `atualizadoEm` no documento de evento para consultas rápidas

## 4. Normalização e justificativa
No Firestore, utiliza-se desnormalização controlada.
Alguns dados podem ser duplicados para melhorar a performance e evitar múltiplas consultas.

Exemplo:

- Nome do usuário salvo no documento de participante para evitar consulta extra

Justificativa:

- Melhor desempenho
- Menos chamadas ao banco
- Melhor experiência mesmo com polling

## 5. Padrões obrigatórios
- IDs gerados automaticamente pelo Firestore
- Uso de nomes em camelCase (ex: dataHoraInicio, usuarioId)
- Evitar documentos muito grandes (limite de 1MB)
- Uso de timestamps do Firebase (Timestamp)
- Estrutura consistente entre documentos
- Segurança definida via Firebase Security Rules
- Indexação automática ou manual para consultas complexas

## 6. Estratégia de migração
Como o Firestore é NoSQL e flexível, não há migrations tradicionais como em SQL.
A estratégia será:

- Definir estrutura inicial das coleções
- Atualizar documentos conforme evolução do sistema
- Utilizar versionamento no código para mudanças estruturais
- Scripts podem ser usados para atualizar dados existentes, se necessário

## 7. Índices e consultas
- eventos por `criadorId` e `dataHoraInicio`
- eventos por `atualizadoEm`
- notificacoes por `usuarioId` e `agendadoPara`
- participantes por `usuarioId`

Consultas principais:
- Listar eventos de um usuário participante: buscar eventos onde exista participante com `usuarioId == uid` e `dataHoraInicio` no intervalo desejado.
- Buscar próximos eventos do criador: `criadorId == uid` e `dataHoraInicio >= hoje`.
- Consultar notificações pendentes: `usuarioId == uid` e `status == pendente` e `agendadoPara <= agora`.

## 8. Sincronização por polling
Como a decisão técnica define polling em vez de Firestore realtime:
- o app deve consultar periodicamente eventos relevantes para o usuário.
- a cada poll, buscar eventos ativos ou atualizados desde o último `updatedAt` registrado localmente.
- limitar consultas a intervalos de data (hoje + próximo mês) para performance.
- atualizações de participante e de evento também devem atualizar `atualizadoEm`.
- o polling garante sincronização consistente mesmo sem listeners em tempo real.

## 9. Fluxo de notificações
1. Criação ou edição de evento gera documentos de lembrete e convite em `/notificacoes`.
2. Um serviço backend (Firebase Cloud Functions) lê novos documentos e agenda envios para `agendadoPara` com 24h e 1h antes de `dataHoraInicio`.
3. Um Cloud Function agendado (cron job) busca notificações pendentes e envia push via Firebase Cloud Messaging.
4. Após envio, a notificação recebe `enviadoEm` e `status: enviado`; em caso de erro, `status: falha`.
5. Convites de participante podem disparar um push inicial de tipo `convite` imediatamente após a inclusão.

## 10. Segurança de acesso
A segurança do modelo depende de Firebase Security Rules que devem garantir:
- somente o criador pode criar/editar/excluir seu evento;
- somente participantes e o criador podem ler o evento;
- somente o criador pode adicionar participantes;
- participantes podem atualizar apenas seu próprio status;
- notificações só podem ser lidas pelo `usuarioId` correspondente.

## 11. Riscos e premissas
Premissas:
- Firebase Authentication fornece o UID de usuário.
- FCM tokens estarão disponíveis para envio de push.
- Polling é suficiente para a necessidade de sincronização entre usuários.

Riscos:
- Polling pode gerar maior uso de leituras se o intervalo for muito curto.
- Agendamento de notificações depende de Cloud Functions e do horário do servidor.
- Regras de acesso precisam ser testadas cuidadosamente para evitar vazamento de eventos privados.