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
RN2: Todo evento deve ter título, data e horário obrigatórios.
RN3: Somente Criador do evento pode editar ou excluir o evento.
RN4: Participantes veem apenas eventos nos quais foram convidados.
RN5: Notificações são enviadas conforme configuração do evento (tempo antes do início).
RN6: Em caso de conflito de horário, comportamento é PENDENTE (decisão necessária: bloquear criação ou permitir com aviso).

## 3. Regras de negócio
Um usuário deve estar autenticado para criar ou gerenciar eventos. 
Cada evento deve possuir obrigatoriamente título, data e horário.
Um evento não pode ser criado com data ou horário inválido (ex: no passado, se essa regra for adotada). Um usuário só pode editar ou excluir eventos que ele criou.
Participantes só podem visualizar eventos aos quais foram convidados.
Notificações devem ser enviadas antes do horário do evento, conforme configuração definida.
Não deve haver sobreposição de eventos no mesmo horário, caso essa restrição seja aplicada ao usuário.

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
Os requisitos estão bem definidos para uma primeira versão, porém existem alguns pontos que precisam de decisão antes do desenvolvimento:

Definir se será permitido criar eventos no passado
Definir se haverá limite de participantes por evento
Definir se eventos podem ser públicos ou apenas privados
Especificar o tempo exato para envio de notificações
Definir se haverá sincronização em tempo real entre usuários
Escolher definitivamente a tecnologia do backend (Firebase ou API própria)

A organização dos requisitos está coerente, porém pode ser melhor estruturada separando funcionalidades por módulos (autenticação, eventos, notificações). Também é importante detalhar melhor regras de conflito de horários e permissões de acesso para evitar inconsistências futuras.