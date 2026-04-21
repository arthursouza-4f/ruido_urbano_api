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

O servidor sobe na porta **3001**.

---

## Endpoints

Todas as rotas aceitam e retornam `application/json`. Rotas protegidas exigem o header:

```
Authorization: Bearer <token>
```

### Autenticação — `/api/users`

| Método | Rota                  | Auth | Descrição            |
|--------|-----------------------|------|----------------------|
| POST   | `/api/users/register` | —    | Cadastra um usuário  |
| POST   | `/api/users/login`    | —    | Autentica um usuário |

**Body:** `{ "email": "...", "password": "..." }`

**Regras de senha:** mínimo 8 caracteres, ao menos uma letra maiúscula e um número.

**Rate limit:** máximo de 10 requisições a cada 15 minutos por IP em ambas as rotas.

---

### Ruídos — `/api/noises`

| Método | Rota                     | Auth | Descrição                                     |
|--------|--------------------------|------|-----------------------------------------------|
| POST   | `/api/noises/create`     | ✅   | Cria um novo ruído                            |
| GET    | `/api/noises/list`       | ✅   | Lista ruídos próximos (busca geoespacial)    |
| PATCH  | `/api/noises/:id/vote`   | ✅   | Vota em um ruído existente                    |

**Body — `POST /create`:**
```json
{
  "title": "...",
  "description": "...",
  "image": "...",
  "category": "...",
  "appellant": false,
  "agent": "...",
  "location": { "type": "Point", "coordinates": [lng, lat] }
}
```

**Query params — `GET /list`:**

| Param    | Obrigatório | Descrição                                           |
|----------|-------------|-----------------------------------------------------|
| `lng`    | ✅          | Longitude do ponto central da busca                 |
| `lat`    | ✅          | Latitude do ponto central da busca                  |
| `radius` | —           | Raio da busca em metros (padrão: `1000`)            |

---

### Categorias — `/api/category`

| Método | Rota                         | Auth | Descrição                       |
|--------|------------------------------|------|---------------------------------|
| POST   | `/api/category/create`       | —    | Cria uma nova categoria         |
| GET    | `/api/category/list`         | —    | Lista todas as categorias       |
| PUT    | `/api/category/update/:id`   | —    | Atualiza uma categoria pelo id  |
| DELETE | `/api/category/delete/:id`   | —    | Remove uma categoria pelo id    |

**Body — `POST /create` e `PUT /update/:id`:**
```json
{
  "title": "Barulho excessivo",
  "icon": "volume-up"
}
```

---

### Agentes — `/api/agents`

| Método | Rota                       | Auth | Descrição                     |
|--------|----------------------------|------|-------------------------------|
| POST   | `/api/agents/create`       | —    | Cria um novo agente           |
| GET    | `/api/agents/list`         | —    | Lista todos os agentes        |
| PUT    | `/api/agents/update/:id`   | —    | Atualiza um agente pelo id    |
| DELETE | `/api/agents/delete/:id`   | —    | Remove um agente pelo id      |

**Body — `POST /create` e `PUT /update/:id`:**
```json
{
  "title": "Polícia Militar",
  "icon": "shield"
}
```

---

## Rate limit global

Todas as rotas da API possuem um rate limit global de **100 requisições a cada 15 minutos por IP**.

---

## Dependências

| Pacote               | Por que usamos                                                                 |
|----------------------|--------------------------------------------------------------------------------|
| `express`            | Framework HTTP que define as rotas e middlewares da API.                       |
| `mongoose`           | ODM para conectar e modelar os dados no MongoDB.                               |
| `bcrypt`             | Faz o hash das senhas antes de salvar e as compara no login com segurança.     |
| `jsonwebtoken`       | Gera e assina o token JWT devolvido ao cliente após autenticação.              |
| `dotenv`             | Carrega as variáveis do `.env` no `process.env` em desenvolvimento.            |
| `cors`               | Libera requisições cross-origin apenas para a origin configurada no `.env`.   |
| `helmet`             | Adiciona headers HTTP de segurança para proteger contra ataques comuns.        |
| `express-rate-limit` | Limita requisições por IP nas rotas de auth para mitigar força bruta.          |
