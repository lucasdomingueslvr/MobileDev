# Orientação para agentes

## 1. Como este sistema funciona
Sistema multiagente coordenado por humano, com seis agentes especializados.
Cada agente tem papel, arquivos de leitura, arquivos de escrita e fronteiras.

## 2. Ordem de leitura obrigatória
Todo agente lê este arquivo e o glossário 09 antes de qualquer outro.

## 3. Regras universais
1. Nenhum agente inventa informação. Em caso de dúvida, abre divergência.
2. Nenhum agente avança sem validação humana entre etapas.
3. Todo artefato gerado deve referenciar o arquivo de origem.
4. Toda decisão técnica deve ser justificada em uma frase.
5. Nenhum agente altera arquivo fora do seu escopo de escrita.

## 4. Protocolo de divergência
Ver seção 6 do guia. Tags válidas: PENDENTE, QUESTIONAMENTO, CONFLITO, BLOQUEIO.

## 5. Formato de entrega
Toda resposta de agente termina com bloco "RESUMO PARA VALIDAÇÃO HUMANA"
listando o que foi feito, o que precisa de aprovação e o que ficou pendente.

## 6. Identificação
Toda contribuição deve ser assinada com nome do agente, data e versão do prompt.