# Hammers Game Ops

App para registar os jogos dos Hammers (Elite, Academy e Girls) na LFFF1, LFFF2 e LFFFW: para onde e para quem vai cada bola, downs, sacks, INT, conversões e goal line, para nós e para o adversário. No fim de cada jogo há um heatmap e as stats por jogador, por down e por formação.

- Funciona no telemóvel, no tablet e no computador, e instala-se como app ("Adicionar ao ecrã principal").
- Continua a funcionar sem rede: guarda as jogadas no aparelho e envia-as quando a rede volta.
- Duas pessoas podem registar o mesmo jogo, cada uma a seguir uma equipa.
- Português e inglês. O guia completo está no botão **? Ajuda** da app.

## Acesso

O login é feito com um link enviado por email, sem password. Só entram os emails da lista de **Membros**:

| Papel | Pode |
|---|---|
| Membro | ver, criar e editar todos os jogos |
| Admin | tudo o que o membro pode, mais apagar jogos e gerir os membros |

Os admins gerem a lista na app, em **Jogo ▾ → Membros**.

## Como está feita

Site estático (HTML, CSS e JavaScript sem build), publicado no GitHub Pages. O login e a base de dados são do Firebase (Authentication com link por email e Firestore).

| Ficheiro | Para quê |
|---|---|
| `index.html` | página da app |
| `app.js` | toda a lógica: registo, análise, sincronização e login |
| `style.css` | aspeto |
| `firebase-config.js` | configuração do projeto Firebase |
| `firestore.rules` | regras de acesso da base de dados (copiar para a consola Firebase) |
| `sw.js`, `manifest.webmanifest`, `icons/` | instalar como app e funcionar sem rede |

## Configuração (uma vez)

1. **Firebase**: criar o projeto, registar uma app web e copiar o `firebaseConfig` para `firebase-config.js`.
2. **Authentication**: ativar *Email/Password* com *Email link (passwordless sign-in)* e acrescentar `gameops.hammersflagfootball.pt` (e `fcpereira10.github.io`) em *Authorized domains*.
3. **Firestore**: criar a base de dados (modo de produção, `eur3`) e colar `firestore.rules` no separador *Regras*.
4. **Primeiro admin**: no Firestore, coleção `members`, documento com o email (em minúsculas) e o campo `role` = `admin`.
5. **GitHub Pages**: em *Settings → Pages*, escolher *Deploy from a branch*, `main`, pasta `/ (root)`.

A app fica em https://gameops.hammersflagfootball.pt (registo DNS `CNAME gameops → fcpereira10.github.io`). Esse domínio também tem de estar nos *Authorized domains* do Firebase.

## Dados

```
members/{email}                 role: "member" | "admin"
games/{gameId}                  equipa, competição, adversário, plantéis, formações
games/{gameId}/events/{eventId} cada jogada, falta, conversão, intervalo...
```

O resultado, o down e a posse não são guardados: a app calcula-os a partir da lista de eventos, por isso ficam sempre iguais em todos os aparelhos.
