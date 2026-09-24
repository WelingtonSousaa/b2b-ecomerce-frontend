# OneSync B2B - Plataforma de E-commerce & Marketplace Corporativo

Plataforma corporativa de comércio eletrônico B2B desenvolvida com **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Prisma ORM** e **SQLite**. O sistema foi projetado para operações atacadistas complexas, suportando faturamento por CNPJ, motor tributário brasileiro (ICMS-ST, DIFAL, IPI e SUFRAMA), gestão de alçadas de aprovação, simulador de cubagem de paletes e distribuição fracionada para múltiplas filiais.

---

## Principais Recursos & Funcionalidades

### 1. Motor Fiscal & Tributário Brasileiro
- **Cálculo de Impostos Interestaduais**: Apuração dinâmica de ICMS, ICMS-ST com MVA e DIFAL por estado de destino.
- **Incentivos Fiscais ZFM/SUFRAMA**: Desoneração de tributos para entregas na Zona Franca de Manaus.
- **Seletor de Finalidade da Compra**: Diferenciação fiscal entre *Revenda Comercial* e *Uso/Consumo ou Ativo Imobilizado*.

### 2. Gestão de Carrinho & Logística de Carga
- **Estado Global Centralizado (`CartContext`)**: Gestão unificada em toda a aplicação com persistência segura no navegador.
- **Drawer Lateral com Rolagem Suave (`CartDrawer`)**: Visualização detalhada de SKUs, NCMs, controle unitário e botão para esvaziar o carrinho com 1 clique.
- **Simulador de Palete PBR (`CargoSimulator`)**: Estimativa de ocupação volumétrica e em peso para paletes padrão PBR (1,00m x 1,20m x 1,45m), indicando economia no frete CIF e cálculo de unidades para fechamento do lote.

### 3. Checkout Corporativo Avançado
- **Modo Endereço Único ou Split Multi-Filiais**: Permite alocar quantidades fracionadas do mesmo pedido para diferentes filiais e CNPJs com cálculo tributário independente.
- **Agendamento de Entregas & Entregas Programadas**: Suporte a entrega imediata ou fracionada em datas futuras.
- **Condições de Pagamento B2B**: Boleto faturado a prazo (ex: 28/56/84 dias), PIX corporativo instantâneo ou cartão corporativo.
- **Geração de Proposta Comercial em PDF**: Criação instantânea de proposta formal para auditoria interna e alçadas de compra.

### 4. Pedido Rápido & Importação de Planilhas
- **Quick Order por SKU & Linhas Manuais (`/quick-order`)**: Digitação ágil de código e quantidade para compradores frequentes.
- **Importador CSV / Planilhas**: Validação linha a linha de SKUs, estoque por Centro de Distribuição (Multi-CD) e lote mínimo (MOQ) com transferência direta para o carrinho.

### 5. Central de Alçadas & Governança de Compras
- **Aprovação Hierárquica (`/pedidos-aprovacao`)**: Bloqueio automático de pedidos que ultrapassam a alçada do comprador, permitindo aprovação ou recusa por gestores financeiros.
- **Central de Notificações em Tempo Real**: Alertas de emissão de NF-e, liberação de limite de crédito corporativo e reposição de estoque por Centro de Distribuição.

### 6. Banco de Dados Local & Rotas de API
- Integrado com **Prisma ORM** e **SQLite** para persistência real de dados.
- Endpoints disponíveis:
  - `GET /api/products`: Consulta ao catálogo de produtos corporativos.
  - `GET /api/orders`: Histórico e registro de novos pedidos faturados.
  - `GET /api/notifications`: Notificações corporativas ativas.
  - `GET /api/price-books`: Tabelas de preços negociadas por contrato.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Framework Web** | Next.js 16 (App Router) |
| **Linguagem** | TypeScript (Modo Estrito) |
| **Estilização** | Tailwind CSS + Variáveis HSL |
| **Tipografia** | Plus Jakarta Sans (`next/font/google`) |
| **Ícones** | Lucide React |
| **Banco de Dados** | SQLite com Prisma ORM |
| **Gerenciamento de Estado** | React Context API (`AuthContext`, `CartContext`, `ToastContext`) |

---

## Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- Gerenciador de pacotes `npm` ou `yarn`

### 1. Instalar as dependências
```bash
npm install
```

### 2. Inicializar o Banco de Dados (Prisma)
```bash
npx prisma generate
npx prisma db push
```

### 3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

> **Dica para Windows:** Caso haja incompatibilidade com os módulos nativos do Turbopack na sua máquina, execute utilizando o Webpack:
> ```bash
> npm run dev -- --webpack
> ```

Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

---

## Estrutura do Projeto

```
├── app/                      # Rotas e páginas do Next.js (App Router)
│   ├── api/                  # Endpoints REST (products, orders, notifications, price-books)
│   ├── checkout/             # Fluxo de finalização de compra corporativa
│   ├── conta/                # Painel da empresa (pedidos, produtos, faturas, estoque)
│   ├── cotacoes/             # Central de cotações RFQ
│   ├── pedidos-aprovacao/    # Central de liberação de alçadas de compra
│   ├── produtos/             # Catálogo corporativo completo com filtros fiscais
│   ├── quick-order/          # Pedido rápido manual e por arquivo CSV
│   └── layout.tsx            # Layout raiz com fontes corporativas e Providers globais
├── components/               # Componentes reutilizáveis
│   ├── cart/                 # CartDrawer, CargoSimulator e widgets de carrinho
│   ├── catalog/              # ProductFilterBar e cards de produtos
│   ├── layout/               # HeaderNavbar, HeaderTopBar, ContaSidebar
│   └── modals/               # Modais de Proposta PDF, PIX, Boleto, NF-e, etc.
├── context/                  # Providers globais (AuthContext, CartContext, ToastContext)
├── lib/                      # Utilitários, clientes de API e calculadora de cubagem
├── prisma/                   # Schema e sementes do banco de dados SQLite
├── services/                 # Serviços de integração com APIs e dados
└── types/                    # Definições de tipos TypeScript (b2b.ts)
```

---

## Licença

Projeto desenvolvido para o ecossistema OneSync B2B. Todos os direitos reservados.
