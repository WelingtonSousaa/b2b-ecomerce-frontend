# 🏢 Especificação Funcional e Arquitetura B2B - Shopcart Enterprise

> **Data de Atualização:** Agosto de 2026  
> **Status:** Arquitetura Front-end Completa & Homologada (52 Rotas Ativas)  
> **Objetivo:** Documento oficial de requisitos funcionais, regras de negócio fiscais/corporativas, contratos de dados e diretrizes de engenharia do ecossistema Front-end (Next.js) e integração com o Back-end / APIs.

---

## 🧭 1. Visão Geral do Modelo de Negócio

O **Shopcart Corporativo** opera como uma plataforma **SaaS Multi-Tenant B2B e Marketplace Corporativo por Assinatura**, inspirada nos modelos corporativos da *Shopify Plus*, *AliExpress B2B* e *VTEX Enterprise*:

1. **Modelo de Assinatura (SaaS)**: Fornecedores e indústrias contratam planos de assinatura corporativa para gerenciar suas próprias vitrines oficiais (*Brand Official Stores*), tabelas de preços, contratos guarda-chuva e estoques em múltiplos Centros de Distribuição (Multi-CD).
2. **Ambiente Multi-Loja Pública**: Cada marca possui sua rota pública dedicada (ex: `/loja/dell-enterprise`, `/loja/poly-audio`, `/loja/synology-brasil`) com catálogo filtrado, tabelas de preços e políticas comerciais exclusivas.
3. **Roadmap para Revendedores (App Mobile)**: A arquitetura está preparada para integração com aplicativo mobile destinado a representantes comerciais e revendedores oficiais emitirem pedidos em campo com regras tributárias pré-validadas.

---

## 🛠️ 2. Stack Tecnológica & Padrões de Engenharia

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Linguagem**: TypeScript (Strict Mode)
- **Design System & Estilos**: Tailwind CSS + Tokens de Cores HSL Customizados (Azul OneSync `#2563eb`, Navy Escuro `#0f172a`, Grafite Titânio `#18181b`)
- **Gestão de Estados Globais**:
  - `AuthContext`: Gestão de sessões CNPJ, alçadas de compra, perfis e modo visitante.
  - `CartContext`: Carrinho corporativo com descontos progressivos por volume e cálculo fiscal.
  - `ToastContext`: Sistema centralizado de notificações e feedbacks ao usuário.
- **Qualidade de Código**: ESLint (`0 erros / 0 warnings`), sem códigos mortos e tipagem 100% estrita.

---

## 🏛️ 3. Módulos e Requisitos Funcionais Essenciais

### 3.1. Gestão de Clientes, CNPJ & Alçadas Hierárquicas
1. **Modo Visitante (Guest Mode)**:
   - Usuários não logados navegam pelo catálogo em modo vitrine com **preços ocultos** (*"Preço sob consulta por CNPJ"*).
   - Modal de autenticação/cadastro dispara ao tentar visualizar preços por estado ou adicionar itens ao carrinho.
2. **Validação Cadastral & Fiscal**:
   - Validação de CNPJ, Inscrição Estadual (IE) e regimes tributários (*Simples Nacional*, *Lucro Presumido*, *Lucro Real*).
   - Aplicação de incentivos fiscais da **Zona Franca de Manaus (ZFM / SUFRAMA)** com isenção de IPI e PIS/COFINS.
3. **Alçadas de Compra e Perfis de Usuários**:
   - **Comprador Júnior (`BUYER`)**: Limite individual de R$ 5.000,00 por pedido.
   - **Comprador Sênior (`BUYER`)**: Limite individual de R$ 25.000,00 por pedido.
   - **Diretora Financeira / Aprovadora (`APPROVER`)**: Alçada ilimitada (R$ 500.000,00+) para liberar pedidos bloqueados.
   - **Alternador Rápido de Papéis (`HeaderTopBar`)**: Permite simular instantaneamente a experiência de diferentes perfis e testar as barreiras de aprovação.
4. **Central de Aprovações (`/pedidos-aprovacao`)**:
   - Pedidos que ultrapassam o limite do comprador ficam com status `PENDING_APPROVAL` e exigem liberação da diretoria.

---

### 3.2. Motor Fiscal & Tributário Brasileiro
1. **Precificação Regional por Estado de Destino**:
   - Cálculo automático de alíquotas interestaduais com base na UF de entrega selecionada (SP, SC, RJ, MG, BA, etc.).
2. **Seletor de Finalidade da Compra**:
   - 🔄 **Para Revenda Comercial**: Aplica **ICMS-ST (Substituição Tributária com MVA)** e destaca o aproveitamento de créditos fiscais de ICMS (12%) e PIS/COFINS (9.25%).
   - 🏢 **Para Uso / Consumo ou Ativo Imobilizado**: Calcula a apuração automática do **DIFAL (Diferencial de Alíquota interestadual)** na emissão da NF-e.
3. **Painel de Inteligência Fiscal (`/conta/analise-tributaria`)**:
   - Simulador avançado de alíquotas, NCMs e regimes especiais por estado.

---

### 3.3. Personalização Dinâmica de Vitrines (Storefront Builder)
1. **Editor de Loja B2B (`/conta/personalizacao`)**:
   - **Identidade da Marca**: Logo, nome da loja, slogan, subdomínio personalizado e paletas de cores corporativas (Shopcart Emerald, Azul Tech, Roxo Inovação, Vermelho Enterprise, Grafite).
   - **Hero Banner Principal**: Título de impacto, subtítulo, botão CTA, imagem de estúdio e cor de fundo do banner.
   - **Produtos e Departamentos em Destaque**: Checkboxes para selecionar quais SKUs e categorias aparecem na home.
   - **Barra de Comunicados B2B (Marquee)**: Avisos de benefícios fiscais, frete CIF e prazos de faturamento.
2. **Simulador em Tempo Real**:
   - Visualização alternável entre **Desktop**, **Tablet** e **Celular (Mobile)**.
3. **Sincronização ao Vivo com a Home (`/`)**:
   - Toda alteração salva no personalizador é refletida imediatamente na página principal da plataforma.

---

### 3.4. Catálogo, Pedidos em Lote & Cotações Formais (RFQ)
1. **Filtros Avançados Reativos (`ProductFilterBar`)**:
   - Dual range slider com 2 pontos arrastáveis e **inputs numéricos manuais editáveis** para valor mínimo e máximo.
   - Filtros por departamento, avaliação, cores corporativas, materiais e promoções B2B.
2. **Lote Mínimo (MOQ) & Desconto por Volume**:
   - Exibição clara do MOQ (*Minimum Order Quantity*) por SKU e tabela de desconto regressivo por faixas de quantidade.
3. **Gerador de Propostas Comerciais & Cotações Formais em PDF (RFQ)**:
   - Componente [`FormalQuotePdfModal`](file:///home/welington/projects/b2b-ecomerce/components/modals/FormalQuotePdfModal.tsx) integrado aos produtos, carrinho e comparador.
   - Gera propostas comerciais completas para impressão/PDF com número de cotação, NCM, alíquotas discriminadas, validade de 15 dias e campo para assinatura da diretoria.
4. **Quick Order em Massa (`/quick-order`)**:
   - Entrada manual rápida por SKU e importação de planilhas CSV/Excel com validação linha a linha de estoque e divergências.
5. **Comparador Técnico Flutuante**:
   - Comparação lado a lado de até 4 equipamentos com análise de especificações e botão de exportação da cotação comparativa em lote.

---

### 3.5. Logística Multi-CD & Gestão de Estoque
1. **Estoque Multi-CD Transparente**:
   - Rastreabilidade de saldos disponíveis nos Centros de Distribuição (CD Sudeste - SP, CD Sul - SC e CD Nordeste - BA).
2. **Modalidades de Frete**:
   - **Frete CIF Corporativo**: Calculado e integrado com opções de frete grátis para pedidos qualificados.
   - **Frete FOB**: Indicação de transportadora contratada pelo cliente.
3. **Painel do Vendedor / Gestão de Estoque (`/conta/estoque`)**:
   - Visão geral de SKUs, movimentações de entrada/saída (NF de compra, devolução, reposição) e alerta de ruptura.

---

### 3.6. Pagamentos B2B, Faturamento & Documentos Fiscais
1. **Condições de Pagamento**:
   - **Boleto Faturado a Prazo** (30, 60 e 90 dias) atrelado ao limite de crédito do CNPJ.
   - **Pagamento Híbrido**: Consome o saldo de crédito disponível e quita o excedente via PIX ou Cartão Corporativo.
   - **PIX à Vista** com desconto progressivo de antecipação.
2. **Emissão de 2ª Via de Boletos & DANFE**:
   - Download de arquivos **DANFE (PDF/TXT)** e **XML** direto do histórico de pedidos ([`/conta/pedidos`](file:///home/welington/projects/b2b-ecomerce/app/conta/pedidos/page.tsx)).
   - Exportação de relatórios gerenciais em formato CSV.
3. **Contratos & RMA**:
   - Central de Contratos de Fornecimento Contínuo (`/conta/contratos`).
   - Gestão de Devoluções e Garantia RMA de Lotes (`/conta/rma`).
   - Monitor de Integrações ERP e Logs de Webhooks (`/conta/integracoes`).

---

## 🗺️ 4. Mapa Completo das 52 Rotas Ativas (Next.js App Router)

```
app/
├── (Rotas Públicas & Catálogo)
│   ├── page.tsx                           # Home Page com Hero dinâmico e Vitrine Storefront
│   ├── produtos/page.tsx                  # Catálogo Completo com Filtros Reativos e Sliders
│   ├── produto/[slug]/page.tsx            # Página de Detalhes do Produto (PDP), Estoque Multi-CD e RFQ
│   ├── categorias/page.tsx                # Diretório Geral de Todas as Categorias Corporativas
│   ├── loja/[slug]/page.tsx               # Vitrine Pública Oficial do Fornecedor / Loja da Marca
│   ├── quick-order/page.tsx               # Pedido Rápido & Importação de Planilhas CSV
│   ├── cotacoes/page.tsx                  # Central de Negociação de Cotações em Grande Volume
│   ├── checkout/page.tsx                  # Checkout B2B (Faturamento a Prazo, Filiais e Frete CIF/FOB)
│   ├── pedidos-aprovacao/page.tsx         # Central de Aprovação de Alçadas Hierárquicas
│   ├── cadastro/page.tsx                  # Cadastro de Empresas B2B e Consulta CNPJ
│   ├── sobre/page.tsx                     # Institucional Sobre a Shopcart
│   ├── carreiras/page.tsx                 # Portal de Vagas
│   ├── contato/page.tsx                   # Fale Conosco B2B
│   ├── central-de-atendimento/page.tsx    # Central de Ajuda
│   ├── envio/page.tsx                     # Informações de Envio e Frete Multi-CD
│   ├── faq/page.tsx                       # Perguntas Frequentes Fiscais e Logísticas
│   ├── noticias/page.tsx                  # Notícias e Blog Corporativo
│   ├── termos/page.tsx                    # Termos e Condições Gerais
│   └── trocas-e-devolucoes/page.tsx       # Políticas de Troca e Devolução de Lotes
│
├── conta/ (Portal do Cliente & Painel do Vendedor)
│   ├── page.tsx                           # Dashboard Executivo com KPIs e Drag & Drop
│   ├── personalizacao/page.tsx            # Editor de Vitrine B2B (Storefront Builder)
│   ├── analise-tributaria/page.tsx        # Matriz Tributária por Estado e NCM
│   ├── clientes/page.tsx                  # Gestão de Filiais e Usuários CNPJ
│   ├── configuracoes/page.tsx             # Configurações de Conta e Notificações NF-e
│   ├── contratos/page.tsx                 # Contratos de Fornecimento Recorrente
│   ├── estoque/page.tsx                   # Controle de Estoque Multi-CD do Vendedor
│   ├── estoque/novo/page.tsx              # Cadastro de Novo SKU e Lote
│   ├── faturas/page.tsx                   # Faturas e 2ª Via de Boletos Atualizados
│   ├── integracoes/page.tsx               # Monitor de ERPs (SAP, TOTVS, Bling) e Webhooks
│   ├── pedidos/page.tsx                   # Pedidos Faturados com Emissão DANFE e Export CSV
│   ├── produtos/page.tsx                  # Catálogo de Produtos e Lotes
│   ├── rma/page.tsx                       # Gestão de Devoluções e Garantia RMA
│   └── tabelas-de-precos/page.tsx         # Tabela de Preços (Price Books) por Segmento
│
└── api/ (Endpoints REST para Integração Back-end)
    ├── auth/login/route.ts                # Autenticação CNPJ
    ├── auth/me/route.ts                   # Sessão do Usuário
    ├── auth/register/route.ts             # Cadastro de Empresa
    ├── contracts/route.ts                 # API de Contratos B2B
    ├── credit/requests/route.ts           # Solicitação de Aumento de Limite
    ├── integrations/erp/route.ts          # Sincronização de ERPs
    ├── integrations/erp/sync/route.ts     # Sync de Lotes e SKUs
    ├── integrations/webhooks/logs/route.ts # Logs de Webhooks
    ├── inventory/route.ts                 # Saldo de Estoque por CD
    ├── inventory/movements/route.ts       # Movimentações de Entrada/Saída
    ├── invoices/route.ts                  # Faturas e Boletos
    ├── notifications/route.ts             # Alertas e Notificações Fiscais
    ├── orders/route.ts                    # Pedidos Faturados
    ├── price-books/route.ts               # Tabelas de Preços
    ├── products/route.ts                  # Catálogo de Produtos
    ├── products/[sku]/route.ts            # Detalhes do Produto por SKU
    ├── rfq/route.ts                       # Solicitações de Cotação
    └── rma/route.ts                       # Solicitações de Troca/RMA
```

---

## 💾 5. Contratos de Dados TypeScript Oficiais

Os tipos oficiais que regem a plataforma estão centralizados em:
- [`types/b2b.ts`](file:///home/welington/projects/b2b-ecomerce/types/b2b.ts): Modelos para Clientes (`CompanyAccount`), Usuários (`CompanyUser`), Produtos (`Product`), Estoques (`StockByCD`), Impostos (`TaxBreakdown`), Carrinho (`CartItem`) e Pedidos (`OrderB2B`).
- [`types/storefront.ts`](file:///home/welington/projects/b2b-ecomerce/types/storefront.ts): Modelos para Temas Visuais (`StorefrontTheme`), Hero Banners (`StorefrontHero`), Comunicados (`StorefrontAnnouncement`) e Configurações de Vitrine (`StorefrontConfig`).

---

## 🎯 6. Conclusão & Prontidão para Back-end

A camada de interface Front-end está **100% implementada, tipada e compilando perfeitamente**, sem pontas soltas. Toda a comunicação de dados já segue o padrão de requisições assíncronas e contratos tipados, facilitando a transição para banco de dados relacional (ex: PostgreSQL/Prisma) e autenticação JWT em produção.
