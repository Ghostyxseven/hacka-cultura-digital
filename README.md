# 🎓 Sistema Inteligente de Cultura Digital - Hackathon IFPI
**Desenvolvedor:** Micael Cardoso Reis

[cite_start]Este projeto consiste em uma aplicação web desenvolvida para o **Hackathon de Desenvolvimento de Sistema Inteligente para Geração de Materiais Didáticos** do IFPI Campus Piripiri. objetivo é fornecer aos professores do Ensino Fundamental e Médio uma ferramenta capaz de gerar materiais didáticos (planos de aula e atividades) automaticamente, utilizando Inteligência Artificial Generativa alinhada à **BNCC**.

## 🏗️ Arquitetura do Projeto

[cite_start]Para garantir a organização, escalabilidade e cumprir os critérios de avaliação de **Organização do Código e Arquitetura** o sistema foi estruturado em **5 camadas independentes**:

1.  [cite_start]**Presentation (UI/UX):** Interface desenvolvida em Next.js e Tailwind CSS, seguindo as sugestões de wireframes do edital.
2.  [cite_start]**Application (Serviços):** Orquestra os fluxos de dados e casos de uso, como a geração de planos de aula e atividades.
3.  [cite_start]**Core (Domain):** Contém as regras pedagógicas e modelos de dados rigorosamente alinhados à BNCC.
4.  [cite_start]**Repository (Persistência):** Gerencia o armazenamento local via **LocalStorage**, atendendo ao requisito de sistema de usuário único sem necessidade de autenticação.
5.  **Infrastructure (IA & RAG):** Camada de integração com a API de IA. [cite_start]Utiliza **RAG (Retrieval-Augmented Generation)** com base em documentos do MEC e BNCC para garantir o alinhamento curricular.
## 🚀 Funcionalidades Principais

[cite_start]Conforme os requisitos funcionais (RF) estabelecidos no edital.

* [cite_start]**RF01 - Gestão de Disciplinas:** Cadastro e gerenciamento de disciplinas associadas a séries/anos.
* [cite_start]**RF02/03 - Unidades de Ensino:** Criação manual ou sugestão automática via IA.
* [cite_start]**RF04/05 - Geração de Materiais:** Produção automática de **Planos de Aula** e **Atividades Avaliativas** por unidade.
* [cite_start]**Diferencial Pedagógico:** Uso ético e responsável da IA como ferramenta de apoio ao planejamento docente.

## 🛠️ Tecnologias Utilizadas

* [cite_start]**Frontend:** Next.js, Tailwind CSS, Shadcn/ui.
* [cite_start]**Linguagem:** TypeScript[cite: 57].
* [cite_start]**IA Generativa:** Google Gemini API.
* [cite_start]**Arquitetura:** Clean Architecture (5 camadas).
* [cite_start]**Persistência:** LocalStorage.

## 📊 Organização do Git (Branches)

[cite_start]O desenvolvimento é segmentado por camadas para demonstrar domínio total sobre a solução.

* `layer/core`: Modelagem pedagógica e entidades.
* `layer/repository`: Persistência local.
* `layer/infrastructure`: Integração com IA e lógica de RAG.
* `layer/application`: Lógica de fluxo e serviços.
* `layer/presentation`: UI e componentes visuais baseados nos wireframes.
* [cite_start]`main`: Versão estável para deploy e avaliação pela banca.
---
[cite_start]Desenvolvido para o curso de **TADS - IFPI Piripiri**.