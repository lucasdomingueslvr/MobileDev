# Contratos de API e acesso

## 1. Objetivo
Documentar como o aplicativo mobile interage com o Firebase, incluindo autenticação, Firestore e notificações. O foco é padronizar operações, validações e regras de acesso para o backend Firebase.

## 2. Padrão de versionamento
Não há versionamento por URL, pois o aplicativo usa Firebase diretamente. O controle de compatibilidade é feito por:
- versão do app mobile
- esquema de coleções e campos no Firestore
- versionamento do código-fonte

## 3. Autenticação e autorização
Autenticação: Firebase Authentication via email e senha.
Após login, o usuário recebe token JWT do Firebase.
Autorização: Firebase Security Rules determinam permissões de leitura e escrita.

Regras esperadas:
- usuário autenticado pode criar eventos com `criadorId == request.auth.uid`
- somente o criador pode atualizar ou excluir seu evento
- somente o criador pode adicionar participantes ao evento
- participante pode ler evento se estiver em `/eventos/{eventoId}/participantes/{uid}`
- participante pode atualizar apenas seu próprio `status`
- notificações só podem ser lidas pelo `usuarioId` correspondente

## 4. Operações Firestore principais
Como não há endpoints REST tradicionais, as operações são realizadas diretamente em coleções e documentos Firestore.

### Autenticação
- criar usuário
- login
- logout
- obter token JWT

### Eventos
- criar evento: gravar documento em `/eventos/{eventoId}`
- listar eventos: consultar eventos em que o usuário é participante ou criador
- atualizar evento: alterar documento em `/eventos/{eventoId}`
- deletar evento: remover documento `/eventos/{eventoId}` e subcoleções de participantes

### Participantes
- adicionar participante: criar documento em `/eventos/{eventoId}/participantes/{uid}`
- atualizar status: atualizar campo `status` no documento do participante
- listar participantes: consultar subcoleção `/eventos/{eventoId}/participantes`

### Notificações
- criar/atualizar notificação: gravar documento em `/notificacoes/{notificacaoId}` via Cloud Function
- listar notificações: consultar `/notificacoes` com `usuarioId == uid`
- enviar push: serviço backend usa Firebase Cloud Messaging

## 5. Formato de dados e validações
### Evento
Campos obrigatórios:
- titulo: string
- descricao: string
- local: string
- criadorId: string
- dataHoraInicio: Timestamp Firestore
- criadoEm: Timestamp
- atualizadoEm: Timestamp
- notificacoesPadrao.habilitado: boolean
- notificacoesPadrao.agendamentos: array de números (segundos antes do evento)

Validações principais:
- `dataHoraInicio` não pode ser no passado
- `criadorId` deve ser igual a `request.auth.uid` na criação
- `titulo` não pode ser vazio
- eventos são privados por padrão

### Participante
Campos obrigatórios:
- usuarioId: string
- nome: string
- status: string (`pendente`, `aceito`, `recusado`)
- convidadoPor: string
- convidadoEm: Timestamp

### Notificação
Campos obrigatórios:
- usuarioId: string
- eventoId: string
- tipo: string (`convite`, `lembrete`)
- mensagem: string
- agendadoPara: Timestamp
- status: string (`pendente`, `enviado`, `falha`)
- criadoEm: Timestamp

## 6. Exemplo de operações JSON
### Criar evento
{
  "titulo": "Reunião de Projeto",
  "descricao": "Alinhamento semanal",
  "local": "Sala 2",
  "criadorId": "uid_usuario",
  "dataHoraInicio": Timestamp,
  "criadoEm": Timestamp,
  "atualizadoEm": Timestamp,
  "notificacoesPadrao": {
    "habilitado": true,
    "agendamentos": [86400, 3600]
  }
}

### Adicionar participante
{
  "usuarioId": "uid_participante",
  "nome": "Maria",
  "status": "pendente",
  "convidadoPor": "uid_usuario",
  "convidadoEm": Timestamp
}

### Criar notificação
{
  "usuarioId": "uid_participante",
  "eventoId": "evento_id",
  "tipo": "convite",
  "mensagem": "Você foi convidado para Reunião de Projeto.",
  "agendadoPara": Timestamp,
  "status": "pendente",
  "criadoEm": Timestamp
}

## 7. Sincronização e polling
Como a sincronização entre usuários será feita por polling:
- o app consulta eventos a cada intervalo configurado (ex.: 30 segundos a 2 minutos, conforme criticidade e custo de leitura)
- consultas filtram eventos relevantes por `participantes.usuarioId == uid` ou `criadorId == uid`
- usar `updatedAt` para identificar itens alterados desde o último polling
- consultar eventos dentro de janelas de data para evitar leituras excessivas

## 8. Fluxo de notificações push
1. O app grava evento e participantes em Firestore.
2. Cloud Function detecta o evento criado/atualizado e gera notificações de lembrete e convite em `/notificacoes`.
3. Um Cloud Function agendado varre notificações pendentes e envia push via Firebase Cloud Messaging no momento certo.
4. Após envio, a notificação recebe `enviadoEm` e `status: enviado`.
5. Em caso de erro, o registro recebe `status: falha` para possível retentativa.

## 9. Erros esperados
Erros seguem padrão Firebase:
- permission-denied: acesso negado pelas regras
- not-found: documento inexistente
- invalid-argument: dados inválidos ou campo ausente
- unauthenticated: usuário não logado

## 10. Segurança de acesso
A autorização é garantida por Firebase Security Rules, não por roteamento REST.
As regras devem impedir acesso a eventos privados fora do conjunto de participantes e garantir que apenas o criador possa alterar o evento e adicionar participantes.

## 11. Pedido para o Agente Designer de API
Documente o esquema Firestore definitivo e as consultas de polling necessárias para sincronização de agenda, incluindo: `eventos` por participação, `participantes` por evento, e `notificacoes` por usuário.