# Plano de testes

## 1. Objetivo
O objetivo deste plano de testes é definir como as funcionalidades do aplicativo serão validadas durante o desenvolvimento, garantindo que o sistema funcione corretamente, com segurança, estabilidade e boa experiência para o usuário. Os testes devem assegurar que o aplicativo esteja de acordo com os requisitos funcionais e não funcionais definidos anteriormente.

## 2. Testes de arquitetura
Os testes de arquitetura têm como objetivo verificar se a estrutura técnica do projeto está correta e seguindo os padrões definidos.

Verificações:
Organização modular do projeto React Native
Separação correta entre telas, serviços e componentes
Integração adequada com Firebase
Configuração correta do Firebase Authentication
Configuração correta do Firestore
Verificação das Firebase Security Rules
Validação do fluxo de autenticação

O que deve ser validado:
Estrutura de pastas consistente
Ausência de dependências desnecessárias
Segurança no acesso aos dados
Comunicação correta com Cloud Functions

## 3. Testes de back-end
Como o sistema utiliza Firebase, os testes de back-end serão focados em Cloud Functions, Firestore e autenticação.

Testes unitários
Validação da criação de eventos
Verificação de campos obrigatórios
Validação de permissões do usuário
Teste de exclusão e atualização
Testes de integração
Integração entre app e Firestore
Integração com Firebase Authentication
Integração com notificações push
Validações manuais
Criar evento diretamente pelo aplicativo
Atualizar evento e verificar persistência
Excluir evento e validar remoção
Testar regras de acesso com usuários diferentes
Ferramentas sugeridas
Firebase Emulator
Jest
Console do Firebase
## 4. Testes de front-end ou mobile
Os testes mobile devem validar o comportamento visual e funcional das telas.

Testes de tela
Renderização correta das telas
Exibição da lista de eventos
Navegação entre telas
Testes de comportamento
Criação de evento
Edição de evento
Exclusão de evento
Atualização automática da lista
Testes de integração
Comunicação com Firebase
Recebimento de notificações
Persistência de login
Cenários de erro
Campos vazios
Falha de internet
Usuário sem permissão
Dados inválidos
Experiência do usuário
Tempo de carregamento
Feedback visual
Mensagens de sucesso e erro
Responsividade em diferentes dispositivos

## 5. Critérios de aprovação
Uma funcionalidade poderá ser considerada concluída quando:

Todos os testes planejados forem executados com sucesso
Não existirem erros críticos
Os dados forem persistidos corretamente no Firebase
O aplicativo não apresentar falhas durante o fluxo principal
O comportamento visual estiver consistente
As regras de segurança estiverem funcionando corretamente

## 6. Evidências
As evidências dos testes devem incluir:

Capturas de tela do aplicativo
Logs do console
Resultados de testes automatizados
Registros de erros encontrados
Prints do Firebase mostrando persistência dos dados
Vídeos curtos demonstrando funcionalidades principais

## 7. Pedido para o Agente de QA
Prioridade Alta
Login e autenticação
Criação de eventos
Persistência no Firestore
Regras de segurança
Prioridade Média
Edição e exclusão de eventos
Participantes
Notificações push
Prioridade Baixa
Melhorias visuais
Ajustes de desempenho
Pequenas validações de interface
Recomendações do QA
Validar primeiro o fluxo principal completo (login → criar evento → visualizar evento)
Executar testes em diferentes dispositivos Android
Simular falhas de conexão
Testar múltiplos usuários simultaneamente
Monitorar consumo de leituras do Firestore para evitar custos excessivos