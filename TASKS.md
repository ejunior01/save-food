# DespensaCerta — Redesign Tasks (Handoff)

Origem: Claude Design handoff `3VHQgsRC2QyZrRTQXMVKCg`
Data: 2026-05-24

## Decisões de implementação

- Navegação: Home · Alertas · ➕ (central) · Despensa · Compras (Receitas sai do tabbar)
- Fontes: DM Sans (sans) + Instrument Serif (display) + JetBrains Mono (mono)
- Fotos: Unsplash CDN via URLs remotas
- Design system: tokens do handoff (cream/pistachio/peach/rose/sage/charcoal blocks)

---

## Fundação

- [x] Instalar `@expo-google-fonts/dm-sans` e `@expo-google-fonts/jetbrains-mono`
- [x] Atualizar `theme/index.ts` — novos tokens de cor, tipografia, radii
- [x] Atualizar `types/index.ts` — adicionar `photo`, novo `ExpiryStatus`, campos Recipe/Shopping
- [x] Atualizar `AppDataContext.tsx` — novos thresholds de expiração (5/15/30 dias)
- [x] Atualizar `StorageSeed.ts` — adicionar URLs de foto do Unsplash
- [x] Atualizar `App.tsx` — carregar novas fontes
- [x] Atualizar `navigation/types.ts` — adicionar Inventory, remover Recipes do tabbar
- [x] Atualizar `navigation/AppStack.tsx` — nova estrutura de tabs
- [x] Atualizar `AppText` — suporte a mono
- [x] Reescrever `Tag` → ExpiryChip com novo design
- [x] Reescrever `BottomTabBar` — novo design com botão central elevado

## Telas Auth

- [x] `Splash` — redesign editorial com collage de fotos
- [x] `Onboarding` — slides com color blocks e fotos hero
- [x] `Login` — redesign com ícones nos inputs
- [x] `SignUp` — redesign multi-step com avatar

## Telas App (Tab)

- [x] `Home` — redesign completo: featured urgente, tiles horizontais, resumo block, receitas
- [x] `Alerts` — reagrupado por status (Vencidos/Urgentes/Próximos/Programados/Seguros)
- [x] `Scanner` (AddFood) — redesign: scan/manual, novo formulário completo
- [x] `Inventory` — **NOVA TELA** — grid/lista por local com filtros de categoria
- [x] `ShoppingList` — redesign: hero charcoal com progresso, grupos por categoria
- [x] `Recipes` — redesign: featured card, chips de match
- [x] `RecipeDetail` — redesign: hero foto, match block, ingredientes com status

## Correções pós-implementação

- [x] Corrigir import `Svg` inválido do react-native em `ShoppingList`
- [x] Remover imports não utilizados em `ShoppingList` (`useState`, `queryClient`, `ShoppingService`)
- [x] Remover `inset: 0` (shorthand CSS não suportado no RN) em `AddFood`, `Onboarding`, `Home`
- [x] Verificar tokens de cor obsoletos — nenhum token antigo referenciado nas novas telas
- [x] Corrigir nomes de fontes (`DmSans_` → `DMSans_`, `JetBrainsMonoNL_` → `JetBrainsMono_`)
- [x] Corrigir fontFamily strings no `theme/index.ts` para coincidir com as chaves registradas

## Segunda iteração (concluída)

- [x] `Biometric` — tela de login biométrico com `useBiometrics` (idle/scanning/success)
- [x] `ActionSheet` — bottom sheet de ações sobre item (consumir/descartar/receitas/reposição/editar)
- [x] Integrar `ActionSheet` em `Alerts` — toque em qualquer linha abre o sheet
- [x] Integrar `ActionSheet` em `Inventory` — toque em grid card ou list row abre o sheet
- [x] `Insights` — dashboard de desperdício: resumo, gráfico de barras mensal, breakdown por categoria
- [x] `Household` — casa compartilhada: membros, código de convite, tabela de permissões
- [x] Navegar para `Biometric` a partir do botão "Usar biometria" na tela de Login
- [x] Links rápidos "Relatório" e "Casa" adicionados ao Home

## Terceira iteração (concluída)

- [x] `ConsumeModal` — modal de quantidade com contador ±; parcial atualiza qty, total remove item
- [x] `ActionSheet` — abre `ConsumeModal` em vez de deletar diretamente ao consumir/descartar
- [x] `Alerts` + `Inventory` — tratamento de consumo parcial (`updatePantryItem` ou `deletePantryItem`)
- [x] `Replenishment` — tela de reposição inteligente: itens vencidos ou qty ≤ 2, agrupados por categoria, adiciona à lista de compras com source='replenishment'
- [x] Navegar para `Replenishment` a partir de "Adicionar reposição" no `ActionSheet`
- [x] `NotificationService` — agendar notificações 30/15/5 dias antes do vencimento
- [x] `useCreatePantryItem` — agenda notificações ao adicionar item
- [x] `useUpdatePantryItem` — reagenda notificações ao editar item
- [x] `useDeletePantryItem` — cancela notificações ao remover item
- [x] `AppDataContext` — solicita permissão e agenda notificações na carga inicial da despensa
- [x] `app.json` — plugin expo-notifications + permissões Android/iOS
- [x] Instalar `expo-notifications` (55.0.23)
- [x] Corrigir TS7053 em `Alerts` (filterCounts type cast)
- [x] Corrigir TS2322 em `RecipeDetail` (servings template literal)
- [x] Remover todos `styles.ts` de telas obsoletos (Home, Onboarding, Login, SignUp, RecipeDetail, Recipes, Alerts, ShoppingList)
- [x] Remover componentes não utilizados: `AuthBottomSheet`, `Button`, `Input`, `LocationPicker`, `LocationsSheet`, `ProductImage`, `Tag/styles.ts`
- [x] Remover `Scanner/index.tsx` + `Scanner/styles.ts` (substituído por `AddFood`)
- [x] Remover `ShoppingFormSheet.tsx` (não referenciado por nenhuma tela ativa)

## Pendente / Próxima iteração

- [ ] Auth real (backend)
- [ ] Sincronização multi-device
- [ ] Dica de armazenamento (PREMIUM) — overlay de StorageTip
- [ ] Editar validade/local — modal de edição inline a partir do ActionSheet
