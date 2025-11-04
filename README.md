Fórum Acadêmico – UNIFEI (MVP – Release 0)

Aplicação web com frontend estático (public/) e backend Node.js (src/) no mesmo repositório.
Entrega CRUD de Usuários e Disciplinas + UI com tabs.

📁 Estrutura de Pastas
.
├─ public/
│  └─ index.html
├─ src/
│  ├─ config/
│  │  └─ database.js          # conexão ao banco (ajuste aqui)
│  ├─ controllers/
│  │  ├─ disciplinaController.js
│  │  └─ usuarioController.js
│  ├─ models/
│  │  ├─ Disciplina.js
│  │  └─ Usuario.js
│  ├─ routes/
│  │  └─ index.js             # define rotas /api/usuarios e /api/disciplinas
│  └─ server.js               # inicia o servidor (porta 3000 por padrão)
├─ .gitignore
├─ package.json
└─ README.md


O index.html (frontend) consome a API em http://localhost:3000/api.
Se mudar a porta/URL do backend, altere a constante API_URL no final do public/index.html.

🧩 Tecnologias

Backend: Node.js + Express

Front: HTML5 + CSS3 (inline no index.html) + JS (Fetch API)

Banco: definido em src/config/database.js (ajustar credenciais/SQLite/etc.)

Observação: o repositório já traz controllers, models e rotas organizados (MVC leve).

▶️ Como Rodar
1) Instalar dependências

Na raiz do projeto:

npm install

2) Configurar banco de dados

Abra src/config/database.js e ajuste as variáveis conforme seu ambiente.
Exemplos comuns:

SQLite (arquivo local)

PostgreSQL/MySQL (host, porta, usuário, senha, database)

Se houver .env, crie/ajuste (ex.: PORT=3000, credenciais do banco, etc.).
Caso não exista, o server.js geralmente usa 3000 por padrão.

3) Subir o backend
node src/server.js
# ou, se tiver script:
# npm start


Você deve ver algo como:

Servidor iniciado em http://localhost:3000

4) Abrir o frontend

Opção A — Servir estático com um servidor simples:

npx serve public -l 5500
# ou
npx http-server public -p 5500 -c-1


Acesse: http://localhost:5500

Opção B — Abrir direto o arquivo public/index.html no navegador.

Se o backend bloquear CORS para file://, prefira a Opção A.

🔌 Endpoints da API
Usuários

POST /api/usuarios – Criar

GET /api/usuarios – Listar

GET /api/usuarios/:id – Buscar por ID (se implementado)

PUT /api/usuarios/:id – Atualizar (se implementado)

DELETE /api/usuarios/:id – Excluir

Exemplo de body (POST /api/usuarios):

{
  "nome_completo": "Fulano da Silva",
  "email": "fulano@unifei.edu.br",
  "senha": "SenhaSegura123",
  "universidade_id": 1,
  "curso_id": 2,
  "periodo": 3,
  "tipo_usuario": "Aluno"
}

Disciplinas

POST /api/disciplinas – Criar

GET /api/disciplinas – Listar

GET /api/disciplinas/:id – Buscar por ID (se implementado)

PUT /api/disciplinas/:id – Atualizar (se implementado)

DELETE /api/disciplinas/:id – Excluir

Exemplo de body (POST /api/disciplinas):

{
  "nome": "Redes de Computadores",
  "codigo": "XRSC01",
  "universidade_id": 1,
  "curso_id": 2,
  "professor_id": 1,
  "periodo_letivo": "2025.1",
  "descricao": "Tópicos de camada de rede e enlace"
}


A implementação exata dos contratos está nos controllers e models. Ajuste o index.html se o formato de resposta for diferente (ex.: { success, message, data }).

🧭 Fluxo na Interface (public/index.html)

Aba Usuários
Cadastrar (form), listar (botão “Atualizar Lista”) e excluir (🗑️).

Aba Disciplinas
Cadastrar, listar e excluir.

Aba Sobre
Traz informações da versão, endpoints e equipe.

🔧 Dicas & Troubleshooting

CORS: se abrir index.html como arquivo e a API bloquear, sirva via http://localhost:5500 (vide “Como rodar – Opção A”) ou habilite CORS no backend.

Banco: verifique src/config/database.js (credenciais/tipo).

Porta: se mudar a porta do backend, altere API_URL no index.html.

👥 Equipe

Gustavo Daniel Vitor

Kelly Dos Reis Leite

Luiz Raul Gomes Oliveira

Disciplina: Gerência de Projetos — UNIFEI
Release: 0 (MVP)

📄 Licença

Defina a licença (MIT/Apache-2.0/etc.) conforme desejado.