# Desenvolvimento front-end ou mobile, módulo X

## 1. Contexto do módulo
Este módulo representa a tela de gerenciamento de eventos no aplicativo mobile. O usuário poderá visualizar seus eventos, criar novos, editar e excluir existentes. O fluxo principal inclui:

Acesso à lista de eventos
Criação de novo evento
Edição de evento existente
Exclusão de evento
Visualização de detalhes

## 2. Contrato consumido
O módulo consome as funções do Firebase:

criarEvento (Cloud Function)
listarEventos
atualizarEvento
excluirEvento

Além disso:

Firebase Authentication para identificar o usuário
Firestore para leitura em tempo real (caso utilizado diretamente)

## 3. O que deve ser gerado
Componentes React Native:
Tela de lista de eventos
Formulário de criação/edição
Item de evento
Serviços:
Funções para consumir Cloud Functions
Estado:
Gerenciamento com useState e useEffect (ou Context API)
Validações:
Campos obrigatórios (título, data, horário)
Feedback visual para erros

## 4. Experiência esperada
Carregamento: indicador de loading ao buscar eventos
Erro: mensagem clara ao usuário
Sucesso: feedback ao criar/editar/excluir
Formulários: simples, intuitivos e responsivos
Atualização automática da lista após ações

## 5. Testes obrigatórios
Testes de renderização da tela
Testes de interação (clique em botões, envio de formulário)
Testes manuais:
Criar evento
Editar evento
Excluir evento
Validar mensagens de erro

## 6. Critérios de aceite
Lista de eventos carrega corretamente
Usuário consegue criar evento
Evento aparece na lista após criação
Edição funciona corretamente
Exclusão remove o evento da lista
Validações impedem dados inválidos

## 7. Pedido para o Agente Front-end
Gere a interface completa do módulo, consumindo o contrato aprovado e incluindo os testes necessários.