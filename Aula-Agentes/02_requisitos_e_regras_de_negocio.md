# Requisitos e regras de negócio

## 1. Requisitos funcionais
O sistema deve permitir que o usuário realize cadastro e login na aplicação. 
Deve possibilitar a criação de eventos com informações como título, descrição, data, horário e local.
O usuário poderá editar e excluir eventos já criados.
O sistema deve permitir adicionar participantes aos eventos e visualizar a lista de convidados.
Deve exibir os eventos em formato de agenda (diária, semanal ou mensal).
O aplicativo deve enviar notificações push para lembrar os usuários sobre eventos próximos.
Também deve permitir ao usuário visualizar detalhes completos de cada evento.

## 2. Requisitos não funcionais
O sistema deve ter bom desempenho, carregando telas e informações rapidamente, mesmo com múltiplos eventos cadastrados.
Deve garantir segurança dos dados, com autenticação de usuários e proteção de informações sensíveis.
A aplicação deve ser confiável, evitando perda de dados e falhas durante o uso.
Deve seguir padrões de desenvolvimento mobile, garantindo compatibilidade com diferentes dispositivos Android (e opcionalmente iOS).
A interface deve ser intuitiva e de fácil uso.
O sistema deve ser de fácil manutenção, com código organizado e modular.

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