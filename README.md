# 🌿 Botânica — Comunidade Botânica ISPK

Aplicação web que preserva e partilha o saber medicinal tradicional angolano:
identificação de plantas por foto, autodiagnóstico conversacional com o
Ndembo (curandeiro virtual), um catálogo de 30 plantas com nomes em
português e Kimbundu, e ferramentas de campo para técnicos registarem o
saber dos anciãos.

## Arquitectura

```
src/
  components/
    ui/          → primitivas reutilizáveis (Button, Card, Modal, Badge…)
    layout/      → casca da aplicação (Header, SideMenu, BottomNav, PageShell)
    features/    → componentes específicos de cada funcionalidade
  pages/         → uma página por ecrã, compõem layout + features
  contexts/      → AuthContext, LanguageContext, AccessibilityContext
  services/      → supabaseClient.js, aiService.js (chamadas a /api)
  hooks/         → useGeolocation, useDisclosure, useDebouncedValue
  constants/     → ÚNICA fonte de dados: papéis, menu, plantas, tratamentos
  utils/         → geolocalização, validação
  styles/        → theme.css (tokens de design) + theme.js (espelho em JS)
api/             → funções serverless (Vercel) que chamam a Groq API
supabase/        → schema.sql opcional para contas reais
```

Cada ecrã do menu corresponde a um único componente em `src/pages/`, listado
em `PAGE_MAP` dentro de `src/App.jsx`. A navegação, os papéis com permissão
de acesso, e os textos do menu vivem **só** em `src/constants/index.js` —
não há nenhum outro sítio no código que defina um item de menu.

## Como correr localmente

```bash
npm install
cp .env.example .env.local   # depois edita o ficheiro com as tuas chaves
npm start
```

A aplicação corre em `http://localhost:3000`.

### Modo de demonstração (sem configuração)

Se `REACT_APP_SUPABASE_URL` não estiver definida, a app entra
automaticamente em **modo de demonstração**: o ecrã de login mostra três
botões — Admin, Técnico, Paciente — que iniciam sessão num clique, sem
precisar de Supabase nem de criar contas. É o estado por omissão deste
repositório, para que qualquer pessoa o possa experimentar de imediato.

### Activar contas reais (Supabase)

1. Cria um projecto em [supabase.com](https://supabase.com).
2. Corre `supabase/schema.sql` no editor SQL do teu projecto.
3. Copia o URL e a `anon key` do projecto para `.env.local`:
   ```
   REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJ...
   ```
4. Reinicia `npm start`. O login passa a usar contas reais automaticamente.

### Activar as funcionalidades de IA (Ndembo + identificação de plantas)

As funções em `api/` correm como serverless functions na Vercel e precisam
de uma chave gratuita da Groq:

```
GROQ_API_KEY=gsk_...
```

Sem esta chave, o catálogo de plantas, os tratamentos e toda a navegação
continuam a funcionar normalmente — só o chat com o Ndembo e a
identificação por foto ficam indisponíveis.

## Deploy na Vercel

```bash
vercel
```

A Vercel detecta automaticamente o `package.json` (Create React App) e a
pasta `api/` (serverless functions). Define as variáveis de ambiente
(`GROQ_API_KEY`, `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`)
no painel do projecto antes do primeiro deploy.

A app usa `HashRouter`-style navigation interna (estado em React, não
`react-router`), por isso não precisa de nenhuma configuração extra de
rewrites no `vercel.json` — qualquer hosting estático funciona.

## Decisões de design

- **Uma única paleta** (verde-floresta, dourado-acácia, terracota) definida
  em `src/styles/theme.css` — nenhum componente inventa a sua própria cor.
- **Cores vivas e consistentes**: cada planta tem uma cor própria, mas em
  vez de usar o hex original directamente (alguns eram demasiado pálidos
  para se ver bem), `src/utils/color.js` extrai apenas o tom (*hue*) de
  cada planta e gera um par vivo e consistente — um centro vibrante e uma
  margem escura e sólida, como luz a passar por uma folha. O mesmo padrão
  aparece no cartão da planta e no ecrã de detalhe.
- **Ajuda contextual**: o botão "?" no cabeçalho mostra primeiro uma
  explicação do ecrã onde estás, e por baixo o guia completo da
  aplicação — acessível a partir de qualquer página.
- **Bilingue**: português e Kimbundu, alternável em Definições.
- **Acessibilidade**: alto contraste, três tamanhos de letra, leitura em voz
  alta das respostas do Ndembo (manual por mensagem ou automática), e
  entrada por voz no autodiagnóstico — tudo persistido entre sessões.
  Pensado para chegar a pessoas de todas as idades e níveis de literacia
  nas 21 províncias de Angola.
- **Exportação em PDF**: qualquer conversa com o Ndembo pode ser
  descarregada como PDF, para mostrar a um enfermeiro, médico ou familiar.
- **Saber da comunidade, com moderação**: submissões em "Registar Saber"
  ficam guardadas em `knowledge_submissions` no Supabase com estado
  `pending`, e só aparecem na página de Tratamentos depois de um admin
  aprovar em "Moderação". O catálogo curado (`constants/index.js`)
  continua estático e instantâneo — só a parte genuinamente nova e
  crescente (contribuições do campo) depende da base de dados, e a sua
  ausência nunca bloqueia a página.
- **Consciente da largura de banda**: a foto real de uma planta (via
  `api/plant-image.js`) só é pedida se o utilizador tocar explicitamente em
  "ver foto real" — nunca automaticamente numa lista.
- **Nunca um ecrã vazio**: toda a lista sem resultados mostra um
  `EmptyState` com uma sugestão útil, em vez de uma área branca.

### Notas sobre voz

A leitura em voz alta (`SpeechSynthesis`) e a entrada por voz
(`SpeechRecognition`) usam APIs nativas do browser — sem dependências
externas, sem custo, e funcionam offline depois de carregada a página.
A entrada por voz tem suporte limitado em Safari e Firefox; nesses
browsers o botão de microfone simplesmente não aparece, em vez de mostrar
um botão que falha silenciosamente.
