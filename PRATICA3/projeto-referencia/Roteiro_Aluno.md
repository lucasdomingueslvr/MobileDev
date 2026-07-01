# Roteiro do aluno — executando o projeto MensagemMQTT

## Sobre esta atividade

Diferente da prática em que vocês constroem o app conduzindo a IA do Copilot,
aqui o caminho é outro: **o app já está pronto e o objetivo é colocá-lo para
rodar e entender como ele foi feito.** Vocês recebem o código completo, sobem no
Codespace, instalam as dependências e executam. Depois, leiam a seção final para
saber o que cada parte do projeto faz.

Ou seja: nesta atividade ninguém escreve código novo. O foco é **executar** e
**compreender** a estrutura de um app React Native real com mensageria MQTT e
banco local.

---

## O que é o app

O **MensagemMQTT** é um mensageiro com várias conversas. Cada conversa é uma
"sala", que no fundo é um tópico MQTT: quem assina o mesmo tópico troca mensagens
em tempo real. O histórico de cada conversa fica salvo no próprio aparelho, num
banco SQLite. Não existe servidor próprio — o app fala direto com um **broker
MQTT público** (`broker.hivemq.com`).

Tecnologias: **React Native + Expo (SDK 54)**, **SQLite** (`expo-sqlite`) e
**MQTT sobre WebSocket** (pacote `mqtt`).

---

## Antes de começar

- Conta no GitHub com Codespaces liberado (o mesmo das outras práticas).
- O arquivo do projeto, disponível no **Portal UNIPAM**.
- **Node 20** — já vem garantido pelo `.devcontainer` que acompanha o projeto;
  você não precisa instalar nada (a Etapa 2 mostra como conferir, por garantia).

---

## Etapa 1 — Abrir o Codespace e trazer o projeto

> **Onde:** navegador (GitHub) + Portal UNIPAM

**1.1** Crie ou abra o seu Codespace, como já faz nas outras práticas. Espere o
VS Code carregar no navegador.

**1.2** Baixe o arquivo do projeto no **Portal UNIPAM** e descompacte no seu
computador.

**1.3** Selecione **todo o conteúdo** da pasta descompactada (o `App.tsx`, a pasta
`src/`, o `package.json`, o `metro.config.js`, a pasta `.devcontainer`, etc.) e
**arraste para dentro do explorador de arquivos do VS Code**, na raiz do
Codespace. Confirme o upload se o VS Code pedir.

> **Atenção às pastas ocultas:** a pasta **`.devcontainer`** começa com ponto e é
> ela que garante o Node 20. Ative "mostrar arquivos ocultos" no seu sistema
> **antes** de arrastar, para ela não ficar de fora. A pasta `node_modules`
> **não** vem no arquivo — ela é recriada na Etapa 2.

> **Checkpoint:** no explorador do VS Code você vê o `App.tsx`, a pasta `src/` e o
> `package.json`? Então pode seguir.

---

## Etapa 2 — Instalar as dependências e rodar

> **Onde:** TERMINAL do VS Code

**2.1 — Confira o Node.** No terminal, rode:

```bash
node -v
```

Com o `.devcontainer` no projeto, deve aparecer **v20**. Se por algum motivo vier
`v18` (Codespace criado sem o `.devcontainer`), rode `nvm install 20 && nvm use 20`
e confira de novo.

**2.2 — Instale as dependências.** O `.devcontainer` já dispara o `npm install`
quando o Codespace é criado, então a pasta `node_modules` pode já estar pronta. Por
garantia, rode mesmo assim na raiz do projeto:

```bash
npm install
```

Se já estiver tudo instalado, o comando termina rápido; se faltar algo, ele
completa.

**2.3 — Confira que o código compila sem erro de tipos:**

```bash
npx tsc --noEmit
```

Se não aparecer nenhuma mensagem, está tudo certo.

**2.4 — Rode os testes automatizados:**

```bash
npm test
```

Devem passar todos (são 45 testes, divididos em 7 grupos). Eles checam os
repositórios, o serviço MQTT, os componentes e as telas.

**2.5 — Suba o app:**

```bash
npx expo start
```

No terminal do Expo, pressione a tecla **`w`** para abrir no navegador. Para
parar, use `Ctrl+C`.

> **Se a web reclamar do banco** (mensagem com `wa-sqlite.wasm` ou
> `SharedArrayBuffer`), reinicie limpando o cache: `npx expo start -c` e depois
> `w`. Se ainda assim não abrir na web (o suporte de SQLite na web é
> experimental e o proxy do Codespace às vezes atrapalha), teste no celular: rode
> `npx expo start --tunnel`, instale o app **Expo Go** e leia o QR code — no
> celular o SQLite é nativo e funciona sem ajuste.

> **Checkpoint:** o app abriu sem tela branca e pediu um apelido na primeira
> abertura? Então está rodando.

---

## Etapa 3 — Usando o app

1. **Primeira abertura:** o app abre na tela de **Ajustes** e pede um **apelido**.
   O broker já vem preenchido (`broker.hivemq.com`, porta `8884`, com SSL). Salve.
2. **Conversas:** você cai na lista de conversas (vazia no começo). No topo fica o
   **status da conexão** (verde = conectado) e o botão **Ajustes**; embaixo, o
   botão **+ Nova conversa**.
3. **Criar conversa:** toque em **+ Nova conversa**, dê um nome (ex.: `Sala 1`) e
   um tópico (ex.: `mensagemmqtt/sala1`) e crie.
4. **Conversar:** abra a conversa e envie mensagens. As suas aparecem à direita; as
   de outras pessoas, à esquerda, com o apelido de quem mandou.
5. **Teste em tempo real:** abra o app numa **segunda aba** (ou em outro aparelho),
   use o **mesmo tópico** e troque mensagens entre as duas instâncias.
6. **Excluir conversa:** dê um **toque longo** na conversa na lista e confirme —
   ela some junto com o histórico.
7. **Limpar histórico (v1.1):** dentro de uma conversa, o ícone de **lixeira** no
   topo apaga só as mensagens daquela conversa, mantendo a conversa ativa.

---

## Como o projeto foi desenvolvido

Vale a pena entender a organização, porque ela segue um padrão comum em apps
profissionais: **separar em camadas**, cada uma com uma responsabilidade, de modo
que a tela nunca fale direto com o banco ou com a rede.

O caminho de uma informação no app é este:

```
telas (screens)  →  hook useMqtt  →  serviço MQTT  →  broker
       ↓
  repositórios   →  banco SQLite
```

### As camadas, de baixo para cima

- **Tipos (`src/types`)** — as "interfaces" em TypeScript que descrevem o formato
  dos dados (uma conversa, uma mensagem, as configurações, o payload MQTT). É o
  contrato que todas as camadas seguem.

- **Banco (`src/database`)** — abre o SQLite uma única vez e cria as três tabelas
  na primeira execução: `settings` (apelido e broker), `conversations` (as salas)
  e `messages` (o histórico). Ao excluir uma conversa, suas mensagens são apagadas
  junto (cascata).

- **Repositórios (`src/repositories`)** — são as funções que leem e gravam no
  banco. Há um para cada tabela: configurações, conversas e mensagens. As telas
  usam os repositórios e **nunca** escrevem SQL direto.

- **Serviço MQTT (`src/services/mqttService.ts`)** — cuida da conexão com o
  broker. O ponto central do projeto: o app mantém **uma única conexão** que assina
  todos os tópicos das conversas. Nunca se abre uma conexão por conversa.

- **Hook `useMqtt` (`src/hooks`)** — junta as duas coisas: conecta uma vez quando
  há configurações válidas, assina os tópicos das conversas, recebe as mensagens,
  salva no banco e avisa a tela. É aqui também que o app **ignora o eco** da
  própria mensagem (cada aparelho tem um `clientId`; quando chega de volta uma
  mensagem com o mesmo `clientId`, ela é descartada para não duplicar).

- **Componentes e telas (`src/components`, `src/screens`)** — a parte visual. São
  três telas: **Ajustes**, **Conversas** e **Chat**, alternadas por estado, sem
  biblioteca de navegação. Toda a aparência é feita com o `StyleSheet` do próprio
  React Native.

- **`App.tsx`** — a raiz, que decide qual tela mostrar e liga tudo. Repare que a
  primeira linha dele importa um *polyfill* de `Buffer`, necessário para o cliente
  MQTT funcionar dentro do React Native.

### Algumas decisões importantes do projeto

- **Uma conexão só.** Não importa quantas conversas existam, há uma única conexão
  MQTT. O protocolo permite assinar vários tópicos na mesma conexão, então abrir
  uma por conversa seria desperdício e fonte de erro.

- **Histórico que persiste.** Como as mensagens ficam no SQLite, elas continuam lá
  depois de fechar e reabrir o app.

- **Não derrubar o app por erro de conexão.** Se o broker estiver errado ou fora
  do ar, o status fica vermelho (`erro`), mas o app continua de pé e os **Ajustes
  permanecem acessíveis** para corrigir o endereço.

- **Validações de entrada.** O tópico não pode ser vazio, ter espaços ou os
  curingas `#` e `+`; o host do broker não aceita espaços nem esquema (`wss://`);
  e não dá para enviar mensagem em branco. Tudo isso é barrado com aviso antes de
  tentar qualquer coisa.

Se quiser ir mais fundo em qualquer um desses pontos, as especificações completas
estão na pasta `docs/` do material da disciplina, e o `README.md` deste projeto
mostra exatamente qual arquivo cobre cada requisito.

---

## Erros comuns

| Erro | O que fazer |
|---|---|
| `ReferenceError: File is not defined` ao instalar | O Codespace está em Node 18. Rode `nvm install 20 && nvm use 20` e repita. |
| `Cannot find module ...` ao rodar | Faltou instalar. Rode `npm install` de novo na raiz do projeto. |
| Web falha no banco (`wa-sqlite.wasm` / `SharedArrayBuffer`) | `npx expo start -c` e `w`. Persistindo, teste no Expo Go com `npx expo start --tunnel`. |
| Tela branca ou erro vermelho no app | `Ctrl+C`, leia a mensagem do terminal e tente `npx expo start -c`. |
| `npm test` parece travar | É normal demorar na primeira vez (ele prepara o ambiente de teste). Aguarde. |
