# Contratos de API

## 1. Objetivo
Definir como o aplicativo mobile irá se comunicar com os serviços do Firebase, incluindo autenticação, banco de dados (Firestore) e notificações. O objetivo é padronizar as operações de leitura e escrita de dados, garantindo consistência entre frontend e backend.

## 2. Padrão de versionamento
Como será utilizado Firebase diretamente (sem API REST própria), não haverá versionamento por URL como /api/v1.

O versionamento será controlado por:

Versão do aplicativo mobile
Estrutura das coleções no Firestore
Versionamento do código no repositório

## 3. Autenticação e autorização
Autenticação será feita via Firebase Authentication
Métodos:
Email e senha
Após login, o usuário recebe um token JWT gerenciado pelo Firebase
Autorização será feita através de:
Firebase Security Rules, controlando acesso às coleções

Exemplo de regra:

Usuário só pode editar eventos que criou
Participantes só podem visualizar eventos em que estão incluídos
## 4. Endpoints
Como não há endpoints REST tradicionais, as operações são:

1. Autenticação
Criar usuário
Login
Logout
2. Usuários
Buscar dados do usuário logado
3. Eventos
Criar evento
Listar eventos
Atualizar evento
Deletar evento
4. Participantes
Adicionar participante
Atualizar status (aceito/recusado)
Listar participantes
5. Notificações
Enviar notificação (via Firebase Cloud Messaging)

## 5. Requisição e resposta com exemplos JSON reais

Criar evento

Requisição (Firestore):

{
  "titulo": "Reunião",
  "descricao": "Discussão do projeto",
  "data": "2026-05-01",
  "horario": "10:00",
  "local": "Online",
  "criadorId": "uid_usuario"
}

Resposta:

{
  "id": "evento_id_gerado",
  "status": "sucesso"
}
Listar eventos do usuário

Resposta:

[
  {
    "id": "evento1",
    "titulo": "Reunião",
    "data": "2026-05-01",
    "horario": "10:00"
  },
  {
    "id": "evento2",
    "titulo": "Aniversário",
    "data": "2026-05-03",
    "horario": "19:00"
  }
]
Adicionar participante

Requisição:

{
  "usuarioId": "uid_participante",
  "nome": "Maria",
  "status": "pendente"
}
Atualizar status do participante

Requisição:

{
  "status": "aceito"
}

## 6. Erros esperados
Mesmo sem API REST, os erros seguem padrões do Firebase:

permission-denied → usuário sem permissão
not-found → documento não encontrado
invalid-argument → dados inválidos
unauthenticated → usuário não logado

Exemplo:

{
  "erro": "permission-denied",
  "mensagem": "Usuário não autorizado a acessar este evento"
}

## 7. Regras de contrato
Campos obrigatórios:
Evento: titulo, data, horario, criadorId
Datas devem estar em formato DD-MM-YYYY
Horários no formato HH:mm
IDs devem ser strings geradas pelo Firebase
Status de participante:
pendente
aceito
recusado
Todos os acessos devem respeitar as regras de segurança do Firebase

## 8. Pedido para o Agente Designer de API
Documente o contrato completo e destaque qualquer ponto ambíguo que precise de validação antes do desenvolvimento.