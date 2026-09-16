# Software Requirements Specification (SRS) - OneSync B2B

## REQUISITOS FUNCIONAIS

## 1. Gestão de Contas, Acessos e Catálogo
**RF01:** Login corporativo via e-mail/senha com MFA.
**RF02:** Autenticação SSO via SAML/OAuth2 (Microsoft/Google).
**RF03:** Validação automática de CNPJ e Inscrição Estadual via API.
**RF04:** Organograma com Matriz (centralizadora) e Filiais (endereços).
**RF05:** Controle de perfis (RBAC): Visitante, Comprador, Aprovador, Admin.
**RF06:** Impersonation para televendas simular acesso do cliente.
**RF07:** Aprovadores podem convidar usuários via link seguro.
**RF08:** Alocação de orçamentos por Centro de Custo/Departamento.
**RF09:** Teto orçamentário mensal definido por departamento.
**RF10:** Alçada de aprovação progressiva por faixas de valor.
**RF11:** Bloqueio de novos pedidos por inadimplência no ERP.
**RF12:** Trilha de auditoria (Audit Log) para aprovações e acessos.
**RF13:** Busca full-text com typo tolerance e pesquisa por SKU/Part Number.
**RF14:** Catálogos clusterizados (restritos por setor do cliente).
**RF15:** Grade de produtos complexa na mesma página (cor/tamanho/voltagem).
**RF16:** Trava de quantidade mínima (MOQ) e múltiplos (caixa master).
**RF17:** Estoque Multi-CD com disponibilidade regionalizada.
**RF18:** Sugestão de cross-sell (complementares) no carrinho.
**RF19:** Sugestão de up-sell (modelos superiores) na página.
**RF20:** Redirecionamento automático para SKU substituto (itens descontinuados).
**RF21:** Acervo técnico (PDFs, Manuais, FISPQ) na página do produto.
**RF22:** Quick Order Entry para digitação rápida de SKUs em lote.
**RF23:** Upload de planilha (CSV) para geração massiva de carrinho.
**RF24:** Comparador técnico selecionando até 4 SKUs simultâneos.
**RF25:** Alerta de reabastecimento de estoque por e-mail.
**RF26:** Integração PunchOut (cXML/OAGi) para ERPs de grandes clientes.

## 2. Precificação, Tributos e Workflow de Cotações
**RF27:** Tiered Pricing (preço unitário reduz conforme volume).
**RF28:** Tabelas de preço blindadas por contratos e acordos comerciais.
**RF29:** Motor de tributação em tempo real (ST, DIFAL, IPI, etc).
**RF30:** Cruzamento de NCM x UF (origem/destino) para cálculo de impostos.
**RF31:** Exibição segregada de "Preço Base" e "Preço com Impostos".
**RF32:** Regimes especiais (isenção SUFRAMA, Órgãos Públicos).
**RF33:** Ajuste de cálculo para Simples Nacional ou Lucro Real.
**RF34:** Cupons B2B ativados por volume ou peso total.
**RF35:** Desconto automático condicionado a pagamentos à vista (PIX).
**RF36:** Vendedor pode aplicar descontos limitados pela margem de lucro.
**RF37:** Checkout com rateio visual de impacto dos impostos.
**RF38:** Carrinho persistente atrelado à conta do usuário.
**RF39:** Criação de Listas de Compras Recorrentes.
**RF40:** Conversão de carrinho em Solicitação de Cotação (RFQ).
**RF41:** Versionamento de histórico de negociações (V1, V2).
**RF42:** Geração automática de Proposta Comercial em PDF timbrado.
**RF43:** Chat log interno atrelado à cotação (comprador vs vendedor).
**RF44:** Validade de cotação com expiração e bloqueio automáticos.
**RF45:** Fila de aprovação disparando e-mails para diretoria.
**RF46:** Merge de múltiplos carrinhos departamentais pelo Aprovador.
**RF47:** Rateio (split) do faturamento entre centros de custo.
**RF48:** Notificações em tempo real sobre status de aprovação.
**RF49:** Transferência de titularidade de cotação entre vendedores.

## 3. Checkout, Logística e Pós-Venda
**RF50:** Validação de Limite de Crédito simultânea ao checkout.
**RF51:** Faturamento a prazo (boletos 28/56/84 dias) via limite.
**RF52:** Pagamento misto (Limite de crédito + PIX/Cartão).
**RF53:** Baixa via webhook para conciliação PIX instantânea.
**RF54:** Transação via cartão corporativo com tokenização antifraude.
**RF55:** Override (forçar aprovação) por diretores da loja.
**RF56:** Split de faturamento (separar itens de revenda vs consumo).
**RF57:** Uso de saldo credor (adiantamentos/devoluções) no checkout.
**RF58:** Renegociação de juros de mora no carrinho para clientes em atraso.
**RF59:** Travamento de faturamento no fechamento contábil mensal.
**RF60:** Split logístico (entregas de CDs diferentes geram fretes distintos).
**RF61:** Modal FOB (cliente retira com transportadora própria).
**RF62:** Agendamento de doca (janela de data/hora no recebimento).
**RF63:** Cálculo de cubagem (m³) e peso bruto no carrinho.
**RF64:** Backorder (compra sob encomenda de item sem estoque).
**RF65:** Bloqueio logístico regional (ex: itens inflamáveis por via aérea).
**RF66:** Reserva de estoque FEFO (First Expired, First Out).
**RF67:** Drop-shipping direto do estoque do fornecedor parceiro.
**RF68:** Retirada Expressa no balcão da distribuidora (Will Call).
**RF69:** Botão de recompra espelhando pedido histórico no carrinho atual.
**RF70:** Portal self-service para download de XML, PDF da NF-e e boletos.
**RF71:** Linha do tempo de rastreio de pedido ponta a ponta.
**RF72:** Módulo de RMA para trocas/devoluções com upload de fotos.
**RF73:** Workflow de status para itens enviados à assistência/garantia.
**RF74:** Pesquisa de satisfação automatizada pós-entrega (NPS).

## 4. Requisitos Não Funcionais (Arquitetura)
**RF75 (Banco de Dados):** Transações financeiras com consistência ACID (PostgreSQL).
**RF76 (Paridade):** Contêineres Docker padronizando o ambiente.
**RF77 (Performance):** Next.js utilizando SSR para checkout e SSG para catálogo.
**RF78 (Mensageria):** Sincronização assíncrona de ERP (estoque/preço) via filas (RabbitMQ/Kafka).
**RF79 (Segurança):** Autenticação JWT e middlewares de validação RBAC nos endpoints.
**RF80 (Resiliência):** Rate limiting em rotas públicas para garantia de SLA < 300ms.

## REQUISITOS NÃO FUNCIONAIS 

### 1. Desempenho e Escalabilidade
**RNF01:** O tempo de resposta das APIs críticas (catálogo, busca e simulação de frete) não deve exceder 300ms (P95) sob condições normais de tráfego.
**RNF02:** A página inicial e o catálogo público devem carregar o conteúdo First Contentful Paint (FCP) em menos de 1,5 segundo.
**RNF03:** O sistema deve suportar picos de acesso simultâneo equivalentes a pelo menos 3 vezes a média diária de usuários corporativos sem degradação perceptível de performance.
**RNF04:** A arquitetura backend deve ser horizontalmente escalável através de contêineres gerenciados em ambientes de nuvem.
**RNF05:** Consultas complexas ao banco de dados (como relatórios de faturamento e extratos de crédito) devem utilizar índices otimizados para retornar em menos de 2 segundos.
**RNF06:** O sistema deve implementar estratégias de cache distribuído (ex: Redis) para dados de catálogo estáticos e categorias de produtos.
**RNF07:** O carregamento de imagens de produtos deve utilizar técnicas de redimensionamento dinâmico e formatos modernos (ex: WebP, AVIF) otimizados via CDN.
**RNF08:** O frontend em Next.js deve priorizar a renderização mista, utilizando Static Site Generation (SSG/ISR) para páginas públicas e Server-Side Rendering (SSR) para dados transacionais sensíveis.

### 2. Segurança e Privacidade (Compliance)
**RNF09:** Todas as comunicações cliente-servidor devem ser criptografadas em trânsito utilizando o protocolo TLS 1.3 (HTTPS).
**RNF10:** Dados sensíveis em repouso (como senhas de usuários e chaves de integração) devem ser armazenados com criptografia forte de mão única (ex: bcrypt ou Argon2).
**RNF11:** A autenticação de sessões na API deve ser baseada em tokens JWT (JSON Web Tokens) com tempo de expiração curto e suporte a refresh tokens seguros.
**RNF12:** O sistema deve implementar proteção contra ataques de Injeção de SQL, Cross-Site Scripting (XSS) e Cross-Site Request Forgery (CSRF) em todas as rotas e formulários.
**RNF13:** O controle de acesso aos dados de faturamento e limites de crédito deve obedecer estritamente ao princípio do privilégio mínimo via RBAC.
**RNF14:** O sistema deve estar em conformidade com as diretrizes da Lei Geral de Proteção de Dados (LGPD), permitindo anonimização ou exclusão de dados pessoais quando aplicável.
**RNF15:** Os endpoints de autenticação, recuperação de senha e checkout devem possuir mecanismos de Rate Limiting e CAPTCHA para mitigação de força bruta e DDoS.
**RNF16:** Nenhuma credencial de acesso a banco de dados ou chaves de API de terceiros deve ser exposta no código-fonte do frontend (Next.js).

### 3. Confiabilidade, Disponibilidade e Recuperação
**RNF17:** O sistema deve manter uma disponibilidade (uptime) mínima de 99,9% em horário comercial de pico.
**RNF18:** O banco de dados relacional deve possuir rotinas automatizadas de backups incrementais diários e backups completos semanais.
**RNF19:** Em caso de falha crítica de infraestrutura, o tempo máximo de recuperação de serviços (Recovery Time Objective - RTO) não deve exceder 2 horas.
**RNF20:** O ponto máximo de perda tolerável de dados em um incidente (Recovery Point Objective - RPO) deve ser de no máximo 15 minutos de transações.
**RNF21:** O backend deve implementar o padrão de resiliência Circuit Breaker para evitar falhas em cascata ao consumir APIs externas (ERPs, gateways de pagamento e serviços fiscais).
**RNF22:** Transações financeiras críticas (como baixa de estoque, consumo de limite de crédito e fechamento de pedidos) devem garantir estritamente as propriedades ACID através do banco de dados relacional.
**RNF23:** O sistema deve possuir monitoramento de integridade (Health Check endpoints) ativo para verificação automática de dependências (banco de dados, filas e serviços externos).
**RNF24:** Erros internos de servidor não devem expujar rastros de pilha (stack traces) ao usuário final, registrando os logs detalhados apenas de forma interna.

### 4. Manutenibilidade e Arquitetura de Código
**RNF05:** O código-fonte do frontend e do backend deve seguir rigorosamente padrões de linting e formatação definidos (ex: ESLint, Prettier) integrados ao versionamento Git.
**RNF26:** O backend e seus serviços auxiliares devem ser estritamente conteinerizados via Docker, garantindo paridade total entre ambientes de desenvolvimento local e produção.
**RNF27:** A aplicação deve utilizar arquitetura em camadas bem definidas (Controllers, Services, Repositories) para desacoplar as regras de negócio das tecnologias de banco de dados ou transporte.
**RNF28:** O código em TypeScript deve ser executado em Strict Mode, vedando o uso de tipos implícitos do tipo `any` para maximizar a previsibilidade estática.
**RNF29:** Os componentes do frontend devem seguir uma estrutura modular baseada em design system, facilitando manutenções visuais sem quebrar contratos de comportamento.
**RNF30:** O sistema deve manter uma suíte de testes automatizados unitários e de integração cobrindo os fluxos críticos de negócio (carrinho, checkout, alçadas de aprovação).
**RNF31:** Todas as alterações no código de produção devem passar por pipelines de Integração Contínua e Entrega Contínua (CI/CD) com validação de build e testes automatizados.
**RNF32:** O projeto deve manter documentação técnica atualizada de endpoints de API (ex: especificações OpenAPI/Swagger).

### 5. Integração, Portabilidade e Operacionalização
**RNF33:** A sincronização de dados massivos com sistemas ERP legados (como SAP ou TOTVS) deve ocorrer obrigatoriamente de forma assíncrona utilizando brokers de mensagens (ex: RabbitMQ ou Kafka).
**RNF34:** O sistema deve registrar logs estruturados (em formato JSON) de todas as transações corporativas críticas para fins de auditoria e rastreabilidade forense.
**RNF35:** Ferramentas de observabilidade e APM (Application Performance Monitoring) devem ser integradas para rastrear o fluxo de requisições de ponta a ponta (distributed tracing).
**RNF36:** A plataforma deve suportar o uso em múltiplos navegadores web modernos (Google Chrome, Mozilla Firefox, Microsoft Edge e Safari) em suas versões mais recentes.
**RNF37:** O design da interface do usuário (frontend) deve ser totalmente responsivo, garantindo pleno funcionamento e legibilidade em desktops, notebooks e tablets corporativos.
**RNF38:** Os fluxos de exportação de dados (como relatórios de pedidos em PDF ou planilhas de itens) devem ser processados em segundo plano para evitar travamento da thread principal da aplicação.
**RNF39:** A aplicação deve permitir a configuração dinâmica de variáveis de ambiente para fácil transição entre os cenários de homologação, testes e produção.
**RNF40:** Mensagens de erro e avisos exibidos ao usuário na interface devem ser claros, em português corporativo formal, orientando sobre a ação corretiva necessária sem expor códigos técnicos internos.