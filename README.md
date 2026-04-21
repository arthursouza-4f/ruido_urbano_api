# Ruido Urbano — API

O projeto Ruido Urbano é um projeto Open-Source onde cada pessoa pode
contribuir para torná-lo cada vez melhor. Ele não tem fins lucrativos e seu único
objetivo é ajudar a comunidade a perceber e relatar problemas do dia a dia de outras pessoas da sua comunidade.

---

## Pré-requisitos

- Node.js 18+
- MongoDB (local ou Atlas)

---

## Configuração

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
MONGO_URI=mongodb://localhost:27017/ruido_urbano
JWT_SECRET=sua_chave_secreta_aqui
CORS_ORIGIN=http://localhost:3000
```

| Variável      | Descrição                                                              |
|---------------|------------------------------------------------------------------------|
| `MONGO_URI`   | String de conexão com o MongoDB (local ou Atlas)                      |
| `JWT_SECRET`  | Chave secreta usada para assinar os tokens JWT — use algo longo e aleatório |
| `CORS_ORIGIN` | URL do frontend que terá permissão para fazer requisições à API       |

### 3. Rode o servidor

```bash
node index.js
```

O servidor sobe na porta que configura, no caso do exemplo, **3000**

---

## Endpoints

| Método | Rota                  | Descrição           |
|--------|-----------------------|---------------------|
| POST   | `/api/users/register` | Cadastra um usuário |
| POST   | `/api/users/login`    | Autentica um usuário |

Ambas as rotas aceitam `Content-Type: application/json` com corpo `{ "email": "...", "password": "..." }`.

**Regras de senha:** mínimo 8 caracteres, ao menos uma letra maiúscula e um número.

**Rate limit:** máximo de 10 requisições a cada 15 minutos por IP em ambas as rotas.

---

## Dependências

| Pacote               | Por que usamos                                                                 |
|----------------------|--------------------------------------------------------------------------------|
| `express`            | Framework HTTP que define as rotas e middlewares da API.                       |
| `mongoose`           | ODM para conectar e modelar os dados no MongoDB.                               |
| `bcrypt`             | Faz o hash das senhas antes de salvar e as compara no login com segurança.     |
| `jsonwebtoken`       | Gera e assina o token JWT devolvido ao cliente após autenticação.              |
| `dotenv`             | Carrega as variáveis do `.env` no `process.env` em desenvolvimento.            |
| `cors`               | Libera requisições cross-origin apenas para a origin configurada no `.env`.    |
| `helmet`             | Adiciona headers HTTP de segurança para proteger contra ataques comuns.        |
| `express-rate-limit` | Limita requisições por IP nas rotas de auth para mitigar força bruta.          |
