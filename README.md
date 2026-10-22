# Hammers Game Ops

App para registar os jogos dos Hammers (Elite, Academy e Girls) na LFFF1, LFFF2 e LFFFW: para onde e para quem vai cada bola, downs, sacks, INT, conversões e goal line, para nós e para o adversário. No fim de cada jogo há um heatmap e as stats por jogador, por down e por formação.

- Funciona no telemóvel, no tablet e no computador, e instala-se como app ("Adicionar ao ecrã principal").
- Continua a funcionar sem rede: guarda as jogadas no aparelho e envia-as quando a rede volta.
- Duas pessoas podem registar o mesmo jogo, cada uma a seguir uma equipa.
- Português e inglês. O guia completo está em **Opções → Ajuda e guia**.

## Acesso

O login é feito só com email e password, e não há registo livre. Os admins criam a conta de cada pessoa em **Opções → Membros → Criar conta**, que gera uma password temporária (sem enviar email). A pessoa troca-a depois em **Opções → Definir password**. Só entram os emails da lista de **Membros**:

| Papel | Pode |
|---|---|
| Membro | ver, criar e editar todos os jogos |
| Admin | tudo o que o membro pode, mais ver os jogos privados, apagar jogos e gerir os membros |

Cada jogo mostra quem o criou. Por defeito fica visível para a **Equipa**. Quem o cria pode escolher **Só eu** (para testes ou treinos) e mudar isso mais tarde.

Os admins gerem a lista (nome e email) na app, em **Opções → Membros**. Os jogos, a língua, a ajuda e a conta também estão no botão **Opções**, no canto superior direito.

## Como está feita

Site estático (HTML, CSS e JavaScript sem build), publicado no GitHub Pages. O login e a base de dados são do Firebase (Authentication com email e password, e Firestore).

| Ficheiro | Para quê |
|---|---|
| `index.html` | página da app |
| `app.js` | toda a lógica: registo, análise, sincronização e login |
| `style.css` | aspeto |
| `video.html` | janela à parte para o vídeo da tape review |
| `firebase-config.js` | configuração do projeto Firebase |
| `firestore.rules` | regras de acesso da base de dados (copiar para a consola Firebase) |
| `sw.js`, `manifest.webmanifest`, `icons/` | instalar como app e funcionar sem rede |

## Configuração (uma vez)

1. **Firebase**: criar o projeto, registar uma app web e copiar o `firebaseConfig` para `firebase-config.js`.
2. **Authentication**: ativar *Email/Password* (o *Email link* pode ficar desligado) e acrescentar `gameops.hammersflagfootball.pt` (e `fcpereira10.github.io`) em *Authorized domains*.
3. **Firestore**: criar a base de dados (modo de produção, `eur3`) e colar `firestore.rules` no separador *Regras*.
4. **Primeiro admin**: no Firestore, coleção `members`, documento com o email (em minúsculas) e o campo `role` = `admin`.
5. **GitHub Pages**: em *Settings → Pages*, escolher *Deploy from a branch*, `main`, pasta `/ (root)`.

A app fica em https://gameops.hammersflagfootball.pt (registo DNS `CNAME gameops → fcpereira10.github.io`). Esse domínio também tem de estar nos *Authorized domains* do Firebase.

## Dados

```
members/{email}                 role: "member" | "admin", name
games/{gameId}                  equipa, competição, adversário, plantéis, formações,
                                owner (email de quem criou), visibility: "team" | "private"
games/{gameId}/events/{eventId} cada jogada, falta, conversão, intervalo...
teams/{teamId}                  ficha de cada equipa: nome, cor, nomes dos jogadores, outros nomes e plano de jogo
```

O resultado, o down e a posse não são guardados: a app calcula-os a partir da lista de eventos, por isso ficam sempre iguais em todos os aparelhos.
