# Forum Academico UNIFEI

Sistema de forum academico desenvolvido para a Universidade Federal de Itajuba (UNIFEI). Plataforma completa para discussoes academicas, compartilhamento de arquivos e comunicacao entre alunos e professores.

## Descricao

O Forum Academico UNIFEI e uma aplicacao web moderna que facilita a interacao entre estudantes e docentes, oferecendo recursos como:

- Sistema de topicos e respostas organizados por disciplina
- Mural de recados com categorizacao por tipo de aviso
- Upload e compartilhamento de arquivos
- Sistema de votacao em respostas
- Gerenciamento de usuarios, disciplinas e categorias
- Interface responsiva com design baseado na identidade visual da UNIFEI

## Tecnologias Utilizadas

### Backend
- Node.js v18+
- Express.js 4.18
- MySQL 8.0
- Multer (upload de arquivos)
- CORS

### Frontend
- HTML5
- CSS3 (Sistema de Design customizado)
- JavaScript ES6+
- Fetch API

### Ferramentas de Desenvolvimento
- Python 3 (servidor de desenvolvimento frontend)
- Selenium WebDriver (testes automatizados)
- Firefox (testes)

## Estrutura do Projeto
```
forum-academico/
├── backend/
│   ├── config/
│   │   ├── database.js           # Configuracao do pool MySQL
│   │   ├── init-arquivos.js      # Tabela de arquivos
│   │   ├── init-mural.js         # Tabela de mural com tipo_aviso
│   │   ├── fix-usuarios.js       # Universidade_id opcional
│   │   └── seed-data.js          # Dados iniciais
│   ├── routes/
│   │   ├── usuarios.js
│   │   ├── disciplinas.js
│   │   ├── topicos.js
│   │   ├── respostas.js
│   │   ├── recados.js
│   │   ├── categorias.js
│   │   ├── votos.js
│   │   └── arquivos.js
│   ├── uploads/                  # Diretorio de arquivos
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── style.css             # Sistema de Design UX/UI
│   ├── js/
│   │   └── script.js             # Logica da aplicacao
│   └── index.html
├── screenshots_teste/            # Screenshots dos testes
├── test_selenium_completo.py     # Suite de testes
├── popular-dados.sql             # Script SQL de dados iniciais
└── README.md
```

## Requisitos do Sistema

- Node.js 18.0 ou superior
- MySQL 8.0 ou superior
- Python 3.8+ (para servidor frontend e testes)
- Firefox (para testes Selenium)
- Sistema operacional: Windows/Linux/macOS

## Instalacao

### 1. Configuracao do Banco de Dados

Acesse o MySQL:
```bash
mysql -u root -p
```

Execute os comandos SQL:
```sql
CREATE DATABASE forum_academico CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE forum_academico;
```

Importe as tabelas do schema fornecido ou deixe o sistema criar automaticamente.

### 2. Instalacao do Backend
```bash
cd backend
npm install
```

Configure o arquivo `config/database.js` com suas credenciais MySQL:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'forum_academico',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### 3. Popular Dados Iniciais

Execute o script SQL para criar usuarios, disciplinas e categorias base:
```bash
mysql -u root -p forum_academico < popular-dados.sql
```

Este script cria:
- 3 usuarios iniciais (Admin, Professor, Aluno)
- 3 disciplinas base
- 3 categorias de topicos

### 4. Instalacao de Dependencias de Teste
```bash
pip install selenium
```

Certifique-se de ter o geckodriver instalado para Firefox.

## Executando a Aplicacao

### Iniciar Backend
```bash
cd backend
npm start
```
Servidor rodando em: http://localhost:3000

### Iniciar Frontend
```bash
cd frontend
python3 -m http.server 8000
```
Aplicacao disponivel em: http://localhost:8000

## Funcionalidades Detalhadas

### 1. Mural de Recados
- Criacao de avisos com 4 tipos de classificacao:
  - Importante: avisos criticos e urgentes
  - Evento: informacoes sobre eventos academicos
  - Geral: comunicados gerais
  - Aviso da Faculdade: comunicados institucionais
- Opcao de fixar recados importantes
- Visualizacao com badges coloridas por tipo

### 2. Gestao de Usuarios
- Cadastro sem obrigatoriedade de universidade
- Tipos: Aluno, Professor, Administrador
- Vinculo com curso e periodo
- Sistema de autenticacao (senha hash)

### 3. Disciplinas
- Vinculo com curso
- Atribuicao de professor responsavel
- Codigo unico de identificacao

### 4. Topicos e Discussoes
- Criacao de topicos por disciplina
- Sistema de categorias
- Status: Aberto, Resolvido, Fechado
- Contagem de respostas e visualizacoes

### 5. Sistema de Respostas
- Resposta a topicos
- Sistema de votacao (positivo/negativo)
- Ordenacao por relevancia

### 6. Upload de Arquivos
- Suporte a multiplos formatos
- Limite de 10MB por arquivo
- Preview de imagens
- Vinculo com topicos ou respostas
- Sistema de busca e filtragem
- Download seguro

## API Endpoints

### Usuarios
- GET /api/usuarios - Listar todos
- POST /api/usuarios - Criar novo
- PUT /api/usuarios/:id - Atualizar
- DELETE /api/usuarios/:id - Deletar

### Disciplinas
- GET /api/disciplinas - Listar todas
- POST /api/disciplinas - Criar nova
- PUT /api/disciplinas/:id - Atualizar
- DELETE /api/disciplinas/:id - Deletar

### Topicos
- GET /api/topicos - Listar todos
- POST /api/topicos - Criar novo
- PUT /api/topicos/:id - Atualizar
- DELETE /api/topicos/:id - Deletar

### Respostas
- GET /api/respostas - Listar todas
- POST /api/respostas - Criar nova
- PUT /api/respostas/:id - Atualizar
- DELETE /api/respostas/:id - Deletar

### Recados
- GET /api/recados - Listar todos
- POST /api/recados - Criar novo
- PUT /api/recados/:id - Atualizar
- DELETE /api/recados/:id - Deletar

### Arquivos
- GET /api/arquivos - Listar todos
- POST /api/arquivos - Upload novo
- GET /api/arquivos/download/:nome - Download
- DELETE /api/arquivos/:id - Deletar

### Votos
- POST /api/votos - Registrar voto
- GET /api/votos/resposta/:id - Votos de uma resposta

### Categorias
- GET /api/categorias - Listar todas

## Testes Automatizados

O projeto inclui uma suite completa de testes com Selenium que valida:

- Navegacao entre abas
- Criacao de recados com diferentes tipos
- Cadastro de usuarios sem campo universidade
- Cadastro de disciplinas
- Criacao de topicos
- Registro de respostas
- Sistema de votacao
- Upload de arquivos com preview

### Executar Testes
```bash
python3 test_selenium_completo.py
```

Os testes geram screenshots automaticos em `screenshots_teste/` documentando cada etapa.

## Design e UX

O sistema segue um Design System consistente baseado em:

### Paleta de Cores
- Primaria: Azul UNIFEI (#003d7a)
- Secundaria: Vermelho UNIFEI (#c41e3a)
- Neutros: Escala de cinza (50-900)
- Status: Verde, Amarelo, Vermelho, Azul

### Espacamento
Sistema baseado em multiplos de 4px (4, 8, 16, 24, 32, 48)

### Tipografia
Escala modular: 12px, 14px, 16px, 18px, 20px, 24px

### Componentes
- Cards com sombras e hover states
- Formularios com validacao visual
- Botoes com feedback de clique
- Badges de status
- Progress bars animadas

### Responsividade
- Breakpoints: 768px (tablet), 480px (mobile)
- Grid system flexivel
- Touch-friendly (botoes 44px+)
- Prevencao de zoom em iOS

### Acessibilidade
- Focus states visiveis
- Suporte a leitores de tela
- Contraste WCAG AA
- Reducao de movimento (prefers-reduced-motion)

## Estrutura do Banco de Dados

### Tabelas Principais

**usuarios**
- id (PK)
- nome_completo
- email (UNIQUE)
- senha_hash
- tipo_usuario (Aluno, Professor, Admin)
- curso_id (FK)
- universidade_id (FK, NULL permitido)
- periodo
- timestamps

**disciplinas**
- id (PK)
- nome
- codigo (UNIQUE)
- curso_id (FK)
- professor_id (FK)
- timestamps

**topicos**
- id (PK)
- titulo
- conteudo
- disciplina_id (FK)
- usuario_id (FK)
- categoria_id (FK)
- status
- visualizacoes
- timestamps

**respostas**
- id (PK)
- conteudo
- topico_id (FK, CASCADE)
- usuario_id (FK)
- pontuacao
- timestamps

**mural_recados**
- id (PK)
- titulo
- conteudo
- usuario_id (FK)
- tipo_aviso (ENUM: importante, evento, geral, aviso_faculdade)
- fixado (BOOLEAN)
- timestamps

**arquivos**
- id (PK)
- nome_arquivo (sistema)
- nome_original
- tipo_mime
- tamanho
- usuario_id (FK)
- topico_id (FK, NULL)
- resposta_id (FK, NULL)
- timestamps

**votos**
- id (PK)
- resposta_id (FK)
- usuario_id (FK)
- voto (1 ou -1)
- UNIQUE(resposta_id, usuario_id)

## Solucao de Problemas

### Backend nao inicia
- Verifique credenciais MySQL em `config/database.js`
- Confirme que MySQL esta rodando: `systemctl status mysql`
- Verifique portas em uso: `lsof -i :3000`

### Erro de Foreign Key
- Execute `popular-dados.sql` para criar dados base
- Verifique relacionamentos no banco
- Confirme existencia de usuarios/disciplinas/categorias

### Upload de arquivos falha
- Verifique permissoes da pasta `uploads/`
- Confirme limite de tamanho (10MB)
- Verifique tipo MIME permitido

### Frontend nao carrega dados
- Verifique console do navegador (F12)
- Confirme CORS habilitado no backend
- Teste endpoints diretamente: `curl http://localhost:3000/api/usuarios`

## Melhorias Futuras

- Sistema de autenticacao JWT
- Notificacoes em tempo real (WebSocket)
- Editor de texto rico (WYSIWYG)
- Sistema de mencoes (@usuario)
- Gamificacao (badges, pontos)
- Moderacao automatica de conteudo
- API GraphQL
- Aplicativo mobile
- Modo escuro
- Internacionalizacao (i18n)

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
3. Commit suas mudancas (git commit -m 'Add some AmazingFeature')
4. Push para a branch (git push origin feature/AmazingFeature)
5. Abra um Pull Request

### Padroes de Codigo

- Use ESLint e Prettier
- Siga o guia de estilo JavaScript Standard
- Escreva testes para novas funcionalidades
- Documente funcoes e APIs
- Use commits semanticos (feat, fix, docs, style, refactor, test, chore)

## Licenca

Este projeto e de uso academico para a UNIFEI.

## Contato

Para duvidas ou sugestoes sobre o projeto, entre em contato com a coordenacao de Sistemas de Informacao da UNIFEI.

## Agradecimentos

- Universidade Federal de Itajuba (UNIFEI)
- Comunidade de desenvolvedores Node.js
- Comunidade MySQL
- Projeto Selenium

---

Desenvolvido para fins academicos - UNIFEI
Versao: 2.0.0
Ultima atualizacao: 2025
# Forum-Academico
