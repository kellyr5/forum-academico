# SISTEMA DE FÓRUM ACADÊMICO

## Identificação do Projeto

**Instituição:** Universidade Federal de Itajubá - UNIFEI  
**Curso:** Engenharia de Computação / Sistemas de Informação  
**Disciplina:** Gerência de Projetos de Software  
**Versão:** 1.0.0 - Release 0 (Produto Mínimo Viável)  
**Data de Conclusão:** Novembro de 2025  

## Equipe de Desenvolvimento

- **Gustavo Daniel Vitor** - Desenvolvedor Backend
- **Kelly Dos Reis Leite** - Analista de Qualidade
- **Luiz Raul Gomes Oliveira** - Desenvolvedor Frontend

## 1. RESUMO

Este documento apresenta o Sistema de Fórum Acadêmico, uma plataforma desenvolvida para facilitar a interação e troca de conhecimento entre docentes, discentes e monitores no ambiente universitário. O sistema foi desenvolvido seguindo metodologias ágeis de desenvolvimento de software e implementa funcionalidades essenciais de gerenciamento de usuários e disciplinas.

## 2. OBJETIVOS

### 2.1 Objetivo Geral

Desenvolver um sistema web que permita o gerenciamento de discussões acadêmicas de forma centralizada e organizada, promovendo a colaboração entre os membros da comunidade universitária.

### 2.2 Objetivos Específicos

- Implementar sistema de cadastro e autenticação de usuários
- Desenvolver módulo de gerenciamento de disciplinas
- Garantir segurança e integridade dos dados através de validações e criptografia
- Estabelecer baseline de configuração utilizando controle de versão Git
- Implementar testes automatizados para validação das funcionalidades

## 3. ARQUITETURA DO SISTEMA

### 3.1 Tecnologias Utilizadas

**Backend:**
- Node.js 20.x
- Express.js 4.18.x
- PostgreSQL 14.x
- bcrypt 5.1.x (criptografia)

**Frontend:**
- HTML5
- CSS3
- JavaScript (ES6+)

**Testes:**
- Selenium WebDriver 4.15.x
- Mocha 10.2.x
- Chai 4.3.x

**Controle de Versão:**
- Git 2.x
- GitHub

### 3.2 Arquitetura MVC

O sistema segue o padrão arquitetural Model-View-Controller (MVC):

- **Model:** Camada de dados e lógica de negócio
- **View:** Interface do usuário (HTML/CSS/JavaScript)
- **Controller:** Lógica de controle e intermediação

## 4. FUNCIONALIDADES IMPLEMENTADAS

### 4.1 Módulo de Gerenciamento de Usuários (RFC01)

- **RFS01 - Cadastrar Usuário:** Permite o registro de novos usuários no sistema
- **RFS02 - Consultar Usuário:** Permite a visualização de usuários cadastrados
- **RFS03 - Editar Usuário:** Permite a atualização de dados cadastrais
- **RFS04 - Excluir Usuário:** Permite a remoção de usuários do sistema

### 4.2 Módulo de Gerenciamento de Disciplinas (RFC02)

- **RFS05 - Cadastrar Disciplina:** Permite o registro de novas disciplinas
- **RFS06 - Consultar Disciplina:** Permite a visualização de disciplinas cadastradas

### 4.3 Funcionalidades Complementares

- Dashboard com indicadores estatísticos
- Sistema de validação de dados
- Criptografia de senhas de acesso
- Interface responsiva

## 5. REQUISITOS NÃO FUNCIONAIS

### 5.1 Segurança (RNF01)

- Criptografia de senhas utilizando algoritmo bcrypt
- Validação de formato de e-mail institucional
- Proteção contra injeção de SQL
- Conformidade com LGPD (Lei Geral de Proteção de Dados)

### 5.2 Performance (RNF02)

- Tempo de resposta inferior a 2 segundos
- Suporte para até 1000 usuários simultâneos
- Disponibilidade de 99,5%

### 5.3 Usabilidade (RNF03)

- Interface responsiva (desktop e mobile)
- Navegação intuitiva
- Conformidade com diretrizes de acessibilidade WCAG 2.1

## 6. BANCO DE DADOS

### 6.1 Modelo Relacional

O sistema utiliza PostgreSQL com o seguinte esquema:

**Tabela: universidades**
- id (PRIMARY KEY)
- nome
- created_at

**Tabela: cursos**
- id (PRIMARY KEY)
- nome
- universidade_id (FOREIGN KEY)
- created_at

**Tabela: usuarios**
- id (PRIMARY KEY)
- nome_completo
- email (UNIQUE)
- senha_hash
- universidade_id (FOREIGN KEY)
- curso_id (FOREIGN KEY)
- periodo
- tipo_usuario
- created_at
- updated_at

**Tabela: disciplinas**
- id (PRIMARY KEY)
- nome
- codigo (UNIQUE por universidade)
- universidade_id (FOREIGN KEY)
- curso_id (FOREIGN KEY)
- professor_id (FOREIGN KEY)
- periodo_letivo
- descricao
- created_at
- updated_at

## 7. API REST

### 7.1 Endpoints de Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/usuarios | Cadastro de novo usuário |
| GET | /api/usuarios | Listagem de usuários |
| GET | /api/usuarios/:id | Consulta de usuário específico |
| PUT | /api/usuarios/:id | Atualização de dados |
| DELETE | /api/usuarios/:id | Remoção de usuário |

### 7.2 Endpoints de Disciplinas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/disciplinas | Cadastro de nova disciplina |
| GET | /api/disciplinas | Listagem de disciplinas |
| GET | /api/disciplinas/:id | Consulta de disciplina específica |
| PUT | /api/disciplinas/:id | Atualização de dados |
| DELETE | /api/disciplinas/:id | Remoção de disciplina |

## 8. CONTROLE DE QUALIDADE

### 8.1 Testes Automatizados

O sistema possui 10 casos de teste automatizados utilizando Selenium WebDriver:

- **TC001 a TC006:** Testes do módulo de usuários
- **TC007 a TC010:** Testes do módulo de disciplinas

**Taxa de Sucesso:** 100%  
**Tempo Médio de Execução:** 45 segundos

### 8.2 Gestão de Problemas

Total de problemas identificados: 3  
Total de problemas resolvidos: 3  
Taxa de resolução: 100%  
Tempo médio de resolução: 30 minutos

## 9. INSTALAÇÃO E EXECUÇÃO

### 9.1 Pré-requisitos

- Node.js 14.x ou superior
- PostgreSQL 12.x ou superior
- Git 2.x

### 9.2 Procedimento de Instalação
```bash
# Clonar repositório
git clone https://github.com/kellyr5/forum-academico.git

# Instalar dependências
cd forum-academico
npm install

# Configurar banco de dados
# Consultar documentação em docs/GUIA_COMPLETO_FORUM_ACADEMICO.md

# Iniciar servidor
npm run dev
```

### 9.3 Execução de Testes
```bash
npm test
```

## 10. ESTRUTURA DO PROJETO
```
forum-academico/
├── src/
│   ├── config/          # Configurações do sistema
│   ├── controllers/     # Controladores MVC
│   ├── models/          # Modelos de dados
│   ├── routes/          # Definição de rotas
│   └── server.js        # Servidor principal
├── public/              # Interface do usuário
├── tests/               # Testes automatizados
├── docs/                # Documentação do projeto
└── README.md            # Este arquivo
```

## 11. DOCUMENTAÇÃO ADICIONAL

- **GUIA_COMPLETO_FORUM_ACADEMICO.md** - Guia completo de instalação e uso
- **CASOS_DE_TESTE.md** - Documentação dos casos de teste
- **STATUS_REPORT.md** - Relatório de status do projeto
- **BUGS_REGISTER.md** - Registro de problemas identificados

## 12. CONTROLE DE VERSÃO

**Repositório:** https://github.com/kellyr5/forum-academico  
**Sistema:** Git  
**Plataforma:** GitHub

## 13. LICENÇA

Este projeto foi desenvolvido para fins acadêmicos na Universidade Federal de Itajubá (UNIFEI).

## 14. REFERÊNCIAS

PRESSMAN, R. S.; MAXIM, B. R. **Engenharia de Software:** Uma Abordagem Profissional. 8. ed. Porto Alegre: AMGH, 2016.

SOMMERVILLE, I. **Engenharia de Software.** 10. ed. São Paulo: Pearson, 2018.

PROJECT MANAGEMENT INSTITUTE. **A Guide to the Project Management Body of Knowledge (PMBOK® Guide).** 7. ed. Newtown Square, PA: Project Management Institute, 2021.

---

**Universidade Federal de Itajubá - UNIFEI**  
**Sistema de Fórum Acadêmico - Versão 1.0.0**  
**Novembro de 2025**
