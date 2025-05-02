# Use uma imagem base do Node.js
FROM node:20-alpine AS builder

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie os arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instale o gerenciador de pacotes PNPM
RUN npm install -g pnpm

# Instale as dependências
RUN pnpm install --frozen-lockfile

# Copie o restante dos arquivos da aplicação
COPY . .

# Compile a aplicação
RUN pnpm build

# Use uma imagem mais leve para o ambiente de produção
FROM node:20-alpine AS production

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie apenas os arquivos necessários para rodar a aplicação
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

# Ou, se preferir, adicionar diretamente ao ambiente do container
ENV NODE_ENV=production \
    HOST_ENV=development \
    CI=false \
    PORT=4000

# Exponha a porta da aplicação
EXPOSE 4000

# Comando para iniciar a aplicação
CMD ["node", "-r", "dotenv/config", "dist/src/main"]
