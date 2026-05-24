# Contexto Para Design E Desenvolvimento

Este documento transforma o domínio do DespensaCerta em uma base prática para evoluir telas, componentes, fluxos e regras de produto. Use junto com `CONTEXT.md` para linguagem de domínio e com `docs/APPLICATION.md` para avaliação do estado atual.

## Direção Do Produto

O DespensaCerta deve parecer uma ferramenta doméstica confiável, simples e preventiva. A experiência precisa ajudar o usuário a responder três perguntas rapidamente:

- O que eu tenho em casa?
- O que preciso usar primeiro?
- O que preciso comprar sem repetir?

O aplicativo não deve se posicionar como um catálogo de receitas genérico, uma planilha de estoque ou uma rede de promoções. O valor central é reduzir desperdício por falta de controle.

## Princípios De Experiência

**Prevenção antes de correção**:
O usuário deve ver alimentos próximos da validade antes que eles virem problema. A tela inicial deve favorecer "usar primeiro" em vez de apenas mostrar totais.

**Cadastro rápido, correção fácil**:
Adicionar alimento precisa ser rápido depois da compra. Campos mínimos devem ser claros, mas qualquer dado preenchido por código de barras deve continuar editável.

**Casa real, não estrutura técnica**:
Despensa, geladeira e freezer são lugares da rotina. A interface deve tratar locais de armazenamento como espaços familiares, com nomes, ícones e filtros compreensíveis.

**Ação clara para cada alerta**:
Um alimento em alerta deve oferecer próximos passos objetivos: consumir, ver receita, mover data/local, descartar ou adicionar reposição à lista.

**Receita como aproveitamento**:
Receitas devem explicar por que aparecem: usam algo que o usuário já tem, principalmente itens próximos da validade.

**Compra consciente**:
A lista de compras deve evitar duplicidade com alimentos ativos no inventário e facilitar transformar itens comprados em alimentos cadastrados.

## Tom De Voz

Use linguagem curta, doméstica e orientada a ação.

Preferir:

- "Vence hoje"
- "Use primeiro"
- "Na geladeira"
- "Adicionar alimento"
- "Marcar como consumido"
- "Adicionar à lista"

Evitar:

- "Gerenciar produto"
- "Registro atualizado com sucesso" em excesso
- "Ambiente de armazenamento" em telas comuns
- "Operação realizada"
- "Item removido" quando o correto é consumido ou descartado

Mensagens de erro devem dizer o que aconteceu e o que fazer em seguida:

- "Nao encontramos esse codigo. Cadastre manualmente."
- "Informe uma validade para salvar o alimento."
- "Sem internet para consultar o codigo. Voce ainda pode cadastrar manualmente."

## Arquitetura De Informação

### Navegação Principal

**Inicio**:
Resumo acionável da casa. Deve mostrar o que vence primeiro, atalhos de cadastro, receitas úteis e andamento da lista de compras.

**Alertas**:
Fila de decisão sobre validade. Deve priorizar vencidos, vence hoje, 5 dias, 15 dias e 30 dias.

**Adicionar**:
Entrada por código de barras e cadastro manual. Deve ser o caminho mais rápido para alimentar o inventário.

**Receitas**:
Sugestões baseadas no inventário. Deve destacar receitas que usam alimentos em risco.

**Compras**:
Lista de reposição e planejamento. Deve alertar sobre duplicidade com o inventário.

**Inventário**:
Recomendado como tela futura dedicada. Deve permitir navegar por local, categoria e busca, sem depender da tela de alertas.

### Hierarquia Da Tela Inicial

Ordem recomendada:

1. Saudação e status curto da rotina.
2. Bloco "Use primeiro" com os alimentos mais urgentes.
3. Ação primária para adicionar alimento.
4. Resumo por validade: vencidos, ate 5 dias, ate 15 dias, seguros.
5. Receitas que aproveitam alimentos urgentes.
6. Lista de compras resumida.

## Sistema Visual

### Personalidade Visual

A identidade deve comunicar frescor, organização e cuidado doméstico. Verde continua sendo a cor principal, mas a interface não deve virar uma paleta de um único tom. Combine verde com superfícies claras, tons quentes sutis para alimentos, amarelo para atenção e vermelho apenas para risco real.

### Cores Recomendadas

- Primária: verde de ação e sustentabilidade.
- Fundo: off-white ou verde muito claro para reduzir dureza visual.
- Superfície: branco para cards, formulários e listas.
- Texto principal: quase preto esverdeado.
- Texto secundário: cinza esverdeado com contraste suficiente.
- Sucesso: verde para seguro, consumido ou concluído.
- Atenção: amarelo/âmbar para próximos 15 ou 30 dias.
- Urgência: laranja para até 5 dias.
- Perigo: vermelho para vencido ou descarte.
- Informação: azul apenas para mensagens neutras ou dicas.

### Tipografia

Manter Host Grotesk é adequado. Use poucos níveis:

- Título de tela: 28-32.
- Título de seção: 18-20.
- Texto principal: 16.
- Metadados e chips: 12-14.

Evite textos longos dentro de cards compactos. Cards de alimento devem ser escaneáveis em menos de dois segundos.

### Componentes Base

**Food Card**:
Deve mostrar nome, quantidade, local, categoria e validade. A validade precisa ser o elemento mais fácil de escanear.

**Expiry Chip**:
Chip colorido com texto curto: "Vencido", "Hoje", "5 dias", "15 dias", "30 dias". O chip deve ter contraste alto e não depender só de cor.

**Storage Location Filter**:
Controle segmentado ou chips: Todos, Despensa, Geladeira, Freezer. Locais personalizados entram depois.

**Action Sheet De Alimento**:
Ações: Ver detalhes, Marcar como consumido, Ver receitas, Adicionar reposição, Editar, Descartar.

**Empty State**:
Deve orientar uma ação, não apenas dizer que está vazio.
Exemplo: "Sua geladeira ainda esta vazia. Adicione alimentos para receber alertas."

**Recipe Match Badge**:
Indica o motivo da sugestão: "Usa tomate que vence hoje", "Voce tem 3 de 4 ingredientes".

**Duplicate Purchase Warning**:
Ao adicionar item à lista, avisar: "Voce ja tem arroz na despensa. Adicionar mesmo assim?"

## Estados De Validade

Use estes estados para design e desenvolvimento:

| Estado | Regra | Uso visual |
|---|---|---|
| Vencido | Data menor ou igual a hoje | Vermelho, topo da fila |
| Urgente | 1 a 5 dias | Laranja, ação imediata |
| Proximo | 6 a 15 dias | Amarelo, planejamento |
| Programado | 16 a 30 dias | Amarelo suave ou azul neutro |
| Seguro | Mais de 30 dias | Verde ou neutro |

Os alertas preventivos formais do MVP devem existir em 30, 15 e 5 dias. Os estados visuais podem ser mais granulares para melhorar a leitura diária.

## Fluxos Principais

### Cadastro Por Codigo De Barras

1. Usuario abre Adicionar.
2. App solicita permissao de camera se necessario.
3. Usuario escaneia codigo.
4. App consulta dados externos.
5. Se encontrar, preenche nome, marca, categoria, quantidade e unidade.
6. Usuario informa validade e local.
7. Usuario confirma.
8. App salva alimento, agenda alertas e mostra confirmacao curta.

Estados obrigatórios:

- Permissão negada.
- Produto encontrado.
- Produto não encontrado.
- Sem conexão.
- Salvando.
- Erro ao salvar.

### Cadastro Manual

1. Usuario escolhe Manual.
2. Informa nome, validade, quantidade, unidade, categoria e local.
3. Pode escolher presets de validade: 5, 15, 30 dias ou data personalizada.
4. Confirma.
5. App salva e agenda alertas.

O cadastro manual deve ter os mesmos campos finais do cadastro por código de barras.

### Decisão Sobre Alimento Em Alerta

1. Usuario vê alimento em "Use primeiro" ou Alertas.
2. Abre ações.
3. Escolhe consumir, ver receita, editar validade, adicionar reposição ou descartar.
4. Se consumir ou descartar, app registra o resultado.
5. Item sai do inventário ativo, mas continua disponível para métricas.

### Receita Sugerida

1. App identifica alimentos próximos da validade.
2. Compara ingredientes das receitas com inventário.
3. Ordena por maior aproveitamento e menor falta.
4. Mostra motivo da sugestão.
5. Usuario pode cozinhar, ver detalhes ou adicionar ingredientes faltantes à lista.

### Lista De Compras

1. Usuario adiciona item manualmente ou a partir de receita.
2. App verifica duplicidade com inventário.
3. Usuario decide manter ou cancelar.
4. Ao marcar item comprado, app pode oferecer "Adicionar ao inventário".

## Regras De Negocio

- Um alimento precisa ter nome, validade, quantidade, unidade, categoria e local para entrar no inventário.
- Um produto de código de barras só vira alimento depois da confirmação do usuário.
- Descartar não deve ser tratado como deletar quando houver indicadores de desperdício.
- Consumir e descartar são resultados diferentes.
- Alimentos vencidos continuam visíveis até decisão do usuário.
- Geladeira e freezer devem existir no MVP gratuito junto com despensa.
- Locais personalizados podem ser Premium.
- Alertas 30/15/5 são padrão do MVP.
- Personalização de alertas pode ser Premium.
- Receitas sugeridas devem ser explicáveis pelo inventário.
- Lista de compras deve detectar possível compra duplicada.

## Modelo De Dados Alvo

### FoodItem

- `id`
- `userId`
- `name`
- `barcode`
- `brand`
- `category`
- `quantity`
- `unit`
- `expiresAt`
- `locationId`
- `status`: active, consumed, discarded
- `createdAt`
- `updatedAt`
- `consumedAt`
- `discardedAt`
- `estimatedValue`

### StorageLocation

- `id`
- `userId`
- `name`
- `icon`
- `isDefault`
- `isPremium`

### ExpiryAlert

- `id`
- `foodItemId`
- `offsetDays`
- `scheduledFor`
- `deliveryStatus`
- `deliveredAt`

### RecipeSuggestion

- `id`
- `title`
- `ingredients`
- `steps`
- `duration`
- `servings`
- `matchedFoodItemIds`
- `missingIngredients`
- `matchReason`

### ShoppingItem

- `id`
- `userId`
- `name`
- `quantity`
- `unit`
- `category`
- `checked`
- `source`: manual, recipe, replenishment
- `matchedFoodItemId`

## Critérios De Pronto

### Para Uma Tela

- Tem estado carregando, vazio, erro e conteúdo.
- Textos cabem em telas pequenas.
- A ação primária é inequívoca.
- Estados destrutivos pedem confirmação quando afetam métricas ou dados.
- A tela usa termos do `CONTEXT.md`.

### Para Um Fluxo

- Funciona sem dados iniciais.
- Funciona com muitos itens.
- Trata falta de internet quando depender de serviço externo.
- Mantém dados do usuário isolados.
- Atualiza React Query/cache após mutações.

### Para Um Componente

- Recebe dados por props e evita depender de contexto global sem necessidade.
- Tem tamanhos previsíveis.
- Não quebra layout com nomes longos.
- Usa cores do tema.
- Expõe estados desabilitado, pressionado e carregando quando aplicável.

## Prioridades De Design

Alta prioridade:

- Inventário por local.
- Cadastro manual completo.
- Estados de validade 30/15/5.
- Ações de consumir/descartar com registro de resultado.
- Receitas com motivo de sugestão.

Media prioridade:

- Relatórios simples de desperdício evitado.
- Conversão de compras em alimentos.
- Alertas personalizados.
- Melhorias de onboarding com exemplos reais.

Baixa prioridade:

- Anúncios.
- Parcerias comerciais.
- Gamificação.
- Social/sharing.

## Prompts Úteis Para Gerar Design

Use estes prompts quando for pedir novas telas ou componentes:

**Tela inicial**:
"Crie uma tela inicial mobile para o DespensaCerta focada em alimentos que precisam ser usados primeiro. Mostre um bloco principal de urgência, resumo de validade, atalhos para adicionar alimento, receitas sugeridas e lista de compras resumida. Visual doméstico, sustentável, claro e acionável."

**Inventário**:
"Crie uma tela de inventário doméstico para alimentos organizados por Despensa, Geladeira e Freezer. Inclua busca, filtros por categoria, cards com validade evidente e ações rápidas para consumir, editar ou descartar."

**Cadastro manual**:
"Crie um formulário mobile rápido para cadastrar alimento manualmente com nome, validade, quantidade, unidade, categoria e local. Inclua presets de validade 5, 15 e 30 dias, calendário e botão primário de salvar."

**Alertas**:
"Crie uma tela de alertas de validade para alimentos vencidos, urgentes, próximos e programados. Cada card deve oferecer consumir, ver receitas, adicionar reposição, editar e descartar."

**Receitas sugeridas**:
"Crie uma tela de receitas sugeridas que mostre por que cada receita foi recomendada, quantos ingredientes o usuário tem, quais faltam e quais alimentos próximos da validade serão aproveitados."

## Decisões Recomendadas

- Nome visível do produto: DespensaCerta.
- MVP gratuito: despensa, geladeira, freezer, cadastro, alertas e lista de compras.
- Premium: locais personalizados, relatórios avançados, personalização de alertas e histórico.
- Alertas padrão: 30, 15 e 5 dias.
- Ação "Usar agora": registrar consumo, não deletar silenciosamente.
- Ação "Descartar": registrar descarte, não deletar silenciosamente.
- Receita sugerida: sempre explicar o vínculo com o inventário.
