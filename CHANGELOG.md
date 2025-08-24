# Changelog

## [1.2.0](https://github.com/welllucky/Services-core/compare/v1.1.0...v1.2.0) (2025-08-24)


### Features

* :art: Refatora e melhora o fluxo de autenticação - Simplifica a lógica condicional para validação de sessão.  - Simplifica a recuperação de token removendo chamadas assíncronas desnecessárias e simplificando a desestruturação de objetos.  - Habilita middlewares globais para rastreamento de solicitações, formatação de resposta e registro em log. ([887e88d](https://github.com/welllucky/Services-core/commit/887e88d374675b7a0ddf77fe58d7df66ae9bd2ab))
* :lock: Isola os endpoints do backoffice somente para roles de alto nível ([6e3b2d3](https://github.com/welllucky/Services-core/commit/6e3b2d3aecd30317298d3107db617998ca70df94))
* :sparkles: Adiciona decorador IsPublic e refatora guardas e controladores para suporte a rotas públicas, melhorando a segurança e a organização do código ([af9991f](https://github.com/welllucky/Services-core/commit/af9991f8dcb794cb83ea906c85d7c362c0307c7d))
* :sparkles: Adiciona suporte para filtragem de tickets pelo resolutor e implementa novos endpoints para iniciar e resolver tickets ([94473b2](https://github.com/welllucky/Services-core/commit/94473b258f4174e446934d04c527d3be0f8dec46))
* :sparkles: Altera colunas de ID para uso de incremento em entidades e refatora serviços e controladores de Role e Sector para melhorar a consistência e legibilidade do código ([56af290](https://github.com/welllucky/Services-core/commit/56af290039823c351201b5a7e7c85a4cf4409754))
* :sparkles: Implementa acesso a endpoints a partir da role do usuário ([35499ff](https://github.com/welllucky/Services-core/commit/35499ffb26dfa3c5982d0e1051d8e3fbf4acfc42))
* :sparkles: Implementa camada extra de proteção para a aplicação - Helmet ([3f7669a](https://github.com/welllucky/Services-core/commit/3f7669ab7f57a1b562bc9cd3265acbba621b9070))
* :sparkles: Implementa logging na chamadas feitas para a aplicação ([bff5a3a](https://github.com/welllucky/Services-core/commit/bff5a3abda6fc61015290f9cd665fb61d2fea963))
* :sparkles: Implementa o módulo de conta na aplicação e retira a responsabilidade dos controles de acesso e recursos do usuário ([1e5346b](https://github.com/welllucky/Services-core/commit/1e5346b41f18a4f69fb955bdeabf397ef90b9316))
* :sparkles: Implementa o rate limit na aplicação ([41c4bf5](https://github.com/welllucky/Services-core/commit/41c4bf539e5f1893d60df05a72597028fad4e9bd))
* :sparkles: Refatora serviços e controladores de Role e Sector para utilizar DTOs sem ID, melhorando a consistência e a legibilidade do código ([ba41818](https://github.com/welllucky/Services-core/commit/ba418187701d5fdd6462ef6b436af5b9992089f4))
* :sparkles: Substitui bcrypt por bcryptjs em serviços de criptografia e testes, garantindo compatibilidade e consistência no uso da biblioteca ([f311d5d](https://github.com/welllucky/Services-core/commit/f311d5dd0d1d626644deabee4bff165fff576583))
* :sparkles: Substitui bcrypt por bcryptjs em serviços de criptografia e testes, garantindo compatibilidade e consistência no uso da biblioteca ([2276749](https://github.com/welllucky/Services-core/commit/2276749de9a98917c0688344cf4e8f9992691c42))


### Bug Fixes

* :wrench: Configura pool com o banco de dados ([f188861](https://github.com/welllucky/Services-core/commit/f1888612c4373575873818f720114d4e2ee58c1b))
