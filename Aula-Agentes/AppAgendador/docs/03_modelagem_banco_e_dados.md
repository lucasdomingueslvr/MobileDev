# Modelagem de banco de dados

## 1. Objetivo da modelagem
A modelagem tem como objetivo definir como os dados do sistema serão armazenados no Firebase Firestore, utilizando uma estrutura NoSQL baseada em coleções e documentos. O foco é garantir escalabilidade, alta performance e sincronização em tempo real entre os usuários do aplicativo.

## 2. Entidades principais
No Firestore, os dados são organizados em coleções e documentos:

usuarios(Armazena os dados dos usuários)
Exemplo de campos:
- id (gerado automaticamente)
- nome
- email
- dataCriacao
eventos(Armazena os eventos criados pelos usuários)
- id
- titulo
- descricao
- data
- horario
- local
- criadorId
participantes (subcoleção dentro de eventos ou coleção separada)
 - usuarioId
 - status (pendente, aceito, recusado)
notificacoes
- usuarioId
- mensagem
- dataEnvio
- tipo

## 3. Relacionamentos
No Firestore não existem joins como em banco relacional, então os relacionamentos são feitos por referência de IDs:

Um usuário pode criar vários eventos → criadorId dentro de eventos
Eventos possuem participantes → pode ser:
Subcoleção: /eventos/{eventoId}/participantes
Ou coleção global com referência ao evento

Estratégia recomendada:

Usar subcoleção de participantes dentro de eventos para melhor organização
Armazenar dados essenciais duplicados quando necessário (denormalização)

## 4. Normalização e justificativa
No Firestore, utiliza-se desnormalização controlada, ao contrário de bancos relacionais.
Isso significa que alguns dados podem ser duplicados para melhorar a performance e evitar múltiplas consultas.

Exemplo:

Nome do usuário pode ser salvo junto no participante para evitar consulta extra

Justificativa:

Melhor desempenho
Menos chamadas ao banco
Melhor experiência em tempo real

## 5. Padrões obrigatórios
IDs gerados automaticamente pelo Firestore
Uso de nomes em camelCase (ex: dataCriacao, usuarioId)
Evitar documentos muito grandes (limite de 1MB)
Uso de timestamps do Firebase (Timestamp)
Estrutura consistente entre documentos
Segurança definida via Firebase Security Rules
Indexação automática ou manual para consultas complexas

## 6. Estratégia de migração
Como o Firestore é NoSQL e flexível, não há migrations tradicionais como em SQL.
A estratégia será:

Definir estrutura inicial das coleções
Atualizar documentos conforme evolução do sistema
Utilizar versionamento no código para mudanças estruturais
Scripts podem ser usados para atualizar dados existentes, se necessário
## 7. Script inicial
Solicitar que a IA gere o script SQL inicial com tabelas, chaves, índices e restrições.

## 8. Pedido para o Agente Arquiteto
Analise a modelagem proposta e indique riscos, melhorias e possíveis simplificações.