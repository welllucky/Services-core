/* eslint-disable no-console */
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { useContainer } from "class-validator";
import * as express from "express";
import helmet from "helmet";
import { join } from "path";
import { AppModule } from "./app.module";
import { accessModules, backofficeModules, coreModules } from "./modules";
import {
    configureCors,
    createAppInstance,
    enableGlobalPipes,
    enableVersioning,
} from "./utils/functions";

export class ServicesApplication {
    private app!: NestExpressApplication;
    private configService!: ConfigService;
    private isDevelopment!: boolean;

    async initialize(): Promise<void> {
        const hostEnv = process.env.HOST_ENV as "development" | "production";
        this.app = await createAppInstance(hostEnv);
        this.configService = this.app.get(ConfigService);
        this.isDevelopment = this.configService.get("HOST_ENV") === "development";
    }

    /**
     * Configura middlewares de segurança
     */
    configureSecurity(): void {
        this.app.use(helmet());
    }

    /**
     * Configura CORS
     */
    configureCors(): void {
        const clientApplicationUrl = this.configService.get("CLIENT_URL");
        configureCors(this.app, this.isDevelopment, clientApplicationUrl);
    }

    /**
     * Configura arquivos estáticos
     */
    configureStaticAssets(): void {
        this.app.use("/public", express.static(join(__dirname, "..", "public")));
    }

    /**
     * Habilita versionamento global
     */
    enableVersioning(): void {
        enableVersioning(this.app);
    }

    /**
     * Habilita pipes globais
     */
    enableGlobalPipes(): void {
        enableGlobalPipes(this.app, this.isDevelopment);
    }

    /**
     * Configura container de validação
     */
    configureValidationContainer(): void {
        useContainer(this.app.select(AppModule), { fallbackOnErrors: true });
    }

    /**
     * Configura documentação Swagger para Core API
     */
    private setupCoreApiDocumentation(): void {
        const coreConfig = new DocumentBuilder()
            .setTitle("Services Core API")
            .setDescription("Public API for Services application")
            .setVersion("1.0")
            .addBearerAuth()
            .build();

        const coreDocument = SwaggerModule.createDocument(this.app, coreConfig, {
            include: [
                ...coreModules
            ]
        });

        SwaggerModule.setup("docs/core", this.app, coreDocument, {
            customSiteTitle: "Core API - Docs",
            customfavIcon: "public/favicon.ico",
            swaggerOptions: {
                tagsSorter: "alpha",
                operationsSorter: "alpha",
                filter: true,
                displayRequestDuration: true,
            },
        });
    }

    /**
     * Configura documentação Swagger para Backoffice API
     */
    private setupBackofficeApiDocumentation(): void {
        const backofficeConfig = new DocumentBuilder()
            .setTitle("Services Backoffice API")
            .setDescription("Management API to control the Services system")
            .setVersion("1.0")
            .addBearerAuth()
            .build();

        const backofficeDocument = SwaggerModule.createDocument(this.app, backofficeConfig, {
            include: [
                ...backofficeModules
            ]
        });

        SwaggerModule.setup("docs/backoffice", this.app, backofficeDocument, {
            customSiteTitle: "Backoffice API - Docs",
            customfavIcon: "public/favicon.ico",
            swaggerOptions: {
                tagsSorter: "alpha",
                operationsSorter: "alpha",
                filter: true,
                displayRequestDuration: true,
            },
        });
    }

    /**
     * Configura documentação Swagger para Access API
     */
    private setupAccessApiDocumentation(): void {
        const authConfig = new DocumentBuilder()
            .setTitle("Services Access API")
            .setDescription("Authentication API to control the authentication and authorization of the Services system")
            .setVersion("1.0")
            .addBearerAuth()
            .build();

        const authDocument = SwaggerModule.createDocument(this.app, authConfig, {
            include: [
                ...accessModules
            ]
        });

        SwaggerModule.setup("docs/auth", this.app, authDocument, {
            customSiteTitle: "Access API - Docs",
            customfavIcon: "public/favicon.ico",
            swaggerOptions: {
                tagsSorter: "alpha",
                operationsSorter: "alpha",
                filter: true,
                displayRequestDuration: true,
            },
        });
    }

    /**
     * Configura documentação Swagger unificada
     */
    private setupUnifiedDocumentation(): void {
        const mainConfig = new DocumentBuilder()
            .setTitle("Services APIs")
            .setDescription("Full documentation of all Services APIs")
            .setVersion("1.0")
            .addBearerAuth()
            .build();

        const mainDocument = SwaggerModule.createDocument(this.app, mainConfig);

        SwaggerModule.setup("docs", this.app, mainDocument, {
            customSiteTitle: "Services - Full Documentation",
            customfavIcon: "public/favicon.ico",
            explorer: true,
            swaggerOptions: {
                urls: [
                    {
                        name: "All APIs",
                        url: "/docs/swagger.json",
                    },
                    {
                        name: "Core API (Public)",
                        url: "/docs/core/swagger.json",
                    },
                    {
                        name: "Backoffice API (Admin)",
                        url: "/docs/backoffice/swagger.json",
                    },
                    {
                        name: "Access API (Auth)",
                        url: "/docs/auth/swagger.json",
                    },
                ],
            },
            jsonDocumentUrl: "/docs/swagger.json",
        });
    }



    /**
     * Configura toda a documentação Swagger
     */
    setupSwaggerDocumentation(): void {
        // Documentações específicas por módulo
        this.setupCoreApiDocumentation();
        this.setupBackofficeApiDocumentation();
        this.setupAccessApiDocumentation();

        // Documentação unificada com dropdown
        this.setupUnifiedDocumentation();
    }

    /**
     * Inicia o servidor
     */
    async listen(): Promise<void> {
        const port = this.configService.get("PORT") ?? 4000;
        const host = this.configService.get("HOST") ?? "localhost";
        await this.app.listen(port);

        console.log(`
        🚀 Application is running!
        📝 Environment: ${this.isDevelopment ? 'Development' : 'Production'}
        🌐 Port: ${port}

        📚 Documentation URLs:
        - Unified: http://${host}:${port}/docs
        - Core API: http://${host}:${port}/docs/core
        - Backoffice API: http://${host}:${port}/docs/backoffice
        - Access API: http://${host}:${port}/docs/auth
        `);
    }

    static async bootstrap(): Promise<void> {
        const app = new ServicesApplication();

        // Inicialização
        await app.initialize();

        // Configurações de segurança
        app.configureSecurity();
        app.configureCors();

        // Configurações de assets
        app.configureStaticAssets();

        // Configurações do framework
        app.enableVersioning();
        app.enableGlobalPipes();
        app.configureValidationContainer();

        // Documentação
        app.setupSwaggerDocumentation();

        // Iniciar servidor
        await app.listen();
    }

    getApp(): NestExpressApplication {
        return this.app;
    }

    getConfigService(): ConfigService {
        return this.configService;
    }

    async close(): Promise<void> {
        await this.app.close();
    }
}