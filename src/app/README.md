# Camada de Apresentação (Presentation Layer)

Esta camada contém toda a interface do usuário da aplicação.

## Estrutura de Diretórios

### `/app`
- Contém as páginas e rotas do Next.js App Router
- Subdivisão por domínio (dashboards de admin, professor, aluno)

### `/components`
- Componentes React reutilizáveis
- Divididos por tipo: `auth`, `layout`, `ui`
- Componentes locais específicos da camada app

### `/contexts`
- Contextos React globais (ex: `AuthContext`)

### `/hooks`
- Custom hooks para lógica de apresentação

## Como Adicionar Nova Página

1. Crie a pasta na estrutura apropriada
2. Adicione o arquivo `page.tsx`
3. Componentes específicos vão em `/components` do diretório local

## Styling

Utilizamos **Tailwind CSS** para estilização. Os estilos globais estão em `globals.css`.
