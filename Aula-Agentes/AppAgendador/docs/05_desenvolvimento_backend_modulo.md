# Desenvolvimento back-end, módulo X

## 1. Contexto do módulo
Este módulo é responsável pelo gerenciamento de eventos no sistema. Ele permite criar, editar, excluir e consultar eventos, além de controlar participantes e disparar notificações relacionadas.

## 2. Requisitos técnicos
Plataforma: Firebase
Banco de dados: Cloud Firestore
Autenticação: Firebase Authentication
Backend serverless: Firebase Cloud Functions
Linguagem: JavaScript (Node.js)
Arquitetura: funções modulares (services) organizadas por domínio
Biblioteca obrigatória:
firebase-admin
firebase-functions

## 3. Contrato da API consumido
O módulo segue o contrato definido anteriormente:

Operações principais:

Criar evento
Listar eventos
Atualizar evento
Excluir evento
Gerenciar participantes

Exemplo de estrutura do evento:

{
  "titulo": "Reunião",
  "descricao": "Discussão",
  "data": "2026-05-01",
  "horario": "10:00",
  "local": "Online",
  "criadorId": "uid_usuario"
}

## 4. O que deve ser gerado
Como se trata de Firebase, os componentes equivalentes são:

Model (estrutura de dados) → definição dos campos do evento
Service → funções de manipulação no Firestore
Cloud Functions → endpoints serverless
Validações → verificação de dados
Configuração Firebase
## 5. Testes obrigatórios
Testes unitários das funções de serviço
Testes de integração com Firestore (em ambiente de teste)
Testes manuais no app:
Criar evento
Editar evento
Excluir evento
Verificar sincronização em tempo real

## 6. Critérios de aceite
Usuário autenticado consegue criar evento
Evento é salvo corretamente no Firestore
Apenas o criador pode editar/excluir
Dados inválidos são rejeitados
Eventos aparecem corretamente na listagem
Não há falhas de segurança nas regras

## 7. Pedido para o Agente Back-end
Gere o código completo do módulo, junto com os testes, seguindo estritamente o contrato definido.