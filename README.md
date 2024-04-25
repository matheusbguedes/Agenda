# Agenda

O Agenda é uma releitura de um software desenvolvido para a @Etec no meu Trabalho de Conclusão de Curso, nele eu procurei criar uma aplicação mais moderna e segura. 

## 🚀 Começando

Estas instruções permitirão que você obtenha uma cópia do projeto em execução em sua máquina local para desenvolvimento e teste.

### 📋 Pré-requisitos

O que você precisa para instalar o software?

```
NPM - Gerenciador de pacotes
```

### 🔧 Instalação

Para instalar, siga os passos abaixo:

1. Faça uma cópia do repositório em sua máquina.
2. Configure os arquivos .env conforme necessário.


- Para o diretório 'server', configure o arquivo .env com o seguinte conteúdo:

```
DATABASE_URL=file:./dev.db
```

3. No terminal, execute:

```
npm install
```

4. Após a instalação das dependências, execute as migrações no servidor:

```
npx prisma migrate dev
```

5. Finalmente, inicie o servidor e a aplicação web:

```
npm run dev
```

O projeto estará pronto e em execução no endereço http://localhost:3000

## 🛠️ Construído com

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcnui](https://github.com/shadcnui)
- [Fastify](https://www.fastify.io/) 
- [Prisma](https://www.prisma.io/) 

## ✒️ Autores

- **Matheus Borges** - [LinkedIn](https://www.linkedin.com/in/matheus-borges-4a7469239/)

⌨️ com ❤️ por [BorgesCode](https://github.com/Borgeta-code) 😊
