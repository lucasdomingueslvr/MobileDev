# Requisitos e regras de negócio

## 1. Requisitos funcionais
RF1 — Cadastro e login:
Critério: usuário consegue criar conta e autenticar; após login, recebe UID e sessão ativa.
RF2 — Criar evento:
Critério: evento criado aparece na Agenda correspondente (data/horário corretos) e contém título, data e horário.
RF3 — Editar evento:
Critério: criador altera campos e mudanças são persistidas e refletidas na Agenda em ≤2s.
RF4 — Excluir evento:
Critério: evento removido não aparece mais na Agenda para criador e participantes.
RF5 — Adicionar participantes:
Critério: convites enviados; participante vê convite e consegue Confirmar/Recusar; status muda para aceito/recusado/pendente.
RF6 — Visualização da Agenda:
Critério: agenda mostra eventos corretos nos modos diário/semanal/mensal, com performance aceitável (<1s para renderizar lista básica).
RF7 — Notificações push:
Critério: notificação enviada ao dispositivo do usuário conforme configuração; pelo menos 90% de entrega em testes controlados (dependente de permissões).
RF8 — Permissões:
Critério: somente Criador do evento pode editar/excluir seu evento; participantes apenas visualizam eventos aos quais foram convidados.

## 2. Requisitos não funcionais
RN1: Apenas usuários autenticados podem criar/editar/excluir eventos.
RN2: Todo evento deve ter título, data e horário obrigatórios. A criação só é permitida para a data atual ou posterior.
RN3: Somente Criador do evento pode editar ou excluir o evento.
RN4: Participantes veem apenas eventos nos quais foram convidados.
RN5: Notificações são enviadas conforme configuração do evento; a configuração padrão envia uma notificação 24h antes e outra 1h antes.
RN6: Conflitos de horário são permitidos. O sistema exibe alerta de sobreposição ao cadastrar evento simultâneo, mas não bloqueia a criação. Cada evento ainda gera suas próprias notificações.
RN7: Cada evento possui lista de participantes, com ordenação disponível por nome (alfabética) ou por ordem de cadastro.
RN8: Todos os eventos são privados; somente participantes convidados podem visualizar um evento.
RN9: O backend utiliza Firebase, e a sincronização entre usuários será feita por polling.

## 3. Regras de negócio
Um usuário deve estar autenticado para criar ou gerenciar eventos.
Cada evento deve possuir obrigatoriamente título, data e horário.
Um evento não pode ser criado no passado; apenas a data atual ou posterior é aceita.
Um usuário só pode editar ou excluir eventos que ele criou.
Participantes só podem visualizar eventos aos quais foram convidados.
Notificações devem ser enviadas antes do horário do evento, com padrão de 24h e 1h antes do início.
Eventos simultâneos são permitidos; o sistema deve alertar sobre sobreposição no cadastro, mas não impedir a criação.
Participantes de um evento podem ser ordenados alfabeticamente ou por ordem de cadastro no evento.
O backend do sistema é Firebase e a sincronização entre clientes ocorrerá via polling.

## 4. Casos de uso prioritários
Os principais casos de uso iniciais incluem o cadastro e login de usuários, criação de eventos, edição e exclusão de eventos, visualização da agenda e envio de notificações. Esses casos são essenciais para o funcionamento básico do sistema e devem ser implementados nas primeiras versões do aplicativo.

## 5. Critérios de aceite
Um usuário deve conseguir se cadastrar e acessar o sistema com sucesso.
Deve ser possível criar um evento e visualizá-lo na agenda.
Ao editar um evento, as alterações devem ser salvas corretamente.
Ao excluir um evento, ele não deve mais aparecer na agenda.
As notificações devem ser enviadas corretamente antes do horário do evento.
O sistema não deve permitir ações inválidas, como criar eventos sem dados obrigatórios.

## 6. Dependências entre requisitos
O cadastro de eventos depende da autenticação do usuário.
A visualização da agenda depende da existência de eventos cadastrados.
O envio de notificações depende da criação de eventos e da configuração de permissões do dispositivo.
A funcionalidade de participantes depende da existência de usuários cadastrados no sistema.
A edição e exclusão de eventos dependem da criação prévia desses eventos.
## 7. Pedido para o Agente Arquiteto
Os requisitos estão bem definidos para uma primeira versão. As decisões já tomadas incluem:
- não permitir criação de eventos no passado;
- eventos privados visíveis apenas para convidados;
- alertar sobre sobreposição sem bloquear criação;
- notificações padrão em 24h e 1h antes do evento;
- backend Firebase com sincronização por polling.

Solicita-se ao Agente Arquiteto que consolide essas regras em modelo de dados Firestore, Firebase Security Rules e fluxo de notificações, além de validar se há necessidade de ajustes na implementação do polling e no controle de visibilidade dos eventos.

A organização dos requisitos está coerente, porém pode ser melhor estruturada separando funcionalidades por módulos (autenticação, eventos, notificações). Também é importante detalhar melhor regras de conflito de horários e permissões de acesso para evitar inconsistências futuras.