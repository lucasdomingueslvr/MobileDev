# Glossário de domínio

## 1. Termos do negócio
Usuário: pessoa cadastrada no aplicativo que pode criar e gerenciar eventos.
Exemplo: “O usuário criou um novo evento.”

Evento: compromisso ou atividade cadastrada no sistema com data, horário e local definidos.
Exemplo: “O evento acontecerá na sexta-feira.”

Participante: usuário convidado para participar de um evento.
Exemplo: “O participante confirmou presença.”

Criador do evento: usuário responsável pela criação e gerenciamento do evento.
Exemplo: “Somente o criador do evento pode excluir o evento.”

Agenda: lista de eventos organizados por data e horário.
Exemplo: “A agenda mostra os eventos da semana.”

Convite: solicitação enviada para que um usuário participe de um evento.
Exemplo: “O convite foi enviado ao participante.”

Notificação: mensagem enviada ao usuário para informar ou lembrar algo relacionado ao evento.
Exemplo: “A notificação avisou sobre o início do evento.”

Status do participante: situação do participante no evento.
Valores possíveis:

pendente
aceito
recusado

Exemplo: “O status do participante foi alterado para aceito.”

## 2. Termos técnicos
React Native: framework utilizado para desenvolver o aplicativo mobile.

Firebase: plataforma utilizada como backend do sistema.

Firestore: banco de dados NoSQL do Firebase utilizado para armazenar os dados do aplicativo.

Firebase Authentication: serviço utilizado para login e autenticação dos usuários.

Cloud Functions: funções serverless utilizadas para executar regras e processos do backend.

Push Notification: notificação enviada diretamente para o dispositivo do usuário.

Collection: agrupamento de documentos dentro do Firestore.
Exemplo: coleção eventos.

Document: registro individual armazenado dentro de uma coleção do Firestore.

UID: identificador único gerado pelo Firebase para cada usuário autenticado.

Expo: plataforma utilizada para facilitar o desenvolvimento e execução do aplicativo React Native.

API: meio de comunicação entre o aplicativo e os serviços do Firebase.

JSON: formato utilizado para enviar e receber dados no sistema.

CamelCase: padrão de escrita utilizado em variáveis e campos.
Exemplo: dataCriacao.

PascalCase: padrão utilizado em nomes de componentes React Native.
Exemplo: EventosScreen.

## 3. Convenções de nomenclatura
Coleções do Firestore
Utilizar nomes no plural e minúsculo
Exemplos:
usuarios
eventos
notificacoes
Campos
Utilizar padrão camelCase
Exemplos:
criadorId
dataCriacao
usuarioId
Variáveis JavaScript
Utilizar camelCase
Exemplos:
listarEventos
criarEvento
usuarioLogado
Componentes React Native
Utilizar PascalCase
Exemplos:
EventosScreen
FormEvento
Cloud Functions
Nome descritivo em camelCase
Exemplos:
criarEvento
listarEventos

## 4. Termos ambíguos resolvidos
Agenda x Calendário:
O termo oficial utilizado no sistema será “Agenda”. O termo “Calendário” não deve ser utilizado na interface principal.

Evento x Compromisso:
O sistema utilizará apenas o termo “Evento” para representar qualquer atividade cadastrada.

Usuário x Participante:
Todo participante é um usuário do sistema, porém nem todo usuário é participante de um evento.

Notificação x Lembrete:
“Lembrete” será tratado como um tipo de notificação automática enviada pelo sistema.

Dono do evento x Criador do evento:
O termo oficial será “Criador do evento”.

Excluir x Cancelar evento:
“Excluir” será utilizado quando o evento for removido permanentemente do sistema.
“Cancelar” poderá ser usado futuramente para eventos que continuem registrados, porém inativos.

Login x Autenticação:
“Login” será utilizado para ações do usuário na interface.
“Autenticação” será utilizado apenas em contexto técnico/documentação.

Mensagem x Notificação:
“Mensagem” representa comunicação entre usuários (caso exista futuramente).
“Notificação” representa avisos automáticos do sistema.

Evento público x Evento privado:
Evento público poderá ser visualizado por vários usuários.
Evento privado será acessível apenas para participantes convidados.

Aceitar convite x Confirmar presença:
Os dois termos possuem o mesmo significado no sistema, porém a interface utilizará “Confirmar presença”.

## 5. Pedido para o Agente Documentador
Manter este arquivo consistente. Toda nova definição passa por humano.