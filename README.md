![Logo](https://services-buckt-dev.s3.us-east-1.amazonaws.com/public/Services+-+Capa.png)

# ⛓️‍💥Desburocratizador do gerenciamento de chamados

Se você já algum dia precisou abrir um chamado sabe o quão chato e burocratico esse processo é. E formulários e mais formulários, sistemas tão antigos que fazem o windows 7 parecer uma arte minimalista.

Pensando em trazer algo mais moderno para esse tipo de sistema surgiu o Services, um aplicativo Helpdesk/Service Desk que tem como objetivo resolver o problema de resolver problemas.

Chega de formulários gigantes ou mal diagramados, chega de adicionar informações duvidosas, não é como você sempre coloque seu chamado com a prioridade alta, não é?

## 🎉 Bem vindo ao Services!

O Services vem para trazer uma experiência um pouco diferente na hora de registar o seu problema, são três etapas:

- Você diz o que aconteceu
- Adiciona, ou não, as evidências
- E verifica se tá tudo ok para registrar, simples.

Você não precisa saber para quem enviar, qual o setor responsável, qual é a urgência do seu chamado ou algo do tipo. O Services se encarrega por isso, e não é só isso, o Services:

![Logo](https://services-buckt-dev.s3.us-east-1.amazonaws.com/public/Funcionalidades.png)

## 📃 Licença

Para isso o Services possui a licença [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/), isso significa que:

- Liberdade de Uso: Você pode usar este software para qualquer finalidade.

- Liberdade de Distribuição: Você pode redistribuir cópias deste software.
- Liberdade de Modificação: Você pode modificar o software e distribuir essas modificações, desde que também estejam sob a GNU GPLv3.

- Distribuição de Código-Fonte: Ao distribuir o software, seja de forma modificada ou não, você deve disponibilizar o código-fonte completo.

- Uso em Rede: Se você modificar este software e permitir que outros o utilizem através de uma rede (por exemplo, um aplicativo web), você deve disponibilizar o código-fonte da sua versão modificada para esses usuários.

Saiba mais clicando no link ao lado: [GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

## 🛠 Stack utilizada

**Front-end:** Next 14, Styled Components, Zustand, Typescript

**Back-end:** Node, TypeOrm, Nest, MySql

**Testes:** Playwright, React Testing Library, Jest

## 💾 Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/welllucky/Services-core
```

Entre no diretório do projeto

```bash
  cd Services
```

Instale as dependências

```bash
  pnpm i # ou rode npm install
```

Inicie o servidor

```bash
  pnpm dev # ou rode npm run dev
```

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

### Obrigatórias

`NODE_ENV` - development | production

`HOST_ENV` - development | qas | pre-stage | production

`APPLICATION_PORT` - Porta onde a aplicação está rodando

`BASE_URL` - Url da aplicação

`DB_HOST` - Host do banco de dados, não necessário ao usar o SQlite

`DB_PORT` - Porta do banco de dados, não necessário ao usar o SQlite

`DB_USER` - Usuário do banco de dados, não necessário ao usar o SQlite

`DB_PASSWORD` - Usuário do banco de dados, não necessário ao usar o SQlite

`DB_NAME` - Nome do banco de dados, não necessário ao usar o SQlite

`DB_DIALECT` - mysql | postgres | sqlite | db2 | mariadb | mssql

`DB_STORAGE` - Nome do arquivo utilizado para armazenar os dados, exlusivo do SQlite

`DB_CA`

`AUTH_SECRET`

### Opcionais

`SENTRY_PROJECT`

`SENTRY_ORG`

`SENTRY_DSN`

`SENTRY_AUTH_TOKEN`

`CRON_SECRET`

`PORT`

`CI`

## Autores

- [@welllucky](https://github.com/welllucky)
