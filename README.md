# 🎓 Sistema Inteligente para Geração de Materiais Didáticos de Cultura Digital

Sistema web para apoiar professores do Ensino Fundamental e Ensino Médio na criação automática de materiais didáticos alinhados à BNCC (Base Nacional Comum Curricular), utilizando Inteligência Artificial Generativa.

## 📋 Sobre o Projeto

Este sistema foi desenvolvido para o **Hackathon de Cultura Digital** do IFPI Campus Piripiri. O projeto permite que professores:

- 📚 Cadastrem disciplinas organizadas por séries/anos escolares
- 🎯 Criem unidades de ensino (aulas) manualmente ou recebam sugestões via IA
- 📝 Gerem automaticamente planos de aula alinhados à BNCC
- ✅ Gerem atividades avaliativas coerentes com cada aula
- 🗂️ Organizem e arquivem materiais didáticos

### Tecnologias Utilizadas

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Estilização**: Tailwind CSS
- **Arquitetura**: Clean Architecture
- **IA**: Google Gemini API (Gemini 2.5 Flash)
- **Persistência**: localStorage (single-user application)

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ e npm/yarn
- Conta Google AI Studio (para API Key do Gemini)
- Navegador moderno com suporte a localStorage

### Passos para Instalação

1. **Clone o repositório** (ou faça download do código)
   ```bash
   git clone <url-do-repositorio>
   cd hacka-cultura-digital
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure a variável de ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   NEXT_PUBLIC_GOOGLE_AI_API_KEY=sua_chave_api_aqui
   ```
   
   **Como obter a API Key:**
   - Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Faça login com sua conta Google
   - Crie uma nova API Key
   - Cole a chave no arquivo `.env.local`

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

---

## 📁 Estrutura do Projeto

O projeto segue **Clean Architecture** com as seguintes camadas:

```
src/
├── core/                    # Entidades de domínio (Core)
│   └── entities/           # Subject, Unit, LessonPlan, Activity
├── repository/             # Camada de persistência
│   ├── interfaces/         # Contratos dos repositórios
│   └── implementations/    # Implementação com localStorage
├── infrastructure/         # Serviços externos
│   └── services/          # AIService, BNCCService, Generators
├── application/            # Lógica de negócio
│   ├── usecases/          # Casos de uso específicos
│   ├── services/          # Serviços de aplicação
│   ├── dto/               # Data Transfer Objects
│   └── viewmodels/        # ViewModels para Presentation
└── app/                   # Camada de apresentação (Next.js)
    ├── (dashboards)/      # Páginas do dashboard
    ├── components/        # Componentes React reutilizáveis
    └── hooks/             # Custom hooks
```

### Princípios de Clean Architecture

- **Core**: Não depende de nenhuma outra camada
- **Repository**: Depende apenas do Core
- **Infrastructure**: Depende apenas do Core
- **Application**: Depende de Core, Repository (interfaces) e Infrastructure
- **Presentation**: Depende apenas de Application (via ViewModels)

---

## 🎯 Funcionalidades

### Dashboard Principal
- Visão geral das disciplinas cadastradas
- Estatísticas (disciplinas, unidades, planos)
- Busca e filtros por ano escolar
- Acesso rápido a funcionalidades

### Gerenciamento de Disciplinas
- ✅ Criar disciplinas (com validação de nome único)
- ✅ Visualizar detalhes da disciplina
- ✅ Ver unidades associadas
- ✅ Arquivar e restaurar disciplinas
- ✅ Deletar permanentemente disciplinas arquivadas

### Gerenciamento de Unidades (Aulas)
- ✅ Criar unidades manualmente
- ✅ Receber sugestões automáticas via IA
- ✅ Gerar plano de aula com IA
- ✅ Gerar atividade avaliativa com IA
- ✅ Arquivar e restaurar unidades
- ✅ Deletar permanentemente unidades arquivadas

### Materiais Didáticos
- ✅ Plano de aula completo (objetivos, conteúdo, metodologia, avaliação)
- ✅ Atividade avaliativa com questões
- ✅ Alinhamento com BNCC
- ✅ Exportação em PDF
- ✅ Visualização organizada em abas

### Agente de IA Conversacional
- ✅ Criar disciplinas via comando de voz/texto
- ✅ Gerar atividades para disciplinas existentes
- ✅ Criar unidades de ensino
- ✅ Suporte a comandos em português natural

### Seção de Arquivados
- ✅ Visualizar todos os materiais arquivados
- ✅ Restaurar materiais arquivados
- ✅ Deletar permanentemente materiais arquivados
- ✅ Organização por tipo (disciplinas, unidades, planos, atividades)

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (porta 3000)

# Produção
npm run build        # Gera build de produção
npm start            # Inicia servidor de produção

# Qualidade
npm run lint         # Executa ESLint
```

---

## 🎨 Guia de Uso

### Criar uma Disciplina

1. Acesse o Dashboard
2. Clique em "Nova Disciplina" ou "Criar Conteúdo"
3. Preencha o nome da disciplina (ex: "Matemática")
4. Adicione uma descrição (opcional)
5. Selecione os anos escolares (ex: "6º ano", "7º ano")
6. Clique em "Criar Disciplina"

### Criar uma Unidade (Aula)

1. Acesse uma disciplina no Dashboard
2. Clique em "Nova Unidade"
3. Preencha o título e tema da aula
4. Opcional: Use "Sugestões Automáticas via IA" para receber sugestões
5. Clique em "Criar Unidade"

### Gerar Materiais Didáticos

1. Acesse uma unidade dentro de uma disciplina
2. Clique em "Gerar Conteúdo" ou "Gerar Materiais"
3. Selecione o ano escolar (opcional)
4. Adicione contexto adicional (opcional)
5. Clique em "Gerar"
6. Aguarde a geração via IA (pode levar alguns segundos)
7. Visualize o plano de aula e atividade gerados
8. Exporte em PDF se desejar

### Usar o Agente de IA

1. Clique no botão do robô (🤖) no canto inferior direito
2. Digite comandos em português natural, por exemplo:
   - "Crie uma disciplina de História"
   - "Gerar atividade de Português"
   - "Criar unidade de Matemática sobre frações"
3. O agente processará o comando e executará a ação

### Arquivar e Restaurar

- **Arquivar**: Use o botão "Arquivar" em qualquer item (disciplina, unidade, material)
- **Restaurar**: Acesse "Arquivados" no menu lateral e clique em "Restaurar"
- **Deletar Permanentemente**: Na seção de arquivados, use o botão de lixeira (🗑️)

---

## 🧪 Testando a API Key

Se encontrar problemas com a geração de materiais, verifique se a API Key está configurada corretamente:

1. Confirme que o arquivo `.env.local` existe na raiz do projeto
2. Verifique se a chave está no formato: `NEXT_PUBLIC_GOOGLE_AI_API_KEY=AIza...`
3. Reinicie o servidor (`npm run dev`) após alterar o `.env.local`
4. Limpe o cache do navegador se necessário

---

## 📚 Arquitetura e Design

### Clean Architecture

O projeto segue rigorosamente os princípios de Clean Architecture:

- **Independência de frameworks**: Core não depende de Next.js ou React
- **Testável**: Lógica de negócio pode ser testada sem UI
- **Independência de UI**: Interface pode ser alterada sem afetar regras de negócio
- **Independência de banco**: Pode migrar de localStorage para outro sistema facilmente

### Padrões Utilizados

- **Repository Pattern**: Abstração de persistência
- **Use Case Pattern**: Cada funcionalidade é um caso de uso isolado
- **DTO Pattern**: Objetos de transferência de dados entre camadas
- **Factory Pattern**: Criação de serviços com injeção de dependências
- **ViewModel Pattern**: Tipos específicos para a camada de apresentação

---

## 🤝 Contribuindo

Este projeto foi desenvolvido para o Hackathon de Cultura Digital. Para contribuir:

1. Mantenha a Clean Architecture
2. Siga os padrões de código existentes
3. Adicione comentários JSDoc em funções públicas
4. Faça commits organizados e descritivos

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais no contexto do Hackathon de Cultura Digital - IFPI Campus Piripiri.

---

## 👥 Autores

Desenvolvido para o Hackathon de Cultura Digital - Coordenação TADS IFPI Campus Piripiri.

---

## 🙏 Agradecimentos

- IFPI Campus Piripiri pela organização do hackathon
- Google AI Studio pela disponibilização da API Gemini
- Comunidade Next.js e React pelo excelente ecossistema

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique a seção "Testando a API Key" acima
2. Revise os logs do console do navegador (F12)
3. Confirme que todas as dependências foram instaladas (`npm install`)

---

**Última atualização**: Janeiro 2026
