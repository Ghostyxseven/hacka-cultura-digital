# Tasks - Hackathon BNCC & Cultura Digital

Requisitos:
- Single User Application (Sem Auth)
- Geração de Materiais via IA (RAG com BNCC)
- Slides e Atividades Avaliativas
- UI Premium

## Phase 0: Setup & Restoration
- [ ] Restore `package.json` with Next.js, Tailwind, and React dependencies <!-- id: 0 -->
- [ ] Configure `postcss.config.js` and `tailwind.config.ts` <!-- id: 1 -->
- [ ] Verify build and project structure <!-- id: 2 -->

## Phase 1: Pivot to "Public Mode" (Removing Auth)
- [ ] Refactor `RootLayout` to remove `AuthProvider` <!-- id: 3 -->
- [ ] Create new `Dashboard` component (Public access) <!-- id: 4 -->
- [ ] Replace `page.tsx` redirect with direct access to Dashboard <!-- id: 5 -->
- [ ] Delete `login` and `register` directories <!-- id: 6 -->

## Phase 2: Core AI Implementation (RAG)
- [ ] Setup `openai` or `langchain` integration <!-- id: 7 -->
- [ ] Create `BNCCService` with hardcoded RAG data (Competência 5) <!-- id: 8 -->
- [ ] Implement `LessonPlanGenerator` service <!-- id: 9 -->

## Phase 3: Features & Polish
- [ ] Implement "Generate Lesson Plan" Form UI <!-- id: 10 -->
- [ ] Implement Result View (Plan + Activity) <!-- id: 11 -->
- [ ] Implement Slide Generator (HTML/Reveal.js) <!-- id: 12 -->
- [ ] UI Visual Polish (Glassmorphism/Animations) <!-- id: 13 -->
