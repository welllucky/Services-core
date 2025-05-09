# Changelog

## [1.2.0](https://github.com/welllucky/Services-core/compare/v1.1.0...v1.2.0) (2025-05-09)


### Features

* :art: Refatora e melhora o fluxo de autenticação - Simplifica a lógica condicional para validação de sessão.  - Simplifica a recuperação de token removendo chamadas assíncronas desnecessárias e simplificando a desestruturação de objetos.  - Habilita middlewares globais para rastreamento de solicitações, formatação de resposta e registro em log. ([183e7da](https://github.com/welllucky/Services-core/commit/183e7da535e0060eca59cdd5bb843edb9c1f0a19))
* :sparkles: Adiciona decorador IsPublic e refatora guardas e controladores para suporte a rotas públicas, melhorando a segurança e a organização do código ([9f1d656](https://github.com/welllucky/Services-core/commit/9f1d6562914f0aa514cffef3f4edad0fc33e6989))
* :sparkles: Adiciona suporte para filtragem de tickets pelo resolutor e implementa novos endpoints para iniciar e resolver tickets ([94473b2](https://github.com/welllucky/Services-core/commit/94473b258f4174e446934d04c527d3be0f8dec46))
* :sparkles: Altera colunas de ID para uso de incremento em entidades e refatora serviços e controladores de Role e Sector para melhorar a consistência e legibilidade do código ([4d72ad0](https://github.com/welllucky/Services-core/commit/4d72ad089351e621542ea89bd5e99906bc51f3fa))
* :sparkles: Implementa acesso a endpoints a partir da role do usuário ([d279bb2](https://github.com/welllucky/Services-core/commit/d279bb28efabb2f3740c909e5c4a9bc535ed8621))
* :sparkles: Implementa camada extra de proteção para a aplicação - Helmet ([01affe0](https://github.com/welllucky/Services-core/commit/01affe0a4c6ae77c2a7fefc0b665fce28180d06f))
* :sparkles: Implementa logging na chamadas feitas para a aplicação ([2268151](https://github.com/welllucky/Services-core/commit/2268151679602ad5373109230e498dd0b36c8dee))
* :sparkles: Implementa o rate limit na aplicação ([675314b](https://github.com/welllucky/Services-core/commit/675314b3435979b7eee7e559c1a5435ebedc7b53))
* :sparkles: Refatora serviços e controladores de Role e Sector para utilizar DTOs sem ID, melhorando a consistência e a legibilidade do código ([8f68126](https://github.com/welllucky/Services-core/commit/8f6812644f38bc6da3124cde7c56621e94687e63))
* :sparkles: Substitui bcrypt por bcryptjs em serviços de criptografia e testes, garantindo compatibilidade e consistência no uso da biblioteca ([4962488](https://github.com/welllucky/Services-core/commit/49624885eece074230421a367bf5e2df9490b0e5))
* :sparkles: Substitui bcrypt por bcryptjs em serviços de criptografia e testes, garantindo compatibilidade e consistência no uso da biblioteca ([2276749](https://github.com/welllucky/Services-core/commit/2276749de9a98917c0688344cf4e8f9992691c42))

## [1.2.0](https://github.com/welllucky/Services-core/compare/v1.1.0...v1.2.0) (2025-05-09)

### Features

-   :art: Refatora e melhora o fluxo de autenticação - Simplifica a lógica condicional para validação de sessão. - Simplifica a recuperação de token removendo chamadas assíncronas desnecessárias e simplificando a desestruturação de objetos. - Habilita middlewares globais para rastreamento de solicitações, formatação de resposta e registro em log. ([37a41ba](https://github.com/welllucky/Services-core/commit/37a41bad171428bff7901f3bb86071b184de403a))
-   :sparkles: Adiciona decorador IsPublic e refatora guardas e controladores para suporte a rotas públicas, melhorando a segurança e a organização do código ([9178aa2](https://github.com/welllucky/Services-core/commit/9178aa25d308461cf8fc083d3e30eacefed5cc27))
-   :sparkles: Adiciona suporte para filtragem de tickets pelo resolutor e implementa novos endpoints para iniciar e resolver tickets ([94473b2](https://github.com/welllucky/Services-core/commit/94473b258f4174e446934d04c527d3be0f8dec46))
-   :sparkles: Altera colunas de ID para uso de incremento em entidades e refatora serviços e controladores de Role e Sector para melhorar a consistência e legibilidade do código ([5430701](https://github.com/welllucky/Services-core/commit/54307013ae4188cd24ab1df8d2fb2cf9008a5a1a))
-   :sparkles: Implementa acesso a endpoints a partir da role do usuário ([b9b0c1d](https://github.com/welllucky/Services-core/commit/b9b0c1d675ed1375220ae23a0a8e2908019d65bc))
-   :sparkles: Implementa camada extra de proteção para a aplicação - Helmet ([8874bbc](https://github.com/welllucky/Services-core/commit/8874bbc9f5d0ad0c50685548f0126fa58f99a73e))
-   :sparkles: Implementa logging na chamadas feitas para a aplicação ([17f2b68](https://github.com/welllucky/Services-core/commit/17f2b684e56f965f5e999805d443df7ef0b9b5be))
-   :sparkles: Implementa o rate limit na aplicação ([f3be3ec](https://github.com/welllucky/Services-core/commit/f3be3ec6ab11819d09797ac8550c6e18b25b79dc))
-   :sparkles: Refatora serviços e controladores de Role e Sector para utilizar DTOs sem ID, melhorando a consistência e a legibilidade do código ([0486c1b](https://github.com/welllucky/Services-core/commit/0486c1bbf41e325ee774af9091e75a7fa72695fd))
-   :sparkles: Substitui bcrypt por bcryptjs em serviços de criptografia e testes, garantindo compatibilidade e consistência no uso da biblioteca ([aa03868](https://github.com/welllucky/Services-core/commit/aa038683863720aff21265772583b124a4b367f1))
-   :sparkles: Substitui bcrypt por bcryptjs em serviços de criptografia e testes, garantindo compatibilidade e consistência no uso da biblioteca ([2276749](https://github.com/welllucky/Services-core/commit/2276749de9a98917c0688344cf4e8f9992691c42))

## [1.1.0](https://github.com/welllucky/Services-core/compare/v1.0.0...v1.1.0) (2025-03-15)

### Features

-   :sparkles: Adiciona endpoint para buscar tickets em progresso e refatora a função de busca para aceitar parâmetros de paginação ([cfc6cfa](https://github.com/welllucky/Services-core/commit/cfc6cfae6f1b9798253db06ac70732e02dd30687))
-   :sparkles: Adiciona o campo 'date' ao serviço de tickets e atualiza a função de recuperação de usuário para tratar erros ([49e8d8d](https://github.com/welllucky/Services-core/commit/49e8d8d28d781ef4f326bef29ef0c0296c3a0ea3))
-   :sparkles: Adiciona workflows do GitHub para build, rotulagem e gerenciamento de lançamentos ([193462d](https://github.com/welllucky/Services-core/commit/193462d471cc590499a06607282b1616b8c7c5db))
-   :sparkles: Atualiza DTOs de Role e Sector para incluir o campo 'id' e remover parametros desnecessários ([15719e4](https://github.com/welllucky/Services-core/commit/15719e4d3ba1e0ade4039f820d4db547aa464b80))
-   :sparkles: Mescla busca de tickets na feature de tickets ([1539cf6](https://github.com/welllucky/Services-core/commit/1539cf676ec03fc8dae40b077752380f6dafd9ea))

## 1.0.0 (2025-02-03)

### Features

-   :sparkles: Adiciona configuração de CORS e simplifica a verificação do ambiente de desenvolvimento ([40087c6](https://github.com/welllucky/Services-core/commit/40087c6bad8fffc9a20724c2e806eb17339d1fc5))
-   :sparkles: Adiciona configuração de logger e habilita CORS na inicialização do aplicativo ([d4b99f9](https://github.com/welllucky/Services-core/commit/d4b99f923cc79896ce7de235a6a59b7ab1c3c4d4))
-   :sparkles: Adiciona configuração do Husky com scripts de pré-commit e pré-push ([a05531a](https://github.com/welllucky/Services-core/commit/a05531ad33c39711e05567e74ccb560d18823866))
-   :sparkles: Adiciona constantes, funções de criação de token e mocks para testes ([a3ce69a](https://github.com/welllucky/Services-core/commit/a3ce69a9c9c4022189c3818ac7b7c69f307ca888))
-   :sparkles: Adiciona controlador de aplicação e serve arquivo HTML estático ([1bfa266](https://github.com/welllucky/Services-core/commit/1bfa266db30de296da7e9043096265400e6b9775))
-   :sparkles: Adiciona DTOs de criação e atualização de usuário, implementa subscriber para criptografia de senha e atualiza controlador de sessão ([c1270bc](https://github.com/welllucky/Services-core/commit/c1270bcb8896459d16833a47b46c2766f3f28a3c))
-   :sparkles: Adiciona entidades e repositórios para gerenciamento de usuários, sessões e eventos ([227f00a](https://github.com/welllucky/Services-core/commit/227f00a22ce8b9fd79ce85a568518ca45438541a))
-   :sparkles: Adiciona integração com Sentry para monitoramento e rastreamento de erros ([b1675d4](https://github.com/welllucky/Services-core/commit/b1675d488cc8eb0eb90cfe25c8b421c8c94d4c10))
-   :sparkles: Adiciona módulo de role e atualiza módulo de setor para incluir dependências de função ([823fa8d](https://github.com/welllucky/Services-core/commit/823fa8dd41927725a46f5ffee0986e41db8618a0))
-   :sparkles: Adiciona módulo de sessão com tipos, controladores e serviços, além de novas funções utilitárias ([58705b1](https://github.com/welllucky/Services-core/commit/58705b1fc9ccfb10e4be96409d16082e15d38bb4))
-   :sparkles: Adiciona módulo de setor com DTOs, entidade e repositório ([6500806](https://github.com/welllucky/Services-core/commit/6500806f2418d564035e00f3d116383b6af95636))
-   :sparkles: Adiciona módulo de tickets ([1cbc730](https://github.com/welllucky/Services-core/commit/1cbc730be728514b70c7e8fafe537221cca286a4))
-   :sparkles: Adiciona novos filtros e middlewares, refatora DTOs e atualiza a estrutura de módulos ([be405fa](https://github.com/welllucky/Services-core/commit/be405faf9b95e800d4c77abe741350333aea79d3))
-   :sparkles: Adiciona os controllers, entidades e etc do projeto services ([709449d](https://github.com/welllucky/Services-core/commit/709449db89262155c349dca8deada28a860b6395))
-   :sparkles: Adiciona repositórios para usuário e sessão, atualiza esquemas e funções de criptografia de senha, e refatora módulos e interfaces ([8e54077](https://github.com/welllucky/Services-core/commit/8e54077bd7c98eee9db8448bfd0ebca0de0dc362))
-   :sparkles: Adiciona script de inicialização para produção e atualiza dependências no package.json ([dbce7c7](https://github.com/welllucky/Services-core/commit/dbce7c7f24c80744fbc4454b9ccb65f57e1a566a))
-   :sparkles: Adiciona suporte à paginação em serviços e repositórios de usuários e sessões ([3b6014a](https://github.com/welllucky/Services-core/commit/3b6014a647f88cb99b592f66ad93ac98a1cc7dbc))
-   :sparkles: Adiciona suporte para assistir a ativos e renomeia o arquivo HTML para o diretório src com idioma pt-BR ([a666927](https://github.com/welllucky/Services-core/commit/a66692792596f35f7bd6d0d10531b9a03f1c2173))
-   :sparkles: Adiciona validadores de usuário, refatora DTOs e implementa novo subscriber para sessões ([43c9082](https://github.com/welllucky/Services-core/commit/43c908224d24c0710fe5b465e9efdbe1d905293d))
-   :sparkles: Adiciona workflows do GitHub para build, rotulagem e gerenciamento de lançamentos ([b38c22b](https://github.com/welllucky/Services-core/commit/b38c22b4e670915d79f92b20c324984b5b217b2d))
-   :sparkles: Altera a identificação do usuário de registro para ID nas funções de busca e atualização de sessão ([c4f86e4](https://github.com/welllucky/Services-core/commit/c4f86e451701529d239a7cfecdc83a7521947f46))
-   :sparkles: Atualiza a configuração de relações nos repositórios e ajusta a criação de usuários para utilizar métodos simplificados ([85a796d](https://github.com/welllucky/Services-core/commit/85a796de7c444cd802c8ef2e5baa6597886cbbdf))
-   :sparkles: Atualiza a entidade de usuário para usar relacionamentos com os módulos de cargo e setor, e ajusta o repositório e serviço de usuário para suportar essas alterações ([a6adab0](https://github.com/welllucky/Services-core/commit/a6adab07c82f64761ef8b8594c4cdad0818bca92))
-   :sparkles: Atualiza dependências no package.json e pnpm-lock.yaml, adicionando novos pacotes ([1035327](https://github.com/welllucky/Services-core/commit/10353278fcbe745b434c94c726387acc2229f111))
-   :sparkles: Implementa o endpoint de Users ([d43fde8](https://github.com/welllucky/Services-core/commit/d43fde86e84a7a6646048379d743ea03315d0ba1))
-   :sparkles: Refatora entidades de endereço, empresa, filial e tema, renomeando propriedades e removendo a entidade de esquema de cores ([9b145bb](https://github.com/welllucky/Services-core/commit/9b145bb1c03c8eea2fdf2dfac5dad7218c41691f))
-   :sparkles: Refatora middlewares, atualiza validações e adiciona configuração do ESLint ([c19b475](https://github.com/welllucky/Services-core/commit/c19b4754946407da766a09e3a1c1f1664a4768fa))
-   :tada: Criando o projeto Services Core ([1938b6c](https://github.com/welllucky/Services-core/commit/1938b6cffcfe7ddc005111d6541da64f534b6a3f))
-   :wrench: Corrige e sincroniza o eslint com prettier ([4a87b6c](https://github.com/welllucky/Services-core/commit/4a87b6c6137ef24952f9a37f692e60d0d7f653da))

### Bug Fixes

-   :bug: Corrige a busca de sessão para aceitar o register ou id do usuário para retornar as sessões ([589d47a](https://github.com/welllucky/Services-core/commit/589d47a86eaa117712d3dcd33a9f74fc8094337c))
