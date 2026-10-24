(function(){
/* app version: bump it (and CACHE in sw.js) in every change; shown in Options, on the home page and on the login screen */
const APP_VERSION='1.11.0';
/* preview build (claude.ai link for testing before production): no Firebase, games stay in this browser */
const PREVIEW=!!window.HGO_PREVIEW;
const LS='hgo.games.v1', LS_CUR='hgo.current.v1', LS_LANG='hgo.lang', LS_HELP='hgo.helpSeen.v1';
const TEAMS=['Elite','Academy','Girls'], COMPS=['LFFF1','LFFF2','LFFFW'], YDS=['15+','5-15','0-5',''];
const FORM_SUGG=['Double','Trips','Bunch','Stack','Spread','Empty','Double QB'];

/* ---------- i18n ---------- */
let lang='pt';
try{const s=localStorage.getItem(LS_LANG);if(s==='pt'||s==='en')lang=s}catch(e){}
const L={
pt:{
  rows:['Fundo','Médio','Curto','Atrás da linha'], glRows:['EZ fundo','EZ frente','0-5','5-10'], cols:['Esq','Meio','Dir'], colsLong:['Esquerda','Meio','Direita'],
  ord:d=>d+'º', noZone:'Sem zona', opponent:'Adversário', noNum:'sem nº',
  res:{C:'completo',X:'incompleto',R:'corrida',TD:'TOUCHDOWN',INT:'interceção',SACK:'sack'},
  tZoneFirst:'Primeiro toca na zona do campo', tTdZone:'Toca na zona da jogada do TD', tIntPass:'INT só em passes',
  tIntZone:'Toca na zona para onde foi o passe', tFdOnly:'1º down só depois de um completo ou corrida',
  tFdOn:'1º down marcado', tFdOff:'1º down retirado', tCleared:'Marca apagada', tNoUndo:'Nada para desfazer', tUndone:'Desfeito',
  pen:{rep:'Falta: repete o down',fd:'Falta: 1º down automático',loss:'Falta: perde o down',dec:'Falta recusada'},
  penShort:{rep:'Repete o down',fd:'1º down automático',loss:'Perde o down',dec:'Recusada'},
  chooseGame:'Escolher jogo', sample:'exemplo', offense:'ataca', down:'down', ham:'HAM', opp:'ADV', undo:'Desfazer', help:'Ajuda',
  tabs:{reg:'Registo',ana:'Análise',log:'Jogadas'},
  hRes:{C:'<b>completo</b>',X:'<b>incompleto</b>',R:'<b>corrida</b>',TD:'<b>TD</b>',INT:'<b>INT</b>'},
  hAgain:'Toca outra vez para incompleto. ', hNow:'Agora toca no <b>número</b>.',
  hRun:'Corrida: toca na zona (ou logo no <b>número</b>) e escolhe Corrida ou TD.',
  hIdle:'Toca na <b>zona</b>, escolhe o <b>resultado</b> e toca no <b>número</b>.',
  targets:'alvos', saveNoNum:'Gravar sem número', noNumShort:'sem nº', newNum:'Novo número',
  conv:'Conversão', failed:'Falhou', offenseArrow:'▲ ataque', los:'Linha de scrimmage', yards:'jardas',
  receiver:'Recetor', hammers:'Hammers', mostUsed:'mais usados primeiro', formation:'Formação', formSticky:'fica selecionada até mudar',
  newForm:'+ nova', fd:'1º Down', td:'TD', int:'INT', penalty:'Falta', run:'Corrida', game:'⋮ Opções',
  tiles:['Passes','Comp %','TD','INT','Corridas','1º downs','2 QB'],
  passes:'Passes', runs:'Corridas', all:'Tudo', allM:'Todos', allF:'Todas', downs:['1º','2º','3º','4º'],
  inclAnnul:'Incluir anuladas', distribution:'Distribuição', marks:'Marcas', heatmap:'Heatmap',
  marksNote:'Cada marca é uma jogada: C = completo, x = incompleto, o número é o down.', fewer:'Menos', more:'Mais alvos',
  showAll:'Ver todos os recetores', byPlayer:'Alvos por jogador',
  thP:['Nº','Alvos','Comp','%','TD','INT','Corr'], noMatch:'Sem jogadas com estes filtros',
  tapPlayer:'Toca num jogador para ver só as bolas dele no mapa.', byDown:'Por down',
  thD:['Down','Passes','Comp','Zona +','Alvo +','Formação +','Corr'], comp:'comp', runsLow:'corridas',
  annulledPlay:'anulou a jogada', downManual:'Down corrigido à mão', possManual:'Posse mudada à mão', confirm:'Confirmar', del:'Apagar',
  tagC:'Completo', tagX:'Incompleto', tagR:'Corrida', runLow:'corrida', fdLow:'1º down', convTag:p=>'conv. '+(p?'+'+p:'falhada'),
  tod:'turnover em downs', annulTag:'anulada', restore:'Repor', annul:'Anular',
  logCount:n=>`${n} jogadas registadas. A mais recente aparece primeiro.`, copyCsv:'Copiar CSV',
  logEmpty:'Ainda sem jogadas. Vai ao Registo e toca numa zona.',
  penTitle:'Falta', penQ:'O que acontece ao down?', annulLast:(d,r,z)=>`Anular a última jogada (${d} down, ${r}, ${z})`,
  penRep:'Repetir down', penRepS:d=>'fica no '+d, penFd:'1º down auto', penFdS:'ex.: interferência', penLoss:'Perde o down',
  penLossS:'avança 1 down', penDec:'Recusada', penDecS:'a jogada conta', cancel:'Cancelar',
  fixDown:'Corrigir down', changePoss:'Mudar posse', nowOff:'passa a atacar: ',
  newNumT:'Novo número', numAddDraft:'Fica no plantel deste jogo e grava já a jogada com este número.', numAdd:'Fica no plantel deste jogo.',
  newFormT:'Nova formação', orType:'Ou escreve o nome', formPh:'ex.: Trips Right', add:'Adicionar',
  games:'Jogos', playsAbbr:'jog.', newGame:'+ Novo jogo', delGameC:'Confirmar: apagar este jogo', delGame:'Apagar este jogo', close:'Fechar',
  newGameT:'Novo jogo', team:'Equipa', competition:'Competição', teamName:'Nome da equipa', starts:'Começa a atacar',
  device:'Este aparelho regista', both:'Os dois lados', onlyH:'Só Hammers', onlyA:'Só adversário', start:'Começar jogo',
  csvHead:'data,equipa,competicao,adversario,parte,lado,down,tipo,mapa,zona,recetor,resultado,defensor,primeiro_down,formacao,dois_qb,pick6,retorno_conv,anulada,jardas,yac,qb,jogada,flag,pbu,video,revista,nota,distancia,spot',
  typeNum:'Escreve um número', typeForm:'Escreve o nome da formação', deleted:'Apagada', possChanged:'Posse mudada',
  gameCreated:'Jogo criado', csvCopied:'CSV copiado', selectCopy:'Seleciona e copia.', kind:{pass:'passe',run:'corrida',sack:'sack',conv:'conversão'},
  loginLead:'Entra com o email e a password que um admin da Game Ops te deu.', sendLink:'Enviar link', linkSent:e=>`Enviámos um link para <b>${e}</b>. Abre o email neste aparelho e toca no link. Se não aparecer, vê a pasta de spam.`,
  pasteLabel:'Se usas a app instalada no iPhone, copia o link do email e cola-o aqui', signIn:'Entrar', otherEmail:'Usar outro email',
  confirmEmail:'Para terminar, confirma o email para onde foi enviado o link.', noAccess:e=>`<b>${e}</b> ainda não tem acesso. Pede a um admin da Game Ops para te acrescentar.`,
  signOut:'Sair', setupMissing:'Falta configurar o Firebase (ficheiro firebase-config.js).', loggingIn:'A entrar...', loading:'A carregar', linkInvalid:'O link não é válido ou já expirou. Pede um novo.',
  badEmail:'Escreve um email válido.', createAcc:'Criar conta', accCreated:'Conta criada', accLead:'Manda estes dados à pessoa. Ela entra com "Entrar com password" e muda a password em Opções → Definir password.',
  tempPw:'Password temporária', copyMsg:'Copiar mensagem', copied:'Copiado', accNote:'Esta password só aparece agora. Se a perderes, apaga a conta no Firebase (Authentication → Utilizadores) e cria outra aqui.',
  credsMsg:(e,p)=>`Hammers Game Ops\nhttps://gameops.hammersflagfootball.pt\nEmail: ${e}\nPassword temporária: ${p}\nDepois de entrares, muda a password em ⋮ Opções → Definir password.`,
  accExistsT:'Esta pessoa já tem conta', accExists:e=>`<b>${e}</b> já tem conta (por exemplo, porque foi criada antes). Pode entrar com a password dela. Se não tiver password ou a esqueceu, apaga a conta no Firebase (Authentication → Utilizadores) e volta a carregar em Criar conta.`,
  accFail:'Não foi possível criar a conta.', emailQuota:'Hoje já não é possível enviar mais links de acesso (limite diário de emails). Entra com a tua password ou tenta amanhã.', notMember:e=>`${e} não está na lista de membros. Pede a um admin da Game Ops para te acrescentar.`,
  version:'versão', previewTag:'pré-visualização', previewNote:'Pré-visualização para testes: sem login, e os jogos ficam só neste browser. Não mexe nos jogos da equipa.', options:'Opções', home:'Início', homeS:'escolher o que queres fazer', hello:n=>n?`Olá, ${n}`:'Olá', continueG:'Continuar', track:'Registar', viewAna:'Análise',
  allGamesBtn:'Todos os jogos', recent:'Jogos recentes', noGames:'Ainda não há jogos. Cria o primeiro em Novo jogo.', newGameS:'começar a registar um jogo', demoS:'jogo de exemplo para experimentar', curGame:'Jogo atual', gamesMenu:'Jogos', gamesS:'mudar de jogo, criar um novo ou apagar', membersS:'quem tem acesso à app',
  helpMenu:'Ajuda e guia', helpS:'como usar a app', language:'Língua', account:'Conta', edit:'Editar', editMember:'Editar membro', saveName:'Guardar nome',
  nameRequired:'Escreve o nome.',
  visLbl:'Visível para', visTeam:'Equipa', visMe:'Só eu', visTeamS:'toda a Game Ops vê e edita', visMeS:'só tu e os admins (testes, treinos)',
  byOwner:n=>`por ${n}`, visNowMe:'Jogo visível só para ti e para os admins', visNowTeam:'Jogo visível para toda a equipa',
  myName:'O meu nome', myNameLead:'É o nome que aparece nos jogos que crias.', nameLbl:'Nome', namePh:'ex.: Francisco', nameSaved:'Nome guardado',
  pwOptional:'Password', signInPw:'Entrar', pwHint:'Não tens conta ou esqueceste a password? Fala com um admin da Game Ops.',
  pwEmpty:'Escreve a password.', pwWrong:'Email ou password errados. Se esqueceste a password, fala com um admin da Game Ops.', pwTooMany:'Demasiadas tentativas. Espera uns minutos e tenta outra vez.',
  setPw:'Definir password', pwLead:'Troca a password temporária que recebeste por uma tua.',
  pwNew:'Nova password (mínimo 8 caracteres)', pwRepeat:'Repete a password', pwSave:'Guardar password', pwShort:'A password tem de ter pelo menos 8 caracteres.',
  pwMismatch:'As duas passwords não são iguais.', pwSaved:'Password guardada', pwRecent:'Por segurança, sai e volta a entrar com a password atual antes de a mudar.', pwFail:'Não foi possível guardar a password. Tenta outra vez.', sendFail:'Não foi possível verificar o acesso. Confirma a rede e tenta outra vez.', offlineStart:'Sem rede. Liga-te à internet para entrar pela primeira vez.',
  signedAs:'Sessão:', members:'Membros', membersLead:'Só estes emails conseguem entrar na app. Membros criam e editam jogos. Admins também apagam jogos e gerem esta lista.',
  addMember:'Acrescentar membro', roleMember:'Membro', roleAdmin:'Admin', memberS:'cria e edita jogos', adminS:'também gere membros',
  makeAdmin:'Tornar admin', makeMember:'Tornar membro', remove:'Remover', you:'tu', memberAdded:e=>`${e} acrescentado`,
  sack:'Sack', sacks:'Sacks', hSack:'Sack: toca no número de <b>quem fez o sack</b>.', hIntBy:'INT: agora toca no número de <b>quem intercetou</b>.',
  hConv:p=>`Conversão de ${p} pt: toca na zona, escolhe o resultado e o número.`, convRes:{G:'Good',NG:'No Good',INT:'INT'}, convSkip:'Sem conversão', retYes:n=>`Sim, +${n}`,
  convIntQ:'INT na conversão. A defesa devolveu-a para pontos?', whoSack:'Quem fez o sack', whoInt:'Quem intercetou', defense:'defesa',
  result:'Resultado', resSub:'escolhe antes do número', mapField:'Campo', glNote:'End zone em cima', losNote:'Linha de scrimmage entre Curto e Atrás',
  convs:'Conversões', convTries:'Tentativas', convGood:'Good %', marksConv:'+1 / +2 = conversão good, x = no good, INT = interceção.',
  defTable:s=>`Defesa ${s}: INT e sacks`, thDef:['Nº','INT','Pick-6','Sacks'], byTag:n=>'por '+(n!=null?'#'+n:'sem nº'), retTag:n=>`devolvida +${n}`,
  halfT:'Intervalo', halfS:s=>`a 2ª parte começa com ${s} a atacar`, h1:'1ª P', h2:'2ª P', game_:'Jogo todo',
  pick6Q:'Interceção. Foi devolvida para TD (pick-6)?', pick6Yes:'Sim, pick-6', pick6No:'Não', pick6Done:s=>`Pick-6: +6 para ${s}`,
  follows:'Sigo', roleA:'Adversário', roleB:'As duas', roleQ:'Que equipa segues neste jogo?',
  roleHs:'Registas quando os Hammers atacam', roleAs:'Registas quando o adversário ataca', roleBs:'Registas tudo sozinho',
  roleNote:'Se forem 2 pessoas, cada uma escolhe uma equipa. As jogadas das duas juntam-se neste jogo, e o down e o resultado ficam iguais nos dois aparelhos.',
  roleSet:'Equipa escolhida', shared:'Partilhado', localOnly:'Só neste aparelho', sending:n=>`A enviar ${n}`,
  noWrite:'Sem permissão para guardar nos jogos partilhados.', quota:'A base de dados está cheia. Apaga jogos antigos.',
  defHint:s=>`${s} está a atacar. Não precisas de fazer nada.`,
  defBody:(me,them)=>`Segues ${me}. Quem segue ${them} está a registar esta posse e as jogadas aparecem aqui ao vivo.`,
  defOverride:'Registar eu esta posse', changeRole:'Mudar de equipa', lastPlays:'Últimas jogadas',
  roTitle:'Só para ver', readOnly:'Podes ver este jogo, mas não registar. Pede ao dono da app para te dar acesso de editor.',
  allGames:'Todos os jogos', loadingShared:'A carregar os jogos partilhados...',
  willShare:'O jogo fica partilhado com a equipa e aparece em todos os aparelhos.', willLocal:'O jogo fica guardado só neste aparelho.',
  tabsTape:'Tape', tEmptyT:'Ainda sem jogadas', tEmpty:'A tape review completa as jogadas registadas no live. Regista primeiro o jogo, ou insere jogadas aqui.', tInsFirst:'+ Inserir jogada',
  tDone:(a,b)=>`${a} / ${b} revistas`, tShowList:'Ver lista', tHideList:'Esconder lista', tPlay:(i,n)=>`Jogada ${i} / ${n}`, tReviewed:'revista',
  tStart:'Início', tMark:'Marcar agora', tMarked:'Tempo marcado', tNoVideo:'Sem vídeo aberto', tVideos:'Vídeos', vPop:'Vídeo noutra janela', vBack:'Trazer vídeo',
  vAway:'O vídeo está noutra janela', vAwayS:'Arrasta essa janela para o outro ecrã. Os botões e as teclas daqui continuam a comandar o vídeo.',
  tPlayCtl:'Play / pausa', tSlow:'0,5×', tBack5:'−5 s', tNext:'Próxima', tPrev:'Anterior', tIns:'+ Inserir jogada antes', tDel:'Apagar jogada', tDelC:'Confirmar: apagar',
  tNewPlay:'Nova jogada', fouls:{fs:'Falsa partida',dg:'Atraso de jogo',sh:'Shift ou motion ilegal',os:'Offside',ip:'Participação ou substituição ilegal',pi:'Interferência de passe',ic:'Contacto ilegal',ir:'Rush ilegal',fl:'Flag puxada ilegalmente',sd:'Shielding',fg:'Flag guarding',jd:'Saltar ou mergulhar',fp:'Passe para a frente ilegal',rn:'Corrida ilegal (no-running zone)',dp:'Atraso de passe (7 s)',us:'Antidesportivo'},
  penWho:'Quem fez a falta?', penOff:'Ataque', penDef:'Defesa', penPre:'Antes do snap', penPlay:'Na jogada', penDead:'Depois da jogada', penOther:'Outra falta', penOtherS:'escolhes as jardas e o down',
  penYds:n=>n?`${n} jd`:'sem jardas', penSpot:{los:'a partir da linha de scrimmage',bs:'a partir da linha (ou do fim da jogada, se a defesa falhou numa jogada que ganhou terreno)',sf:'a partir do sítio da falta: põe nas jardas da jogada até onde foi a falta',next:'depois da jogada, que conta'},
  penApply:'Aplicar falta', penDecl:'Recusada', penBack:'‹ Outra falta', penBall:(a,b)=>`Bola: ${a} → ${b}`, penAnnulPlay:'A falta anula a jogada', penOn:'Falta na jogada',
  penEff:{rep:'repete o down',fd:'1º down automático',loss:'perde o down',dec:'recusada'}, penRemove:'Remover falta', penAdd:'⚑ Falta', penYdsLbl:'Jardas da falta', midTag:'Meio-campo', tBall:'Bola', tBallS:'▼ meio-campo próprio · ▲ meio-campo adversário', tAutoS:'calculado com as jardas', tManualS:'corrigido à mão', tSpotFix:'Corrigir', tSpotAuto:'Automático', tSpotT:'Linha de scrimmage', tOwnHalf:'▼ Próprio', tOppHalf:'▲ Adversário', tSpotNote:'Jardas até à linha de golo de cada lado. A drive começa no ▼5 e o 1º down é no meio-campo (▼25).', tSpotQ:'Sem jardas na jogada anterior (ou depois de um INT): indica o spot.', fdAuto:'auto', distAll:'Qualquer distância', tJump:'Ir para o início desta jogada no vídeo', tPick6:'Pick-6', tNoConv:'Sem conversão', tSackK:'Sack', tPass:'Passe', tRun:'Corrida', tPlaySec:'Jogada', tFix:'corrige se for preciso', tZone:'Zona', tRunner:'Corredor',
  tYds:'Jardas', tYdsS:'totais, a partir da linha de scrimmage', tYac:'YAC', tYacS:'jardas depois da receção', yardsShort:'jd', tKpYds:'Jardas', tKpYac:'YAC',
  tQb:'QB', tQbOpp:'QB do adversário', tSticky:'fica até mudares', tCall:'Nome da jogada', tCallS:'opcional, do playbook da equipa', tNewCall:'Nova jogada', tCallPh:'ex.: Smash', tTypeCall:'Escreve o nome da jogada',
  tFormOpp:'Formação do adversário', tFlag:'Quem tirou a flag', tPbu:'PBU', tPbuS:'quem desviou a bola', tOurs:'Hammers, defesa', tNote:'Nota', tNotePh:'opcional', tKeys:'Teclas: ← → muda de jogada · espaço play/pausa · Enter próxima',
  vNoneT:'Sem vídeo', vNoneP:'Cola o link do YouTube do jogo (não listado) ou abre o ficheiro do vídeo neste aparelho.', vAddLink:'Colar link do YouTube', vFile:'Abrir ficheiro',
  vLead:'Um vídeo por jogo é o ideal. Se o jogo estiver em vários vídeos, acrescenta uma parte para cada um.', vPart:n=>`Parte ${n}`, vPaste:'Link do YouTube', vSaveLink:'Guardar link', vUse:'Ver esta',
  vLocal:n=>`ficheiro neste aparelho: ${n}`, vNoneS:'sem vídeo', vAdd:'+ Acrescentar parte', vBadLink:'Esse link não parece do YouTube.', vSaved:'Vídeo guardado',
  vNote:'O ficheiro aberto só toca neste aparelho e não é enviado. O link do YouTube fica guardado no jogo para toda a equipa.',
  vPopBlocked:'O browser bloqueou a janela. Autoriza pop-ups para este site e tenta outra vez.', vWin:'Vídeo',
  thQb:['QB','Passes','Comp','%','Jd','Jd ar','TD','INT'], byQb:'Por QB', byCall:'Por jogada', thCall:['Jogada','Vezes','Comp %','Jd','Jd/jog','TD'],
  tilesY:['Jardas','Jd/jogada','Explosivas'], thDef2:['Nº','Flags','PBU','INT','Pick-6','Sacks'], defTable2:s=>`Defesa ${s}`, jdPlay:'Jd/jog',
  insTag:'inserida na review',
  compOther:'Outra', compPh:'ex.: Taça de Portugal, Torneio de Lisboa', compType:'Escreve o nome da competição.',
  ngOurs:'Jogo dos Hammers', ngOursS:'contra um adversário', ngOther:'Outras equipas', ngOtherS:'scouting de um jogo entre duas equipas',
  ngTeam1:'Equipa 1', ngTeam2:'Equipa 2', ngNames:'Escreve o nome das duas equipas.', ngQuick:'Modo rápido', ngQuickY:'Sim', ngQuickYS:'só zona e resultado, 2 toques', ngQuickN:'Não', ngQuickNS:'com números de camisola',
  quickOn:'ligado: zona e resultado, sem números', quickOff:'desligado: com números de camisola', quickNote:'Modo rápido: o resultado grava a jogada, sem números. Muda em Opções.',
  hQuick:'Toca na <b>zona</b> e depois no <b>resultado</b>. A jogada fica gravada.', hQuick2:'Agora toca no <b>resultado</b> para gravar.', hRunQ:'Corrida: toca na zona e escolhe Corrida ou TD.', resSubQ:'grava a jogada',
  roleHs2:s=>`Registas quando ${s} ataca`, xTag:'scouting',
  tmEdit:'Ficha da equipa', tmT:'Ficha da equipa', tmColor:'Cor', tmPlayers:'Jogadores', tmPlayersN:'Nome de cada número de camisola. Aparece no registo, nas tabelas e no resumo.', tmNamePh:'nome',
  tmNoNums:'Ainda não há números registados para esta equipa.', tmSame:'É a mesma equipa que', tmSameN:'Marca os nomes escritos de outra forma noutros jogos. Esses jogos passam a contar para esta equipa no relatório.',
  tmSave:'Guardar ficha', tmSaved:'Ficha guardada', planT:'Plano de jogo', planPh:'ex.: cobrir o #13 em Curto Dir; blitz no 3º down; atacar Fundo Esq', planSaved:'Plano guardado',
  planNote:'Partilhado com a equipa. Guarda-se quando sais da caixa. Aparece no registo durante o jogo e quando imprimes o relatório.',
  vWatch:n=>`Ver no vídeo (${n===1?'1 jogada':n+' jogadas'})`, vNoClips:'Estas jogadas ainda não têm tempo de vídeo. Ganham-no na tape review.', vPlayOne:'Ver esta jogada no vídeo',
  vAllT:'Jogadas filtradas', vFilt:n=>`Ver no vídeo as jogadas filtradas (${n})`, vOnlyPos:(i,n)=>`${i} de ${n} · Próxima salta para a seguinte da lista`, vOnlyX:'Ver todas as jogadas', vOnlyNo:'Sai da lista para inserir jogadas.',
  zmRings:'Anéis', zmSum:'Resumo', zmDots:'Pontos', zOk:'com sucesso',
  zmRingsN:'O número é o total de bolas na zona e o anel enche com a % de sucesso (completos e corridas). Por baixo, a % de todas as bolas. Toca numa zona para ver as jogadas.',
  zmSumN:'Quanto mais amarela, mais bolas. Número de bolas, % de sucesso, alvo mais usado e a barra de completos, TD e falhados. Toca numa zona para ver as jogadas.',
  zmDotsN:'o número é o down. Toca numa zona para ver as jogadas.',
  lsT:n=>`Habitual em ${n===1?'1 jogo':n+' jogos'} · toca para o relatório`, lsDown:(d,p,z,r)=>`${d} down: ${p} passe${z?' · '+z:''}${r?' · alvo #'+r:''}`, lsNoDown:d=>`${d} down: sem jogadas anteriores`, lsGl:z=>`perto da end zone: ${z}`,
  alRun:(a,b)=>`Hoje correm ${a} das vezes (costumam ${b})`, alRec:(n,a,b)=>`#${n} com ${a} dos alvos hoje (costuma ter ${b})`, alSide:(i,a,b)=>`Hoje ${a} dos passes ${['para a esquerda','para o meio','para a direita'][i]} (costuma ser ${b})`, alForm:f=>`Formação nova hoje: ${f}`,
  scByCall:'Por jogada do playbook', thScCall:['Jogada','Vezes','% passe','Comp %','Jd/jog','TD','Downs'], scCallF:c=>`Jogada: ${c}`,
  drvT:'Drives', drvAg:'Drives dos adversários', drvN:'drives', drvPts:'pontos por drive', drvTd:'acabam em TD', drvLost:'perdem a bola', drvPl:'jogadas por drive', drvOut:'Como acabam',
  drvEnd:{TD:'TD',INT:'INT',P6:'Pick-6',DN:'Downs',SF:'Safety',END:'Fim de parte ou em curso'}, drvFirst:(p,z)=>`1ª jogada da drive: ${p} passe${z?`, sobretudo para ${z}`:''}.`,
  sumDrv:(n,pp,td,l)=>`Em ${n} drives: ${pp} pontos por drive, ${td} acabam em TD e ${l} perdem a bola (INT, downs ou safety).`,
  autoFd:'AUTO 1º DOWN', otherBtn:'Outro ⋯', otherT:'Outros resultados', safety:'Safety', safetyS:s=>`+2 para ${s}, que fica com a bola`, badSnap:'Bad snap', badSnapS:'a bola tocou no chão no snap · conta como down',
  driveN:n=>`Drive ${n}`, lastPlay1:'Última jogada', noPlaysYet:'ainda sem jogadas', lastRec:'último recetor',
  sumT:'Resumo', sumNote:'Escrito automaticamente a partir dos números.', sumFew:'Ainda há poucas jogadas para um resumo (são precisas pelo menos 5).',
  sumGames:g=>g>1?`Em ${g} jogos: `:'', sumPass:(pp,np,nr,cp)=>`${pp} das jogadas são passes (${np} passes e ${nr} corridas), com ${cp} de completos.`,
  sumDir:(i,p)=>`A bola vai sobretudo ${['para a esquerda','para o meio','para a direita'][i]} (${p} dos passes)`, sumDirEven:(a,b,c)=>`A bola vai para os três lados (esquerda ${a}, meio ${b}, direita ${c})`,
  sumDepth:(sh,dp)=>`; ${sh} ficam até 5 jardas e ${dp} vão a mais de 15.`, sumRec:(n,sh,c)=>`Alvo principal: #${n} (${sh} dos alvos, ${c} completos).`, sumRec2:(n,sh,c)=>` A seguir vem o #${n} (${sh}, ${c} completos).`,
  sumLate:(p,z,r,o)=>`No 3º e 4º down: ${p} passe${z?`, sobretudo para ${z}`:''}${r?`, e o alvo preferido é o #${r}`:''}${o?` (não o #${o})`:''}.`,
  sumForm:(f,sh,p)=>`Formação mais usada: ${f} (${sh} das jogadas, ${p} passe).`, sumFormRun:(f,p)=>` Em ${f} há mais corridas (${p}).`,
  sumGl:(z,sh)=>`Perto da end zone: sobretudo ${z} (${sh} das bolas no mapa GL).`, sumConv:l=>`Conversões: ${l.map(([p,n,gd])=>`${n} de ${p} pt${p>1?'s':''} (${gd} good)`).join(' e ')}.`,
  sumBig:(n,p)=>`Jogadas de 15+ jardas: ${n} (${p} das jogadas com jardas).`, sumDef:(us,c)=>`Contra ${us?'a nossa defesa':'esta defesa'} completa-se ${c} dos passes.`,
  sumDefBest:(z,a,b)=>` Onde se completa mais: ${z} (${a} em ${b}).`, sumDefWorst:(z,a,b)=>` Onde se completa menos: ${z} (${a} em ${b}).`, sumDefPl:(n,x)=>` Defensor mais ativo: #${n} (${x}).`,
  chQuick:'Visão rápida', chDir:'Direção dos passes', chDepth:'Profundidade dos passes', chDown:'Passe e corrida por down', chRec:'Alvos e completos',
  sc:'Relatório de adversário', scS:'tendências de uma equipa em todos os jogos', scTeam:'Equipa', scUs:'Hammers (auto-scouting)', scGamesN:n=>n===1?'1 jogo':`${n} jogos`,
  scPrint:'Imprimir', scNone:'Ainda não há jogos registados.', scNoPlays:'Sem jogadas registadas nos jogos escolhidos.', scLoading:n=>`A carregar ${n===1?'1 jogo':n+' jogos'}...`,
  scRecord:'Resultados', scRecVs:'contra os Hammers', scPtsFor:'marcados por jogo', scPtsAg:'sofridos por jogo', scWDL:['V','E','D'],
  scKey:'Tendências principais', scFew:n=>`Só ${n} jogadas: lê estas tendências com cuidado.`, scSample:n=>`${n} jogadas de ataque`,
  scPassK:'Passe ou corrida', scPassTxt:(p,r)=>`${p} passes e ${r} corridas`, scZoneK:'Zona favorita', scZoneTxt:(s,c)=>`${s} dos passes · ${c} completos`,
  scDeepK:'Bolas fundas', scDeepTxt:n=>`dos passes vão a mais de 15 jardas (${n})`, scRecK:'Alvo principal', scRecTxt:(s,c,td)=>`${s} dos alvos · ${c} completos · ${td} TD`,
  scLateK:'3º e 4º down', scPassPct:p=>`${p} passe`, scFavZone:z=>`zona favorita ${z}`, scFavRec:n=>`alvo #${n}`, scPlaysN:n=>n===1?'1 jogada':`${n} jogadas`,
  scFormK:'Formação mais usada', scFormTxt:(s,p)=>`${s} das jogadas · ${p} passe`, scGlK:'Perto da end zone', scGlTxt:(s,n)=>`${s} das bolas no mapa GL (${n})`,
  scConvK:'Conversões', scConvBig:p=>`${p} de 1 pt`, scConvTxt:(a,b,c,d)=>`good: 1 pt ${a}/${b} · 2 pts ${c}/${d}`,
  scDefK:h=>h?'A nossa defesa':'A defesa deles', scCompPct:p=>`${p} comp`, scDefTxt:(h,i,k)=>`completos ${h?'contra nós':'contra eles'} · ${i} INT · ${k} sacks`,
  scAttack:h=>h?'Como atacamos':'Como atacam', scMapT:'Para onde vai a bola', scMapNote:'% das bolas em cada zona, com o número de bolas e a % de completos. Os filtros mudam o mapa e as tabelas. Toca numa linha de uma tabela para filtrar.',
  scPosAll:'Todo o campo', scPosOwn:'Meio-campo próprio', scPosGoal:'Goal to go', scClear:'Limpar filtros', scNoForm:'sem formação',
  scByForm:'Por formação', scByDown:'Por down', scByDist:'Por distância', scTargets:'Alvos', scQbs:'QB',
  thScForm:['Formação','Jog.','% passe','Comp %','Zona +','Alvo +'], thScDown:['Down','Jog.','% passe','Comp %','Zona +','Alvo +','Formação +'],
  thScDist:['Distância','Jog.','% passe','Comp %','Zona +','Alvo +','Formação +'], thScRec:['Nº','Alvos','% alvos','Comp %','TD','Corr','Zona +'], thScQb:['QB','Passes','Comp %','TD','INT'],
  scDefence:h=>h?'Como defendemos':'Como defendem', scDefMap:h=>h?'Para onde nos atiram':'Para onde se lhes atira', scDefMapNote:'Passes dos adversários contra esta defesa, no campo (sem GL).',
  scDefPl:'Defensores em destaque', thScDef:['Nº','Flags','PBU','INT','Pick-6','Sacks'], scGamesT:'Jogos incluídos', scGamesNote:'Toca num jogo para o tirar do relatório ou voltar a incluir.',
  scLoadingG:'a carregar', scLoadFail:'não foi possível carregar', scOff:'fora do relatório', scOpenA:'Abrir análise', scBtn:'Relatório de adversário',
},
en:{
  rows:['Deep','Mid','Short','Behind the line'], glRows:['EZ back','EZ front','0-5','5-10'], cols:['Left','Middle','Right'], colsLong:['Left','Middle','Right'],
  ord:d=>d+(['','st','nd','rd','th'][d]||'th'), noZone:'No zone', opponent:'Opponent', noNum:'no #',
  res:{C:'complete',X:'incomplete',R:'run',TD:'TOUCHDOWN',INT:'interception',SACK:'sack'},
  tZoneFirst:'Tap a field zone first', tTdZone:'Tap the zone of the TD play', tIntPass:'INT only on passes',
  tIntZone:'Tap the zone the pass went to', tFdOnly:'1st down only after a completion or run',
  tFdOn:'1st down marked', tFdOff:'1st down removed', tCleared:'Mark cleared', tNoUndo:'Nothing to undo', tUndone:'Undone',
  pen:{rep:'Penalty: replay the down',fd:'Penalty: automatic 1st down',loss:'Penalty: loss of down',dec:'Penalty declined'},
  penShort:{rep:'Replay the down',fd:'Automatic 1st down',loss:'Loss of down',dec:'Declined'},
  chooseGame:'Choose game', sample:'sample', offense:'offense', down:'down', ham:'HAM', opp:'OPP', undo:'Undo', help:'Help',
  tabs:{reg:'Track',ana:'Analysis',log:'Plays'},
  hRes:{C:'<b>complete</b>',X:'<b>incomplete</b>',R:'<b>run</b>',TD:'<b>TD</b>',INT:'<b>INT</b>'},
  hAgain:'Tap again for incomplete. ', hNow:'Now tap the <b>number</b>.',
  hRun:'Run: tap the zone (or go straight to the <b>number</b>) and pick Run or TD.',
  hIdle:'Tap the <b>zone</b>, pick the <b>result</b>, then tap the <b>number</b>.',
  targets:'targets', saveNoNum:'Save without number', noNumShort:'no #', newNum:'New number',
  conv:'Conversion', failed:'Failed', offenseArrow:'▲ offense', los:'Line of scrimmage', yards:'yards',
  receiver:'Receiver', hammers:'Hammers', mostUsed:'most used first', formation:'Formation', formSticky:'stays selected until changed',
  newForm:'+ new', fd:'1st Down', td:'TD', int:'INT', penalty:'Penalty', run:'Run', game:'⋮ Options',
  tiles:['Passes','Comp %','TD','INT','Runs','1st downs','2 QB'],
  passes:'Passes', runs:'Runs', all:'All', allM:'All', allF:'All', downs:['1st','2nd','3rd','4th'],
  inclAnnul:'Include nullified', distribution:'Distribution', marks:'Marks', heatmap:'Heatmap',
  marksNote:'Each mark is one play: C = complete, x = incomplete, the number is the down.', fewer:'Fewer', more:'More targets',
  showAll:'Show all receivers', byPlayer:'Targets by player',
  thP:['#','Tgts','Comp','%','TD','INT','Runs'], noMatch:'No plays match these filters',
  tapPlayer:'Tap a player to show only their balls on the map.', byDown:'By down',
  thD:['Down','Passes','Comp','Top zone','Top target','Top formation','Runs'], comp:'comp', runsLow:'runs',
  annulledPlay:'nullified the play', downManual:'Down corrected manually', possManual:'Possession changed manually', confirm:'Confirm', del:'Delete',
  tagC:'Complete', tagX:'Incomplete', tagR:'Run', runLow:'run', fdLow:'1st down', convTag:p=>'conv. '+(p?'+'+p:'failed'),
  tod:'turnover on downs', annulTag:'nullified', restore:'Restore', annul:'Nullify',
  logCount:n=>`${n} plays recorded. Most recent first.`, copyCsv:'Copy CSV',
  logEmpty:'No plays yet. Go to Track and tap a zone.',
  penTitle:'Penalty', penQ:'What happens to the down?', annulLast:(d,r,z)=>`Nullify the last play (${d} down, ${r}, ${z})`,
  penRep:'Replay down', penRepS:d=>'stays on '+d, penFd:'Auto 1st down', penFdS:'e.g. pass interference', penLoss:'Loss of down',
  penLossS:'moves 1 down forward', penDec:'Declined', penDecS:'the play stands', cancel:'Cancel',
  fixDown:'Correct down', changePoss:'Change possession', nowOff:'now on offense: ',
  newNumT:'New number', numAddDraft:"Added to this game's roster and saves the play with this number.", numAdd:"Added to this game's roster.",
  newFormT:'New formation', orType:'Or type the name', formPh:'e.g. Trips Right', add:'Add',
  games:'Games', playsAbbr:'plays', newGame:'+ New game', delGameC:'Confirm: delete this game', delGame:'Delete this game', close:'Close',
  newGameT:'New game', team:'Team', competition:'Competition', teamName:'Team name', starts:'Starts on offense',
  device:'This device tracks', both:'Both sides', onlyH:'Hammers only', onlyA:'Opponent only', start:'Start game',
  csvHead:'date,team,competition,opponent,half,side,down,type,map,zone,receiver,result,defender,first_down,formation,double_qb,pick6,conv_return,nullified,yards,yac,qb,play,flag,pbu,video,reviewed,note,distance,spot',
  typeNum:'Type a number', typeForm:'Type the formation name', deleted:'Deleted', possChanged:'Possession changed',
  gameCreated:'Game created', csvCopied:'CSV copied', selectCopy:'Select and copy.', kind:{pass:'pass',run:'run',sack:'sack',conv:'conversion'},
  loginLead:'Sign in with the email and password a Game Ops admin gave you.', sendLink:'Send link', linkSent:e=>`We sent a link to <b>${e}</b>. Open the email on this device and tap the link. If you can't find it, check spam.`,
  pasteLabel:'If you use the installed app on iPhone, copy the link from the email and paste it here', signIn:'Sign in', otherEmail:'Use another email',
  confirmEmail:'To finish, confirm the email the link was sent to.', noAccess:e=>`<b>${e}</b> has no access yet. Ask a Game Ops admin to add you.`,
  signOut:'Sign out', setupMissing:'Firebase is not configured yet (firebase-config.js file).', loggingIn:'Signing in...', loading:'Loading', linkInvalid:'The link is not valid or has expired. Ask for a new one.',
  badEmail:'Type a valid email.', createAcc:'Create account', accCreated:'Account created', accLead:'Send these details to the person. They sign in with "Sign in with password" and change the password in Options → Set password.',
  tempPw:'Temporary password', copyMsg:'Copy message', copied:'Copied', accNote:'This password is only shown now. If you lose it, delete the account in Firebase (Authentication → Users) and create another one here.',
  credsMsg:(e,p)=>`Hammers Game Ops\nhttps://gameops.hammersflagfootball.pt\nEmail: ${e}\nTemporary password: ${p}\nAfter signing in, change the password in ⋮ Options → Set password.`,
  accExistsT:'This person already has an account', accExists:e=>`<b>${e}</b> already has an account (for example, because it was created before). They can sign in with their password. If they have none or forgot it, delete the account in Firebase (Authentication → Users) and tap Create account again.`,
  accFail:'Could not create the account.', emailQuota:'No more sign-in links can be sent today (daily email limit). Sign in with your password or try tomorrow.', notMember:e=>`${e} is not on the members list. Ask a Game Ops admin to add you.`,
  version:'version', previewTag:'preview', previewNote:'Preview for testing: no sign-in, and games stay in this browser only. Team games are not touched.', options:'Options', home:'Home', homeS:'choose what you want to do', hello:n=>n?`Hi, ${n}`:'Hi', continueG:'Continue', track:'Track', viewAna:'Analysis',
  allGamesBtn:'All games', recent:'Recent games', noGames:'No games yet. Create the first one in New game.', newGameS:'start tracking a game', demoS:'sample game to try things out', curGame:'Current game', gamesMenu:'Games', gamesS:'switch game, create a new one or delete', membersS:'who has access to the app',
  helpMenu:'Help and guide', helpS:'how to use the app', language:'Language', account:'Account', edit:'Edit', editMember:'Edit member', saveName:'Save name',
  nameRequired:'Type the name.',
  visLbl:'Visible to', visTeam:'Team', visMe:'Only me', visTeamS:'all of Game Ops sees and edits', visMeS:'only you and the admins (tests, practice)',
  byOwner:n=>`by ${n}`, visNowMe:'Game visible only to you and the admins', visNowTeam:'Game visible to the whole team',
  myName:'My name', myNameLead:'This is the name shown on the games you create.', nameLbl:'Name', namePh:'e.g. Francisco', nameSaved:'Name saved',
  pwOptional:'Password', signInPw:'Sign in', pwHint:'No account or forgot your password? Talk to a Game Ops admin.',
  pwEmpty:'Type the password.', pwWrong:'Wrong email or password. If you forgot your password, talk to a Game Ops admin.', pwTooMany:'Too many attempts. Wait a few minutes and try again.',
  setPw:'Set password', pwLead:'Replace the temporary password you received with your own.',
  pwNew:'New password (at least 8 characters)', pwRepeat:'Repeat the password', pwSave:'Save password', pwShort:'The password must have at least 8 characters.',
  pwMismatch:'The two passwords do not match.', pwSaved:'Password saved', pwRecent:'For security, sign out and sign in again with your current password before changing it.', pwFail:'Could not save the password. Try again.', sendFail:'Could not check your access. Check the network and try again.', offlineStart:'No network. Connect to the internet to sign in for the first time.',
  signedAs:'Signed in:', members:'Members', membersLead:'Only these emails can sign in. Members create and edit games. Admins also delete games and manage this list.',
  addMember:'Add member', roleMember:'Member', roleAdmin:'Admin', memberS:'creates and edits games', adminS:'also manages members',
  makeAdmin:'Make admin', makeMember:'Make member', remove:'Remove', you:'you', memberAdded:e=>`${e} added`,
  sack:'Sack', sacks:'Sacks', hSack:'Sack: tap the number of <b>who made the sack</b>.', hIntBy:'INT: now tap the number of <b>who intercepted</b>.',
  hConv:p=>`${p} pt conversion: tap the zone, pick the result and the number.`, convRes:{G:'Good',NG:'No Good',INT:'INT'}, convSkip:'No conversion', retYes:n=>`Yes, +${n}`,
  convIntQ:'INT on the conversion. Did the defense return it for points?', whoSack:'Who made the sack', whoInt:'Who intercepted', defense:'defense',
  result:'Result', resSub:'pick it before the number', mapField:'Field', glNote:'End zone at the top', losNote:'Line of scrimmage between Short and Behind',
  convs:'Conversions', convTries:'Attempts', convGood:'Good %', marksConv:'+1 / +2 = good conversion, x = no good, INT = interception.',
  defTable:s=>`${s} defense: INT and sacks`, thDef:['#','INT','Pick-6','Sacks'], byTag:n=>'by '+(n!=null?'#'+n:'no #'), retTag:n=>`returned +${n}`,
  halfT:'Halftime', halfS:s=>`2nd half starts with ${s} on offense`, h1:'1st H', h2:'2nd H', game_:'Whole game',
  pick6Q:'Interception. Returned for a TD (pick-6)?', pick6Yes:'Yes, pick-6', pick6No:'No', pick6Done:s=>`Pick-6: +6 for ${s}`,
  follows:'Following', roleA:'Opponent', roleB:'Both', roleQ:'Which team do you follow in this game?',
  roleHs:'You track when Hammers are on offense', roleAs:'You track when the opponent is on offense', roleBs:'You track everything alone',
  roleNote:"If there are 2 people, each picks one team. Both people's plays join this game, and the down and score stay the same on both devices.",
  roleSet:'Team selected', shared:'Shared', localOnly:'This device only', sending:n=>`Sending ${n}`,
  noWrite:'No permission to save to the shared games.', quota:'The database is full. Delete old games.',
  defHint:s=>`${s} is on offense. Nothing to do.`,
  defBody:(me,them)=>`You follow ${me}. The person following ${them} is tracking this drive, and plays show up here live.`,
  defOverride:'I will track this drive', changeRole:'Change team', lastPlays:'Latest plays',
  roTitle:'View only', readOnly:'You can view this game but not track it. Ask the app owner for editor access.',
  allGames:'All games', loadingShared:'Loading shared games...',
  willShare:'The game is shared with the team and shows on every device.', willLocal:'The game is saved on this device only.',
  tabsTape:'Tape', tEmptyT:'No plays yet', tEmpty:'Tape review completes the plays tracked live. Track the game first, or insert plays here.', tInsFirst:'+ Insert play',
  tDone:(a,b)=>`${a} / ${b} reviewed`, tShowList:'Show list', tHideList:'Hide list', tPlay:(i,n)=>`Play ${i} / ${n}`, tReviewed:'reviewed',
  tStart:'Start', tMark:'Mark now', tMarked:'Time marked', tNoVideo:'No video open', tVideos:'Videos', vPop:'Video in another window', vBack:'Bring video back',
  vAway:'The video is in another window', vAwayS:'Drag that window to the other screen. The buttons and keys here still control the video.',
  tPlayCtl:'Play / pause', tSlow:'0.5×', tBack5:'−5 s', tNext:'Next', tPrev:'Previous', tIns:'+ Insert play before', tDel:'Delete play', tDelC:'Confirm: delete',
  tNewPlay:'New play', fouls:{fs:'False start',dg:'Delay of game',sh:'Illegal shift or motion',os:'Offside',ip:'Illegal participation or substitution',pi:'Pass interference',ic:'Illegal contact',ir:'Illegal rush',fl:'Illegal flag pull',sd:'Shielding',fg:'Flag guarding',jd:'Jumping or diving',fp:'Illegal forward pass',rn:'Illegal run (no-running zone)',dp:'Delay of pass (7 s)',us:'Unsportsmanlike'},
  penWho:'Who committed the foul?', penOff:'Offense', penDef:'Defense', penPre:'Before the snap', penPlay:'During the play', penDead:'After the play', penOther:'Other foul', penOtherS:'you pick the yards and the down',
  penYds:n=>n?`${n} yds`:'no yards', penSpot:{los:'from the line of scrimmage',bs:'from the line (or from the end of the play, when the defense fouled on a play that gained)',sf:'from the spot of the foul: put the yards of the play up to the foul',next:'after the play, which counts'},
  penApply:'Apply foul', penDecl:'Declined', penBack:'‹ Another foul', penBall:(a,b)=>`Ball: ${a} → ${b}`, penAnnulPlay:'The foul nullifies the play', penOn:'Foul on the play',
  penEff:{rep:'replay the down',fd:'automatic 1st down',loss:'loss of down',dec:'declined'}, penRemove:'Remove foul', penAdd:'⚑ Foul', penYdsLbl:'Foul yards', midTag:'Midfield', tBall:'Ball', tBallS:'▼ own half · ▲ opponent half', tAutoS:'worked out from the yards', tManualS:'set by hand', tSpotFix:'Fix', tSpotAuto:'Automatic', tSpotT:'Line of scrimmage', tOwnHalf:'▼ Own', tOppHalf:'▲ Opponent', tSpotNote:'Yards to the goal line on each side. Drives start on the ▼5 and the 1st down is at midfield (▼25).', tSpotQ:'No yards on the previous play (or after an INT): set the spot.', fdAuto:'auto', distAll:'Any distance', tJump:'Go to the start of this play in the video', tPick6:'Pick-6', tNoConv:'No conversion', tSackK:'Sack', tPass:'Pass', tRun:'Run', tPlaySec:'Play', tFix:'fix it if needed', tZone:'Zone', tRunner:'Runner',
  tYds:'Yards', tYdsS:'total, from the line of scrimmage', tYac:'YAC', tYacS:'yards after the catch', yardsShort:'yds', tKpYds:'Yards', tKpYac:'YAC',
  tQb:'QB', tQbOpp:'Opponent QB', tSticky:'stays until you change it', tCall:'Play name', tCallS:"optional, from the team's playbook", tNewCall:'New play', tCallPh:'e.g. Smash', tTypeCall:'Type the play name',
  tFormOpp:'Opponent formation', tFlag:'Who pulled the flag', tPbu:'PBU', tPbuS:'who broke up the pass', tOurs:'Hammers, defense', tNote:'Note', tNotePh:'optional', tKeys:'Keys: ← → change play · space play/pause · Enter next',
  vNoneT:'No video', vNoneP:"Paste the game's YouTube link (unlisted) or open the video file on this device.", vAddLink:'Paste YouTube link', vFile:'Open file',
  vLead:'One video per game is best. If the game is in several videos, add one part for each.', vPart:n=>`Part ${n}`, vPaste:'YouTube link', vSaveLink:'Save link', vUse:'Watch this',
  vLocal:n=>`file on this device: ${n}`, vNoneS:'no video', vAdd:'+ Add part', vBadLink:"That link doesn't look like YouTube.", vSaved:'Video saved',
  vNote:'An opened file only plays on this device and is not uploaded. The YouTube link is saved in the game for the whole team.',
  vPopBlocked:'The browser blocked the window. Allow pop-ups for this site and try again.', vWin:'Video',
  thQb:['QB','Passes','Comp','%','Yds','Air','TD','INT'], byQb:'By QB', byCall:'By play', thCall:['Play','Calls','Comp %','Yds','Yds/play','TD'],
  tilesY:['Yards','Yds/play','Explosive'], thDef2:['#','Flags','PBU','INT','Pick-6','Sacks'], defTable2:s=>`${s} defense`, jdPlay:'Yds/play',
  insTag:'inserted in review',
  compOther:'Other', compPh:'e.g. Portugal Cup, Lisbon Tournament', compType:'Type the competition name.',
  ngOurs:'Hammers game', ngOursS:'against an opponent', ngOther:'Other teams', ngOtherS:'scouting a game between two teams',
  ngTeam1:'Team 1', ngTeam2:'Team 2', ngNames:'Type the names of both teams.', ngQuick:'Quick mode', ngQuickY:'Yes', ngQuickYS:'zone and result only, 2 taps', ngQuickN:'No', ngQuickNS:'with jersey numbers',
  quickOn:'on: zone and result, no numbers', quickOff:'off: with jersey numbers', quickNote:'Quick mode: the result saves the play, with no numbers. Change it in Options.',
  hQuick:'Tap the <b>zone</b>, then the <b>result</b>. The play is saved.', hQuick2:'Now tap the <b>result</b> to save.', hRunQ:'Run: tap the zone and pick Run or TD.', resSubQ:'saves the play',
  roleHs2:s=>`You track when ${s} is on offense`, xTag:'scouting',
  tmEdit:'Team sheet', tmT:'Team sheet', tmColor:'Color', tmPlayers:'Players', tmPlayersN:'The name for each jersey number. It shows in tracking, in the tables and in the summary.', tmNamePh:'name',
  tmNoNums:'No numbers tracked for this team yet.', tmSame:'Same team as', tmSameN:'Tick the names written another way in other games. Those games then count for this team in the report.',
  tmSave:'Save sheet', tmSaved:'Sheet saved', planT:'Game plan', planPh:'e.g. cover #13 on Short Right; blitz on 3rd down; attack Deep Left', planSaved:'Plan saved',
  planNote:'Shared with the team. Saved when you leave the box. Shows in tracking during the game and when you print the report.',
  vWatch:n=>`Watch on video (${n===1?'1 play':n+' plays'})`, vNoClips:'These plays have no video time yet. They get one in the tape review.', vPlayOne:'Watch this play on video',
  vAllT:'Filtered plays', vFilt:n=>`Watch the filtered plays on video (${n})`, vOnlyPos:(i,n)=>`${i} of ${n} · Next jumps to the next one in the list`, vOnlyX:'See all plays', vOnlyNo:'Leave the list to insert plays.',
  zmRings:'Rings', zmSum:'Summary', zmDots:'Dots', zOk:'successful',
  zmRingsN:'The number is the total of balls in the zone and the ring fills with the success % (completions and runs). Below, the % of all balls. Tap a zone to see its plays.',
  zmSumN:'The more yellow, the more balls. Number of balls, success %, most used target and the bar of completions, TDs and misses. Tap a zone to see its plays.',
  zmDotsN:'the number is the down. Tap a zone to see its plays.',
  lsT:n=>`Usual in ${n===1?'1 game':n+' games'} · tap for the report`, lsDown:(d,p,z,r)=>`${d} down: ${p} pass${z?' · '+z:''}${r?' · target #'+r:''}`, lsNoDown:d=>`${d} down: no earlier plays`, lsGl:z=>`near the end zone: ${z}`,
  alRun:(a,b)=>`Running ${a} of the time today (usually ${b})`, alRec:(n,a,b)=>`#${n} has ${a} of targets today (usually ${b})`, alSide:(i,a,b)=>`${a} of passes ${['to the left','to the middle','to the right'][i]} today (usually ${b})`, alForm:f=>`New formation today: ${f}`,
  scByCall:'By playbook call', thScCall:['Play','Times','% pass','Comp %','Yds/play','TD','Downs'], scCallF:c=>`Play: ${c}`,
  drvT:'Drives', drvAg:'Opponent drives', drvN:'drives', drvPts:'points per drive', drvTd:'end in a TD', drvLost:'lose the ball', drvPl:'plays per drive', drvOut:'How they end',
  drvEnd:{TD:'TD',INT:'INT',P6:'Pick-6',DN:'Downs',SF:'Safety',END:'End of half or ongoing'}, drvFirst:(p,z)=>`1st play of the drive: ${p} pass${z?`, mostly to ${z}`:''}.`,
  sumDrv:(n,pp,td,l)=>`Over ${n} drives: ${pp} points per drive, ${td} end in a TD and ${l} lose the ball (INT, downs or safety).`,
  autoFd:'AUTO 1ST DOWN', otherBtn:'Other ⋯', otherT:'Other outcomes', safety:'Safety', safetyS:s=>`+2 for ${s}, who get the ball`, badSnap:'Bad snap', badSnapS:'the snap hit the ground · counts as a down',
  driveN:n=>`Drive ${n}`, lastPlay1:'Last play', noPlaysYet:'no plays yet', lastRec:'last receiver',
  sumT:'Summary', sumNote:'Written automatically from the numbers.', sumFew:'Too few plays for a summary yet (it needs at least 5).',
  sumGames:g=>g>1?`Over ${g} games: `:'', sumPass:(pp,np,nr,cp)=>`${pp} of plays are passes (${np} passes and ${nr} runs), with ${cp} completed.`,
  sumDir:(i,p)=>`The ball goes mostly ${['to the left','to the middle','to the right'][i]} (${p} of passes)`, sumDirEven:(a,b,c)=>`The ball goes to all three sides (left ${a}, middle ${b}, right ${c})`,
  sumDepth:(sh,dp)=>`; ${sh} stay within 5 yards and ${dp} go more than 15.`, sumRec:(n,sh,c)=>`Main target: #${n} (${sh} of targets, ${c} complete).`, sumRec2:(n,sh,c)=>` Next is #${n} (${sh}, ${c} complete).`,
  sumLate:(p,z,r,o)=>`On 3rd and 4th down: ${p} pass${z?`, mostly to ${z}`:''}${r?`, and the favorite target is #${r}`:''}${o?` (not #${o})`:''}.`,
  sumForm:(f,sh,p)=>`Most used formation: ${f} (${sh} of plays, ${p} pass).`, sumFormRun:(f,p)=>` ${f} has more runs (${p}).`,
  sumGl:(z,sh)=>`Near the end zone: mostly ${z} (${sh} of balls on the GL map).`, sumConv:l=>`Conversions: ${l.map(([p,n,gd])=>`${n} for ${p} (${gd} good)`).join(' and ')}.`,
  sumBig:(n,p)=>`Plays of 15+ yards: ${n} (${p} of plays with yards).`, sumDef:(us,c)=>`Against ${us?'our defense':'this defense'}, ${c} of passes are completed.`,
  sumDefBest:(z,a,b)=>` Most completions: ${z} (${a} of ${b}).`, sumDefWorst:(z,a,b)=>` Fewest: ${z} (${a} of ${b}).`, sumDefPl:(n,x)=>` Most active defender: #${n} (${x}).`,
  chQuick:'At a glance', chDir:'Pass direction', chDepth:'Pass depth', chDown:'Pass and run by down', chRec:'Targets and completions',
  sc:'Opponent report', scS:"one team's tendencies across every game", scTeam:'Team', scUs:'Hammers (self-scout)', scGamesN:n=>n===1?'1 game':`${n} games`,
  scPrint:'Print', scNone:'No games tracked yet.', scNoPlays:'No plays tracked in the chosen games.', scLoading:n=>`Loading ${n===1?'1 game':n+' games'}...`,
  scRecord:'Results', scRecVs:'against the Hammers', scPtsFor:'scored per game', scPtsAg:'allowed per game', scWDL:['W','D','L'],
  scKey:'Key tendencies', scFew:n=>`Only ${n} plays: read these tendencies with care.`, scSample:n=>`${n} offensive plays`,
  scPassK:'Pass or run', scPassTxt:(p,r)=>`${p} passes and ${r} runs`, scZoneK:'Favorite zone', scZoneTxt:(s,c)=>`${s} of passes · ${c} complete`,
  scDeepK:'Deep balls', scDeepTxt:n=>`of passes go more than 15 yards (${n})`, scRecK:'Main target', scRecTxt:(s,c,td)=>`${s} of targets · ${c} complete · ${td} TD`,
  scLateK:'3rd and 4th down', scPassPct:p=>`${p} pass`, scFavZone:z=>`favorite zone ${z}`, scFavRec:n=>`target #${n}`, scPlaysN:n=>n===1?'1 play':`${n} plays`,
  scFormK:'Most used formation', scFormTxt:(s,p)=>`${s} of plays · ${p} pass`, scGlK:'Near the end zone', scGlTxt:(s,n)=>`${s} of balls on the GL map (${n})`,
  scConvK:'Conversions', scConvBig:p=>`${p} go for 1`, scConvTxt:(a,b,c,d)=>`good: 1 pt ${a}/${b} · 2 pts ${c}/${d}`,
  scDefK:h=>h?'Our defense':'Their defense', scCompPct:p=>`${p} comp`, scDefTxt:(h,i,k)=>`completed ${h?'against us':'against them'} · ${i} INT · ${k} sacks`,
  scAttack:h=>h?'How we attack':'How they attack', scMapT:'Where the ball goes', scMapNote:'% of balls in each zone, with the number of balls and the completion %. Filters change the map and the tables. Tap a table row to filter.',
  scPosAll:'Whole field', scPosOwn:'Own half', scPosGoal:'Goal to go', scClear:'Clear filters', scNoForm:'no formation',
  scByForm:'By formation', scByDown:'By down', scByDist:'By distance', scTargets:'Targets', scQbs:'QB',
  thScForm:['Formation','Plays','% pass','Comp %','Zone +','Target +'], thScDown:['Down','Plays','% pass','Comp %','Zone +','Target +','Formation +'],
  thScDist:['Distance','Plays','% pass','Comp %','Zone +','Target +','Formation +'], thScRec:['No.','Targets','% targets','Comp %','TD','Runs','Zone +'], thScQb:['QB','Passes','Comp %','TD','INT'],
  scDefence:h=>h?'How we defend':'How they defend', scDefMap:h=>h?'Where teams throw on us':'Where teams throw on them', scDefMapNote:'Opponent passes against this defense, on the field map (no GL).',
  scDefPl:'Defenders to watch', thScDef:['No.','Flags','PBU','INT','Pick-6','Sacks'], scGamesT:'Games included', scGamesNote:'Tap a game to leave it out of the report or bring it back.',
  scLoadingG:'loading', scLoadFail:'could not load', scOff:'left out', scOpenA:'Open analysis', scBtn:'Opponent report',
}};
function t(k,...a){const v=L[lang][k]!==undefined?L[lang][k]:L.en[k];return typeof v==='function'?v(...a):v}
const ord=d=>t('ord',d);
const zoneName=z=>z==null?t('noZone'):z[0]==='g'?t('glRows')[+z[1]]+' '+t('cols')[+z[2]]:t('rows')[+z[0]]+' '+t('cols')[+z[1]];
const uid=()=>Math.random().toString(36).slice(2,10);
const other=s=>s==='H'?'A':'H';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- help content ---------- */
const btn=(cls,txt)=>`<span class="pill ${cls}">${txt}</span>`;
function helpData(){
  const pt=lang==='pt';
  const quick=pt?[
    ['Passo 1','Toca na zona','Onde a bola foi lançada (ou onde acabou a corrida).'],
    ['Passo 2','Escolhe o resultado','Completo já vem marcado. Muda para Incompleto, TD ou INT se for preciso.'],
    ['Passo 3','Toca no número','O recetor. A jogada fica gravada e o down avança sozinho.']
  ]:[
    ['Step 1','Tap the zone','Where the ball was thrown (or where the run ended).'],
    ['Step 2','Pick the result','Complete is already selected. Switch to Incomplete, TD or INT if needed.'],
    ['Step 3','Tap the number','The receiver. The play is saved and the down moves on by itself.']
  ];
  const S=pt?[
    {id:'start',t:'Antes do jogo',b:`<ol>
      <li>Toca em ${btn('',t('game'))}, depois em <b>Jogos</b> e em <b>+ Novo jogo</b>. Escolhe <b>Jogo dos Hammers</b> (ou <b>Outras equipas</b> para fazer scouting, ver abaixo).</li>
      <li>Escolhe a equipa (Elite, Academy, Girls) e a competição, e escreve o adversário. Para uma competição que não está na lista (uma taça ou um torneio), toca em <b>+ Outra</b> e escreve o nome: fica na lista para os jogos seguintes.</li>
      <li>Escolhe quem começa a atacar.</li>
      <li>Escolhe <b>que equipa segues</b>: Hammers, Adversário ou as duas (se estiveres sozinho).</li></ol>
      <p>O jogo "Demo FC" é só um exemplo para veres como fica. Podes trocar de jogo a qualquer momento em ${btn('',t('game'))} → <b>Jogos</b>.</p>`},
    {id:'xgame',t:'Jogos de outras equipas',b:`<p>Para fazer scouting de um jogo entre duas equipas que não são os Hammers (por exemplo, nos torneios da LFFF):</p>
      <ol><li>Em <b>+ Novo jogo</b>, escolhe <b>Outras equipas</b>.</li>
      <li>Escolhe a competição (ou <b>+ Outra</b>) e escreve o nome das duas equipas. O jogo entra no relatório dessas equipas, junto com os jogos da equipa nossa que joga nessa competição. Numa competição onde ainda não temos jogos, conta como Elite.</li>
      <li>Escolhe o <b>modo rápido</b> (só zona e resultado: tocas na zona e no resultado e a jogada fica gravada) ou o registo normal, com números de camisola. Podes mudar mais tarde em ${btn('',t('game'))}.</li></ol>
      <p>O registo, a tape review e a análise funcionam como num jogo dos Hammers, com o nome das duas equipas e outra cor. Estes jogos entram no <b>relatório de adversário</b> das duas equipas, juntos com os jogos contra nós, e na faixa de <b>scouting ao vivo</b>. Na lista de jogos do relatório aparecem marcados como scouting.</p>`},
    {id:'track',t:'Registar uma jogada',b:`<ol>
      <li>Toca na <b>zona</b> para onde a bola foi lançada.</li>
      <li>Escolhe o <b>resultado</b> na linha que aparece: ${btn('','Completo')} (já vem marcado), ${btn('','Incompleto')}, ${btn('td','TD')} ou ${btn('int','INT')}.</li>
      <li>Toca no <b>número</b> do recetor. A jogada fica gravada.</li></ol>
      <dl class="hl">
      <dt>${btn('int','INT')}</dt><dd>Depois do número do recetor, a app pede o número de <b>quem intercetou</b>. A posse muda e a barra pergunta se foi <b>pick-6</b>.</dd>
      <dt>${btn('','?')}</dt><dd>Grava sem número, quando não deu para ver quem foi.</dd>
      <dt>${btn('','+')}</dt><dd>Acrescenta um número novo ao plantel deste jogo.</dd></dl>
      <p>Antes do número podes mudar de ideias: toca noutra zona ou noutro resultado. Tocar outra vez na mesma zona apaga a marca.</p>
      <p>Por cima do campo, os quadros <b>Zona</b>, <b>Resultado</b> e <b>Recetor</b> mostram o que já escolheste, e o contorno laranja diz o passo seguinte. O ponto laranja num número marca o último recetor. Por baixo dos botões fica a <b>drive</b> em curso, com a última jogada e o botão Desfazer ao lado, e as drives anteriores numa linha cada.</p>
      <p>No marcador, a bola mostra quem ataca. Toca na outra equipa para lhe dar a bola, ou no down ao centro para o corrigir.</p>
      <p><b>Scouting ao vivo</b>: quando o adversário ataca e já há jogos registados contra ele, uma faixa por cima do campo mostra o que costuma fazer nesse down (passe ou corrida, zona e alvo preferidos) e, perto da end zone, a zona favorita. Por baixo aparecem avisos quando hoje está a fazer diferente: corre mais ou menos, procura outro alvo, ataca outro lado ou usa uma formação nova. Toca na faixa para abrir o relatório.</p>`},
    {id:'zones',t:'O campo',b:`<p>O ataque vai sempre para cima. São 12 zonas: 3 colunas e 4 faixas a partir da linha de scrimmage.</p>
      <ul><li><b>Fundo</b>: mais de 15 jardas</li><li><b>Médio</b>: 5 a 15 jardas</li><li><b>Curto</b>: 0 a 5 jardas</li><li><b>Atrás da linha</b>: passes atrás da linha de scrimmage (screens, laterais), completos ou incompletos</li></ul>
      <p>Cada zona mostra o resumo das jogadas de quem está a atacar: fica mais amarela quanto mais bolas recebe, com o número de bolas, a % de sucesso, o alvo mais usado e uma barra (verde = completos e corridas, dourado = TD, vermelho = falhados). O down de cada jogada vê-se na faixa de scouting e no cartão da drive.</p>`},
    {id:'gl',t:'Goal line e conversões',b:`<p>Perto da end zone, toca em ${btn('','GL')} por cima do campo para usar o mapa de goal line: <b>EZ fundo</b> e <b>EZ frente</b> (a end zone em 2 faixas), <b>0-5</b> e <b>5-10 jardas</b>, sempre em 3 colunas. O GL desliga-se sozinho quando muda a posse.</p>
      <p>Depois de um TD aparece a barra <b>Conversão</b>:</p>
      <ol><li>Escolhe <b>1 pt</b> ou <b>2 pts</b>. Abre o mapa GL.</li>
      <li>Toca na zona e escolhe ${btn('','Good')}, ${btn('','No Good')} ou ${btn('int','INT')}. Um passe incompleto é No Good.</li>
      <li>Toca no número do recetor. Se for INT, toca também em quem intercetou e diz se a defesa a devolveu. O retorno vale o mesmo que a tentativa: <b>+1</b> numa de 1 pt, <b>+2</b> numa de 2 pts.</li></ol>
      <p>Se não houve tentativa, toca em <b>Sem conversão</b>. Na Análise, escolhe <b>Campo</b>, <b>GL</b> ou <b>Conversões</b>.</p>`},
    {id:'buttons',t:'Botões',b:`<dl class="hl">
      <dt>${btn('',t('fd'))}</dt><dd>Passaram o meio-campo ou ganharam novo 1º down. O down volta a 1.</dd>
      <dt>${btn('pen',t('penalty'))}</dt><dd>Escolhe a equipa que fez a falta e a falta (por exemplo interferência de passe ou flag guarding). A app aplica as jardas e o efeito no down das regras IFAF e, com as jardas da tape review, mexe a bola. Também dá para marcar como recusada, ou escolher "Outra falta".</dd>
      <dt>${btn('',t('run'))}</dt><dd>A jogada é uma corrida. Toca na zona, escolhe Corrida ou TD e toca no número de quem correu.</dd>
      <dt>${btn('int',t('sack'))}</dt><dd>Sack. Toca no número de quem fez o sack. O down avança.</dd>
      <dt>${btn('','GL')}</dt><dd>Troca o campo pelo mapa de goal line.</dd>
      <dt>${btn('','Double')}</dt><dd>Formação. Fica selecionada até mudares. Toca outra vez para tirar.</dd>
      <dt>${btn('','2 QB')}</dt><dd>Marca a próxima jogada como Double QB.</dd>
      <dt>${btn('',t('otherBtn'))}</dt><dd><b>Safety</b> (+2 para a defesa, que fica com a bola) ou <b>bad snap</b> (a bola tocou no chão no snap; conta como down).</dd>
      <dt>${btn('','↶ '+t('undo'))}</dt><dd>Apaga o último toque ou a última jogada.</dd></dl>`},
    {id:'downs',t:'Down e posse automáticos',b:`<ul>
      <li>Cada jogada avança 1 down.</li>
      <li>${btn('',t('fd'))} volta ao 1º down.</li>
      <li>TD, INT ou falhar o 4º down mudam a posse e voltam ao 1º down.</li>
      <li>Se a app se enganar, toca no <b>down</b> ao centro do marcador para o corrigir ou para mudar a posse. Também podes tocar na equipa que não tem a bola para lha dar.</li>
      <li>No <b>intervalo</b>, toca no down e depois em <b>Intervalo</b>: a 2ª parte começa no 1º down, a atacar quem não começou o jogo.</li></ul>`},
    {id:'analysis',t:'Análise',b:`<ul>
      <li><b>Filtros</b>: Hammers ou adversário, passes ou corridas, down, formação e se as jogadas anuladas contam.</li>
      <li><b>Mapa</b> em três vistas: <b>Anéis</b> (o número é o total de bolas na zona e o anel enche com a % de sucesso), <b>Resumo</b> (quanto mais amarela, mais bolas, com o alvo mais usado) e <b>Pontos</b> (cada jogada é um ponto com a cor do resultado e o down lá dentro).</li>
      <li><b>Toca numa zona</b> para ver todas as jogadas que lá caíram: down e distância, resultado, recetor, formação, jogada e jardas. Com ▶ vês essas jogadas de seguida no vídeo da tape review.</li>
      <li><b>Alvos por jogador</b>: alvos, completos, %, TD, INT e corridas. Toca num jogador para ver só as bolas dele no mapa.</li>
      <li><b>Por down</b>: zona, alvo e formação mais usados em cada down. Toca num down para filtrar.</li>
      <li><b>Resumo</b>: frases escritas automaticamente a partir dos números, com as tendências principais de quem ataca e da defesa.</li>
      <li><b>Visão rápida</b>: gráficos da direção e da profundidade dos passes, passe e corrida por down, e alvos com completos.</li>
      <li><b>Drives</b>: quantas drives, pontos por drive, % que acabam em TD ou perdem a bola, como acabam e o que fazem na 1ª jogada.</li></ul>`},
    {id:'scout',t:'Relatório de adversário',b:`<p>Junta todos os jogos registados contra uma equipa e mostra o que ela costuma fazer. Abre em <b>Início</b> → <b>Relatório de adversário</b>, em ${btn('',t('game'))} ou no botão da <b>Análise</b> de um jogo.</p>
      <ul><li><b>Equipa</b>: escolhe o adversário (separado por Elite, Academy e Girls) ou <b>Hammers</b>, para vermos se nós próprios estamos a ser previsíveis.</li>
      <li><b>Resumo</b>: frases escritas automaticamente a partir dos números.</li>
      <li><b>Tendências principais</b>: passe ou corrida, zona favorita, bolas fundas, alvo principal, 3º e 4º down, formação, perto da end zone, conversões e a defesa deles. Com poucas jogadas, a app avisa.</li>
      <li><b>Para onde vai a bola</b>: o mapa com as vistas Anéis, Resumo e Pontos, e o toque numa zona para ver as jogadas de todos os jogos. Filtra por down, distância, zona do campo e formação. Toca numa linha das tabelas para filtrar.</li>
      <li><b>Drives</b>: pontos por drive e como acabam, a atacar e a defender.</li>
      <li><b>Por jogada do playbook</b> (só nos Hammers): quantas vezes chamamos cada jogada, em que downs e como corre. Toca numa jogada para filtrar o mapa. Os nomes vêm da tape review.</li>
      <li><b>Como defendem</b>: para onde se lhes atira e quem faz as jogadas (flags, PBU, INT, sacks).</li>
      <li><b>Jogos incluídos</b>: toca num jogo para o tirar do relatório.</li>
      <li><b>Ficha da equipa</b> (botão junto ao nome): cor, nome de cada jogador por número e "é a mesma equipa que", para juntar jogos onde o nome foi escrito de outra forma. Os nomes aparecem no registo, nas tabelas e no resumo, e a cor no marcador.</li>
      <li><b>Plano de jogo</b>: notas dos treinadores para este adversário, partilhadas com a equipa. Aparecem no registo, numa caixa por cima do campo, e na impressão.</li>
      <li><b>Ver no vídeo</b>: toca numa zona, ou no botão por baixo do mapa para as jogadas filtradas, e escolhe o jogo. A tape review abre só com essas jogadas e <b>Próxima</b> salta para a seguinte da lista. Só entram as jogadas que já têm tempo de vídeo.</li></ul>
      <p>A distância e a zona do campo precisam das jardas da tape review. <b>Imprimir</b> dá uma folha para levar para o jogo.</p>`},
    {id:'plays',t:'Lista de jogadas',b:`<ul>
      <li>Todas as jogadas do jogo, a mais recente primeiro.</li>
      <li><b>Anular</b> tira a jogada das stats mas guarda-a. <b>Apagar</b> remove-a (pede confirmação).</li>
      <li><b>Copiar CSV</b> copia tudo para colar numa folha de Excel ou Google Sheets.</li></ul>`},
    {id:'tape',t:'Tape review',b:`<p>Depois do jogo, abre o separador <b>Tape</b>. Aparece uma jogada de cada vez, com o que foi registado no live, ao lado do vídeo.</p>
      <ol><li>Em <b>Vídeos</b>, cola o link do YouTube do jogo (não listado). Se o jogo estiver em vários vídeos, acrescenta uma parte para cada um. Também podes abrir um ficheiro de vídeo do aparelho: só toca nesse aparelho.</li>
      <li>Vê o clip da jogada e completa: <b>jardas</b>, <b>YAC</b> nos completos, <b>QB</b>, <b>formação</b> e <b>nome da jogada</b> (opcional) quando atacamos. Quando defendemos: QB e formação do adversário, <b>quem tirou a flag</b> e <b>PBU</b>.</li>
      <li>Corrige o tipo, o resultado, a zona ou o recetor se o live se enganou.</li>
      <li>Carrega em <b>Próxima</b> quando o clip seguinte começar. A jogada fica revista e o segundo do vídeo fica guardado como início da jogada seguinte. Na última jogada, o botão passa a <b>Nova jogada</b> e cria a seguinte, como no Registo: depois de um TD é a conversão (1 ou 2 pts, ou <b>Sem conversão</b>), senão um passe que podes mudar para corrida ou sack. Assim dá para registar o jogo todo a partir da tape.</li></ol>
      <ul><li><b>Down e distância</b>: com as jardas, a app sabe onde está a bola (▼ meio-campo próprio, ▲ meio-campo adversário) e mostra, por exemplo, <b>2º & 12 · ▼13</b>. A drive começa no ▼5 e passar o meio-campo é 1º down (e depois é <b>Goal</b>). Depois de um INT, ou se faltarem as jardas, indica o spot em <b>Bola → Corrigir</b>. Na Análise podes filtrar por distância (0-5, 5-10, 10-15, 15+).</li>
      <li>QB e formação vêm preenchidos com os da jogada anterior (tracejado). Só tocas se mudarem.</li>
      <li>Escolher uma jogada na lista, ou com ‹ ›, faz o vídeo saltar para ela. <b>Marcar agora</b> corrige o início, e tocar no tempo de início volta a esse ponto do vídeo.</li>
      <li><b>⚑ Falta</b> regista uma falta nesta jogada: escolhes a equipa e a falta, e a app aplica as jardas a partir do sítio certo, o efeito no down e o novo spot da bola.</li>
      <li><b>Inserir jogada antes</b> acrescenta uma jogada que faltou no live. O down e o resultado são recalculados.</li>
      <li><b>Vídeo noutra janela</b> abre o vídeo numa janela à parte, para pôr noutro ecrã. Os botões e as teclas continuam a comandá-lo.</li>
      <li>No computador: <b>← →</b> muda de jogada, <b>espaço</b> faz play/pausa, <b>Enter</b> é Próxima.</li></ul>
      <p>As jardas, o YAC, os QB, os nomes das jogadas, as flags e os PBU aparecem na <b>Análise</b>.</p>`},
    {id:'team',t:'Duas pessoas no mesmo jogo',b:`<ol>
      <li>Uma pessoa cria o jogo. Ele aparece logo em ${btn('',t('game'))} → <b>Jogos</b> para toda a equipa.</li>
      <li>A outra pessoa abre o mesmo link e escolhe esse jogo na lista.</li>
      <li>Cada uma escolhe a equipa que segue: <b>Hammers</b> ou <b>Adversário</b>.</li>
      <li>Quando a tua equipa ataca, registas normalmente. Quando a outra ataca, o ecrã fica em espera e mostra as jogadas da outra pessoa ao vivo.</li></ol>
      <p>O down, a posse e o resultado são os mesmos nos dois aparelhos. Se a outra pessoa ficar sem bateria, toca em <b>Registar eu esta posse</b>. Para mudar de equipa, usa ${btn('',t('game'))} no topo.</p>`},
    {id:'data',t:'Onde ficam os dados',b:`<p>Os jogos ficam guardados online e aparecem em qualquer aparelho, também para a tape review depois do torneio. Só os emails da lista de <b>Membros</b> conseguem entrar. Os admins gerem a lista em ${btn('',t('game'))} → <b>Membros</b>.</p>
      <p>Para entrar usas o email e a password. A conta é criada por um admin em ${btn('',t('game'))} → <b>Membros</b> → <b>Criar conta</b>, com uma password temporária que depois trocas em ${btn('',t('game'))} → <b>Definir password</b>.</p>
      <p>Sem rede, a app continua a funcionar: guarda as jogadas e envia-as quando a rede voltar. No topo aparece <b>A enviar</b> enquanto houver jogadas por enviar.</p>
      <p>A língua muda-se em ${btn('',t('game'))} → <b>Língua</b>. Os dados não mudam.</p>`}
  ]:[
    {id:'start',t:'Before the game',b:`<ol>
      <li>Tap ${btn('',t('game'))}, then <b>Games</b> and <b>+ New game</b>. Pick <b>Hammers game</b> (or <b>Other teams</b> to scout, see below).</li>
      <li>Pick the team (Elite, Academy, Girls) and the competition, and type the opponent. For a competition not on the list (a cup or a tournament), tap <b>+ Other</b> and type its name: it stays on the list for the next games.</li>
      <li>Pick who starts on offense.</li>
      <li>Pick <b>which team you follow</b>: Hammers, Opponent or both (if you are alone).</li></ol>
      <p>The "Demo FC" game is just a sample so you can see how it looks. Switch games at any time in ${btn('',t('game'))} → <b>Games</b>.</p>`},
    {id:'xgame',t:'Games between other teams',b:`<p>To scout a game between two teams that are not the Hammers (for example, at LFFF tournaments):</p>
      <ol><li>In <b>+ New game</b>, pick <b>Other teams</b>.</li>
      <li>Pick the competition (or <b>+ Other</b>) and type the names of both teams. The game joins those teams' reports, with the games of our team that plays in that competition. In a competition where we have no games yet, it counts as Elite.</li>
      <li>Pick <b>quick mode</b> (zone and result only: tap the zone and the result and the play is saved) or normal tracking with jersey numbers. You can change it later in ${btn('',t('game'))}.</li></ol>
      <p>Tracking, the tape review and the analysis work like in a Hammers game, with both teams' names and another color. These games count in the <b>opponent report</b> of both teams, together with the games against us, and in the <b>live scouting</b> strip. In the report's game list they are marked as scouting.</p>`},
    {id:'track',t:'Track a play',b:`<ol>
      <li>Tap the <b>zone</b> the ball was thrown to.</li>
      <li>Pick the <b>result</b> on the row that appears: ${btn('','Complete')} (already selected), ${btn('','Incomplete')}, ${btn('td','TD')} or ${btn('int','INT')}.</li>
      <li>Tap the receiver's <b>number</b>. The play is saved.</li></ol>
      <dl class="hl">
      <dt>${btn('int','INT')}</dt><dd>After the receiver's number, the app asks for the number of <b>who intercepted</b>. Possession changes and the bar asks whether it was a <b>pick-6</b>.</dd>
      <dt>${btn('','?')}</dt><dd>Saves without a number, when you couldn't see who it was.</dd>
      <dt>${btn('','+')}</dt><dd>Adds a new number to this game's roster.</dd></dl>
      <p>Before the number you can change your mind: tap another zone or another result. Tapping the same zone again clears the mark.</p>
      <p>Above the field, the <b>Zone</b>, <b>Result</b> and <b>Receiver</b> boxes show what you picked, and the orange outline shows the next step. The orange dot on a number marks the last receiver. Below the buttons is the current <b>drive</b>, with the last play and an Undo button next to it, and earlier drives one line each.</p>
      <p>On the scoreboard, the ball shows who is on offense. Tap the other team to give it the ball, or the down in the middle to fix it.</p>
      <p><b>Live scouting</b>: when the opponent has the ball and there are earlier games against it, a strip above the field shows what it usually does on this down (pass or run, favorite zone and target) and, near the end zone, its favorite zone. Warnings show when today is different: more or fewer runs, another target, another side or a new formation. Tap the strip to open the report.</p>`},
    {id:'zones',t:'The field',b:`<p>Offense always goes up. There are 12 zones: 3 columns and 4 bands from the line of scrimmage.</p>
      <ul><li><b>Deep</b>: more than 15 yards</li><li><b>Mid</b>: 5 to 15 yards</li><li><b>Short</b>: 0 to 5 yards</li><li><b>Behind the line</b>: passes behind the line of scrimmage (screens, laterals), complete or incomplete</li></ul>
      <p>Each zone shows a summary of the plays of the team on offense: it gets more yellow the more balls it gets, with the number of balls, the success %, the most used target and a bar (green = completions and runs, gold = TD, red = misses). The down of each play shows in the scouting strip and the drive card.</p>`},
    {id:'gl',t:'Goal line and conversions',b:`<p>Near the end zone, tap ${btn('','GL')} above the field to use the goal line map: <b>EZ back</b> and <b>EZ front</b> (the end zone in 2 bands), <b>0-5</b> and <b>5-10 yards</b>, always in 3 columns. GL turns off by itself when possession changes.</p>
      <p>After a TD the <b>Conversion</b> bar appears:</p>
      <ol><li>Pick <b>1 pt</b> or <b>2 pts</b>. The GL map opens.</li>
      <li>Tap the zone and pick ${btn('','Good')}, ${btn('','No Good')} or ${btn('int','INT')}. An incomplete pass is No Good.</li>
      <li>Tap the receiver's number. On an INT, also tap who intercepted and say whether the defense returned it. The return is worth the same as the attempt: <b>+1</b> on a 1 pt try, <b>+2</b> on a 2 pt try.</li></ol>
      <p>If there was no attempt, tap <b>No conversion</b>. In Analysis, pick <b>Field</b>, <b>GL</b> or <b>Conversions</b>.</p>`},
    {id:'buttons',t:'Buttons',b:`<dl class="hl">
      <dt>${btn('',t('fd'))}</dt><dd>They crossed midfield or earned a new 1st down. The down goes back to 1.</dd>
      <dt>${btn('pen',t('penalty'))}</dt><dd>Pick the team that committed the foul and the foul (for example pass interference or flag guarding). The app applies the yards and the effect on the down from the IFAF rules and, with the tape review yards, moves the ball. It can also be declined, or pick "Other foul".</dd>
      <dt>${btn('',t('run'))}</dt><dd>The play is a run. Tap the zone, pick Run or TD and tap the runner's number.</dd>
      <dt>${btn('int',t('sack'))}</dt><dd>Sack. Tap the number of who made the sack. The down moves forward.</dd>
      <dt>${btn('','GL')}</dt><dd>Switches the field to the goal line map.</dd>
      <dt>${btn('','Double')}</dt><dd>Formation. Stays selected until you change it. Tap again to clear.</dd>
      <dt>${btn('','2 QB')}</dt><dd>Marks the next play as Double QB.</dd>
      <dt>${btn('',t('otherBtn'))}</dt><dd><b>Safety</b> (+2 for the defense, who get the ball) or <b>bad snap</b> (the snap hit the ground; counts as a down).</dd>
      <dt>${btn('','↶ '+t('undo'))}</dt><dd>Removes the last tap or the last play.</dd></dl>`},
    {id:'downs',t:'Automatic down and possession',b:`<ul>
      <li>Each play moves the down forward by 1.</li>
      <li>${btn('',t('fd'))} goes back to 1st down.</li>
      <li>TD, INT or failing on 4th down change possession and reset to 1st down.</li>
      <li>If the app gets it wrong, tap the <b>down</b> in the middle of the scoreboard to fix it or to change possession. You can also tap the team without the ball to give it the ball.</li>
      <li>At <b>halftime</b>, tap the down and then <b>Halftime</b>: the 2nd half starts on 1st down, with the team that did not start on offense.</li></ul>`},
    {id:'analysis',t:'Analysis',b:`<ul>
      <li><b>Filters</b>: Hammers or opponent, passes or runs, down, formation and whether nullified plays count.</li>
      <li><b>Map</b> in three views: <b>Rings</b> (the number is the total of balls in the zone and the ring fills with the success %), <b>Summary</b> (the more yellow, the more balls, with the most used target) and <b>Dots</b> (each play is a dot with the result's color and its down inside).</li>
      <li><b>Tap a zone</b> to see every play in it: down and distance, result, receiver, formation, play and yards. With ▶ you watch those plays one after the other in the tape review video.</li>
      <li><b>Targets by player</b>: targets, completions, %, TD, INT and runs. Tap a player to show only their balls on the map.</li>
      <li><b>By down</b>: most used zone, target and formation on each down. Tap a down to filter.</li>
      <li><b>Summary</b>: sentences written automatically from the numbers, with the main tendencies of the offense and of the defense.</li>
      <li><b>At a glance</b>: charts of pass direction and depth, pass and run by down, and targets with completions.</li>
      <li><b>Drives</b>: how many drives, points per drive, % that end in a TD or lose the ball, how they end and what the 1st play is.</li></ul>`},
    {id:'scout',t:'Opponent report',b:`<p>Adds up every game tracked against one team and shows what it tends to do. Open it from <b>Home</b> → <b>Opponent report</b>, from ${btn('',t('game'))} or with the button in a game's <b>Analysis</b>.</p>
      <ul><li><b>Team</b>: pick the opponent (kept apart by Elite, Academy and Girls) or <b>Hammers</b>, to check whether we are predictable ourselves.</li>
      <li><b>Summary</b>: sentences written automatically from the numbers.</li>
      <li><b>Key tendencies</b>: pass or run, favorite zone, deep balls, main target, 3rd and 4th down, formation, near the end zone, conversions and their defense. With few plays, the app warns you.</li>
      <li><b>Where the ball goes</b>: the map with the Rings, Summary and Dots views, and a tap on a zone to see its plays from every game. Filter by down, distance, field position and formation. Tap a table row to filter.</li>
      <li><b>Drives</b>: points per drive and how drives end, on offense and on defense.</li>
      <li><b>By playbook call</b> (Hammers only): how often we call each play, on which downs and how it goes. Tap a play to filter the map. Play names come from the tape review.</li>
      <li><b>How they defend</b>: where teams throw on them and who makes the plays (flags, PBU, INT, sacks).</li>
      <li><b>Games included</b>: tap a game to leave it out of the report.</li>
      <li><b>Team sheet</b> (button next to the name): color, each player's name by number and "same team as", to join games where the name was written another way. Names show in tracking, the tables and the summary, and the color on the scoreboard.</li>
      <li><b>Game plan</b>: coaches' notes for this opponent, shared with the team. They show in tracking, in a box above the field, and when printing.</li>
      <li><b>Watch on video</b>: tap a zone, or the button under the map for the filtered plays, and pick the game. The tape review opens with just those plays and <b>Next</b> jumps to the next one in the list. Only plays that already have a video time are included.</li></ul>
      <p>Distance and field position need the yards from the tape review. <b>Print</b> gives a sheet to take to the game.</p>`},
    {id:'plays',t:'Play list',b:`<ul>
      <li>Every play of the game, most recent first.</li>
      <li><b>Nullify</b> removes the play from stats but keeps it. <b>Delete</b> removes it (asks to confirm).</li>
      <li><b>Copy CSV</b> copies everything to paste into Excel or Google Sheets.</li></ul>`},
    {id:'tape',t:'Tape review',b:`<p>After the game, open the <b>Tape</b> tab. It shows one play at a time, with what was tracked live, next to the video.</p>
      <ol><li>In <b>Videos</b>, paste the game's YouTube link (unlisted). If the game is in several videos, add one part for each. You can also open a video file from the device: it only plays on that device.</li>
      <li>Watch the play's clip and fill in: <b>yards</b>, <b>YAC</b> on completions, <b>QB</b>, <b>formation</b> and <b>play name</b> (optional) when we are on offense. On defense: opponent QB and formation, <b>who pulled the flag</b> and <b>PBU</b>.</li>
      <li>Fix the type, result, zone or receiver if the live tracking got it wrong.</li>
      <li>Tap <b>Next</b> when the next clip starts. The play is marked reviewed and the video second is saved as the start of the next play. On the last play the button becomes <b>New play</b> and creates the next one, like the Track tab: after a TD it is the conversion (1 or 2 pts, or <b>No conversion</b>), otherwise a pass you can switch to run or sack. So a whole game can be tracked from the tape.</li></ol>
      <ul><li><b>Down and distance</b>: with the yards the app knows where the ball is (▼ own half, ▲ opponent half) and shows, for example, <b>2nd & 12 · ▼13</b>. Drives start on the ▼5 and crossing midfield is a 1st down (then it is <b>Goal</b>). After an INT, or when yards are missing, set the spot in <b>Ball → Fix</b>. In Analysis you can filter by distance (0-5, 5-10, 10-15, 15+).</li>
      <li>QB and formation come filled in from the previous play (dashed). Only tap if they change.</li>
      <li>Picking a play in the list, or with ‹ ›, jumps the video to it. <b>Mark now</b> fixes the start, and tapping the start time jumps back to that point in the video.</li>
      <li><b>⚑ Foul</b> records a foul on this play: pick the team and the foul, and the app applies the yards from the right spot, the effect on the down and the new ball spot.</li>
      <li><b>Insert play before</b> adds a play missed live. Down and score are recalculated.</li>
      <li><b>Video in another window</b> opens the video in a separate window, to put on another screen. The buttons and keys still control it.</li>
      <li>On a computer: <b>← →</b> change play, <b>space</b> play/pause, <b>Enter</b> is Next.</li></ul>
      <p>Yards, YAC, QBs, play names, flags and PBUs show in <b>Analysis</b>.</p>`},
    {id:'team',t:'Two people, one game',b:`<ol>
      <li>One person creates the game. It shows up right away in ${btn('',t('game'))} → <b>Games</b> for the whole team.</li>
      <li>The other person opens the same link and picks that game from the list.</li>
      <li>Each person picks the team they follow: <b>Hammers</b> or <b>Opponent</b>.</li>
      <li>When your team is on offense, you track as usual. When the other team is on offense, your screen waits and shows the other person's plays live.</li></ol>
      <p>Down, possession and score are the same on both devices. If the other person's battery dies, tap <b>I will track this drive</b>. To change team, use ${btn('',t('game'))} at the top.</p>`},
    {id:'data',t:'Where the data lives',b:`<p>Games are saved online and show on any device, including for tape review after the tournament. Only emails on the <b>Members</b> list can sign in. Admins manage the list in ${btn('',t('game'))} → <b>Members</b>.</p>
      <p>To sign in you use your email and password. An admin creates the account in ${btn('',t('game'))} → <b>Members</b> → <b>Create account</b>, with a temporary password you then replace in ${btn('',t('game'))} → <b>Set password</b>.</p>
      <p>Without network the app keeps working: it saves plays and sends them when the network is back. <b>Sending</b> shows at the top while plays are waiting to be sent.</p>
      <p>Change the language in ${btn('',t('game'))} → <b>Language</b>. Your data stays the same.</p>`}
  ];
  return {quick,S,title:pt?'Guia':'Guide',quickT:pt?'Guia rápido':'Quick start',full:pt?'Guia completo':'Full guide'};
}
const qh=()=>'';

/* ---------- device, role ---------- */
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const DEV=(()=>{let d=lsGet('hgo.device');if(!d){d=uid()+uid();lsSet('hgo.device',d)}return d})();
const getRole=gid=>lsGet('hgo.role.'+gid);
const setRole=(gid,r)=>lsSet('hgo.role.'+gid,r);

/* ---------- helpers ---------- */
const strip=e=>{const o={};for(const k in e)if(k[0]!=='_')o[k]=e[k];return o};
const clone=o=>JSON.parse(JSON.stringify(o));
const sortEv=a=>a.sort((x,y)=>(x.ts||0)-(y.ts||0)||(x.id<y.id?-1:x.id>y.id?1:0));
function merge(base,patch){const o={...base};for(const k in patch){const v=patch[k];
  o[k]=(v&&typeof v==='object'&&!Array.isArray(v)&&o[k]&&typeof o[k]==='object'&&!Array.isArray(o[k]))?merge(o[k],v):v}return o}
function newMeta(o){
  const x=!!o.scout;
  return {team:o.team,comp:o.comp,opp:o.opp||t('opponent'),date:new Date().toISOString().slice(0,10),start:o.start||'H',mode:'both',
    ...(x?{scout:true,home:o.home,quick:!!o.quick}:{}),
    roster:{H:o.rosterH||(x?[]:[2,5,8,11,17,23,31,77]),A:o.rosterA||[]},
    formations:{H:o.formH||(x?[]:['Double','Trips','Bunch']),A:o.formA||[]},curForm:{H:null,A:null},created:Date.now(),by:DEV};
}

/* ---------- store: this device only (localStorage) and demo (memory) ---------- */
function makeMem(read,write){
  return {
    list(){return read()},
    put(gid,ev){const l=read(),G=l.find(x=>x.id===gid);if(!G)return;const b=strip(ev),i=G.events.findIndex(x=>x.id===b.id);
      if(i<0)G.events.push(b);else G.events[i]=b;write(l);refresh()},
    del(gid,id){const l=read(),G=l.find(x=>x.id===gid);if(!G)return;G.events=G.events.filter(x=>x.id!==id);write(l);refresh()},
    updGame(gid,patch){const l=read(),i=l.findIndex(x=>x.id===gid);if(i<0)return;l[i]=merge(l[i],patch);write(l);refresh()},
    create(meta){const id=Date.now().toString(36)+uid();const l=read();l.unshift({id,...meta,events:[]});write(l);return id},
    remove(gid){write(read().filter(x=>x.id!==gid));refresh()}
  };
}
const local=makeMem(()=>{try{return JSON.parse(localStorage.getItem(LS)||'[]')||[]}catch(e){return []}},l=>lsSet(LS,JSON.stringify(l)));
let demoList=null;
const demo=makeMem(()=>{if(!demoList)demoList=[makeSample()];return demoList},l=>{demoList=l});

/* ---------- store: shared with the team (artifact db) ---------- */
const cloud={db:null,ready:false,canWrite:true,remoteGames:{},remoteTeams:{},remoteEv:{},subGid:null,unsubEv:null,recent:[],
  outbox:(()=>{try{return JSON.parse(localStorage.getItem('hgo.outbox')||'[]')||[]}catch(e){return []}})()};
const saveOutbox=()=>lsSet('hgo.outbox',JSON.stringify(cloud.outbox));
function queue(op){cloud.outbox.push(op);saveOutbox();refresh();flush()}
const evPath=(gid,id)=>`games/${gid}/events/${id}`;
const cloudStore={
  list(){return cloudGames()},
  put(gid,ev){queue({k:'set',path:evPath(gid,ev.id),body:strip(ev)})},
  del(gid,id){queue({k:'del',path:evPath(gid,id)})},
  updGame(gid,patch){queue({k:'upd',path:'games/'+gid,patch})},
  create(meta){const id=Date.now().toString(36)+uid();queue({k:'set',path:'games/'+id,body:meta});return id},
  remove(gid){const G=games.find(x=>x.id===gid);(G&&G.id===g.id?g.events:[]).forEach(e=>cloud.outbox.push({k:'del',path:evPath(gid,e.id)}));
    queue({k:'del',path:'games/'+gid})}
};
function overlayOps(){const now=Date.now();cloud.recent=cloud.recent.filter(r=>now-r.at<6000);return [...cloud.recent.map(r=>r.op),...cloud.outbox]}
function cloudGames(){
  const m={};for(const id in cloud.remoteGames)m[id]=cloud.remoteGames[id];
  for(const op of overlayOps()){const p=op.path.split('/');if(p.length!==2||p[0]!=='games')continue;const id=p[1];
    if(op.k==='set')m[id]=op.body;else if(op.k==='upd'&&m[id])m[id]=merge(m[id],op.patch);else if(op.k==='del')delete m[id]}
  return Object.entries(m).map(([id,b])=>({id,...clone(b)})).sort((a,b)=>(b.created||0)-(a.created||0));
}
/* events of other games, read once for the opponent report (the open game has a live subscription instead) */
const scoutEv={};
function cloudEvents(gid){
  const m={}, src=cloud.subGid===gid?cloud.remoteEv:(scoutEv[gid]&&scoutEv[gid].m)||{};for(const id in src)m[id]=src[id];
  const pre=`games/${gid}/events/`;
  for(const op of overlayOps()){if(!op.path.startsWith(pre))continue;const id=op.path.slice(pre.length);
    if(op.k==='set')m[id]=op.body;else if(op.k==='del')delete m[id]}
  return Object.entries(m).map(([id,b])=>({...clone(b),id}));
}
function subscribeEvents(gid){
  if(cloud.subGid===gid)return;
  if(cloud.unsubEv){cloud.unsubEv();cloud.unsubEv=null}
  cloud.subGid=gid;cloud.remoteEv={};
  if(!cloud.db||!gid)return;
  try{cloud.unsubEv=cloud.db.collection(`games/${gid}/events`).orderBy('ts').limit(1000).onSnapshot(s=>{
    const m={};s.docs.forEach(d=>{m[d.id]=d.data()});cloud.remoteEv=m;refresh()},()=>{})}catch(e){}
}
let flushing=false;
async function flush(){
  if(flushing||!cloud.db)return;flushing=true;let retry=false;
  try{
    while(cloud.outbox.length){
      const op=cloud.outbox[0],ref=cloud.db.doc(op.path);
      try{ if(op.k==='set')await ref.set(op.body);else if(op.k==='upd')await ref.update(op.patch);else await ref.delete() }
      catch(e){const c=e&&e.code;
        if(c==='permission-denied'||c==='invalid-argument'||c==='not-found'||c==='resource-exhausted'){
          cloud.outbox.shift();saveOutbox();toast(t(c==='resource-exhausted'?'quota':'noWrite'));continue}
        retry=true;break}
      cloud.outbox.shift();cloud.recent.push({op,at:Date.now()});saveOutbox();
    }
  }finally{flushing=false;refresh();if(retry)setTimeout(flush,5000)}
}
addEventListener('online',()=>flush());


/* ---------- team sheets (opponent library and our own teams): name, color, player names, other spellings, game plan ----------
   teams/{id} in Firestore, shared with the team; in the preview (no Firebase) they stay in this browser */
const LS_TEAMS='hgo.teams.v1';
const tid=key=>String(key).replace(/[\/.#$\[\]]/g,'_');
function teamsAll(){
  if(!cloud.db){try{return JSON.parse(localStorage.getItem(LS_TEAMS)||'{}')||{}}catch(e){return {}}}
  const m={};for(const id in cloud.remoteTeams)m[id]=cloud.remoteTeams[id];
  for(const op of overlayOps()){const p=op.path.split('/');if(p.length!==2||p[0]!=='teams')continue;
    if(op.k==='upd')m[p[1]]=merge(m[p[1]]||{},op.patch);else if(op.k==='del')delete m[p[1]]}
  return m;
}
const teamDoc=key=>teamsAll()[tid(key)]||null;
function saveTeam(key,patch){
  patch={...patch,key,updated:Date.now()};
  if(cloud.db){queue({k:'upd',path:'teams/'+tid(key),patch});return}
  const m=teamsAll();m[tid(key)]=merge(m[tid(key)]||{},patch);lsSet(LS_TEAMS,JSON.stringify(m));refresh();
}
/* other spellings saved on a sheet point to that team */
function aliasOf(base){
  const all=teamsAll();for(const id in all){const d=all[id];if(d&&d.key&&d.key!==base&&(d.aliases||[]).some(a=>d.key.split('|').slice(0,2).join('|')+'|'+a===base))return d.key}
  return base;
}
const pName=(key,n)=>{const d=key&&teamDoc(key);return d&&d.players&&n!=null?d.players[n]||'':''};
const numTxt=(key,n)=>n==null?t('noNum'):'#'+n+(pName(key,n)?' '+esc(pName(key,n)):'');
const teamColor=key=>{const d=key&&teamDoc(key);return d&&d.color||null};
/* ---------- current game ---------- */
let games=[], g=null, curId=lsGet(LS_CUR), draft=null, runMode=false, qbNext=false, override=null;
let view='home', undoStack=[], sheet=null, toastT=null, confirmDel=null, rendering=false;
const an={side:'H',down:0,rec:null,form:null,kind:'pass',mode:'rings',annul:false,area:'field',half:0,dist:0};
const storeOf=G=>G.store==='cloud'?cloudStore:G.store==='demo'?demo:local;
const S=()=>storeOf(g);

function refresh(){
  const list=[];
  if(cloud.db)cloudGames().forEach(m=>list.push({...m,store:'cloud'}));
  local.list().forEach(G=>list.push({...G,store:'local'}));
  demo.list().forEach(G=>list.push({...G,store:'demo',sample:true}));
  games=list;
  let cur=games.find(x=>x.id===curId);
  if(!cur){cur=(cloud.ready||!curId)?games[0]:games.find(x=>x.store==='demo');if(cloud.ready||!curId)curId=cur.id}
  let ev;
  if(cur.store==='cloud'){subscribeEvents(cur.id);ev=cloudEvents(cur.id)}else{subscribeEvents(null);ev=clone(cur.events||[])}
  g={...clone({...cur,events:[]}),events:sortEv(ev)};
  g.roster=g.roster||{H:[],A:[]};g.roster.H=g.roster.H||[];g.roster.A=g.roster.A||[];
  g.formations=g.formations||{H:[],A:[]};g.formations.H=g.formations.H||[];g.formations.A=g.formations.A||[];
  g.curForm=g.curForm||{H:null,A:null};
  if(!rendering&&authed){if(cloud.db&&!cloud.ready)return splashView();render()}
}
function role(){if(!g||g.store==='demo')return 'both';const r=getRole(g.id);if(r)return r;return g.mode&&g.mode!=='both'?g.mode:'both'}
const readOnly=()=>g.store==='cloud'&&!cloud.canWrite;
function selectGame(id){
  curId=id;lsSet(LS_CUR,id);undoStack=[];draft=null;runMode=false;qbNext=false;override=null;an.rec=null;an.form=null;
  tp.id=null;tp.gl=null;tp.del=null;tp.only=null;tp.seekId=null;vid.files={};vid.slot=0;vid.seek=null;vid.resume=null;
  refresh();
  if(g.store!=='demo'&&!getRole(g.id)&&!readOnly())openSheet('role');
}

const FIELD=50, MID=25, SPOT0=5;
/* fouls from the IFAF flag football rules (summary of penalties): who can commit it (O offense, D defense, B both), when, yards,
   effect on the down for an offense / defense foul, and the spot: los = line of scrimmage (the play does not count), bs = basic spot
   (a defense foul on a play that gained is added to the end of the play), sf = spot of foul (the play counts up to the foul), next = after the play */
const FOULS=[
  ['fs','O','pre',5,'rep',null,'los'],['dg','O','pre',5,'rep',null,'los'],['sh','O','pre',5,'rep',null,'los'],['os','D','pre',5,null,'rep','los'],['ip','B','pre',5,'rep','rep','los'],
  ['pi','B','play',10,'loss','fd','bs'],['ic','B','play',10,'loss','fd','bs'],['ir','D','play',5,null,'rep','los'],['fl','D','play',5,null,'rep','bs'],['sd','B','play',5,'rep','rep','bs'],
  ['fg','O','play',5,'loss',null,'sf'],['jd','O','play',5,'loss',null,'sf'],['fp','O','play',5,'loss',null,'sf'],['rn','O','play',5,'loss',null,'los'],['dp','O','play',0,'loss',null,'los'],
  ['us','B','dead',10,'rep','rep','next']
].map(([k,who,when,yds,effO,effD,spot])=>({k,who,when,yds,effO,effD,spot}));
const foulOf=k=>FOULS.find(f=>f.k===k);
const isPre=pe=>{const f=pe.foul&&foulOf(pe.foul);return !!f&&f.when==='pre'};
/* ▼n = n yards from the offense's own goal line, ▲n = n yards from the end zone it attacks */
const spotTxt=x=>x==null?'?':x<MID?'▼'+x:x===MID?t('midTag'):'▲'+(FIELD-x);
const ddTxt=e=>`${ord(e._down)} & ${e._dist==null?'?':e._goal?'Goal':e._dist}`;
/* same bands as the field zones: 0-5, 5-10, 10-15, 15+ (a band includes its upper number) */
const distB=d=>d==null?null:d<=5?1:d<=10?2:d<=15?3:4;
/* state machine: replay events to get down, possession, score, half */
function replay(G){
  G=G||g;
  const legacy=G.mode&&G.mode!=='both';
  let poss=legacy?G.mode:G.start, down=1, drive=0, half=1; const score={H:0,A:0};
  /* ball spot from the yards of the tape review: yards from the offense's own goal line (field of 50, first down at midfield, drives start on the own 5).
     Unknown (null) after an INT or a play without yards, until a play has its spot set by hand (e.spot). Crossing midfield on yards is a first down. */
  let spot=SPOT0, goal=false, crossed=null, pd=0;
  const flip=()=>{if(!legacy)poss=other(poss);down=1;drive++;spot=SPOT0;goal=false};
  for(const e of G.events){
    e._side=poss;e._down=down;e._tod=false;e._half=half;e._autoFd=false;e._drive=drive;
    if(e.t!=='pen'&&!e.annul)crossed=null;
    if(e.t==='play'){
      const los=e.spot!=null?e.spot:spot;
      e._spot=los;e._goal=goal||(los!=null&&los>=MID);e._dist=los==null?null:e._goal?FIELD-los:MID-los;pd=drive;
      if(e.annul) continue;
      const gain=e.yds!=null?e.yds:(e.res==='X'?0:null), next=los!=null&&gain!=null?Math.max(0,Math.min(FIELD,los+gain)):null;
      if(e.res==='TD'){score[poss]+=6+(e.pat||0);flip()}
      else if(e.res==='SF'){score[other(poss)]+=2;flip()}
      else if(e.res==='INT'){flip();spot=null;if(e.pick6){score[poss]+=6+(e.pat||0);flip()}}
      else if(e.fd){down=1;goal=true;spot=next}
      else if(!e._goal&&next!=null&&next>=MID){crossed={e,down:down+1};down=1;goal=true;spot=next;e._autoFd=true}
      else{down++;spot=next;if(down>4){e._tod=true;flip()}}
    }else if(e.t==='conv'){
      e._side=e.side;e._drive=pd;
      if(e.res==='G')score[e.side]+=e.pts||0;
      else if(e.res==='INT'&&e.ret)score[other(e.side)]+=e.ret;
    }else if(e.t==='pen'){
      // yards move the ball (never more than half the distance to the offending team's goal line); a ball left beyond midfield is a first down
      e._spot=spot;e._pyds=null;
      if(e.eff!=='dec'&&e.pyds&&spot!=null){let y=e.pyds;y=y<0?-Math.min(-y,spot/2):Math.min(y,(FIELD-spot)/2);y=Math.round(y*2)/2;spot=Math.max(0,Math.min(FIELD,spot+y));e._pyds=y}
      // the first down for crossing midfield only counts if the ball is still beyond it after the penalty
      if(crossed&&e.annulId!==crossed.e.id&&e.eff!=='dec'&&spot!=null&&spot<MID){goal=false;down=crossed.down;crossed.e._autoFd=false;crossed=null}
      if(e.eff==='fd')down=1;
      else if(e.eff==='loss'&&!e.cnt){down++;if(down>4){e._tod=true;flip()}}
      if(!e._tod&&e.eff!=='dec'&&!goal&&spot!=null&&spot>=MID){down=1;goal=true}
      e._after=spot;e._dd={down,goal};
    }else if(e.t==='down'){down=e.down}
    else if(e.t==='poss'){flip()}
    else if(e.t==='half'){half=2;if(!legacy)poss=other(G.start);down=1;drive++;spot=SPOT0;goal=false}
  }
  return {poss,down,score,drive,half,spot,goal};
}
const lastEv=()=>g.events[g.events.length-1]||null;
function lastPlay(){const e=lastEv();return e&&e.t==='play'?e:null}
/* a TD (or pick-6) waiting for its conversion */
function convPending(){
  const e=lastEv();if(!e||e.t!=='play'||e.annul||e.convSkip||e.pat!=null)return null;
  if(e.res==='TD')return {side:e._side,ev:e};
  if(e.res==='INT'&&e.pick6)return {side:other(e._side),ev:e};
  return null;
}

/* writes with undo */
function act(fn){const grp=[];fn(grp);if(grp.length){undoStack.push(grp);if(undoStack.length>80)undoStack.shift()}}
function addEv(ev,grp){ev.id=Date.now().toString(36)+uid();lastAdded=ev.id;ev.ts=Date.now();ev.by=DEV;S().put(g.id,ev);grp.push({k:'add',id:ev.id})}
function chEv(e,patch,grp){const before=strip(e);S().put(g.id,{...before,...patch});grp.push({k:'put',before})}
function rmEv(e,grp){grp.push({k:'put',before:strip(e)});S().del(g.id,e.id)}
function updGame(patch){S().updGame(g.id,patch)}

/* sample games against Demo FC: the demo game, and two more (other seeds, earlier dates) that only the opponent report uses */
function makeSample(seed0=7,id='demo',ago=0){
  const G={id,...newMeta({team:'Elite',comp:'LFFF1',opp:'Demo FC',rosterA:[7,13,88,4,21],formA:['Double','Double QB','Trips']}),events:[]};
  if(ago)G.date=new Date(Date.now()-ago*864e5).toISOString().slice(0,10);
  G.roster.A=[7,13,88,4,21,3,9];
  let seed=seed0;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const pick=w=>{const tt=w.reduce((a,b)=>a+b[1],0);let r=rnd()*tt;for(const [v,p] of w){if((r-=p)<=0)return v}return w[0][0]};
  const recW={H:[[11,5],[23,4],[8,3],[17,3],[5,1]],A:[[13,6],[7,4],[88,3],[4,1],[21,1]]};
  const defW={H:[[3,2],[9,1]],A:[[2,1],[31,2],[77,1]]};
  const qbW={H:[[2,5],[5,1]],A:[[4,5],[7,1]]};
  const zW={H:[['21',4],['20',3],['11',3],['22',3],['12',2],['10',2],['01',1],['02',1],['30',1],['32',1]],
            A:[['22',6],['12',5],['02',3],['21',3],['20',1],['11',2],['01',1],['32',2]]};
  const fW={H:[['Double',3],['Trips',2],['Bunch',1]],A:[['Double',3],['Double QB',2],['Trips',1]]};
  const callW=[['Smash',4],['Mesh',3],['Flood',2],['Slant',3],['Screen',2]], runW=[['Sweep',2],['Draw',1]];
  /* yards by depth band (deep, mid, short, behind the line): first downs and goal to go come from the ball spot */
  const ydsW=[[16,10],[8,7],[2,4],[-1,5]], ydsOf=z=>{const b=ydsW[+z[0]];return b[0]+Math.floor(rnd()*b[1])};
  let ts=1;const push=e=>{e.id=id[0]+id.slice(4)+'-'+ts;e.ts=ts++;G.events.push(e)};
  for(let i=0;i<46;i++){
    if(i===24)push({t:'half'});
    const st=replay(G), s=st.poss, spot=st.spot==null?{spot:8+Math.floor(rnd()*12)}:{};
    const prev=G.events[G.events.length-1];
    if(prev&&prev.t==='play'&&prev.res==='TD'&&!prev.convSkip){
      const pts=rnd()<.6?1:2,res=rnd()<.6?'G':'NG';
      push({t:'conv',side:prev._side||s,pts,zone:pick([['g11',2],['g10',1],['g12',1],['g01',1]]),rec:pick(recW[prev._side||s]),res,qb:pick(qbW[prev._side||s])});
      replay(G);continue;
    }
    const fby=rnd()<.6?{fby:pick(defW[s])}:{};
    if(rnd()<.06){push({t:'play',kind:'sack',zone:null,rec:null,res:'SACK',dby:pick(defW[s]),fd:false,form:pick(fW[s]),qb2:false,annul:false,yds:-2,...spot});continue}
    if(rnd()<.1){push({t:'play',kind:'run',zone:pick([['21',1],['20',1],['22',1]]),rec:pick(recW[s]),res:'R',fd:false,form:pick(fW[s]),qb2:false,annul:false,yds:1+Math.floor(rnd()*8),...fby,...spot,...(s==='H'?{call:pick(runW)}:{})});continue}
    const zone=pick(zW[s]);let res=rnd()<.64?'C':'X';
    if(res==='C'&&zone[0]==='0'&&rnd()<.45)res='TD';
    if(res==='X'&&rnd()<.08)res='INT';
    if(res==='C'&&st.down>=3&&rnd()<.25&&s==='H')res='TD';
    let yds=res==='C'?ydsOf(zone):null;
    const los=spot.spot!=null?spot.spot:st.spot;
    if(yds!=null&&los+yds>=FIELD){res='TD';yds=null}
    const form=pick(fW[s]);
    push({t:'play',kind:'pass',zone,rec:pick(recW[s]),res,fd:false,form,qb:pick(qbW[s]),
      qb2:form==='Double QB'||(s==='A'&&rnd()<.08),annul:false,...(yds!=null?{yds}:{}),...(res==='C'?fby:{}),...spot,
      ...(res==='INT'?{dby:pick(defW[s]),pick6:false}:{}),...(s==='H'?{call:pick(callW)}:{})});
    if(i===17){const p=G.events[G.events.length-1];p.annul=true;push({t:'pen',eff:'rep',annulId:p.id})}
    replay(G);
  }
  G.events.forEach(e=>{for(const k in e)if(k[0]==='_')delete e[k]});
  if(id==='demo'){let vt=20;G.events.forEach(e=>{if(e.t==='play'||e.t==='conv'){e.vt=vt;e.vi=0;vt+=28+Math.floor(rnd()*20)}})}
  return G;
}

/* ---------- actions ---------- */
let glOn=null;
function tapZone(z){
  if(draft&&(draft.step==='by'||draft.kind==='sack'))return;
  if(draft&&draft.zone===z){
    if(draft.kind==='conv')draft.zone=null;else{draft=null;runMode=false}
  }else if(draft){draft.zone=z}
  else{draft={kind:runMode?'run':'pass',zone:z,res:runMode?'R':'C',fd:false};runMode=false}
  render();
}
/* quick mode (games between other teams): the result saves the play, with no numbers */
function tapRes(r){if(!draft)return;draft.res=r;if(g.quick){draft.rec=null;draft.by=null;return finalize()}render()}
function startSack(){draft={kind:'sack',zone:null,res:'SACK',step:'by'};runMode=false;if(g.quick){draft.by=null;return finalize()}render()}
function finalize(){
  const st=replay(),d=draft;draft=null;runMode=false;
  let e;
  if(d.kind==='conv')e={t:'conv',side:d.side,pts:d.pts,zone:d.zone||null,rec:d.rec??null,res:d.res,...(d.res==='INT'?{dby:d.by??null}:{})};
  else if(d.kind==='sack')e={t:'play',kind:'sack',zone:null,rec:null,res:'SACK',dby:d.by??null,fd:false,form:g.curForm[st.poss]||null,qb2:qbNext,annul:false};
  else e={t:'play',kind:d.kind,zone:d.zone,rec:d.rec??null,res:d.res,fd:!!d.fd,form:g.curForm[st.poss]||null,qb2:qbNext,annul:false,
    ...(d.res==='INT'?{dby:d.by??null}:{})};
  if(e.t==='play')qbNext=false;
  act(grp=>addEv(e,grp));
  const who=x=>x!=null?'#'+x:t('noNum');
  if(e.t==='conv')toast(`${t('conv')} ${e.pts} pt · ${t('convRes')[e.res]}`);
  else if(e.res==='SACK')toast(`${t('sack')} · ${who(e.dby)}`);
  else if(e.res==='INT')toast(`INT · ${who(e.dby)}`);
  else toast(`${ord(st.down)} ${t('down')} · ${who(e.rec)} · ${t('res')[e.res]}`);
  if(e.res==='TD')celebrate('TOUCHDOWN',st.poss);
  else if(e.t==='conv'&&e.res==='G')celebrate('+'+e.pts,e.side,true);
  else if(e.res==='INT'&&e.t==='play')celebrate('INT',other(st.poss),true);
}
function tapNum(n){
  if(!draft){
    if(runMode){draft={kind:'run',zone:null,res:'R',fd:false,rec:n};return finalize()}
    toast(t('tZoneFirst'));return;
  }
  if(draft.step==='by'){draft.by=n;return finalize()}
  draft.rec=n;
  if(draft.res==='INT'){draft.step='by';render();return}
  finalize();
}
function markFD(){
  if(draft&&(draft.kind==='pass'||draft.kind==='run')){draft.fd=!draft.fd;render();return}
  const p=lastPlay();if(!p||p.annul||!['C','R'].includes(p.res)){toast(t('tFdOnly'));return}
  const on=!p.fd;act(grp=>chEv(p,{fd:on},grp));toast(on?t('tFdOn'):t('tFdOff'));
}
function toggleRun(){
  if(draft&&(draft.kind==='pass'||draft.kind==='run')&&!draft.step){draft.kind=draft.kind==='run'?'pass':'run';draft.res=draft.kind==='run'?'R':'C';render();return}
  if(draft)return;
  runMode=!runMode;render();
}
function undo(){
  if(draft){draft=null;runMode=false;render();toast(t('tCleared'));return}
  const grp=undoStack.pop();if(!grp){toast(t('tNoUndo'));return}
  [...grp].reverse().forEach(op=>{if(op.k==='add')S().del(g.id,op.id);else S().put(g.id,op.before)});
  toast(t('tUndone'));
}
/* penalties: pick the team and the foul; the app applies the yards from the right spot and the effect on the down */
function penCtx(){
  const st=replay();
  if(sheet.ctx==='tape'){
    const p=g.events.find(x=>x.id===sheet.pid)||null;
    return {p,offPlay:p?p._side:st.poss,offPre:p?p._side:st.poss};
  }
  const p=draft?null:lastPlay();
  return {p:p&&!p.annul?p:null,offPlay:p&&!p.annul?p._side:st.poss,offPre:st.poss};
}
function penDefaultAnnul(f,by,p){
  if(!p||!f||f.when!=='play')return false;
  if(f.spot==='los')return true;
  if(f.spot==='bs')return by==='O'||!((p.res==='C'||p.res==='R')&&(p.yds==null||p.yds>0));
  return false;
}
function penBuild(dec){
  const P=penCtx(), f=sheet.foul&&sheet.foul!=='other'?foulOf(sheet.foul):null, when=f?f.when:'play';
  const by=sheet.team===(when==='pre'?P.offPre:P.offPlay)?'O':'D';
  let eff,y;
  if(dec){eff='dec';y=0}else if(f){eff=by==='O'?f.effO:f.effD;y=f.yds*(by==='O'?-1:1)}else{eff=sheet.eff||'rep';y=(sheet.yds||0)*(by==='O'?-1:1)}
  const annul=!dec&&!!P.p&&!!sheet.annul&&!P.p.annul;
  const ev={t:'pen',eff,annulId:annul?P.p.id:null,foul:f?f.k:null,ob:by,team:sheet.team,pyds:y||null};
  if(!annul&&eff==='loss'&&when!=='pre'&&P.p)ev.cnt=true;
  // where the event goes: at the end (Track), or right after the play and its other fouls (tape review)
  let at=g.events.length;
  // tape review: a foul before the snap goes right before the play, any other right after it (before the next play's pre-snap fouls)
  if(sheet.ctx==='tape'&&P.p){
    if(when==='pre')at=g.events.indexOf(P.p);
    else{at=g.events.indexOf(P.p)+1;while(g.events[at]&&g.events[at].t==='pen'&&!isPre(g.events[at]))at++}
  }
  return {ev,annul,P,at};
}
function penPreview(){
  const {ev,annul,P,at}=penBuild(false), evs=g.events.map(strip);
  if(annul){const i=g.events.indexOf(P.p);evs[i]={...evs[i],annul:true}}
  const pe={...ev,id:'_pv'};evs.splice(at,0,pe);
  replay({...g,events:evs});
  return pe;
}
function applyFoul(dec){
  const {ev,annul,P,at}=penBuild(dec), f=ev.foul?foulOf(ev.foul):null;
  act(grp=>{
    if(sheet.ctx!=='tape')draft=null;
    if(annul)chEv(P.p,{annul:true},grp);
    if(sheet.ctx==='tape'&&at<g.events.length){
      const prev=annul&&g.events[at-1]===P.p?P.p:g.events[at-1], next=g.events[at];
      Object.assign(ev,{id:Date.now().toString(36)+uid(),ts:prev?(prev.ts+next.ts)/2:next.ts-1,by:DEV});
      S().put(g.id,ev);grp.push({k:'add',id:ev.id});lastAdded=ev.id;
    }else addEv(ev,grp);
  });
  const name=f?t('fouls')[f.k]:t('penalty');
  sheet=null;closeSheet();toast(`${name} · ${t('penEff')[ev.eff]}`);
}

/* ---------- render ---------- */
const isGL=z=>!!z&&z[0]==='g';
/* a scouting game goes with the team of ours that plays in its competition (so it joins the right opponent reports):
   the one we track most often in that competition, else LFFF1 Elite, LFFF2 Academy, LFFFW Girls */
/* competitions: the LFFF ones plus every other one already used in a game (typed once in New game) */
function allComps(){const l=[...COMPS];games.forEach(x=>{if(x.comp&&x.store!=='demo'&&!l.some(c=>c.toLowerCase()===String(x.comp).toLowerCase()))l.push(x.comp)});return l}
function teamForComp(c){const m={};games.forEach(x=>{if(!x.scout&&x.store!=='demo'&&x.comp===c)m[x.team]=(m[x.team]||0)+1});
  const top=Object.entries(m).sort((a,b)=>b[1]-a[1])[0];return top?top[0]:{LFFF1:'Elite',LFFF2:'Academy',LFFFW:'Girls'}[c]||'Elite'}
/* a game's title: our team (Elite, Academy, Girls) vs the opponent, or the two teams of a scouting game */
const gTitle=x=>x.scout?`${esc(x.home||'')} vs ${esc(x.opp)}`:`${esc(x.team)} vs ${esc(x.opp)}`;
const gSub=x=>x.scout?`${t('xTag')} · `:'';
function sideName(s){return s==='H'?(g.scout?esc(g.home||''):'Hammers'):esc(g.opp)}

function render(){
  document.documentElement.lang=lang==='pt'?'pt-PT':'en';
  const st=replay(), app=document.getElementById('app');
  /* tape review: the video pane stays in place (re-creating it would restart the video), only the header and the panel are redrawn */
  if(view==='tape'&&app.dataset.tape===g.id&&document.getElementById('tpanel')){
    app.querySelector('.top').outerHTML=topHTML(st);tapeUpdate();animateRender(st);if(pendingReload)setTimeout(reloadIfIdle,300);return}
  if(document.getElementById('vbox')&&!vidAway()){const tt=vTime();if(tt!=null)vid.resume=tt}
  app.dataset.tape=view==='tape'?g.id:'';
  app.classList.toggle('scoutg',!!g.scout&&view!=='home'&&view!=='scout');
  if(view==='home'){app.innerHTML=homeView(st);animateRender(st);if(pendingReload)setTimeout(reloadIfIdle,300);return}
  if(view==='scout'){const ae=document.activeElement, keep=ae&&ae.id==='sc-plan'?{v:ae.value,a:ae.selectionStart,b:ae.selectionEnd}:null;
    app.innerHTML=scoutView();if(keep){const x=document.getElementById('sc-plan');if(x){x.value=keep.v;x.focus();x.setSelectionRange(keep.a,keep.b)}}prevRender=null;if(pendingReload)setTimeout(reloadIfIdle,300);return}
  app.innerHTML=`${topHTML(st)}
  <nav class="tabs" role="tablist">
    ${['reg','tape','ana','log'].map(k=>`<button role="tab" data-act="view" data-v="${k}" aria-selected="${view===k}">${k==='tape'?t('tabsTape')+'<span class="beta">BETA</span>':t('tabs')[k]}</button>`).join('')}
  </nav>
  ${view==='reg'?regView(st):view==='tape'?tapeView():view==='ana'?anaView():logView()}`;
  if(view==='tape')mountPlayer();
  animateRender(st);
  if(pendingReload)setTimeout(reloadIfIdle,300);
}
/* down, distance and ball spot: the current situation in Track, the play on screen in the tape review */
function downChip(st){
  const c=view==='tape'?tapeCur().e:null, e=c&&c.t==='play'?c:null;
  const d=e?e._down:st.down, sp=e?e._spot:st.spot, gl=e?e._goal:st.goal, h=e?e._half:st.half;
  return `<small>${h===2?t('h2'):t('h1')}</small><b>${ord(d)} ${sp!=null?`& ${gl?'Goal':MID-sp}`:t('down')}</b>${sp!=null?`<span class="dspot">${spotTxt(sp)}</span>`:''}`;
}
const BALL='<svg class="ball" viewBox="0 0 24 14" aria-hidden="true"><ellipse cx="12" cy="7" rx="11" ry="6"/><path d="M7 7h10M9.5 5v4M12 5v4M14.5 5v4"/></svg>';
/* scoreboard: the team on offense carries the ball; tapping the other team hands it the ball (change of possession) */
function topHTML(st){
  const showPoss=g.mode==='both'&&!readOnly();
  const r=role(), roleTxt=r==='both'?t('roleB'):sideName(r);
  const pend=cloud.outbox.length;
  const sync=g.store==='demo'?`<span class="sample">${t('sample')}</span>`
    :g.store==='local'?`<span class="sync local">${t('localOnly')}</span>`
    :`<span class="sync ${pend?'pend':g.visibility==='private'?'local':'ok'}">${pend?t('sending',pend):g.visibility==='private'?'🔒 '+t('visMe'):t('visTeam')}</span>`;
  const team=s=>{const on=st.poss===s, tc=(s==='A'||g.scout)&&teamColor(scKeyOf(g,s));
    return `<button class="sb-team ${s}${on?' poss on':''}"${tc?` style="--tc:${esc(tc)}"`:''} data-act="poss" ${showPoss&&!on?'':'disabled'} aria-label="${sideName(s)}${on?', '+t('offense'):''}">
      <span class="sb-name">${on?BALL:''}<span>${sideName(s)}</span></span><span class="s num">${st.score[s]}</span></button>`};
  return `<header class="top sb">
    <div class="sb-bar">
      <button class="hlogo-btn" data-act="home" aria-label="${t('home')}"><img class="hlogo" src="icons/logo.png" alt="" width="52" height="50"></button>
      <button class="sb-game" data-act="opts" aria-label="${t('options')}"><span class="gt">${gTitle(g)} <small>${esc(g.comp)}</small></span>
        <span class="gs">${g.store!=='demo'?`${t('follows')}: <b>${roleTxt}</b> · `:''}${sync}</span></button>
      <button class="chip undo" data-act="undo" aria-label="${t('undo')}">↶<span class="sb-lt"> ${t('undo')}</span></button>
      <button class="chip opts" data-act="opts" aria-label="${t('options')}"><span class="dots" aria-hidden="true">⋮</span><span class="sb-lt">${t('options')}</span></button>
    </div>
    <div class="sb-board score">${team('H')}
      <button class="chip down num" data-act="down" aria-label="${t('fixDown')}">${downChip(st)}</button>
      ${team('A')}</div>
  </header>`;
}
/* ---------- motion ---------- */
let lastAdded=null, prevRender=null, loginAnimated=false, pendingReload=false;
const motionOK=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
function flash(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)}
function animateRender(st){
  const app=document.getElementById('app'), cur={gid:g.id,view,H:st.score.H,A:st.score.A,down:st.down,poss:st.poss,half:st.half};
  const p=prevRender;prevRender=cur;
  if(!motionOK())return;
  if(!p||p.gid!==cur.gid||p.view!==cur.view){[...app.children].slice(2).forEach(el=>flash(el,'fadein'));if(!p)flash(app.querySelector('.top'),'dropin');lastAdded=null;return}
  const sc=app.querySelectorAll('.score .s');
  if(p.H!==cur.H)flash(sc[0],'bump');
  if(p.A!==cur.A)flash(sc[1],'bump');
  if(p.down!==cur.down||p.half!==cur.half)flash(app.querySelector('.down'),'tick');
  if(p.poss!==cur.poss){flash(app.querySelector('.poss'),'swap');flash(app.querySelector('.field'),'fadein')}
  if(lastAdded){const m=app.querySelector(`[data-e="${lastAdded}"]`);if(m)flash(m,m.classList.contains('zone')?'zglow':'pop');lastAdded=null}
}
function celebrate(big,side,mini){
  if(!motionOK())return;
  const ours=side==='H'&&!g.scout, small=sideName(side);
  const el=document.createElement('div');el.className='celebrate'+(mini?' mini':'')+(ours?'':' opp');el.setAttribute('aria-hidden','true');
  let bits='';for(let i=0;i<(mini?10:22);i++){const a=Math.random()*360,d=90+Math.random()*(mini?110:220),c=(ours?['#FF3300','#C8102E','#141414','#F2C14E','#FFFFFF']:['#9AA1AA','#5F6670','#D6D9DD','#FFFFFF','#3F4650'])[i%5];
    bits+=`<i style="--a:${a}deg;--d:${d}px;--c:${c};--t:${(.55+Math.random()*.5).toFixed(2)}s"></i>`}
  el.innerHTML=`<div class="burst">${bits}</div><div class="cbox"><b>${big}</b><span>${small}</span></div>`;
  document.body.appendChild(el);if(ours)flash(document.querySelector('.hlogo'),'swing');
  setTimeout(()=>el.remove(),mini?1100:1700);
}
/* ---------- home ---------- */
function homeView(st){
  const name=personName(me)||'';
  const list=games.filter(x=>x.store!=='demo');
  const demoG=games.find(x=>x.store==='demo');
  const cur=g&&g.store!=='demo'?g:null;
  const lock=x=>x.visibility==='private'?`<span class="sync local">🔒 ${t('visMe')}</span>`:'';
  const card=x=>`<div class="gcard">
      <div class="gtxt"><b>${gTitle(x)}</b><small>${gSub(x)}${esc(x.comp)} · ${x.date}${x.owner?' · '+t('byOwner',esc(personName(x.owner))):''}</small>${lock(x)}</div>
      <div class="gbtns"><button class="btn" data-act="openg" data-id="${x.id}" data-v="reg">${t('track')}</button><button class="btn" data-act="openg" data-id="${x.id}" data-v="tape">${t('tabsTape')}<span class="beta">BETA</span></button><button class="btn" data-act="openg" data-id="${x.id}" data-v="ana">${t('viewAna')}</button></div></div>`;
  const tile=(act,icon,l,d,cls='')=>`<button class="htile ${cls}" data-act="${act}"><span class="hi" aria-hidden="true">${icon}</span><b>${l}</b><small>${d}</small></button>`;
  const recent=list.filter(x=>!cur||x.id!==cur.id).slice(0,5);
  return `<header class="top home-top">
      <button class="hlogo-btn" data-act="home" aria-label="${t('home')}"><img class="hlogo" src="icons/logo.png" alt="" width="52" height="50"></button>
      <div class="htitle"><b>Hammers Game Ops</b><small>${t('hello',esc(name))}</small></div>
      <button class="chip opts" data-act="opts" aria-label="${t('options')}"><span class="dots" aria-hidden="true">⋮</span>${t('options')}</button>
    </header>
    ${cur?`<section class="hero">
      <span class="lbl2">${t('continueG')}</span>
      <div class="hero-row"><div class="gtxt"><b>${gTitle(cur)}</b><small>${esc(cur.comp)} · ${cur.date}${cur.owner?' · '+t('byOwner',esc(personName(cur.owner))):''}</small>${lock(cur)}</div>
        <div class="hscore num"><span>${st.score.H}</span><small>:</small><span>${st.score.A}</span><em>${ord(st.down)} ${t('down')} · ${st.half===2?t('h2'):t('h1')}</em></div></div>
      <div class="gbtns big2"><button class="primary" data-act="openg" data-id="${cur.id}" data-v="reg">${t('track')}</button><button class="btn" data-act="openg" data-id="${cur.id}" data-v="tape">${t('tabsTape')}<span class="beta">BETA</span></button><button class="btn" data-act="openg" data-id="${cur.id}" data-v="ana">${t('viewAna')}</button><button class="btn" data-act="openg" data-id="${cur.id}" data-v="log">${t('tabs').log}</button></div>
    </section>`:''}
    <section class="htiles">
      ${tile('newgame','+',t('newGameT'),t('newGameS'),'accent')}
      ${tile('games','▦',t('allGamesBtn'),t('gamesS'))}
      ${tile('scout','◎',t('sc'),t('scS'))}
      ${tile('help','?',t('helpMenu'),t('helpS'))}
      ${isAdmin?tile('members','👥',t('members'),t('membersS')):''}
    </section>
    <section class="hlist">
      <span class="lbl2">${t('recent')}</span>
      ${recent.length?recent.map(card).join(''):`<p class="note">${list.length?'':t('noGames')}</p>`}
      ${demoG?`<div class="gcard demo"><div class="gtxt"><b>${gTitle(demoG)}</b><small>${t('demoS')}</small></div>
        <div class="gbtns"><button class="btn" data-act="openg" data-id="${demoG.id}" data-v="reg">${t('track')}</button><button class="btn" data-act="openg" data-id="${demoG.id}" data-v="tape">${t('tabsTape')}<span class="beta">BETA</span></button><button class="btn" data-act="openg" data-id="${demoG.id}" data-v="ana">${t('viewAna')}</button></div></div>`:''}
    </section>
    <p class="appver">Hammers Game Ops · ${t('version')} ${APP_VERSION}${PREVIEW?' · '+t('previewTag'):''}</p>`;
}
function hintText(){
  if(g.quick)return draft?t('hQuick2'):runMode?t('hRunQ'):t('hQuick');
  if(draft){
    if(draft.step==='by')return draft.kind==='sack'?t('hSack'):t('hIntBy');
    if(draft.kind==='conv')return draft.zone?`${zoneName(draft.zone)} · <b>${t('convRes')[draft.res]}</b>. ${t('hNow')}`:t('hConv',draft.pts);
    return `${zoneName(draft.zone)} · <b>${t('res')[draft.res]}</b>. ${t('hNow')}`;
  }
  if(runMode) return t('hRun');
  return t('hIdle');
}
/* the 12-zone grid: field (4 depths incl. behind the line) or goal line (end zone back/front, 0-5, 5-10) */
function gridHTML(gl,plays,live){
  const ROWS=gl?t('glRows'):t('rows'), COLS=t('cols'), Y=gl?['','','0-5','5-10']:['15+','5-15','0-5',''];
  /* each zone shows the summary of the plays of the team on offense: tint by volume, count, success %, top target and a result bar */
  let h='';const zs=[];for(let r=0;r<4;r++)for(let c=0;c<3;c++)zs.push((gl?'g':'')+r+c);
  const max=Math.max(1,...zs.map(z=>plays.filter(e=>e.zone===z).length)), tot=plays.filter(e=>e.zone).length;
  for(let r=0;r<4;r++)for(let c=0;c<3;c++){
    const z=(gl?'g':'')+r+c, here=plays.filter(e=>e.zone===z), a=here.length/max, last=here[here.length-1];
    let d='';
    if(live&&draft&&draft.zone===z){
      const cls={C:'',X:'x',TD:'td',INT:'int',R:'r',G:'',NG:'x'}[draft.res]||'';
      const txt={C:'C',X:'x',TD:'TD',INT:'INT',R:'R',G:'✓',NG:'✗'}[draft.res]||'';
      d=`<div class="draft ${cls}"><span>${txt}</span></div>`;
    }
    const ez=gl&&r<2?' ez':'', behind=!gl&&r===3?' behind':'';
    const tag=live?'button':'div';
    const tint=here.length?` style="background:rgba(255,214,10,${(a*.6).toFixed(2)});color:${a>.6?'#1a1205':'#fff'}"`:'';
    h+=`<${tag} class="zone r${r}${ez}${behind}${here.length?' has':''}" ${live?`data-act="zone" data-z="${z}"`:''}${last?` data-e="${last.id}"`:''}${tint} aria-label="${ROWS[r]} ${COLS[c]}: ${here.length}">
      <span class="zl">${ROWS[r]} ${COLS[c]}</span>${c===2&&Y[r]?`<span class="zy">${Y[r]}</span>`:''}${zoneInner(here,'sum',max,tot)}${d}</${tag}>`;
  }
  return h;
}
function bannerHTML(r){
  const lp=lastEv(), cp=convPending(), mine=s=>r==='both'||r===s;
  if(lp&&lp.t==='play'&&lp.res==='INT'&&lp.pick6==null&&!lp.annul&&mine(lp._side))
    return `<div class="banner">${t('pick6Q')}<button data-act="pick6" data-v="1">${t('pick6Yes')}</button><button data-act="pick6" data-v="0">${t('pick6No')}</button></div>`;
  if(cp&&!(draft&&draft.kind==='conv')&&mine(cp.side))
    return `<div class="banner">${t('conv')} ${sideName(cp.side)}:<button data-act="convpts" data-p="1">1 pt</button><button data-act="convpts" data-p="2">2 pts</button><button data-act="convskip">${t('convSkip')}</button></div>`;
  if(lp&&lp.t==='conv'&&lp.res==='INT'&&lp.ret==null&&mine(lp.side))
    return `<div class="banner">${t('convIntQ')}<button data-act="convret" data-p="0">${t('pick6No')}</button><button data-act="convret" data-p="${lp.pts}">${t('retYes',lp.pts)}</button></div>`;
  return '';
}
/* live scouting: while the opponent has the ball, what it did on this down in the earlier games against it, and what is different today */
function liveScoutHTML(st,s){
  const key=scKeyOf(g,s);if(key.startsWith('H|'))return '';
  const team=scoutTeams().find(x=>x.key===key);if(!team)return '';
  const others=team.games.filter(G=>G.id!==g.id);others.forEach(scoutFetch);
  const ready=others.filter(scoutReady), plays=(x,sd)=>x.filter(e=>e.t==='play'&&e._side===sd&&!e.annul&&e.kind!=='sack'&&e.kind!=='safety'&&e.kind!=='snap');
  const H=ready.map(scoutGame).flatMap(x=>plays(x.events,team.sideIn[x.id]));if(H.length<8)return '';
  const hd=H.filter(e=>e._down===st.down), hp=hd.filter(e=>e.kind==='pass'), z=scTop(hp.filter(e=>e.zone),e=>e.zone), r=scTop(hp,e=>e.rec);
  let line=hd.length?t('lsDown',ord(st.down),pct(hp.length,hd.length),z?zoneName(z[0]):'',r?r[0]:''):t('lsNoDown',ord(st.down));
  const hg=H.filter(e=>isGL(e.zone)), gz=scTop(hg,e=>e.zone);
  if(st.goal&&gz&&hg.length>=3)line+=' · '+t('lsGl',zoneName(gz[0]));
  // what is different today (only once there are enough plays to compare)
  const T=plays(g.events,s), al=[];
  if(T.length>=6){
    const rr=l=>l.filter(e=>e.kind==='run').length/l.length, rh=rr(H), rt=rr(T);
    if(Math.abs(rt-rh)>=.2)al.push(t('alRun',pct(Math.round(rt*100),100),pct(Math.round(rh*100),100)));
    const tp=T.filter(e=>e.kind==='pass'), hpa=H.filter(e=>e.kind==='pass'), tr=scTop(tp,e=>e.rec);
    if(tr&&tr[1]>=3&&tp.length){const sh=tr[1]/tp.length, hh=hpa.filter(e=>String(e.rec)===tr[0]).length/Math.max(1,hpa.length);if(sh-hh>=.2)al.push(t('alRec',tr[0],pct(tr[1],tp.length),pct(Math.round(hh*100),100)))}
    const tf=tp.filter(e=>e.zone&&!isGL(e.zone)), hf=hpa.filter(e=>e.zone&&!isGL(e.zone));
    if(tf.length>=5&&hf.length)for(const i of [0,1,2]){const a=tf.filter(e=>colOf(e.zone)===i).length/tf.length, b=hf.filter(e=>colOf(e.zone)===i).length/hf.length;
      if(a-b>=.25){al.push(t('alSide',i,pct(Math.round(a*100),100),pct(Math.round(b*100),100)));break}}
    const hforms=new Set(H.map(e=>e.form).filter(Boolean)), fm={};T.forEach(e=>{if(e.form&&!hforms.has(e.form))fm[e.form]=(fm[e.form]||0)+1});
    Object.entries(fm).filter(([,n])=>n>=3).forEach(([f])=>al.push(t('alForm',esc(f))));
  }
  return `<button class="scoutbar" data-act="scout" data-key="${esc(key)}"><span class="lbl2">${t('lsT',ready.length)}</span><b>${line}</b>${al.map(a=>`<span class="alert">⚠ ${a}</span>`).join('')}</button>`;
}
/* the game plan for this opponent, folded, above the field */
function planBox(){const d=teamDoc(scKeyOf(g,'A'));if(!d||!d.plan)return '';
  return `<details class="planbox"><summary>${t('planT')} · ${esc(d.name||g.opp)}</summary><p>${esc(d.plan).replace(/\n/g,'<br>')}</p></details>`}
/* the play being tracked, as slots: zone, result and number (the active one is outlined) */
function slotsHTML(s){
  const d=draft, slot=(lbl,val,on,cls='')=>`<div class="slot${on?' on':''}${val?' set':''} ${cls}"><small>${lbl}</small><b>${val||'—'}</b></div>`;
  const RES={C:t('tagC'),X:t('tagX'),R:t('tagR'),TD:'TD',INT:'INT',G:t('convRes').G,NG:t('convRes').NG};
  if(d&&d.kind==='sack')return `<div class="slots">${slot(t('sack'),t('sack'),false,'r-SACK')}${slot(t('whoSack'),null,true)}</div>`;
  const by=d&&d.step==='by', numL=d&&d.kind==='run'||runMode?t('tRunner'):t('receiver');
  return `<div class="slots">${slot(t('tZone'),d&&d.zone?zoneName(d.zone):null,!d)}
    ${slot(d&&d.kind==='conv'?t('conv')+' '+d.pts+' pt':t('result'),d&&d.res?RES[d.res]:runMode?t('tagR'):null,false,d&&d.res?'r-'+d.res:'')}
    ${g.quick?'':slot(numL,by?(d.rec!=null?'#'+d.rec:t('noNumShort')):null,!!d&&!by)+(d&&d.res==='INT'&&d.kind!=='conv'?slot(t('whoInt'),null,by):'')}</div>`;
}
/* one line per play for the drive card */
function evLine(e){
  const R={C:t('tagC'),X:t('tagX'),R:t('tagR'),TD:'TD',INT:'INT',SACK:t('sack'),SF:t('safety'),BS:t('badSnap')};
  if(e.t==='pen')return {cls:'pen',h:e.foul?t('fouls')[e.foul]:t('penalty'),s:(e.team?sideName(e.team)+' · ':'')+(e.foul?t('penEff')[e.eff==='rep'&&e.cnt?'loss':e.eff]:t('penShort')[e.eff]||'')};
  if(e.t==='conv')return {cls:e.res==='G'?'C':'X',h:`${t('conv')} ${e.pts} pt · ${t('convRes')[e.res]||e.res}`,s:[e.rec!=null?'#'+e.rec:'',e.zone?zoneName(e.zone):''].filter(Boolean).join(' · '),tag:e.res==='G'?'+'+e.pts:''};
  const h=e.kind==='sack'?t('sack')+(e.dby!=null?' · #'+e.dby:''):`${e.kind==='run'&&e.res!=='TD'?t('tagR'):R[e.res]}${e.zone?' · '+zoneName(e.zone):''}`;
  if(e.res==='SF'||e.res==='BS')return {cls:e.res==='SF'?'SACK':'X',h,s:e._dist!=null?ddTxt(e):ord(e._down)+' '+t('down'),tag:e.res==='SF'?'+2 '+sideName(other(e._side)):'',annul:e.annul};
  const dd=e._dist!=null?ddTxt(e):ord(e._down)+' '+t('down');
  const tags=[e.yds!=null?(e.yds>0?'+':'')+e.yds+' '+t('yardsShort'):'',e.fd||e._autoFd?t('fdLow'):'',e.pick6?'pick-6':'',e._tod?t('tod'):'',e.annul?t('annulTag'):''].filter(Boolean);
  return {cls:e.res,h,s:[dd,e.kind!=='sack'&&e.rec!=null?'#'+e.rec:'',e.form?esc(e.form):''].filter(Boolean).join(' · '),tag:tags.join(' · '),annul:e.annul};
}
/* the drive on the field, newest play first, with undo next to the last thing tracked; earlier drives in one line each */
function driveHTML(st){
  const evs=g.events.filter(e=>e.t==='play'||e.t==='pen'||e.t==='conv'), cur=evs.filter(e=>e._drive===st.drive);
  const plays=cur.filter(e=>e.t==='play'&&!e.annul), yds=plays.filter(e=>e.yds!=null);
  const last=lastEv(), show=cur.length?cur:last&&(last.t==='play'||last.t==='pen'||last.t==='conv')?[last]:[];
  const lines=show.slice().reverse().slice(0,6).map(e=>{const L=evLine(e), u=last&&e.id===last.id;
    return `<li class="dl r-${L.cls||''}${L.annul?' annul':''}"><div><b>${L.h}</b><small>${L.s}</small></div>${L.tag?`<span class="dtag">${L.tag}</span>`:''}${u?`<button class="dundo" data-act="undo">↶<small>${t('undo')}</small></button>`:''}</li>`}).join('');
  const prev=[...new Set(evs.filter(e=>e._drive<st.drive).map(e=>e._drive))].slice(-3).reverse().map(n=>{
    const l=evs.filter(e=>e._drive===n), p=l.filter(e=>e.t==='play'&&!e.annul), end=p[p.length-1], s=p.length?p[0]._side:l[0]._side;
    const out=!end?'':end.res==='TD'?'TD':end.res==='INT'?(end.pick6?'Pick-6':'INT'):end._tod?t('tod'):'';
    return `<li class="dprev side-${s}"><span>${sideName(s)}</span><small>${t('scPlaysN',p.length)}</small>${out?`<span class="dtag ${out==='TD'||out==='Pick-6'?'TD':''}">${out}</span>`:''}</li>`}).join('');
  return `<section class="drive side-${st.poss}"><div class="dhead"><span class="dball">${BALL}</span><div><b>${sideName(st.poss)}</b>
      <small>${t('driveN',st.drive+1)} · ${plays.length?t('scPlaysN',plays.length):t('noPlaysYet')}${yds.length?` · ${(()=>{const y=yds.reduce((a,e)=>a+e.yds,0);return (y>0?'+':'')+y})()} ${t('yardsShort')}`:''}</small></div></div>
    ${lines?`${cur.length?'':`<span class="lbl2">${t('lastPlay1')}</span>`}<ol class="dlist">${lines}</ol>`:''}${prev?`<ol class="dprevs">${prev}</ol>`:''}</section>`;
}
function regView(st){
  const r=role(), conv=draft&&draft.kind==='conv';
  const s=conv?draft.side:st.poss;
  const gl=conv||glOn===st.drive;
  const cl=t('colsLong');
  const def=!conv&&(readOnly()||(r!=='both'&&r!==s&&override!==st.drive));
  const plays=conv?g.events.filter(e=>e.t==='conv'&&e.side===s):g.events.filter(e=>e.t==='play'&&!e.annul&&e._side===s);
  const banner=bannerHTML(r);
  if(def){
    const recent=g.events.filter(e=>e.t==='play'&&e._side===s).slice(-4).reverse();
    const resTxt=e=>({C:t('tagC'),X:t('tagX'),R:t('tagR'),TD:'TD',INT:'INT',SACK:t('sack')}[e.res]);
    const card=readOnly()?`<div class="defcard"><h3>${t('roTitle')}</h3><p>${t('readOnly')}</p></div>`
      :`<div class="defcard"><span class="lbl2">${t('offense')}</span><h3>${sideName(s)}</h3>
        <p>${t('defBody',sideName(r),sideName(s))}</p>
        ${recent.length?`<span class="lbl2">${t('lastPlays')}</span><div class="mini">${recent.map(e=>`<div><b class="num">${ord(e._down)}</b><span>${e.rec!=null?'#'+e.rec:e.dby!=null?'#'+e.dby:''}</span><span>${e.zone?zoneName(e.zone):''}</span><span class="tag ${e.res}">${resTxt(e)}</span></div>`).join('')}</div>`:''}
        <button class="btn" data-act="defover">${t('defOverride')}</button>
        <button class="btn" data-act="opts">${t('changeRole')}</button></div>`;
    return `<div class="reg side-${s}">
      <section class="fieldwrap">
        ${liveScoutHTML(st,s)}${planBox()}
        <div class="hint">${readOnly()?t('roTitle'):t('defHint',sideName(s))} ${qh('team')}</div>
        ${banner}
        <div class="field watch">${gridHTML(gl,plays,false)}</div>
        <div class="cols"><span>${cl[0]}</span><span>${cl[1]}</span><span>${cl[2]}</span></div>
      </section>
      <section class="controls">${card}${driveHTML(st)}</section></div>`;
  }
  const byStep=draft&&draft.step==='by';
  const ns=byStep?other(s):s;
  const cnt={};g.events.forEach(e=>{if(e.t==='play'&&e._side===s&&e.rec!=null)cnt[e.rec]=(cnt[e.rec]||0)+1});
  const roster=[...g.roster[ns]].sort((a,b)=>byStep?a-b:((cnt[b]||0)-(cnt[a]||0)||a-b));
  const ready=!!draft;
  const lastRec=byStep?null:(()=>{for(let i=g.events.length-1;i>=0;i--){const e=g.events[i];if(e.t==='play'&&e._side===s&&e.rec!=null&&!e.annul)return e.rec}return null})();
  const nkey=scKeyOf(g,ns);
  const nums=roster.map(n=>`<button class="n num ${ready?'ready':''}${n===lastRec?' last':''}" data-act="num" data-n="${n}">#${n}${pName(nkey,n)?`<span class="nm">${esc(pName(nkey,n))}</span>`:''}${!byStep&&cnt[n]?`<small>${cnt[n]} ${t('targets')}</small>`:''}${n===lastRec?`<i class="lastdot" title="${t('lastRec')}"></i>`:''}</button>`).join('')
    +`<button class="n none" data-act="nonum" ${ready?'':'disabled'} aria-label="${t('saveNoNum')}">?<small>${t('noNumShort')}</small></button>`
    +`<button class="n add" data-act="addnum" aria-label="${t('newNum')}">+</button>`;
  const numLbl=byStep?(draft.kind==='sack'?t('whoSack'):t('whoInt')):t('receiver');
  const numSub=byStep?`${sideName(ns)}, ${t('defense')}`:`${sideName(s)}, ${t('mostUsed')}`;
  let resRow='';
  if(draft&&!byStep&&draft.kind!=='sack'){
    const opts=draft.kind==='conv'?[['G',t('convRes').G],['NG',t('convRes').NG],['INT','INT']]
      :draft.kind==='run'?[['R',t('tagR')],['TD','TD']]
      :[['C',t('tagC')],['X',t('tagX')],['TD','TD'],['INT','INT']];
    resRow=`<div class="block"><div class="lbl"><span style="font:inherit;letter-spacing:inherit;text-transform:inherit">${t('result')}${qh('track')}</span><span>${g.quick?t('resSubQ'):t('resSub')}</span></div>
      <div class="resrow">${opts.map(([v,l])=>`<button class="rb rb-${v}" data-act="res" data-r="${v}" aria-pressed="${draft.res===v}">${l}</button>`).join('')}</div></div>`;
  }
  const forms=g.formations[s].map(f=>`<button class="f" data-act="form" data-f="${esc(f)}" aria-pressed="${g.curForm[s]===f}">${esc(f)}</button>`).join('')
    +`<button class="f" data-act="addform">${t('newForm')}</button>`
    +`<button class="f qb" data-act="qb" aria-pressed="${qbNext}">2 QB</button>`;
  return `<div class="reg side-${s}">
    <section class="fieldwrap">
      ${conv?'':liveScoutHTML(st,s)}${planBox()}
      ${slotsHTML(s)}
      <div class="hint">${hintText()} ${qh('track')}</div>
      ${banner}
      <div class="mapbar"><div class="seg">
        <button data-act="glset" data-v="0" aria-pressed="${!gl}" ${conv?'disabled':''}>${t('mapField')}</button>
        <button data-act="glset" data-v="1" aria-pressed="${gl}" ${conv?'disabled':''}>GL</button></div>
        ${conv?`<span class="convtag">${t('conv')} ${draft.pts} pt · ${sideName(s)} <button class="linkbtn" data-act="convcancel">${t('cancel')}</button></span>`:''}
        ${qh(gl?'gl':'zones')}</div>
      <div class="field${gl?' glmap':''}">${gridHTML(gl,plays,true)}</div>
      <div class="cols"><span>${cl[0]}</span><span>${cl[1]}</span><span>${cl[2]}</span></div>
      <div class="los"><span>${t('offenseArrow')}</span><span>${gl?t('glNote'):t('losNote')}</span><span></span></div>
    </section>
    <section class="controls">
      ${resRow}
      ${g.quick?`<p class="note quicknote">⚡ ${t('quickNote')}</p>`:`<div class="block"><div class="lbl"><span style="font:inherit;letter-spacing:inherit;text-transform:inherit">${numLbl}${qh('track')}</span><span>${numSub}</span></div><div class="nums">${nums}</div></div>`}
      ${byStep||conv?'':`<div class="block"><div class="lbl"><span style="font:inherit;letter-spacing:inherit;text-transform:inherit">${t('formation')}${qh('buttons')}</span><span>${t('formSticky')}</span></div><div class="forms">${forms}</div></div>`}
      <div class="actions">
        <button class="a" data-act="fd" aria-pressed="${draft?!!draft.fd:false}">${t('fd')}</button>
        <button class="a pen" data-act="pen">${t('penalty')}</button>
        <button class="a run" data-act="run" aria-pressed="${runMode||(draft&&draft.kind==='run')}">${t('run')}</button>
        <button class="a sack" data-act="sack" aria-pressed="${!!(draft&&draft.kind==='sack')}">${t('sack')}</button>
        <button class="a other" data-act="other">${t('otherBtn')}</button>
      </div>
      ${driveHTML(st)}
    </section>
  </div>`;
}

/* analysis */
const isComp=e=>e.res==='C'||e.res==='TD'||e.res==='G';
const isPassLike=e=>e.t==='conv'||e.kind==='pass';
const pct=(a,b)=>b?Math.round(a/b*100)+'%':'-';
function inArea(e){
  if(an.area==='conv')return e.t==='conv';
  if(e.t!=='play')return false;
  if(e.kind==='sack')return an.area==='field';
  return an.area==='gl'?isGL(e.zone):!isGL(e.zone);
}
function anaBase(){
  return g.events.filter(e=>inArea(e)&&e._side===an.side&&(an.annul||!e.annul)&&(!an.half||e._half===an.half)&&(!an.form||e.form===an.form));
}
function anaPlays(ignoreRec){
  return anaBase().filter(e=>(e.t==='conv'||an.kind==='all'||(an.kind==='run'?e.kind==='run':e.kind==='pass'))
    &&(e.t==='conv'||!an.down||e._down===an.down)&&(e.t==='conv'||!an.dist||distB(e._dist)===an.dist)&&(ignoreRec||an.rec==null||e.rec===an.rec));
}
function anaView(){
  replay();
  const conv=an.area==='conv', gl=an.area!=='field';
  const ROWS=gl?t('glRows'):t('rows'), COLS=t('cols');
  const P=anaPlays(false), all=anaPlays(true), base=anaBase();
  const passes=P.filter(isPassLike), runs=P.filter(e=>e.kind==='run');
  const comp=passes.filter(isComp).length, TL=t('tiles');
  const tiles=conv?[[passes.length,t('convTries')],[pct(comp,passes.length),t('convGood')],[passes.filter(e=>e.res==='INT').length,'INT'],
      [passes.filter(e=>e.res==='G'&&e.pts===1).length+'/'+passes.filter(e=>e.pts===1).length,'1 pt'],[passes.filter(e=>e.res==='G'&&e.pts===2).length+'/'+passes.filter(e=>e.pts===2).length,'2 pts']]
    :[[passes.length,TL[0]],[pct(comp,passes.length),TL[1]],[P.filter(e=>e.res==='TD').length,TL[2]],
      [passes.filter(e=>e.res==='INT').length,TL[3]],[runs.length,TL[4]],[base.filter(e=>e.kind==='sack').length,t('sacks')],[P.filter(e=>e.fd||e._autoFd).length,TL[5]],[P.filter(e=>e.qb2).length,TL[6]]];
  // yards come from the tape review
  const Y=P.filter(e=>e.t==='play'&&e.yds!=null), hasY=!conv&&Y.length>0, sum=(l,k)=>l.reduce((a,e)=>a+(e[k]||0),0), avg=l=>l.length?(sum(l,'yds')/l.length).toFixed(1):'-';
  if(hasY){const TY=t('tilesY');tiles.push([sum(Y,'yds'),TY[0]],[avg(Y),TY[1]],[Y.filter(e=>e.yds>=15).length,TY[2]])}
  zoneSrc={};
  const by={};all.filter(e=>e.kind!=='sack').forEach(e=>{const k=e.rec==null?'?':e.rec;(by[k]=by[k]||[]).push(e)});
  const rows=Object.entries(by).map(([k,l])=>{const p=l.filter(isPassLike);return{k,t:p.length,c:p.filter(isComp).length,td:l.filter(e=>e.res==='TD').length,int:p.filter(e=>e.res==='INT').length,r:l.filter(e=>e.kind==='run').length,
      y:sum(l.filter(e=>e.res!=='INT'),'yds'),yac:sum(l,'yac'),hy:l.some(e=>e.yds!=null)}})
    .sort((a,b)=>b.t-a.t||b.r-a.r);
  const tbody=rows.map(r=>`<tr data-act="anrec" data-r="${r.k}" aria-selected="${String(an.rec)===r.k}"><td class="jn">${r.k==='?'?t('noNum'):'#'+r.k}</td><td>${r.t}</td><td>${r.c}</td><td>${pct(r.c,r.t)}</td>${hasY?`<td>${r.hy?r.y:'-'}</td><td>${r.hy?r.yac:'-'}</td>`:''}<td>${r.td}</td><td>${r.int}</td><td>${r.r}</td></tr>`).join('');
  const thP2=hasY?[...t('thP').slice(0,4),lang==='pt'?'Jd':'Yds','YAC',...t('thP').slice(4)]:t('thP');
  // by QB and by play name (tape review fields)
  const qbs={};all.filter(e=>e.qb!=null&&isPassLike(e)).forEach(e=>{(qbs[e.qb]=qbs[e.qb]||[]).push(e)});
  const qrows=Object.entries(qbs).map(([k,l])=>{const c=l.filter(isComp);return `<tr><td class="jn">#${k}</td><td>${l.length}</td><td>${c.length}</td><td>${pct(c.length,l.length)}</td>
      <td>${sum(l.filter(e=>e.res!=='INT'),'yds')}</td><td>${c.filter(e=>e.yds!=null).reduce((a,e)=>a+e.yds-(e.yac||0),0)}</td><td>${l.filter(e=>e.res==='TD').length}</td><td>${l.filter(e=>e.res==='INT').length}</td></tr>`}).join('');
  const calls={};all.filter(e=>e.call).forEach(e=>{(calls[e.call]=calls[e.call]||[]).push(e)});
  const crows=Object.entries(calls).sort((a,b)=>b[1].length-a[1].length).map(([k,l])=>{const p=l.filter(isPassLike),y=l.filter(e=>e.yds!=null);
      return `<tr><td>${esc(k)}</td><td>${l.length}</td><td>${pct(p.filter(isComp).length,p.length)}</td><td>${sum(y,'yds')}</td><td>${avg(y)}</td><td>${l.filter(e=>e.res==='TD').length}</td></tr>`}).join('');
  const top=(arr,f)=>{const m={};arr.forEach(e=>{const k=f(e);if(k!=null)m[k]=(m[k]||0)+1});const s=Object.entries(m).sort((a,b)=>b[1]-a[1])[0];return s||null};
  const dn=conv?'':[1,2,3,4].map(d=>{
    const l=base.filter(e=>e._down===d&&(an.rec==null||e.rec===an.rec));
    const p=l.filter(e=>e.kind==='pass');
    const tz=top(p,e=>e.zone), tr=top(p,e=>e.rec), tf=top(l,e=>e.form);
    return `<tr data-act="andown" data-d="${d}" aria-selected="${an.down===d}"><td class="jn">${ord(d)}</td><td>${p.length}</td><td>${pct(p.filter(isComp).length,p.length)}</td><td>${tz?zoneName(tz[0])+' ('+tz[1]+')':'-'}</td><td>${tr?'#'+tr[0]+' ('+tr[1]+')':'-'}</td><td>${tf?esc(tf[0]):'-'}</td><td>${l.filter(e=>e.kind==='run').length}</td>${hasY?`<td>${avg(l.filter(e=>e.yds!=null))}</td>`:''}</tr>`;
  }).join('');
  // defensive plays made against this offense: interceptions and sacks by number
  // flags and PBU from the tape review
  const dv={}, dk=k=>dv[k]=dv[k]||{i:0,s:0,p6:0,f:0,b:0};
  g.events.filter(e=>(e.t==='play'||e.t==='conv')&&e._side===an.side&&!e.annul&&(!an.half||e._half===an.half)).forEach(e=>{
    if(e.res==='INT'||e.res==='SACK'){const v=dk(e.dby==null?'?':e.dby);if(e.res==='SACK')v.s++;else{v.i++;if(e.pick6)v.p6++}}
    if(e.fby!=null)dk(e.fby).f++;
    if(e.pbu!=null)dk(e.pbu).b++;
  });
  const hasDT=Object.values(dv).some(v=>v.f||v.b);
  const drows=Object.entries(dv).sort((a,b)=>(b[1].i+b[1].s+b[1].f+b[1].b)-(a[1].i+a[1].s+a[1].f+a[1].b)).map(([k,v])=>`<tr><td class="jn">${k==='?'?t('noNum'):'#'+k}</td>${hasDT?`<td>${v.f}</td><td>${v.b}</td>`:''}<td>${v.i}</td><td>${v.p6}</td><td>${v.s}</td></tr>`).join('');
  const forms=[...new Set(g.events.filter(e=>e.t==='play'&&e._side===an.side&&e.form).map(e=>e.form))];
  const seg=(key,opts,cls='')=>`<div class="seg ${cls}">${opts.map(([v,l,c])=>`<button class="${c||''}" data-act="an" data-k="${key}" data-v="${v}" aria-pressed="${String(an[key])===String(v)}">${l}</button>`).join('')}</div>`;
  const D=t('downs'), thP=t('thP'), thD=t('thD');
  return `<div class="filters">
      ${seg('side',[['H',sideName('H'),'H'],['A',sideName('A'),'A']],'side')}
      ${seg('area',[['field',t('mapField')],['gl','GL'],['conv',t('convs')]])}
      ${conv?'':seg('kind',[['pass',t('passes')],['run',t('runs')],['all',t('all')]])}
      ${conv?'':seg('down',[[0,t('allM')],[1,D[0]],[2,D[1]],[3,D[2]],[4,D[3]]])}
      ${!conv&&base.some(e=>e._dist!=null&&(e.yds!=null||e.spot!=null))?seg('dist',[[0,t('distAll')],[1,'0-5'],[2,'5-10'],[3,'10-15'],[4,'15+']]):''}
      ${seg('half',[[0,t('game_')],[1,t('h1')],[2,t('h2')]])}
      ${forms.length&&!conv?seg('form',[['',t('allF')],...forms.map(f=>[esc(f),esc(f)])]):''}
      <label class="check" style="padding:6px 10px"><input type="checkbox" id="an-annul" data-act="anannul" ${an.annul?'checked':''}>${t('inclAnnul')}</label>
      <button class="btn" data-act="scout" data-key="${esc(scKeyOf(g,an.side))}">◎ ${t('scBtn')}</button>
      ${qh('analysis')}
    </div>
    <div class="tiles">${tiles.map(([v,l])=>`<div class="tile"><b class="num">${v}</b><span>${l}</span></div>`).join('')}</div>
    ${(()=>{const ev=x=>g.events.filter(e=>(e.t==='play'||e.t==='conv')&&e._side===x&&!e.annul&&(!an.half||e._half===an.half));
      return `<section class="panel"><h3>${t('sumT')} · ${sideName(an.side)}</h3>${sumHTML(ev(an.side),ev(other(an.side)),1,an.side==='H',drivesOf(g.events,an.side).filter(d=>!an.half||d.half===an.half),scKeyOf(g,an.side))}</section>`})()}
    <div class="ana"><div class="sc-tables">
      <section class="panel">
        <div class="toolbar"><h3>${t('distribution')}${an.rec!=null?' · #'+an.rec:''}</h3>${zoneModes('an',an.mode)}</div>
        ${zoneMap(P,gl,an.mode,'an')}
        ${zoneLegend(an.mode)}${P.some(e=>e.vt!=null)?`<button class="btn" data-act="zdet" data-z="an|all">▶ ${t('vFilt',P.filter(e=>e.vt!=null).length)}</button>`:''}
        ${an.rec!=null?`<button class="btn" data-act="anrec" data-r="${an.rec}">${t('showAll')}</button>`:''}
      </section>
      ${conv?'':chartsHTML(P,base,all)}</div>
      <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
        ${conv?'':drivePanel(drivesOf(g.events,an.side).filter(d=>!an.half||d.half===an.half))}
        <section class="panel"><h3>${t('byPlayer')}</h3>
          <div class="tablewrap"><table><thead><tr>${thP2.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${tbody||`<tr><td colspan="9">${t('noMatch')}</td></tr>`}</tbody></table></div>
          <p class="note">${t('tapPlayer')}</p>
        </section>
        ${qrows?`<section class="panel"><h3>${t('byQb')}</h3>
          <div class="tablewrap"><table><thead><tr>${t('thQb').map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${qrows}</tbody></table></div></section>`:''}
        ${crows?`<section class="panel"><h3>${t('byCall')}</h3>
          <div class="tablewrap"><table class="nosel"><thead><tr>${t('thCall').map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${crows}</tbody></table></div></section>`:''}
        ${conv?'':`<section class="panel"><h3>${t('byDown')}</h3>
          <div class="tablewrap"><table><thead><tr>${[...thD,...(hasY?[t('jdPlay')]:[])].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${dn}</tbody></table></div>
        </section>`}
        <section class="panel"><h3>${hasDT?t('defTable2',sideName(other(an.side))):t('defTable',sideName(other(an.side)))}</h3>
          <div class="tablewrap"><table><thead><tr>${(hasDT?t('thDef2'):t('thDef')).map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${drows||`<tr><td colspan="6">${t('noMatch')}</td></tr>`}</tbody></table></div>
        </section>
      </div>
    </div>`;
}
/* ---------- the 12 zones, three ways: rings (count and completion), summary (heat, count, bar, top target) and dots (one per play, with its down) ----------
   Zones in the analysis and the report open the list of their plays (zoneSrc keeps them for the sheet). */
let zoneSrc={};
const okPlay=e=>isComp(e)||e.res==='R';
const dotCls=e=>({C:'c',G:'c',R:'r',TD:'td',X:'x',NG:'x',INT:'int',SACK:'x'})[e.res]||'x';
function zoneInner(h,mode,max,tot){
  if(!h.length)return '';
  const n=h.length, ok=h.filter(okPlay).length, td=h.filter(e=>e.res==='TD').length, bad=n-ok;
  if(mode==='dots'){const l=h.slice(-12);return `<span class="zdots">${l.map(e=>`<i class="zdot ${dotCls(e)}">${e.t==='conv'?e.pts:e._down||''}</i>`).join('')}${n>12?`<i class="zmore">+${n-12}</i>`:''}</span>`}
  if(mode==='sum'){const r=scTop(h.filter(isPassLike),e=>e.rec);
    return `<span class="zsum"><b class="num">${n}</b><small>${pct(ok,n)}${r?' · #'+r[0]:''}</small><span class="cbar"><i class="c" style="flex:${ok-td}"></i><i class="td" style="flex:${td}"></i><i class="x" style="flex:${bad}"></i></span></span>`}
  const sz=30+n/max*38;
  return `<span class="zring" style="--p:${Math.round(ok/n*100)};--s:${sz.toFixed(0)}px"><span class="num">${n}</span></span><small class="zshare">${pct(n,tot)}</small>`;
}
function zoneMap(P,gl,mode,id){
  if(P.length)zoneSrc[id+'|all']=P;
  const ROWS=gl?t('glRows'):t('rows'), COLS=t('cols'), zl=[];for(let r=0;r<4;r++)for(let c=0;c<3;c++)zl.push((gl?'g':'')+r+c);
  const max=Math.max(1,...zl.map(z=>P.filter(e=>e.zone===z).length)), tot=P.filter(e=>e.zone).length;
  return `<div class="amap zm-${mode}${gl?' glmap':''}">${zl.map(z=>{const r=+z[gl?1:0], c=+z[gl?2:1], h=P.filter(e=>e.zone===z), a=h.length/max;
    if(h.length)zoneSrc[id+'|'+z]=h;
    const tint=mode==='sum'&&h.length?` style="background:rgba(255,214,10,${(a*.75).toFixed(2)});color:${a>.55?'#1a1205':'#fff'}"`:'';
    return `<button class="az r${r}${gl&&r<2?' ez':''}${!gl&&r===3?' behind':''}${mode==='sum'?' heat':''}" data-act="zdet" data-z="${id}|${z}"${h.length?'':' disabled'}${tint} aria-label="${ROWS[r]} ${COLS[c]}: ${h.length}">
      <span class="zl">${ROWS[r]} ${COLS[c]}</span>${zoneInner(h,mode,max,tot)}</button>`}).join('')}</div>`;
}
const zoneModes=(key,cur)=>`<div class="seg">${[['rings',t('zmRings')],['sum',t('zmSum')],['dots',t('zmDots')]].map(([v,l])=>`<button data-act="${key}" data-k="mode" data-v="${v}" aria-pressed="${cur===v}">${l}</button>`).join('')}</div>`;
const zoneLegend=mode=>mode==='dots'?`<div class="zleg"><i class="zdot c">1</i>${t('tagC')}<i class="zdot x">1</i>${t('tagX')}<i class="zdot td">1</i>TD<i class="zdot int">1</i>INT<i class="zdot r">1</i>${t('tagR')}<span>· ${t('zmDotsN')}</span></div>`
  :mode==='sum'?`<p class="note">${t('zmSumN')}</p>`:`<p class="note">${t('zmRingsN')}</p>`;
/* ---------- written summary and charts, shared by the game analysis and the opponent report ----------
   The summary is plain rules over the counts (no AI): the same data always gives the same text. */
const colOf=z=>z==null?null:+z[isGL(z)?2:1];
function sumHTML(off,def,nG,us,D,key){
  const nn=n=>n+(pName(key,n)?' '+esc(pName(key,n)):'');
  const pl=off.filter(e=>e.t==='play'), pas=pl.filter(e=>e.kind==='pass'), runs=pl.filter(e=>e.kind==='run'), n=pas.length+runs.length;
  if(n<5)return `<p class="note">${t('sumFew')}</p>`;
  const L=[], fp=pas.filter(e=>e.zone&&!isGL(e.zone));
  L.push(t('sumGames',nG)+t('sumPass',pct(pas.length,n),pas.length,runs.length,pct(pas.filter(isComp).length,pas.length)));
  if(fp.length>=4){
    const c=[0,1,2].map(i=>fp.filter(e=>colOf(e.zone)===i).length), m=c.indexOf(Math.max(...c));
    const sh=fp.filter(e=>e.zone[0]>='2').length, dp=fp.filter(e=>e.zone[0]==='0').length;
    L.push((c[m]/fp.length>=.45?t('sumDir',m,pct(c[m],fp.length)):t('sumDirEven',...c.map(x=>pct(x,fp.length))))+t('sumDepth',pct(sh,fp.length),pct(dp,fp.length)));
  }
  const rc={};pas.forEach(e=>{if(e.rec!=null)(rc[e.rec]=rc[e.rec]||[]).push(e)});
  const rr=Object.entries(rc).sort((a,b)=>b[1].length-a[1].length);
  if(rr.length&&rr[0][1].length>=2){let x=t('sumRec',nn(rr[0][0]),pct(rr[0][1].length,pas.length),pct(rr[0][1].filter(isComp).length,rr[0][1].length));
    if(rr[1]&&rr[1][1].length>=2)x+=t('sumRec2',nn(rr[1][0]),pct(rr[1][1].length,pas.length),pct(rr[1][1].filter(isComp).length,rr[1][1].length));L.push(x)}
  const late=pl.filter(e=>e._down>=3&&e.kind!=='sack'), lp=late.filter(e=>e.kind==='pass');
  if(late.length>=4){const z=scTop(lp.filter(e=>e.zone),e=>e.zone), r=scTop(lp,e=>e.rec), main=rr[0]&&rr[0][0];
    L.push(t('sumLate',pct(lp.length,late.length),z?zoneName(z[0]):'',r?nn(r[0]):'',r&&main&&r[0]!==main?nn(main):''))}
  const fm={};pl.filter(e=>e.form&&e.kind!=='sack').forEach(e=>{(fm[e.form]=fm[e.form]||[]).push(e)});
  const fr=Object.entries(fm).sort((a,b)=>b[1].length-a[1].length);
  if(fr.length){const [f,l]=fr[0], allR=runs.length/n;let x=t('sumForm',esc(f),pct(l.length,pl.length),pct(l.filter(e=>e.kind==='pass').length,l.length));
    const rf=fr.find(([,l2])=>l2.length>=5&&l2.filter(e=>e.kind==='run').length/l2.length>=Math.max(.3,allR*2));
    if(rf)x+=t('sumFormRun',esc(rf[0]),pct(rf[1].filter(e=>e.kind==='run').length,rf[1].length));L.push(x)}
  const gp=pl.filter(e=>isGL(e.zone)), gz=scTop(gp,e=>e.zone);
  if(gz&&gp.length>=3)L.push(t('sumGl',zoneName(gz[0]),pct(gz[1],gp.length)));
  const cv=off.filter(e=>e.t==='conv');
  if(cv.length>=2){const one=cv.filter(e=>e.pts===1), two=cv.filter(e=>e.pts===2), gd=l=>l.filter(e=>e.res==='G').length;
    L.push(t('sumConv',[[1,one],[2,two]].filter(([,l])=>l.length).map(([p,l])=>[p,l.length,gd(l)])))}
  if(D&&D.length>=3){const lost=D.filter(d=>['INT','P6','DN','SF'].includes(d.res)).length;
    L.push(t('sumDrv',D.length,(D.reduce((a,d)=>a+d.pts,0)/D.length).toFixed(1),pct(D.filter(d=>d.res==='TD').length,D.length),pct(lost,D.length)))}
  const Y=pl.filter(e=>e.yds!=null);
  if(Y.length>=5&&Y.some(e=>e.yds>=15))L.push(t('sumBig',Y.filter(e=>e.yds>=15).length,pct(Y.filter(e=>e.yds>=15).length,Y.length)));
  const dp=def.filter(e=>e.t==='play'&&e.kind==='pass');
  if(dp.length>=5){let x=t('sumDef',us,pct(dp.filter(isComp).length,dp.length));
    const zs=Object.entries(dp.filter(e=>e.zone&&!isGL(e.zone)).reduce((m,e)=>{(m[e.zone]=m[e.zone]||[]).push(e);return m},{})).filter(([,l])=>l.length>=3)
      .map(([z,l])=>({z,n:l.length,c:l.filter(isComp).length})).sort((a,b)=>b.c/b.n-a.c/a.n||b.n-a.n);
    if(zs.length>=2){const b=zs[0],w=zs[zs.length-1];x+=t('sumDefBest',zoneName(b.z),b.c,b.n);if(w.c/w.n<b.c/b.n)x+=t('sumDefWorst',zoneName(w.z),w.c,w.n)}
    const dv={};def.forEach(e=>{const k=(o,f)=>{if(o!=null){const v=dv[o]=dv[o]||{f:0,s:0,i:0,b:0};v[f]++}};
      if(e.res==='SACK')k(e.dby,'s');if(e.res==='INT')k(e.dby,'i');k(e.fby,'f');k(e.pbu,'b')});
    const top=Object.entries(dv).sort((a,b)=>(b[1].f+2*b[1].s+3*b[1].i+b[1].b)-(a[1].f+2*a[1].s+3*a[1].i+a[1].b))[0];
    if(top){const v=top[1];x+=t('sumDefPl',nn(top[0]),[v.f?v.f+(v.f>1?' flags':' flag'):'',v.s?v.s+(v.s>1?' sacks':' sack'):'',v.i?v.i+' INT':'',v.b?v.b+' PBU':''].filter(Boolean).join(', '))}
    L.push(x)}
  return `<ul class="sum">${L.map(x=>`<li>${x}</li>`).join('')}</ul><p class="note">${t('sumNote')}</p>`;
}
/* drives of one side in one game (events already replayed): plays, how it ended, points and yards */
function drivesOf(events,side){
  const m={};events.forEach(e=>{if((e.t==='play'||e.t==='conv')&&!e.annul&&e._drive!=null)(m[e._drive]=m[e._drive]||[]).push(e)});
  return Object.values(m).map(l=>{const p=l.filter(e=>e.t==='play');if(!p.length||p[0]._side!==side)return null;
    const end=p[p.length-1], cv=l.filter(e=>e.t==='conv'&&e.side===side&&e.res==='G').reduce((a,e)=>a+(e.pts||0),0);
    const res=end.res==='TD'?'TD':end.res==='INT'?(end.pick6?'P6':'INT'):end.res==='SF'?'SF':end._tod?'DN':'END', y=p.filter(e=>e.yds!=null);
    return {n:p.length,res,pts:res==='TD'?6+cv:0,yds:y.length?y.reduce((a,e)=>a+e.yds,0):null,first:p[0],half:p[0]._half}}).filter(Boolean);
}
function drivePanel(D,title){
  if(!D.length)return '';
  const n=D.length, pts=D.reduce((a,d)=>a+d.pts,0), lost=D.filter(d=>['INT','P6','DN','SF'].includes(d.res)).length, E=t('drvEnd');
  const fp=D.map(d=>d.first).filter(e=>e.kind==='pass'||e.kind==='run'), fpp=fp.filter(e=>e.kind==='pass'), fz=scTop(fpp.filter(e=>e.zone),e=>e.zone);
  const tl=[[n,t('drvN')],[(pts/n).toFixed(1),t('drvPts')],[pct(D.filter(d=>d.res==='TD').length,n),t('drvTd')],[pct(lost,n),t('drvLost')],[(D.reduce((a,d)=>a+d.n,0)/n).toFixed(1),t('drvPl')]];
  return `<section class="panel"><h3>${title||t('drvT')}</h3>
    <div class="tiles">${tl.map(([v,l])=>`<div class="tile"><b class="num">${v}</b><span>${l}</span></div>`).join('')}</div>
    <div class="charts">${stackBar(t('drvOut'),['TD','INT','P6','DN','SF','END'].map(k=>({l:E[k],v:D.filter(d=>d.res===k).length,c:'ch-o'+k})))}</div>
    ${fp.length?`<p class="note">${t('drvFirst',pct(fpp.length,fp.length),fz?zoneName(fz[0]):'')}</p>`:''}</section>`;
}
/* a 100% bar split in parts, with its legend */
function stackBar(title,parts){
  const tot=parts.reduce((a,p)=>a+p.v,0);if(!tot)return '';
  return `<div class="chart"><span class="lbl2">${title}</span><div class="ch-bar">${parts.map(p=>p.v?`<i class="${p.c}" style="flex:${p.v}"><span>${pct(p.v,tot)}</span></i>`:'').join('')}</div>
    <div class="ch-leg">${parts.map(p=>`<span><i class="${p.c}"></i>${p.l} <b>${p.v}</b></span>`).join('')}</div></div>`;
}
/* the charts block: pass direction and depth from the plays on the map, pass / run / sack by down, targets with completions */
function chartsHTML(P,downL,recL){
  const fp=P.filter(e=>e.kind==='pass'&&e.zone&&!isGL(e.zone)), CL=t('colsLong'), R=t('rows');
  let h=stackBar(t('chDir'),[0,1,2].map(i=>({l:CL[i],v:fp.filter(e=>colOf(e.zone)===i).length,c:'ch-q'+i})));
  h+=stackBar(t('chDepth'),[3,2,1,0].map(r=>({l:R[r],v:fp.filter(e=>+e.zone[0]===r).length,c:'ch-d'+r})));
  const rows=[1,2,3,4].map(d=>{const x=downL.filter(e=>e.t==='play'&&e._down===d);return {d,p:x.filter(e=>e.kind==='pass'),r:x.filter(e=>e.kind==='run').length,s:x.filter(e=>e.kind==='sack').length}});
  const mx=Math.max(1,...rows.map(r=>r.p.length+r.r+r.s));
  if(rows.some(r=>r.p.length+r.r+r.s))h+=`<div class="chart"><span class="lbl2">${t('chDown')}</span>${rows.map(r=>{const n=r.p.length+r.r+r.s;
    return `<div class="ch-row"><span class="ch-l">${ord(r.d)}</span><div class="ch-track"><div class="ch-stack" style="width:${n/mx*100}%">${r.p.length?`<i class="ch-p" style="flex:${r.p.length}"></i>`:''}${r.r?`<i class="ch-r" style="flex:${r.r}"></i>`:''}${r.s?`<i class="ch-s" style="flex:${r.s}"></i>`:''}</div></div>
      <span class="ch-v">${n?`${n} · ${pct(r.p.filter(isComp).length,r.p.length)}`:'-'}</span></div>`}).join('')}
    <div class="ch-leg"><span><i class="ch-p"></i>${t('passes')}</span><span><i class="ch-r"></i>${t('runs')}</span><span><i class="ch-s"></i>${t('sacks')}</span><span>· % ${t('comp')}</span></div></div>`;
  const rm={};recL.filter(isPassLike).forEach(e=>{if(e.rec!=null)(rm[e.rec]=rm[e.rec]||[]).push(e)});
  const rr=Object.entries(rm).sort((a,b)=>b[1].length-a[1].length).slice(0,8), rmax=Math.max(1,...rr.map(x=>x[1].length));
  if(rr.length)h+=`<div class="chart"><span class="lbl2">${t('chRec')}</span>${rr.map(([k,l])=>{const c=l.filter(isComp).length;
    return `<div class="ch-row"><span class="ch-l">#${k}</span><div class="ch-track"><div class="ch-t" style="width:${l.length/rmax*100}%"><i style="width:${c/l.length*100}%"></i></div></div><span class="ch-v">${c}/${l.length}</span></div>`}).join('')}</div>`;
  return h?`<section class="panel"><h3>${t('chQuick')}</h3><div class="charts">${h}</div></section>`:'';
}
/* ---------- opponent report: one team's tendencies across every game tracked against it (or our own, to self-scout) ---------- */
const sc={mode:'rings',key:null,off:{},area:'field',kind:'pass',down:0,dist:0,pos:0,form:null,rec:null,call:null};
const scReset=()=>Object.assign(sc,{area:'field',kind:'pass',down:0,dist:0,pos:0,form:null,rec:null,call:null});
let scFresh={}, demoX=null;
const normOpp=x=>String(x||'').trim().toLowerCase();
/* the sample opponent gets two more sample games, so the report has games to add up in the demo and the preview */
function scoutGames(){
  const l=games.filter(x=>x.store!=='demo'), d=games.find(x=>x.store==='demo');
  if(d){if(!demoX)demoX=[makeSample(11,'demo2',14),makeSample(23,'demo3',28)].map(G=>({...G,store:'demo',sample:true,extra:true}));l.push(d,...demoX)}
  return l;
}
/* a team is the opponent's name inside one of our teams (Elite, Academy, Girls), or the Hammers team itself */
/* in a game between two other teams (x.scout), side H is x.home and side A is x.opp, and both are scouted teams */
const scKeyOf=(x,s)=>s==='H'&&!x.scout?'H|'+(x.store==='demo'?'demo':x.team):aliasOf('A|'+x.team+'|'+normOpp(s==='H'?x.home:x.opp));
function scoutTeams(){
  const m={};
  scoutGames().forEach(x=>['A','H'].forEach(s=>{const k=scKeyOf(x,s), us=k.startsWith('H|');
    const e=m[k]=m[k]||{key:k,side:us?'H':'A',name:us?'Hammers':(teamDoc(k)&&teamDoc(k).name)||(s==='H'?x.home:x.opp),team:x.team,demo:x.store==='demo',games:[],sideIn:{}};
    e.games.push(x);e.sideIn[x.id]=s}));
  return Object.values(m).sort((a,b)=>(a.side==='H')-(b.side==='H')||b.games.length-a.games.length||String(a.name).localeCompare(String(b.name)));
}
/* shared games other than the open one are read once per visit to the report */
function scoutFetch(G){
  if(G.store!=='cloud'||!cloud.db||G.id===cloud.subGid||scFresh[G.id])return;
  scFresh[G.id]=true;const c=scoutEv[G.id];scoutEv[G.id]={...(c||{}),loading:true};
  cloud.db.collection(`games/${G.id}/events`).orderBy('ts').limit(1000).get()
    .then(r=>{const m={};r.docs.forEach(d=>{m[d.id]=d.data()});scoutEv[G.id]={m}})
    .catch(()=>{scoutEv[G.id]={m:(c&&c.m)||null,err:true}})
    .then(()=>{if(view==='scout'||view==='reg')render()});
}
const scoutReady=G=>G.store!=='cloud'||G.id===cloud.subGid||!!(scoutEv[G.id]&&scoutEv[G.id].m);
function scoutGame(G){const X={...G,events:sortEv(G.store==='cloud'?cloudEvents(G.id):clone(G.events||[]))};X.st=replay(X);
  const lbl=(G.date||'')+' · vs '+(G.opp||'');X.events.forEach(e=>{e._g=lbl;e._gid=G.id});return X}
const scTop=(arr,f)=>{const m={};arr.forEach(e=>{const k=f(e);if(k!=null)m[k]=(m[k]||0)+1});return Object.entries(m).sort((a,b)=>b[1]-a[1])[0]||null};
/* field position: 1 = own half, 2 = beyond midfield (goal to go), 0 = unknown */
const posOf=e=>e._goal?2:e._spot!=null?1:0;
function scoutView(){
  zoneSrc={};
  const T=scoutTeams();
  if(!T.find(x=>x.key===sc.key)){const k=g&&scKeyOf(g,'A');sc.key=((T.find(x=>x.key===k)||T[0])||{}).key||null}
  const team=T.find(x=>x.key===sc.key);
  const head=`<header class="top home-top">
      <button class="hlogo-btn" data-act="home" aria-label="${t('home')}"><img class="hlogo" src="icons/logo.png" alt="" width="52" height="50"></button>
      <div class="htitle"><b>${t('sc')}</b><small>${t('scS')}</small></div>
      <button class="chip opts noprint" data-act="scprint">${t('scPrint')}</button>
    </header>`;
  if(!team)return head+`<p class="note">${t('scNone')}</p>`;
  const S=team.side, O=other(S), us=S==='H', name=us?'Hammers':esc(team.name);
  const list=team.games.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||(b.created||0)-(a.created||0));
  list.forEach(scoutFetch);
  const R={};list.forEach(G=>{if(scoutReady(G))R[G.id]=scoutGame(G)});
  for(const id in R){R[id].S=team.sideIn[id];R[id].O=other(R[id].S)}
  const X=list.filter(G=>!sc.off[G.id]&&R[G.id]).map(G=>R[G.id]), waiting=list.filter(G=>!sc.off[G.id]&&!R[G.id]&&!(scoutEv[G.id]&&scoutEv[G.id].err)).length;
  const tag=x=>x.side==='H'?esc(x.team):[...new Set(x.games.map(G=>G.comp))].map(esc).join(' / ');
  const opts=T.map(x=>`<option value="${esc(x.key)}" ${x.key===sc.key?'selected':''}>${x.side==='H'?t('scUs'):esc(x.name)} · ${tag(x)}${x.demo?' ('+t('sample')+')':''} · ${t('scGamesN',x.games.length)}</option>`).join('');
  // record and points, from the scouted team's side
  const nG=X.length, W=X.filter(x=>x.st.score[x.S]>x.st.score[x.O]).length, Lo=X.filter(x=>x.st.score[x.S]<x.st.score[x.O]).length;
  const avgPts=k=>nG?(X.reduce((a,x)=>a+x.st.score[x[k]],0)/nG).toFixed(1):'-', WDL=t('scWDL'), vsUs=!us&&X.length&&X.every(x=>!x.scout);
  const doc=teamDoc(team.key)||{}, col=doc.color;
  const hero=`<section class="hero sc-hero side-${S}"${col?` style="--tc:${esc(col)}"`:''}><span class="lbl2">${tag(team)}${team.demo?' · '+t('sample'):''} · ${t('scGamesN',nG)}</span>
      <div class="sc-name"><div class="gtxt"><b>${name}</b></div><button class="btn noprint" data-act="teamedit" data-key="${esc(team.key)}">✎ ${t('tmEdit')}</button></div>
      <div class="sc-stats">
        <div><b class="num">${W}${WDL[0]} ${nG-W-Lo}${WDL[1]} ${Lo}${WDL[2]}</b><small>${t('scRecord')}${vsUs?' '+t('scRecVs'):''}</small></div>
        <div><b class="num">${avgPts('S')}</b><small>${t('scPtsFor')}</small></div>
        <div><b class="num">${avgPts('O')}</b><small>${t('scPtsAg')}</small></div>
      </div></section>`;
  const pickRow=`<div class="sc-pick noprint"><label class="lbl2" for="sc-team">${t('scTeam')}</label><select id="sc-team">${opts}</select></div>`;
  const evs=k=>X.flatMap(x=>x.events.filter(e=>(e.t==='play'||e.t==='conv')&&e._side===x[k]&&!e.annul));
  const off=evs('S'), def=evs('O'), DO=X.flatMap(x=>drivesOf(x.events,x.S)), DD=X.flatMap(x=>drivesOf(x.events,x.O));
  // key tendencies: plain numbers a coach can read before the game
  const plays=off.filter(e=>e.t==='play'), pas=plays.filter(e=>e.kind==='pass'), runs=plays.filter(e=>e.kind==='run');
  const fp=pas.filter(e=>e.zone&&!isGL(e.zone)), ins=[];
  if(pas.length+runs.length)ins.push([t('scPassK'),t('scPassPct',pct(pas.length,pas.length+runs.length)),t('scPassTxt',pas.length,runs.length)]);
  const tz=scTop(fp,e=>e.zone);
  if(tz){const h=fp.filter(e=>e.zone===tz[0]);ins.push([t('scZoneK'),zoneName(tz[0]),t('scZoneTxt',pct(tz[1],fp.length),pct(h.filter(isComp).length,h.length))])}
  if(fp.length){const d=fp.filter(e=>e.zone[0]==='0').length;ins.push([t('scDeepK'),pct(d,fp.length),t('scDeepTxt',d)])}
  const trc=scTop(pas,e=>e.rec);
  if(trc){const h=pas.filter(e=>String(e.rec)===trc[0]);ins.push([t('scRecK'),'#'+trc[0],t('scRecTxt',pct(trc[1],pas.length),pct(h.filter(isComp).length,h.length),h.filter(e=>e.res==='TD').length)])}
  const late=plays.filter(e=>e._down>=3&&e.kind!=='sack'), lp=late.filter(e=>e.kind==='pass');
  if(late.length){const z=scTop(lp.filter(e=>e.zone),e=>e.zone), r=scTop(lp,e=>e.rec);
    ins.push([t('scLateK'),t('scPassPct',pct(lp.length,late.length)),[z?t('scFavZone',zoneName(z[0])):'',r?t('scFavRec',r[0]):''].filter(Boolean).join(' · ')||t('scPlaysN',late.length)])}
  const tf=scTop(plays,e=>e.form);
  if(tf){const h=plays.filter(e=>e.form===tf[0]&&e.kind!=='sack');ins.push([t('scFormK'),esc(tf[0]),t('scFormTxt',pct(tf[1],plays.length),pct(h.filter(e=>e.kind==='pass').length,h.length))])}
  const gp=plays.filter(e=>isGL(e.zone)), gz=scTop(gp,e=>e.zone);
  if(gz)ins.push([t('scGlK'),zoneName(gz[0]),t('scGlTxt',pct(gz[1],gp.length),gp.length)]);
  const cv=off.filter(e=>e.t==='conv');
  if(cv.length){const one=cv.filter(e=>e.pts===1), two=cv.filter(e=>e.pts===2), gd=l=>l.filter(e=>e.res==='G').length;
    ins.push([t('scConvK'),t('scConvBig',pct(one.length,cv.length)),t('scConvTxt',gd(one),one.length,gd(two),two.length)])}
  const dp=def.filter(e=>e.t==='play'&&e.kind==='pass');
  if(dp.length)ins.push([t('scDefK',us),t('scCompPct',pct(dp.filter(isComp).length,dp.length)),t('scDefTxt',us,def.filter(e=>e.res==='INT').length,def.filter(e=>e.res==='SACK').length)]);
  const insHTML=ins.length?`<section class="sc-sec"><h2>${t('scKey')}</h2><p class="note">${plays.length<20?t('scFew',plays.length):t('scSample',plays.length)}</p>
      <div class="sc-ins">${ins.map(([k,b,x])=>`<div class="ins side-${S}"><span class="lbl2">${k}</span><b>${b}</b><small>${x}</small></div>`).join('')}</div></section>`:'';
  // filters: the map and every table follow them, except each table ignores its own dimension so all its rows stay visible,
  // and the tables ignore pass / run so their pass % means something
  const conv=sc.area==='conv', gl=sc.area!=='field';
  const inA=e=>conv?e.t==='conv':e.t==='play'&&(e.kind==='sack'?sc.area==='field':(sc.area==='gl')===isGL(e.zone));
  const fil=(l,skip)=>l.filter(e=>inA(e)&&(e.t==='conv'||skip||sc.kind==='all'||(sc.kind==='run'?e.kind==='run':e.kind==='pass'))
    &&(e.t==='conv'||skip==='down'||!sc.down||e._down===sc.down)&&(e.t==='conv'||skip==='dist'||!sc.dist||distB(e._dist)===sc.dist)
    &&(e.t==='conv'||skip==='pos'||!sc.pos||posOf(e)===sc.pos)&&(skip==='form'||!sc.form||e.form===sc.form)&&(skip==='rec'||sc.rec==null||e.rec===sc.rec)&&(skip==='call'||!sc.call||e.call===sc.call));
  const P=fil(off), hasDist=plays.some(e=>e._dist!=null&&(e.yds!=null||e.spot!=null)), hasPos=plays.some(e=>posOf(e)===2);
  const seg=(key,o)=>`<div class="seg">${o.map(([v,l])=>`<button data-act="sc" data-k="${key}" data-v="${esc(v)}" aria-pressed="${String(sc[key]==null?'':sc[key])===String(v)}">${l}</button>`).join('')}</div>`;
  const D=t('downs'), forms=[...new Set(plays.map(e=>e.form).filter(Boolean))];
  const filtered=sc.down||sc.dist||sc.pos||sc.form||sc.call||sc.rec!=null||sc.kind!=='pass'||sc.area!=='field';
  const filters=`<div class="filters">
      ${sc.call?`<button class="btn" data-act="sc" data-k="call" data-v="">${t('scCallF',esc(sc.call))} ✕</button>`:''}
      ${seg('area',[['field',t('mapField')],['gl','GL'],['conv',t('convs')]])}
      ${conv?'':seg('kind',[['pass',t('passes')],['run',t('runs')],['all',t('all')]])}
      ${conv?'':seg('down',[[0,t('allM')],[1,D[0]],[2,D[1]],[3,D[2]],[4,D[3]]])}
      ${!conv&&hasDist?seg('dist',[[0,t('distAll')],[1,'0-5'],[2,'5-10'],[3,'10-15'],[4,'15+']]):''}
      ${!conv&&hasPos?seg('pos',[[0,t('scPosAll')],[1,t('scPosOwn')],[2,t('scPosGoal')]]):''}
      ${forms.length&&!conv?seg('form',[['',t('allF')],...forms.map(f=>[f,esc(f)])]):''}
      ${filtered?`<button class="btn noprint" data-act="scclear">${t('scClear')}</button>`:''}
    </div>`;
  const pP=P.filter(isPassLike);
  const mapHTML=`<section class="panel"><div class="toolbar"><h3>${t('scMapT')}${sc.rec!=null?' · #'+sc.rec:''}</h3>${zoneModes('scm',sc.mode)}</div>
      <span class="note">${t('scPlaysN',P.length)} · ${pct(pP.filter(isComp).length,pP.length)} ${t('comp')}</span>
      ${zoneMap(P,gl,sc.mode,'sc')}${zoneLegend(sc.mode)}${P.some(e=>e.vt!=null)?`<button class="btn noprint" data-act="zdet" data-z="sc|all">▶ ${t('vFilt',P.filter(e=>e.vt!=null).length)}</button>`:''}<p class="note">${t('scMapNote')}</p></section>`;
  // tables
  const cellsOf=l=>{const np=l.filter(e=>e.kind!=='sack'), p=l.filter(isPassLike), z=scTop(p.filter(e=>e.zone),e=>e.zone), r=scTop(p,e=>e.rec);
    return [l.length,pct(p.length,np.length),pct(p.filter(isComp).length,p.length),z?zoneName(z[0]):'-',r?'#'+r[0]:'-']};
  const tr=(k,v,sel,cells)=>`<tr data-act="sc" data-k="${k}" data-v="${esc(v)}" data-tog="1" aria-selected="${sel}">${cells.map((c,i)=>`<td${i===0?' class="jn"':''}>${c}</td>`).join('')}</tr>`;
  const tbl=(title,head,rows)=>rows?`<section class="panel"><h3>${title}</h3><div class="tablewrap"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></section>`:'';
  const topForm=l=>{const f=scTop(l,e=>e.form);return f?esc(f[0]):'-'};
  let tables='';
  if(!conv){
    const DL=fil(off,'down').filter(e=>e.t==='play');
    tables+=tbl(t('scByDown'),t('thScDown'),[1,2,3,4].map(d=>{const l=DL.filter(e=>e._down===d);return l.length?tr('down',d,sc.down===d,[ord(d),...cellsOf(l),topForm(l)]):''}).join(''));
    if(hasDist){const DS=fil(off,'dist').filter(e=>e.t==='play'&&e._dist!=null), B=['0-5','5-10','10-15','15+'];
      tables+=tbl(t('scByDist'),t('thScDist'),B.map((b,i)=>{const l=DS.filter(e=>distB(e._dist)===i+1);return l.length?tr('dist',i+1,sc.dist===i+1,[b,...cellsOf(l),topForm(l)]):''}).join(''))}
    const FL=fil(off,'form').filter(e=>e.t==='play'), fm={};FL.forEach(e=>{(fm[e.form||'']=fm[e.form||'']||[]).push(e)});
    tables+=tbl(t('scByForm'),t('thScForm'),Object.entries(fm).sort((a,b)=>b[1].length-a[1].length).map(([f,l])=>tr('form',f,(sc.form||'')===f&&!!f,[f?esc(f):t('scNoForm'),...cellsOf(l)])).join(''));
  }
  // our playbook: how often each play is called, on which downs, and how it goes (play names come from the tape review)
  const CL=fil(off,'call').filter(e=>e.call), cm={};CL.forEach(e=>{(cm[e.call]=cm[e.call]||[]).push(e)});
  tables+=tbl(t('scByCall'),t('thScCall'),Object.entries(cm).sort((a,b)=>b[1].length-a[1].length).map(([k,l])=>{const p=l.filter(isPassLike), y=l.filter(e=>e.yds!=null);
    return tr('call',k,sc.call===k,[esc(k),l.length,pct(p.length,l.filter(e=>e.kind!=='sack').length),pct(p.filter(isComp).length,p.length),y.length?(y.reduce((a,e)=>a+e.yds,0)/y.length).toFixed(1):'-',l.filter(e=>e.res==='TD').length,
      [1,2,3,4].map(d=>{const n=l.filter(e=>e._down===d).length;return n?ord(d)+' '+n:''}).filter(Boolean).join(' · ')])}).join(''));
  const RL=fil(off,'rec').filter(e=>e.kind!=='sack'), rm={};RL.forEach(e=>{const k=e.rec==null?'?':e.rec;(rm[k]=rm[k]||[]).push(e)});
  const nT=RL.filter(isPassLike).length;
  tables+=tbl(t('scTargets'),t('thScRec'),Object.entries(rm).map(([k,l])=>({k,l,p:l.filter(isPassLike)})).sort((a,b)=>b.p.length-a.p.length||b.l.length-a.l.length).map(({k,l,p})=>{
    const z=scTop(p.filter(e=>e.zone),e=>e.zone);
    return tr('rec',k==='?'?'':k,String(sc.rec)===k,[k==='?'?t('noNum'):'#'+k+(pName(team.key,k)?`<small class="pn">${esc(pName(team.key,k))}</small>`:''),p.length,pct(p.length,nT),pct(p.filter(isComp).length,p.length),l.filter(e=>e.res==='TD').length,l.filter(e=>e.kind==='run').length,z?zoneName(z[0]):'-'])}).join(''));
  const qm={};P.filter(e=>isPassLike(e)&&e.qb!=null).forEach(e=>{(qm[e.qb]=qm[e.qb]||[]).push(e)});
  tables+=tbl(t('scQbs'),t('thScQb'),Object.entries(qm).sort((a,b)=>b[1].length-a[1].length).map(([k,l])=>`<tr><td class="jn">#${k}${pName(team.key,k)?`<small class="pn">${esc(pName(team.key,k))}</small>`:''}</td><td>${l.length}</td><td>${pct(l.filter(isComp).length,l.length)}</td><td>${l.filter(e=>e.res==='TD').length}</td><td>${l.filter(e=>e.res==='INT').length}</td></tr>`).join(''));
  // the scouted team on defense: where opponents throw on them, and who makes the plays
  const dfp=dp.filter(e=>e.zone&&!isGL(e.zone));
  const dv={}, dk=k=>dv[k]=dv[k]||{f:0,b:0,i:0,p6:0,s:0};
  def.forEach(e=>{if(e.res==='INT'||e.res==='SACK'){const v=dk(e.dby==null?'?':e.dby);if(e.res==='SACK')v.s++;else{v.i++;if(e.pick6)v.p6++}}
    if(e.fby!=null)dk(e.fby).f++;if(e.pbu!=null)dk(e.pbu).b++});
  const drows=Object.entries(dv).sort((a,b)=>(b[1].i+b[1].s+b[1].f+b[1].b)-(a[1].i+a[1].s+a[1].f+a[1].b)).map(([k,v])=>`<tr><td class="jn">${k==='?'?t('noNum'):'#'+k}${pName(team.key,k)?`<small class="pn">${esc(pName(team.key,k))}</small>`:''}</td><td>${v.f}</td><td>${v.b}</td><td>${v.i}</td><td>${v.p6}</td><td>${v.s}</td></tr>`).join('');
  const defHTML=dfp.length||drows||DD.length?`<section class="sc-sec"><h2>${t('scDefence',us)}</h2><div class="ana">
      ${dfp.length?`<section class="panel"><div class="toolbar"><h3>${t('scDefMap',us)}</h3><span class="note">${t('scPlaysN',dfp.length)} · ${pct(dfp.filter(isComp).length,dfp.length)} ${t('comp')}</span></div>
        ${zoneMap(dfp,false,sc.mode,'scd')}<p class="note">${t('scDefMapNote')}</p></section>`:'<div></div>'}
      <div class="sc-tables">${drivePanel(DD,t('drvAg'))}${tbl(t('scDefPl'),t('thScDef'),drows)}</div></div></section>`:'';
  const resOf=x=>x.st.score[x.S]>x.st.score[x.O]?0:x.st.score[x.S]<x.st.score[x.O]?2:1;
  const vsName=G=>{const sd=team.sideIn[G.id];return G.scout?esc(sd==='H'?G.opp:G.home):sd==='H'?esc(G.opp):'Hammers'};
  const gamesHTML=`<section class="sc-sec"><h2>${t('scGamesT')}</h2><p class="note noprint">${t('scGamesNote')}</p><div class="sc-games">${list.map(G=>{
      const x=R[G.id], off_=!!sc.off[G.id], e=scoutEv[G.id], r=x?resOf(x):null;
      const st=off_?t('scOff'):x?`${x.st.score[x.S]}-${x.st.score[x.O]} · ${t('scPlaysN',x.events.filter(e=>e.t==='play').length)}`:e&&e.err?t('scLoadFail'):t('scLoadingG');
      return `<div class="scg${off_?' off':''}"><button class="scg-main" data-act="scgame" data-id="${G.id}" aria-pressed="${!off_}">
          <span class="res r${r==null?'':r}">${r==null?'·':WDL[r]}</span>
          <span class="gtxt"><b>vs ${vsName(G)}</b><small>${esc(G.date||'')} · ${esc(G.comp)}${G.scout?' · '+t('xTag'):''} · ${st}</small></span></button>
        ${G.extra?'':`<button class="btn noprint" data-act="openg" data-id="${G.id}" data-v="ana">${t('scOpenA')}</button>`}</div>`}).join('')}</div></section>`;
  const sumSec=`<section class="sc-sec"><h2>${t('sumT')}</h2><div class="panel">${sumHTML(off,def,nG,us,DO,team.key)}</div></section>`;
  const body=X.length&&off.length?`${sumSec}${insHTML}
    <section class="sc-sec"><h2>${t('scAttack',us)}</h2>${filters}
      <div class="ana"><div class="sc-tables">${mapHTML}${chartsHTML(P,fil(off,'down'),fil(off,'rec'))}</div><div class="sc-tables">${drivePanel(DO)}${tables}</div></div></section>
    ${defHTML}`:`<p class="note">${waiting?'':t('scNoPlays')}</p>`;
  const planHTML=`<section class="sc-sec"><h2>${t('planT')}</h2><div class="panel">
      <textarea id="sc-plan" class="plan-in noprint" data-key="${esc(team.key)}" rows="4" placeholder="${t('planPh')}">${esc(doc.plan||'')}</textarea>
      <div class="printonly plan-print">${esc(doc.plan||'').replace(/\n/g,'<br>')}</div><p class="note noprint">${t('planNote')}</p></div></section>`;
  return `${head}${pickRow}${hero}${planHTML}${waiting?`<p class="note">${t('scLoading',waiting)}</p>`:''}${body}${gamesHTML}
    <p class="appver">Hammers Game Ops · ${t('version')} ${APP_VERSION}${PREVIEW?' · '+t('previewTag'):''}</p>`;
}
function logView(){
  replay();
  const delB=e=>`<button class="del" data-act="del" data-id="${e.id}">${confirmDel===e.id?t('confirm'):t('del')}</button>`;
  const sd=e=>`<span class="sd ${e._side}"></span>`;
  const items=[...g.events].reverse().map(e=>{
    if(e.t==='pen')return `<div class="ev">${sd(e)}<span class="dn">${ord(e._down)}</span><span class="tx"><b>${e.foul?t('fouls')[e.foul]:t('penalty')}</b>${e.team?`<span class="tag">${sideName(e.team)}</span>`:''}${e._pyds?`<span class="tag">${e._pyds>0?'+':'−'}${Math.abs(e._pyds)} ${t('yardsShort')}</span>`:''}<span class="tag">${e.foul?t('penEff')[e.eff==='rep'&&e.cnt?'loss':e.eff]:t('penShort')[e.eff]}</span>${e.annulId?`<span class="tag">${t('annulledPlay')}</span>`:''}</span><span class="ops">${delB(e)}</span></div>`;
    if(e.t==='down')return `<div class="ev">${sd(e)}<span class="dn">→${ord(e.down)}</span><span class="tx">${t('downManual')}</span><span class="ops">${delB(e)}</span></div>`;
    if(e.t==='poss')return `<div class="ev"><span class="sd ${other(e._side)}"></span><span class="dn">⇄</span><span class="tx">${t('possManual')}</span><span class="ops">${delB(e)}</span></div>`;
    if(e.t==='half')return `<div class="ev"><span class="sd"></span><span class="dn">½</span><span class="tx"><b>${t('halfT')}</b></span><span class="ops">${delB(e)}</span></div>`;
    if(e.t==='conv'){
      const rt={G:`<span class="tag C">${t('convRes').G}</span>`,NG:`<span class="tag X">${t('convRes').NG}</span>`,INT:'<span class="tag INT">INT</span>'}[e.res];
      return `<div class="ev">${sd(e)}<span class="dn">+${e.pts}</span><span class="tx"><b>${e.rec!=null?'#'+e.rec:t('noNum')}</b>${rt}<span class="tag">${t('conv')}</span>${e.zone?`<span class="tag">${zoneName(e.zone)}</span>`:''}
        ${e.res==='INT'?`<span class="tag">${t('byTag',e.dby)}</span>${e.ret?`<span class="tag TD">${t('retTag',e.ret)}</span>`:''}`:''}</span><span class="ops">${delB(e)}</span></div>`;
    }
    const resTag={C:`<span class="tag C">${t('tagC')}</span>`,X:`<span class="tag X">${t('tagX')}</span>`,R:`<span class="tag">${t('tagR')}</span>`,TD:'<span class="tag TD">TD</span>',INT:'<span class="tag INT">INT</span>',SACK:`<span class="tag INT">${t('sack')}</span>`,SF:`<span class="tag INT">${t('safety')}</span>`,BS:`<span class="tag X">${t('badSnap')}</span>`}[e.res];
    return `<div class="ev ${e.annul?'annul':''}">${sd(e)}<span class="dn">${ord(e._down)}</span>
      <span class="tx">${e.kind==='sack'||e.kind==='safety'||e.kind==='snap'?'':`<b>${e.rec!=null?'#'+e.rec:t('noNum')}</b>`}${resTag}${e.zone?`<span class="tag">${zoneName(e.zone)}</span>`:''}${e.kind==='run'&&e.res==='TD'?`<span class="tag">${t('runLow')}</span>`:''}
      ${(e.res==='INT'||e.res==='SACK')?`<span class="tag">${t('byTag',e.dby)}</span>`:''}
      ${e.fd?`<span class="tag">${t('fdLow')}</span>`:''}${e.form?`<span class="tag">${esc(e.form)}</span>`:''}${e.qb2?'<span class="tag">2 QB</span>':''}
      ${e.pick6?'<span class="tag TD">pick-6</span>':''}${e.pat!=null?`<span class="tag">${t('convTag',e.pat)}</span>`:''}${e._tod?`<span class="tag">${t('tod')}</span>`:''}${e.annul?`<span class="tag">${t('annulTag')}</span>`:''}</span>
      <span class="ops"><button data-act="annul" data-id="${e.id}">${e.annul?t('restore'):t('annul')}</button>${delB(e)}</span></div>`;
  }).join('');
  return `<div class="toolbar"><p class="note">${t('logCount',g.events.filter(e=>e.t==='play').length)} ${qh('plays')}</p>
    <button class="btn" data-act="csv">${t('copyCsv')}</button></div>
    <div class="log">${items||`<p class="note">${t('logEmpty')}</p>`}</div>`;
}


/* ---------- tape review: one play at a time, next to the video ----------
   Adds to each play event: yds, yac, qb, call (play name), fby (flag pulled by), pbu, note, vt/vi (video time and part), rv (reviewed). */
/* tp.only: a playlist (plays picked from a zone or a filter in the analysis or the report), watched one after the other */
const tp={id:null,list:false,gl:null,del:null,only:null,seekId:null};
const tapeAll=()=>g.events.filter(e=>e.t==='play'||e.t==='conv');
const tapeEvs=()=>{const L=tapeAll();if(!tp.only)return L;const k=new Set(tp.only.ids);return L.filter(e=>k.has(e.id))};
function tapeCur(){
  const L=tapeEvs();let i=L.findIndex(e=>e.id===tp.id);
  if(i<0&&L.length){i=L.findIndex(e=>!e.rv);if(i<0)i=L.length-1;tp.id=L[i].id}
  const e=L[i]||null;
  if(tp.seekId&&e&&e.id===tp.seekId&&e.vt!=null){tp.seekId=null;setTimeout(()=>seekPlay(e),0)}
  return {L,i,e};
}
/* sticky fields (QB, formation): the value of the previous play of the same team */
function tSugg(e,k){const L=tapeAll();for(let j=L.indexOf(e)-1;j>=0;j--){const x=L[j];if(x._side===e._side&&x[k]!=null&&x[k]!=='')return x[k]}return null}
const fmtT=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s/60)%60,ss=String(s%60).padStart(2,'0');return h?`${h}:${String(m).padStart(2,'0')}:${ss}`:`${m}:${ss}`};
const partName=i=>t('vPart',(i||0)+1);
function playbook(){const s=new Set(g.playbook||[]);games.forEach(x=>{if(x.team===g.team&&x.id!==g.id)(x.playbook||[]).forEach(c=>s.add(c))});return [...s]}
const ytId=v=>{v=(v||'').trim();const m=v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);return m?m[1]:/^[A-Za-z0-9_-]{11}$/.test(v)?v:null};

/* the fouls recorded right after a play */
function penLines(e){
  const out=[], i=g.events.indexOf(e);
  for(let j=i-1;j>=0&&g.events[j].t==='pen';j--)if(isPre(g.events[j]))out.unshift(g.events[j]);
  for(let j=i+1;j<g.events.length&&g.events[j].t==='pen';j++)if(!isPre(g.events[j]))out.push(g.events[j]);
  if(!out.length)return '';
  return `<div class="tblk tpens">${out.map(pe=>`<div class="tpenl"><span>⚑ <b>${pe.foul?t('fouls')[pe.foul]:t('penalty')}</b>${pe.team?' · '+sideName(pe.team):''}${pe._pyds?` · ${pe._pyds>0?'+':'−'}${Math.abs(pe._pyds)} ${t('yardsShort')}`:''} · ${pe.foul?t('penEff')[pe.cnt?'loss':pe.eff]:t('penShort')[pe.eff]}${pe._after!=null?' · '+spotTxt(pe._after):''}</span>
    ${readOnly()?'':`<button class="linkbtn" data-act="tpenrm" data-id="${pe.id}">${t('penRemove')}</button>`}</div>`).join('')}</div>`;
}
function tapeView(){return `<div class="tape"><section class="vpane" id="vpane">${vpaneHTML()}</section><section class="tpanel" id="tpanel">${tapePanel()}</section></div>`}
function tapeUpdate(){
  const P=document.getElementById('tpanel'), a=document.activeElement, keep=a&&a.id==='t-note'?{v:a.value,s:a.selectionStart,id:tp.id}:null;
  P.innerHTML=tapePanel();
  if(keep&&keep.id===tp.id){const n=document.getElementById('t-note');if(n){n.value=keep.v;n.focus();try{n.setSelectionRange(keep.s,keep.s)}catch(e){}}}
  mountPlayer();
}
function tapePanel(){
  if(!tp.only)return tapePanel0();
  const {L,i}=tapeCur();
  return `<div class="vonly"><span><b>▶ ${esc(tp.only.l)}</b><small>${t('vOnlyPos',i+1,L.length)}</small></span><button class="btn" data-act="tonlyx">${t('vOnlyX')}</button></div>${tapePanel0()}`;
}
function tapePanel0(){
  const {L,i,e}=tapeCur();
  if(!e)return `<div class="defcard"><h3>${t('tEmptyT')}</h3><p>${t('tEmpty')}</p>${readOnly()?'':`<button class="btn" data-act="tins">${t('tInsFirst')}</button>`}</div>`;
  const done=L.filter(x=>x.rv).length, s=e._side, conv=e.t==='conv', ours=s==='H', vs=g.videos||[], away=vidAway();
  const blk=(l,sub,body)=>`<div class="tblk"><div class="lbl"><span>${l}</span><span>${sub||''}</span></div>${body}</div>`;
  const chips=(k,opts,val,sug)=>`<div class="forms">${opts.map(([v,l])=>`<button class="f" data-act="tset" data-k="${k}" data-s="${esc(v)}" aria-pressed="${val===v}"${sug&&val===v?' data-sug':''}>${esc(l)}</button>`).join('')}`;
  const nums=(k,side,val,sug)=>{const R=[...new Set([...g.roster[side],...(val!=null?[val]:[])])].sort((a,b)=>a-b);
    return `<div class="tnums">${R.map(n=>`<button class="tn num" data-act="tset" data-k="${k}" data-n="${n}" aria-pressed="${val===n}"${sug&&val===n?' data-sug':''}>${n}</button>`).join('')}<button class="tn add" data-act="taddnum" data-k="${k}" data-side="${side}" aria-label="${t('newNum')}">+</button></div>`};
  const yds=(k,val)=>`<div class="tyds"><div class="tyv"><button class="tn" data-act="tadj" data-k="${k}" data-d="-1" aria-label="-1">−</button><b class="num">${val==null?'—':val}<span>${t('yardsShort')}</span></b>
      <button class="tn" data-act="tadj" data-k="${k}" data-d="1" aria-label="+1">+</button><button class="tn kp" data-act="tkp" data-k="${k}">123</button></div>
    <div class="tq">${[-5,0,3,5,10,15,20,30].map(n=>`<button class="tn num" data-act="tset" data-k="${k}" data-n="${n}" aria-pressed="${val===n}">${n>0?'+'+n:n}</button>`).join('')}</div></div>`;
  // the play itself, as tracked live (fix it if needed)
  const resOpts=conv?[['G',t('convRes').G],['NG',t('convRes').NG],['INT','INT']]:e.kind==='run'?[['R',t('tagR')],['TD','TD']]:e.kind==='sack'?[]:[['C',t('tagC')],['X',t('tagX')],['TD','TD'],['INT','INT']];
  const gl=tp.gl!=null?tp.gl:(conv||isGL(e.zone));
  let zones='';const ROWS=gl?t('glRows'):t('rows'),COLS=t('cols');
  for(let r=0;r<4;r++)for(let c=0;c<3;c++){const z=(gl?'g':'')+r+c;
    zones+=`<button class="tz${gl&&r<2?' ez':''}${!gl&&r===3?' behind':''}" data-act="tset" data-k="zone" data-s="${z}" aria-pressed="${e.zone===z}">${ROWS[r]} ${COLS[c]}</button>`}
  const play=`${conv?`<div class="tzhead"><div class="seg">${[1,2].map(n=>`<button data-act="tset" data-k="pts" data-n="${n}" aria-pressed="${e.pts===n}">${n} pt${n>1?'s':''}</button>`).join('')}</div>
      ${readOnly()?'':`<button class="btn" data-act="tnoconv">${t('tNoConv')}</button>`}</div>`
    :`<div class="seg">${[['pass',t('tPass')],['run',t('tRun')],['sack',t('tSackK')]].map(([v,l])=>`<button data-act="tset" data-k="kind" data-s="${v}" aria-pressed="${e.kind===v}">${l}</button>`).join('')}</div>`}
    ${resOpts.length?`<div class="resrow">${resOpts.map(([v,l])=>`<button class="rb rb-${v}" data-act="tset" data-k="res" data-s="${v}" aria-pressed="${e.res===v}">${l}</button>`).join('')}${!conv&&(e.res==='C'||e.res==='R')?`<button class="rb" data-act="tbool" data-k="fd" aria-pressed="${!!(e.fd||e._autoFd)}">${t('fd')}${e._autoFd&&!e.fd?' <small>'+t('fdAuto')+'</small>':''}</button>`:''}
      ${!conv&&e.res==='INT'?`<button class="rb rb-TD" data-act="tbool" data-k="pick6" aria-pressed="${!!e.pick6}">${t('tPick6')}</button>`:''}
      ${conv&&e.res==='INT'?`<button class="rb rb-TD" data-act="tset" data-k="ret" data-n="${e.pts}" aria-pressed="${!!e.ret}">${t('retTag',e.pts)}</button>`:''}</div>`:''}
    ${e.kind==='sack'?'':`<div class="tzhead"><span class="lbl2">${t('tZone')}</span><div class="seg"><button data-act="tgl" data-v="0" aria-pressed="${!gl}">${t('mapField')}</button><button data-act="tgl" data-v="1" aria-pressed="${gl}">GL</button></div></div>
    <div class="tzones">${zones}</div>
    <span class="lbl2">${e.kind==='run'?t('tRunner'):t('receiver')}</span>${nums('rec',s,e.rec??null)}`}
    ${e.res==='INT'||e.res==='SACK'?`<span class="lbl2">${e.res==='SACK'?t('whoSack'):t('whoInt')} · ${sideName(other(s))}</span>${nums('dby',other(s),e.dby??null)}`:''}`;
  const qbV=e.qb!=null?e.qb:tSugg(e,'qb'), fmV=e.form||(conv?null:tSugg(e,'form'));
  const forms=g.formations[s].map(f=>[f,f]);
  const passDone=(e.kind==='pass'||conv)&&(e.res==='C'||e.res==='TD'||e.res==='G');
  const vt=e.vt!=null?`${fmtT(e.vt)}${vs.length>1?' · '+partName(e.vi):''}`:'—';
  const L2=L.map((x,j)=>`<button class="trow${x.id===e.id?' cur':''}" data-act="tgo" data-id="${x.id}"><span class="sd ${x._side}"></span><span class="num">${j+1}</span>
      <span>${x.t==='conv'?'+'+x.pts:ddTxt(x)}</span><span class="trx">${x.rec!=null?'#'+x.rec+' ':''}${{C:t('tagC'),X:t('tagX'),R:t('tagR'),TD:'TD',INT:'INT',SACK:t('sack'),G:'Good',NG:'No Good'}[x.res]||''}${x.yds!=null?' · '+x.yds+' '+t('yardsShort'):''}</span>
      <span class="num">${x.vt!=null?fmtT(x.vt):''}</span><span>${x.rv?'✓':''}</span></button>`).join('');
  return `<div class="tprog"><div class="tbar"><i style="width:${L.length?Math.round(done/L.length*100):0}%"></i></div><span class="num">${t('tDone',done,L.length)}</span><button class="linkbtn" data-act="tlist">${tp.list?t('tHideList'):t('tShowList')}</button></div>
    ${tp.list?`<div class="tlist">${L2}</div>`:''}
    <div class="tnav side-${s}"><button class="btn" data-act="tnav" data-d="-1" ${i?'':'disabled'} aria-label="${t('tPrev')}">‹</button>
      <div class="tttl"><b>${t('tPlay',i+1,L.length)}</b><small>${conv?t('conv')+' '+e.pts+' pt':`<b class="dd">${ddTxt(e)} · ${spotTxt(e._spot)}</b>`} · <span class="pside ${s}">${sideName(s)}</span> · ${e._half===2?t('h2'):t('h1')}${e.annul?' · '+t('annulTag'):''}${e.ins?' · '+t('insTag'):''}${e.rv?' · ✓ '+t('tReviewed'):''}</small></div>
      <button class="btn" data-act="tnav" data-d="1" ${i<L.length-1?'':'disabled'} aria-label="${t('tNext')}">›</button></div>
    <div class="vctl">
      ${vs.length>1?`<div class="seg">${vs.map((v,j)=>`<button data-act="vuse" data-n="${j}" aria-pressed="${vid.slot===j}">${partName(j)}</button>`).join('')}</div>`:''}
      <button class="btn" data-act="tplay" aria-label="${t('tPlayCtl')}">▶ ❚❚</button><button class="btn" data-act="tback">${t('tBack5')}</button>
      <button class="btn" data-act="trate" aria-pressed="${vid.rate!==1}">${t('tSlow')}</button>
      ${e.vt!=null?`<button class="btn vt" data-act="tjump" title="${t('tJump')}">${t('tStart')}: <b class="num">▶ ${vt}</b></button>`:`<span class="vt">${t('tStart')}: <b class="num">—</b></span>`}<button class="btn" data-act="tmark">${t('tMark')}</button>
      <span class="vsp"></span><button class="btn" data-act="videos">${t('tVideos')}</button><button class="btn" data-act="${away?'vback':'vpop'}">${away?t('vBack'):t('vPop')}</button>
    </div>
    ${blk(t('tPlaySec'),t('tFix'),play)}
    ${conv?'':blk(t('tBall'),t('tBallS'),`<div class="tyv tball"><button class="tn" data-act="tspotadj" data-d="-1" aria-label="-1">−</button>
      <b class="num">${spotTxt(e._spot)}<span>${ddTxt(e)}</span></b><button class="tn" data-act="tspotadj" data-d="1" aria-label="+1">+</button><button class="tn kp" data-act="tspot">${t('tSpotFix')}</button></div>
      <p class="note">${e._spot==null?t('tSpotQ'):e.spot!=null?t('tManualS'):t('tAutoS')}${e.spot!=null&&!readOnly()?` · <button class="linkbtn" data-act="tspotauto">${t('tSpotAuto')}</button>`:''}</p>`)}
    ${conv?'':blk(t('tYds'),t('tYdsS'),yds('yds',e.yds??null))}
    ${ours&&passDone&&!conv?blk(t('tYac'),t('tYacS'),yds('yac',e.yac??null)):''}
    ${blk(ours?t('tQb'):t('tQbOpp'),t('tSticky'),nums('qb',s,qbV,e.qb==null))}
    ${conv?'':blk(ours?t('formation'):t('tFormOpp'),t('tSticky'),chips('form',forms,fmV,!e.form)+`<button class="f" data-act="addform" data-side="${s}">${t('newForm')}</button></div>`)}
    ${ours?blk(t('tCall'),t('tCallS'),chips('call',playbook().map(c=>[c,c]),e.call||null,false)+`<button class="f" data-act="tcall">${t('newForm')}</button></div>`):''}
    ${!ours&&!conv&&(e.res==='C'||e.res==='R')?blk(t('tFlag'),t('tOurs'),nums('fby','H',e.fby??null)):''}
    ${!ours&&(e.res==='X'||e.res==='NG')?blk(t('tPbu'),t('tPbuS'),nums('pbu','H',e.pbu??null)):''}
    ${penLines(e)}
    ${blk(t('tNote'),'',`<input class="field-in" id="t-note" maxlength="140" placeholder="${t('tNotePh')}" value="${esc(e.note||'')}" autocomplete="off">`)}
    <div class="tfoot">
      <button class="primary" data-act="tnext">${i<L.length-1||readOnly()?t('tNext'):t('tNewPlay')} ›</button>
      <div class="row"><button class="btn" data-act="tpen">${t('penAdd')}</button><button class="btn" data-act="tins">${t('tIns')}</button><button class="btn" data-act="tdel" style="color:var(--bad)">${tp.del===e.id?t('tDelC'):t('tDel')}</button></div>
      <p class="note tkeys">${t('tKeys')}</p>
    </div>`;
}

/* ---------- video: YouTube (unlisted link saved in the game) or a file opened on this device; here or in a separate window ---------- */
const vid={slot:0,files:{},win:null,rate:1,seek:null,resume:null};
const vidAway=()=>!!(vid.win&&!vid.win.closed);
function vpaneHTML(){return vidAway()?`<div class="vaway"><b>${t('vAway')}</b><p>${t('vAwayS')}</p><button class="btn" data-act="vback">${t('vBack')}</button></div>`:`<div class="vbox" id="vbox"></div>`}
function vHost(){
  if(vidAway()){const b=vid.win.document.getElementById('vbox');return b?{win:vid.win,box:b}:null}
  const b=document.getElementById('vbox');return b?{win:window,box:b}:null;
}
function vSrc(){
  const v=(g.videos||[])[vid.slot], f=vid.files[vid.slot];
  if(f)return {k:'file',key:`${g.id}:f${vid.slot}:${f.name}:${f.size}`,file:f};
  if(v&&v.yt)return {k:'yt',key:`${g.id}:yt:${v.yt}`,id:v.yt};
  return null;
}
function loadYT(w,cb,fail){
  if(w.YT&&w.YT.Player)return cb();
  if(w.HGO_ytfail)return fail();
  (w.HGO_ytq=w.HGO_ytq||[]).push([cb,fail]);if(w.HGO_ytl)return;w.HGO_ytl=true;
  w.onYouTubeIframeAPIReady=()=>{(w.HGO_ytq||[]).splice(0).forEach(([f])=>{try{f()}catch(e){}})};
  const sc=w.document.createElement('script');sc.src='https://www.youtube.com/iframe_api';
  sc.onerror=()=>{w.HGO_ytl=false;w.HGO_ytfail=true;(w.HGO_ytq||[]).splice(0).forEach(([,f])=>{try{f()}catch(e){}})};
  w.document.head.appendChild(sc);
}
/* without the YouTube script (blocked, e.g. in the preview page): plain embed driven by the same messages the script uses */
function ytFrame(h,key,id){
  const w=h.win, f=w.document.createElement('iframe'), org=w.location.origin;
  f.src=`https://www.youtube.com/embed/${id}?enablejsapi=1&playsinline=1&rel=0${org&&org!=='null'?'&origin='+encodeURIComponent(org):''}`;
  f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;
  h.box.appendChild(f);
  const st={t:null,s:-1,at:0,ready:false};
  const post=o=>{try{f.contentWindow.postMessage(JSON.stringify({...o,id:1,channel:'widget'}),'*')}catch(e){}};
  const send=(func,args)=>post({event:'command',func,args:args||[]});
  w.addEventListener('message',ev=>{
    if(w.HGO_src!==key||ev.source!==f.contentWindow)return;
    let d;try{d=typeof ev.data==='string'?JSON.parse(ev.data):ev.data}catch(e){return}
    const i=d&&d.info;
    if(i&&typeof i==='object'){if(typeof i.currentTime==='number'){st.t=i.currentTime;st.at=Date.now()}if(typeof i.playerState==='number')st.s=i.playerState}
    if(!st.ready&&d&&(d.event==='onReady'||d.event==='initialDelivery'||d.event==='infoDelivery')){st.ready=true;send('setPlaybackRate',[vid.rate]);
      if(vid.seek!=null){send('seekTo',[vid.seek,true]);send('pauseVideo');st.t=vid.seek;st.at=Date.now();vid.seek=null}}
  });
  const hello=()=>post({event:'listening'});
  f.addEventListener('load',()=>{hello();let n=0;const iv=setInterval(()=>{if(st.ready||++n>20||w.HGO_src!==key)clearInterval(iv);else hello()},250)});
  w.HGO_yt={getCurrentTime:()=>st.t==null?0:st.t+(st.s===1?(Date.now()-st.at)/1000*vid.rate:0),
    seekTo:s=>{send('seekTo',[s,true]);st.t=s;st.at=Date.now()},getPlayerState:()=>st.s,
    playVideo:()=>send('playVideo'),pauseVideo:()=>send('pauseVideo'),setPlaybackRate:r=>send('setPlaybackRate',[r])};
}
function mountPlayer(){
  if(vidAway()){const l=vid.win.document.getElementById('vlabel'),c=tapeCur().e;
    if(l)l.textContent=c?`${g.scout?g.home:g.team} vs ${g.opp} · ${t('tPlay',tapeEvs().indexOf(c)+1,tapeEvs().length)} · ${c.t==='conv'?t('conv'):ord(c._down)+' '+t('down')} · ${c._side==='H'?'Hammers':g.opp}`:''}
  const h=vHost();if(!h)return;
  const src=vSrc(), key=src?src.key:'none:'+lang+':'+(h.win===window);
  if(h.win.HGO_src===key&&h.box.firstChild)return;
  h.win.HGO_src=key;h.win.HGO_yt=null;h.box.innerHTML='';
  if(vid.seek==null&&vid.resume!=null)vid.seek=vid.resume;vid.resume=null;
  if(!src){h.box.innerHTML=h.win===window?`<div class="vempty"><b>${t('vNoneT')}</b><p>${t('vNoneP')}</p>
    <div class="row">${readOnly()?'':`<button class="primary" data-act="videos">${t('vAddLink')}</button>`}<button class="btn" data-act="vfile">${t('vFile')}</button></div></div>`:`<div class="vempty"><p>${t('vNoneT')}</p></div>`;return}
  if(src.k==='file'){
    const v=h.win.document.createElement('video');v.controls=true;v.playsInline=true;v.preload='auto';
    v.src=h.win.URL.createObjectURL(src.file);
    v.addEventListener('loadedmetadata',()=>{v.playbackRate=vid.rate;if(vid.seek!=null){v.currentTime=vid.seek;vid.seek=null}});
    h.box.appendChild(v);return;
  }
  const d=h.win.document.createElement('div');h.box.appendChild(d);
  loadYT(h.win,()=>{if(h.win.HGO_src!==key)return;
    const y=new h.win.YT.Player(d,{videoId:src.id,width:'100%',height:'100%',playerVars:{playsinline:1,rel:0,modestbranding:1},
      events:{onReady:()=>{h.win.HGO_yt=y;try{y.setPlaybackRate(vid.rate)}catch(e){}if(vid.seek!=null){y.seekTo(vid.seek,true);y.pauseVideo();vid.seek=null}}}})},
    ()=>{if(h.win.HGO_src!==key)return;h.box.innerHTML='';ytFrame(h,key,src.id)});
}
/* one small controller for whichever player is open */
function vp(){
  const h=vHost();if(!h)return null;
  const v=h.box.querySelector('video');
  if(v)return {time:()=>v.currentTime,seek:s=>{v.currentTime=s},toggle:()=>{v.paused?v.play():v.pause()},rate:r=>{v.playbackRate=r}};
  const y=h.win.HGO_yt;
  if(y&&y.getCurrentTime)return {time:()=>y.getCurrentTime(),seek:s=>y.seekTo(s,true),toggle:()=>{y.getPlayerState()===1?y.pauseVideo():y.playVideo()},rate:r=>{try{y.setPlaybackRate(r)}catch(e){}}};
  return null;
}
function vTime(){const p=vp();if(!p)return null;const x=p.time();return typeof x==='number'&&isFinite(x)?Math.round(x*10)/10:null}
function seekPlay(e){
  if(!e||e.vt==null)return;
  const slot=e.vi||0;
  if(slot!==vid.slot){vid.slot=slot;vid.seek=e.vt;mountPlayer();return}
  const p=vp();if(p)p.seek(e.vt);else vid.seek=e.vt;
}
function attachFile(file,n){
  const vs=g.videos||[];
  if(n>=vs.length){const arr=clone(vs);while(arr.length<=n)arr.push({yt:null});updGame({videos:arr})}
  vid.files[n]=file;vid.slot=n;mountPlayer();
}
function pickFile(n){
  const inp=document.createElement('input');inp.type='file';inp.accept='video/*';
  inp.addEventListener('change',()=>{const f=inp.files&&inp.files[0];if(f){attachFile(f,n);if(sheet&&sheet.kind==='videos')renderSheet()}});
  inp.click();
}
const VDOC=`<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hammers Game Ops</title>
<style>html,body{margin:0;height:100%;background:#000;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;overflow:hidden}
#vbox{position:absolute;left:0;right:0;top:0;bottom:36px}#vbox iframe,#vbox video{width:100%;height:100%;border:0;display:block;background:#000}
#vlabel{position:absolute;left:0;right:0;bottom:0;height:36px;display:flex;align-items:center;padding:0 12px;font-size:14px;font-weight:600;background:#141414;border-top:3px solid #FF3300;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vempty{display:grid;place-items:center;height:100%;color:#aaa;text-align:center;padding:20px}</style></head>
<body><div id="vbox"></div><div id="vlabel"></div>
<script>
document.addEventListener('keydown',function(e){var t=e.target&&e.target.tagName;if(t==='INPUT')return;if(['ArrowLeft','ArrowRight',' ','Enter'].indexOf(e.key)>=0){try{if(opener&&opener.HGO_key){e.preventDefault();opener.HGO_key(e.key)}}catch(x){}}});
setInterval(function(){try{if(opener&&!opener.closed&&opener.HGO_reattach)opener.HGO_reattach(window)}catch(x){}},1500);
<\/script></body></html>`;
/* a real page of the site (video.html): YouTube refuses to play in a blank window (error 153). The preview has no such file, so it writes the same page in. */
function openVideoWindow(){
  if(vidAway()){try{vid.win.focus()}catch(e){}return}
  const at=vTime();
  const w=window.open(PREVIEW?'':'video.html','hgo-video','popup,width=1100,height=680');
  if(!w){toast(t('vPopBlocked'));return}
  if(PREVIEW&&!w.document.getElementById('vbox')){w.document.open();w.document.write(VDOC);w.document.close()}
  vid.win=w;if(at!=null)vid.seek=at;
  const pane=document.getElementById('vpane');if(pane)pane.innerHTML=vpaneHTML();
  let n=0;const ready=()=>{
    if(vid.win!==w||w.closed)return;
    let ok=false;try{ok=w.document.readyState==='complete'&&!!w.document.getElementById('vbox')&&w.location.href!=='about:blank'||PREVIEW&&!!w.document.getElementById('vbox')}catch(e){}
    if(!ok){if(++n<100)setTimeout(ready,100);return}
    w.document.title=`${t('vWin')} · ${g.scout?g.home:g.team} vs ${g.opp}`;w.HGO_src=null;
    mountPlayer();tapeUpdate();try{w.focus()}catch(e){}
  };ready();
}
function bringVideoBack(){
  const at=vTime(), w=vid.win;vid.win=null;
  try{if(w&&!w.closed)w.close()}catch(e){}
  if(at!=null)vid.seek=at;
  const pane=document.getElementById('vpane');if(pane){pane.innerHTML=vpaneHTML();mountPlayer()}
  if(document.getElementById('tpanel'))tapeUpdate();
}
/* the video window survives a reload of the app (for example after an update) and reconnects by itself */
window.HGO_reattach=w=>{if(vid.win===w||!g)return;vid.win=w;if(view==='tape'&&document.getElementById('vpane')){document.getElementById('vpane').innerHTML=vpaneHTML();tapeUpdate()}};
window.HGO_key=k=>{tapeKey(k)};
setInterval(()=>{if(vid.win&&vid.win.closed){vid.win=null;if(view==='tape'&&document.getElementById('vpane')){document.getElementById('vpane').innerHTML=vpaneHTML();mountPlayer();tapeUpdate()}}},1000);

/* ---------- tape actions ---------- */
function tapeGo(id,seek){tp.id=id;tp.gl=null;tp.del=null;if(seek)seekPlay(tapeAll().find(x=>x.id===id));render()}
function tapeNav(d){const {L,i}=tapeCur();const x=L[i+d];if(x)tapeGo(x.id,true)}
function tapeNext(){
  if(tp.only){tapeNav(1);return}
  const {L,i,e}=tapeCur();if(!e)return;
  const nx=L[i+1], now=vTime();
  if(!readOnly())act(grp=>{
    const p={rv:true};
    if(e.qb==null){const v=tSugg(e,'qb');if(v!=null)p.qb=v}
    if(e.t==='play'&&!e.form){const v=tSugg(e,'form');if(v)p.form=v}
    if(i===0&&e.vt==null&&now!=null){p.vt=0;p.vi=vid.slot}
    const n=document.getElementById('t-note');if(n&&n.value.trim()!==(e.note||''))p.note=n.value.trim();
    chEv(e,p,grp);
    if(nx&&nx.vt==null&&now!=null)chEv(nx,{vt:now,vi:vid.slot},grp);
    if(!nx)tp.id=tapeAppend(grp,now);
  });
  if(!nx){tp.gl=null;tp.del=null;render();return}
  tp.id=nx.id;tp.gl=null;tp.del=null;
  if(nx.vt!=null&&now!=null&&(Math.abs(now-nx.vt)>4||(nx.vi||0)!==vid.slot))seekPlay(nx);
  render();
}
function tapeKey(k){
  if(view!=='tape'||sheet)return false;
  if(k==='ArrowLeft')tapeNav(-1);
  else if(k==='ArrowRight')tapeNav(1);
  else if(k===' '){const p=vp();if(p)p.toggle()}
  else if(k==='Enter')tapeNext();
  else return false;
  return true;
}
function tapeSet(k,v){
  const e=tapeCur().e;if(!e||readOnly())return;
  if(e[k]===v&&k!=='res'&&k!=='kind'&&k!=='pts'&&k!=='spot')v=null;
  const patch={[k]:v};
  if(k==='kind'){
    if(v==='sack')Object.assign(patch,{res:'SACK',zone:null,rec:null,fd:false,yac:null});
    else if(e.kind==='sack')Object.assign(patch,{res:v==='run'?'R':'C',dby:null});
    else if(e.res!=='TD'&&e.res!=='INT')patch.res=v==='run'?'R':'C';
    else if(v==='run'&&e.res==='INT')patch.res='R';
  }
  if(k==='pts'&&e.ret)patch.ret=v;
  if(k==='res'&&v!=='C'&&v!=='R')patch.fd=false;
  if(k==='res'&&v!=='INT'&&e.res==='INT'){patch.dby=null;patch.pick6=null}
  act(grp=>chEv(e,patch,grp));
}
/* after the last play, Next adds a new one, like the Track tab would: the conversion after a TD, otherwise a pass (change it to run or sack) */
function tapeAppend(grp,now){
  replay();
  const cp=convPending(), last=g.events[g.events.length-1];
  const ne=cp?{t:'conv',side:cp.side,pts:1,zone:null,rec:null,res:'G'}
    :{t:'play',kind:'pass',zone:null,rec:null,res:'C',fd:false,form:null,qb2:false,annul:false};
  Object.assign(ne,{ins:true,id:Date.now().toString(36)+uid(),ts:Math.max(Date.now(),last?last.ts+1:0),by:DEV,...(now!=null?{vt:now,vi:vid.slot}:{})});
  S().put(g.id,ne);grp.push({k:'add',id:ne.id});lastAdded=ne.id;
  return ne.id;
}
function tapeInsert(){
  if(tp.only){toast(t('vOnlyNo'));return}
  if(readOnly())return;
  const e=tapeCur().e, idx=e?g.events.indexOf(e):g.events.length, prev=g.events[idx-1];
  const ts=e?(prev?(prev.ts+e.ts)/2:e.ts-1):Date.now(), now=vTime();
  const ne={t:'play',kind:'pass',zone:null,rec:null,res:'C',fd:false,form:null,qb2:false,annul:false,ins:true,
    id:Date.now().toString(36)+uid(),ts,by:DEV,...(now!=null?{vt:now,vi:vid.slot}:{})};
  act(grp=>{S().put(g.id,ne);grp.push({k:'add',id:ne.id})});
  tp.id=ne.id;tp.gl=null;render();
}

/* ---------- sheets ---------- */
function openSheet(kind,data){sheet={kind,...(data||{})};renderSheet()}
function closeSheet(){sheet=null;setTimeout(reloadIfIdle,200);const Lr=document.getElementById('layer'),sc=Lr.querySelector('.scrim');
  if(sc&&motionOK()){sc.classList.add('leave');setTimeout(()=>{if(!sheet)Lr.innerHTML=''},170)}else Lr.innerHTML='';render()}
function renderSheet(){
  const Lr=document.getElementById('layer');if(!sheet){Lr.innerHTML='';return}
  const st=replay();let h='', cls='';
  if(sheet.kind==='pen'){
    const P=penCtx(), p=P.p;
    const ctxLine=p?`<p>${t('penOn')}: <b>${p.t==='conv'?t('conv')+' '+p.pts+' pt':ddTxt(p)}</b> · ${p.rec!=null?'#'+p.rec+' · ':''}${({C:t('tagC'),X:t('tagX'),R:t('tagR'),TD:'TD',INT:'INT',SACK:t('sack'),G:'Good',NG:'No Good'})[p.res]||''}</p>`:'';
    if(!sheet.team){
      h=`<h2>${t('penTitle')}</h2>${ctxLine}<span class="lbl2">${t('penWho')}</span>
        <div class="grid2">${['H','A'].map(x=>`<button class="big" data-act="penteam" data-v="${x}">${sideName(x)}<small>${x===P.offPlay?t('penOff'):t('penDef')}</small></button>`).join('')}</div>
        <button class="ghost" data-act="close">${t('cancel')}</button>`;
    }else if(!sheet.foul){
      const byOf=f=>sheet.team===(f.when==='pre'?P.offPre:P.offPlay)?'O':'D';
      const ok=FOULS.filter(f=>f.who==='B'||f.who===byOf(f));
      const fb=f=>{const by=byOf(f),eff=by==='O'?f.effO:f.effD;return `<button class="big pf" data-act="penfoul" data-k="${f.k}">${t('fouls')[f.k]}<small>${f.yds?(by==='O'?'−':'+')+t('penYds',f.yds):t('penYds',0)} · ${t('penEff')[eff]}</small>${eff==='fd'?`<em class="autofd">${t('autoFd')}</em>`:''}</button>`};
      h=`<div class="help-head"><h2>${t('penTitle')} · ${sideName(sheet.team)}</h2><button class="ghost" data-act="penteam" data-v="">‹</button></div>${ctxLine}
        ${[['play',t('penPlay')],['pre',t('penPre')],['dead',t('penDead')]].map(([w,l])=>{const l2=ok.filter(f=>f.when===w);return l2.length?`<span class="lbl2">${l}</span><div class="grid2">${l2.map(fb).join('')}</div>`:''}).join('')}
        <button class="big" data-act="penfoul" data-k="other">${t('penOther')}<small>${t('penOtherS')}</small></button>
        <button class="ghost" data-act="close">${t('cancel')}</button>`;
    }else{
      const f=sheet.foul==='other'?null:foulOf(sheet.foul), pv=penPreview(), by=pv.ob;
      const yTxt=pv.pyds?(pv.pyds<0?'−':'+')+t('penYds',Math.abs(pv.pyds)):t('penYds',0);
      const ball=pv._spot!=null||pv._after!=null?`<p class="penball">${t('penBall',spotTxt(pv._spot),spotTxt(pv._after))} · <b>${ord(pv._dd.down)} & ${pv._after==null?'?':pv._dd.goal?'Goal':MID-pv._after}</b></p>`:'';
      h=`<div class="help-head"><h2>${f?t('fouls')[f.k]:t('penOther')}</h2><button class="ghost" data-act="penfoul" data-k="">${t('penBack')}</button></div>
        <p><b>${sideName(sheet.team)}</b> (${by==='O'?t('penOff'):t('penDef')}) · ${yTxt} · ${t('penEff')[pv.eff]}</p>
        ${f?`<p class="note">${t('penSpot')[f.spot]}</p>`:`<span class="lbl2">${t('penYdsLbl')}</span>
          <div class="tyv"><button class="tn" data-act="penyds" data-d="-5">−5</button><b class="num">${sheet.yds||0}<span>${t('yardsShort')}</span></b><button class="tn" data-act="penyds" data-d="5">+5</button><button class="tn" data-act="penyds" data-d="1">+1</button></div>
          <div class="grid2">${['rep','fd','loss'].map(x=>`<button class="big" data-act="peneff2" data-e="${x}" aria-pressed="${(sheet.eff||'rep')===x}">${t('penEff')[x]}</button>`).join('')}</div>`}
        ${p&&!p.annul?`<label class="check"><input type="checkbox" id="pen-annul" ${sheet.annul?'checked':''}> ${t('penAnnulPlay')}</label>`:''}
        ${ball}
        <button class="primary" data-act="penapply">${t('penApply')}</button>
        <div class="grid2"><button class="big" data-act="pendec">${t('penDecl')}<small>${t('penDecS')}</small></button><button class="big" data-act="close">${t('cancel')}</button></div>`;
    }
  }else if(sheet.kind==='down'){
    h=`<h2>${t('fixDown')}</h2><div class="grid4">${[1,2,3,4].map(d=>`<button class="big num" data-act="setdown" data-d="${d}" aria-pressed="${st.down===d}">${ord(d)}</button>`).join('')}</div>
      ${g.mode==='both'?`<button class="big" data-act="flipposs">${t('changePoss')}<small>${t('nowOff')}${sideName(other(st.poss))}</small></button>`:''}
      ${st.half===1&&!readOnly()?`<button class="big" data-act="half">${t('halfT')}<small>${t('halfS',sideName(g.mode&&g.mode!=='both'?g.mode:other(g.start)))}</small></button>`:''}
      <button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='zone'){
    const L=sheet.L.slice().reverse(), ok=L.filter(okPlay).length, R={C:t('tagC'),X:t('tagX'),R:t('tagR'),TD:'TD',INT:'INT',SACK:t('sack'),G:t('convRes').G,NG:t('convRes').NG};
    h=`<h2>${sheet.z==='all'?t('vAllT'):zoneName(sheet.z)}</h2><p>${t('scPlaysN',L.length)} · ${pct(ok,L.length)} ${t('zOk')}</p>
      ${(()=>{const by={};L.filter(e=>e.vt!=null).slice().reverse().forEach(e=>{const k=e._gid||g.id;(by[k]=by[k]||{l:e._g||(g.team+' vs '+g.opp),ids:[]}).ids.push(e.id)});
        sheet.vids=by;const n=Object.values(by).reduce((a,x)=>a+x.ids.length,0);
        return n?`<div class="zvid"><span class="lbl2">${t('vWatch',n)}</span>${Object.entries(by).map(([gid,x])=>`<button class="btn" data-act="zvideo" data-g="${gid}">▶ ${esc(x.l)} · ${x.ids.length}</button>`).join('')}</div>`:`<p class="note">${t('vNoClips')}</p>`})()}
      <div class="zlist">${L.map(e=>`<div class="zrow"><i class="zdot ${dotCls(e)}">${e.t==='conv'?e.pts:e._down||''}</i>
        <span><b>${R[e.res]||e.res}${e.rec!=null?' · '+numTxt(view==='scout'?sc.key:scKeyOf(g,e._side),e.rec):''}</b><small>${[e.t==='conv'?t('conv')+' '+e.pts+' pt':e._dist!=null?ddTxt(e):ord(e._down)+' '+t('down'),e.form?esc(e.form):'',e.call?esc(e.call):'',e.yds!=null?e.yds+' '+t('yardsShort'):'',e._g||''].filter(Boolean).join(' · ')}</small></span>${e.vt!=null?`<button class="zplay" data-act="zvideo" data-g="${e._gid||g.id}" data-start="${e.id}" aria-label="${t('vPlayOne')}">▶</button>`:''}</div>`).join('')}</div>
      <button class="ghost" data-act="close">${t('close')}</button>`;
  }else if(sheet.kind==='teamedit'){
    const T=scoutTeams(), team=T.find(x=>x.key===sheet.key)||{games:[],side:'A',team:'',name:''}, d=teamDoc(sheet.key)||{}, us=team.side==='H';
    // numbers seen for this team: rosters of its games and the plays of the loaded ones
    const nums=new Set();team.games.forEach(G=>{const sd=(team.sideIn||{})[G.id]||team.side;((G.roster||{})[sd]||[]).forEach(n=>nums.add(+n));if(scoutReady(G))scoutGame(G).events.forEach(e=>{
      if(e._side===sd){if(e.rec!=null)nums.add(e.rec);if(e.qb!=null)nums.add(e.qb)}else{['dby','fby','pbu'].forEach(k=>{if(e[k]!=null)nums.add(e[k])})}})});
    Object.keys(d.players||{}).forEach(n=>nums.add(+n));
    const others=T.filter(x=>x.side==='A'&&!us&&x.team===team.team&&x.key!==sheet.key&&!x.demo);
    const al=new Set(d.aliases||[]), cols=['#C8102E','#1F5FA8','#17804F','#6B3FA0','#E0A82A','#0E7C86','#3F4650','#111111'];
    h=`<div class="help-head"><h2>${t('tmT')}</h2><button class="ghost" data-act="close">✕</button></div>
      <p>${esc(team.team)} · ${us?'Hammers':esc(team.name)}</p>
      ${us?'':`<label class="lbl2" for="te-name">${t('nameLbl')}</label><input class="field-in" id="te-name" maxlength="40" value="${esc(d.name||team.name)}">
      <span class="lbl2">${t('tmColor')}</span><div class="swatches">${cols.map(c=>`<button class="sw" data-act="tecol" data-c="${c}" style="background:${c}" aria-pressed="${(sheet.col??d.color)===c}" aria-label="${c}"></button>`).join('')}
        <button class="sw none" data-act="tecol" data-c="" aria-pressed="${!(sheet.col??d.color)}">✕</button></div>`}
      <span class="lbl2">${t('tmPlayers')}</span><p class="note">${t('tmPlayersN')}</p>
      <div class="tm-players">${[...nums].sort((a,b)=>a-b).map(n=>`<label class="tm-p"><b class="num">#${n}</b><input class="field-in" data-pn="${n}" maxlength="24" placeholder="${t('tmNamePh')}" value="${esc((d.players||{})[n]||'')}"></label>`).join('')||`<p class="note">${t('tmNoNums')}</p>`}</div>
      ${others.length?`<span class="lbl2">${t('tmSame')}</span><p class="note">${t('tmSameN')}</p><div class="tm-al">${others.map(o=>{const a=o.key.split('|')[2];
        return `<label class="check"><input type="checkbox" data-al="${esc(a)}" ${al.has(a)?'checked':''}>${esc(o.name)} <small>${t('scGamesN',o.games.length)}</small></label>`}).join('')}</div>`:''}
      <button class="primary" data-act="tesave">${t('tmSave')}</button><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='other'){
    h=`<h2>${t('otherT')}</h2><p>${t('offense')}: <b>${sideName(st.poss)}</b> · ${ord(st.down)} ${t('down')}</p>
      <div class="grid2"><button class="big" data-act="safety">${t('safety')}<small>${t('safetyS',sideName(other(st.poss)))}</small></button>
      <button class="big" data-act="badsnap">${t('badSnap')}<small>${t('badSnapS')}</small></button></div>
      <button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='addnum'){
    const v=sheet.v||'';
    h=`<h2>${t('newNumT')} · ${sideName(numSide(st))}</h2><div class="kp-out num">${v||'&nbsp;'}</div>
      <div class="keypad">${[1,2,3,4,5,6,7,8,9].map(k=>`<button class="big num" data-act="kp" data-k="${k}">${k}</button>`).join('')}
      <button class="big" data-act="kp" data-k="back" aria-label="Backspace">⌫</button><button class="big num" data-act="kp" data-k="0">0</button>
      <button class="big" data-act="kpok" style="background:var(--accent);color:var(--accent-ink);border-color:transparent">OK</button></div>
      <p>${draft?t('numAddDraft'):t('numAdd')}</p>
      <button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='addform'){
    const s=sheet.side||st.poss, have=g.formations[s];
    h=`<h2>${t('newFormT')} · ${sideName(s)}</h2>
      <div class="row">${FORM_SUGG.filter(f=>!have.includes(f)).map(f=>`<button class="f" data-act="formadd" data-f="${f}">${f}</button>`).join('')}</div>
      <label class="lbl2" for="form-name">${t('orType')}</label>
      <input class="field-in" id="form-name" maxlength="24" placeholder="${t('formPh')}" autocomplete="off">
      <button class="primary" data-act="formaddin">${t('add')}</button><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='opts'){
    const rb=(v,l,d)=>`<button class="big" data-act="role" data-r="${v}" aria-pressed="${role()===v}">${l}<small>${d}</small></button>`;
    const row=(act,icon,l,d)=>`<button class="optrow" data-act="${act}"><span class="oi" aria-hidden="true">${icon}</span><span><b>${l}</b><small>${d}</small></span><span aria-hidden="true">›</span></button>`;
    h=`<div class="help-head"><h2>${t('options')}</h2><button class="ghost" data-act="close" aria-label="${t('close')}" style="font-size:22px">✕</button></div>
      <span class="lbl2">${t('curGame')}</span>
      <div class="curgame"><b>${gTitle(g)}</b><small>${esc(g.comp)} · ${g.date}${g.store==='cloud'&&g.owner?' · '+t('byOwner',esc(personName(g.owner))):''}</small></div>
      ${g.store!=='demo'&&!readOnly()?`<span class="lbl2">${t('roleQ')}</span><div class="grid4" style="grid-template-columns:repeat(3,1fr)">${rb('H',sideName('H'),t('roleHs2',sideName('H')))}${rb('A',sideName('A'),t('roleHs2',sideName('A')))}${rb('both',t('roleB'),t('roleBs'))}</div>`:''}
      ${canChangeVis(g)?`<span class="lbl2">${t('visLbl')}</span><div class="grid2">
        <button class="big" data-act="setvis" data-v="team" aria-pressed="${g.visibility!=='private'}">${t('visTeam')}<small>${t('visTeamS')}</small></button>
        <button class="big" data-act="setvis" data-v="private" aria-pressed="${g.visibility==='private'}">🔒 ${t('visMe')}<small>${t('visMeS')}</small></button></div>`:''}
      <div class="optlist">
        ${row('home','⌂',t('home'),t('homeS'))}
        ${row('games','▦',t('gamesMenu'),t('gamesS'))}
        ${g.scout&&!readOnly()?row('quick','⚡',t('ngQuick'),g.quick?t('quickOn'):t('quickOff')):''}
        ${row('scout','◎',t('sc'),t('scS'))}
        ${isAdmin?row('members','👥',t('members'),t('membersS')):''}
        ${row('help','?',t('helpMenu'),t('helpS'))}
        <div class="optrow static"><span class="oi" aria-hidden="true">🌐</span><span><b>${t('language')}</b></span>
          <div class="lang" role="group" aria-label="Language"><button data-act="lang" data-l="pt" aria-pressed="${lang==='pt'}">PT</button><button data-act="lang" data-l="en" aria-pressed="${lang==='en'}">EN</button></div></div>
      </div>
      ${PREVIEW?`<p class="note">${t('previewNote')}</p>`:`<span class="lbl2">${t('account')}</span>
      <div class="acct"><span><b>${esc(personName(me))}</b> · ${esc(me||'')}${isAdmin?` · ${t('roleAdmin')}`:''}</span></div>
      <div class="row"><button class="btn" data-act="myname">${t('myName')}</button><button class="btn" data-act="setpw">${t('setPw')}</button><button class="btn" data-act="signout">${t('signOut')}</button></div>`}
      <p class="appver">Hammers Game Ops · ${t('version')} ${APP_VERSION}${PREVIEW?' · '+t('previewTag'):''}</p>`;
  }else if(sheet.kind==='games'){
    const tag=x=>x.store==='cloud'?`<span class="owner">${x.owner?t('byOwner',esc(personName(x.owner))):''}</span>${x.visibility==='private'?` <span class="sync local">🔒 ${t('visMe')}</span>`:''}`:x.store==='local'?`<span class="sync local">${t('localOnly')}</span>`:`<span class="sample">${t('sample')}</span>`;
    const cnt=x=>{const ev=x.id===g.id?g.events:(x.events||null);return ev?`${ev.filter(e=>e.t==='play').length} ${t('playsAbbr')}`:''};
    h=`<div class="help-head"><h2>${t('games')}</h2><button class="ghost" data-act="opts">‹ ${t('options')}</button></div>
      <div class="gl">${games.map(x=>`<button data-act="pickgame" data-id="${x.id}" aria-current="${x.id===g.id}"><span><b>${gTitle(x)}</b><br><small>${esc(x.comp)} · ${x.date}</small> ${tag(x)}</span><span class="num">${cnt(x)}</span></button>`).join('')}</div>
      ${cloud.db&&!cloud.ready?`<p>${t('loadingShared')}</p>`:''}
      <button class="primary" data-act="newgame">${t('newGame')}</button>
      ${g.store==='demo'||readOnly()||(g.store==='cloud'&&!isAdmin)?'':`<button class="ghost" data-act="delgame" style="color:var(--bad)">${sheet.delc?t('delGameC'):t('delGame')}</button>`}
      <button class="ghost" data-act="close">${t('close')}</button>`;
  }else if(sheet.kind==='members'){
    h=`<div class="help-head"><h2>${t('members')}</h2><button class="ghost" data-act="opts">‹ ${t('options')}</button></div><p>${t('membersLead')}</p>
      <div class="gl">${members.map(m=>`<div class="mrow"><span class="mname"><b>${esc(m.name||'—')}</b><span class="memail">${esc(m.id)}</span><small>${m.role==='admin'?t('roleAdmin'):t('roleMember')}</small></span>
        <span class="row">${m.id===me?'':`<button class="btn" data-act="macc" data-id="${esc(m.id)}">${t('createAcc')}</button>`}<button class="btn" data-act="medit" data-id="${esc(m.id)}">${t('edit')}</button>
        ${m.id===me?`<small>${t('you')}</small>`:`<button class="btn" data-act="mrole" data-id="${esc(m.id)}" data-r="${m.role==='admin'?'member':'admin'}">${m.role==='admin'?t('makeMember'):t('makeAdmin')}</button>
        <button class="btn" data-act="mdel" data-id="${esc(m.id)}" style="color:var(--bad)">${sheet.mdel===m.id?t('confirm'):t('remove')}</button>`}</span></div>`).join('')}</div>
      <span class="lbl2">${sheet.medit?t('editMember'):t('addMember')}</span>
      <label class="lbl2" for="m-name">${t('nameLbl')}</label>
      <input class="field-in" id="m-name" maxlength="40" placeholder="${t('namePh')}" autocomplete="off" value="${esc(sheet.medit?((members.find(x=>x.id===sheet.medit)||{}).name||''):'')}">
      <label class="lbl2" for="m-email">Email</label>
      <input class="field-in" id="m-email" type="email" placeholder="nome@email.com" autocomplete="off" value="${esc(sheet.medit||'')}" ${sheet.medit?'readonly':''}>
      ${sheet.medit?`<button class="primary" data-act="mrename">${t('saveName')}</button><button class="ghost" data-act="mcancel">${t('cancel')}</button>`
      :`<div class="grid2"><button class="big" data-act="madd" data-r="member">${t('roleMember')}<small>${t('memberS')}</small></button>
        <button class="big" data-act="madd" data-r="admin">${t('roleAdmin')}<small>${t('adminS')}</small></button></div>`}
      <button class="ghost" data-act="close">${t('close')}</button>`;
  }else if(sheet.kind==='creds'){
    h=sheet.exists?`<h2>${t('accExistsT')}</h2><p>${t('accExists',esc(sheet.email))}</p>
        <button class="primary" data-act="backmembers">${t('members')}</button>`
      :`<h2>${t('accCreated')}</h2><p>${t('accLead')}</p>
        <div class="creds"><span class="lbl2">Email</span><b>${esc(sheet.email)}</b><span class="lbl2">${t('tempPw')}</span><b class="num">${esc(sheet.pw)}</b></div>
        <textarea id="creds-txt" class="field-in" readonly style="min-height:110px;padding:10px">${esc(t('credsMsg',sheet.email,sheet.pw))}</textarea>
        <button class="primary" data-act="copycreds">${t('copyMsg')}</button>
        <p class="note">${t('accNote')}</p>
        <button class="ghost" data-act="backmembers">${t('members')}</button>`;
  }else if(sheet.kind==='myname'){
    h=`<h2>${t('myName')}</h2><p>${t('myNameLead')}</p>
      <input class="field-in" id="my-name" maxlength="40" value="${esc((members.find(x=>x.id===me)||{}).name||'')}" placeholder="${t('namePh')}" autocomplete="name">
      <button class="primary" data-act="namesave">${t('pwSave').split(' ')[0]}</button><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='pw'){
    h=`<h2>${t('setPw')}</h2><p>${t('pwLead')}</p>
      <input type="text" autocomplete="username" value="${esc(me||'')}" hidden>
      <label class="lbl2" for="pw1">${t('pwNew')}</label><input class="field-in" id="pw1" type="password" autocomplete="new-password">
      <label class="lbl2" for="pw2">${t('pwRepeat')}</label><input class="field-in" id="pw2" type="password" autocomplete="new-password">
      ${sheet.err?`<p class="err">${esc(sheet.err)}</p>`:''}
      <button class="primary" data-act="pwsave">${t('pwSave')}</button><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='role'){
    const rb=(v,l,d)=>`<button class="big" data-act="role" data-r="${v}">${l}<small>${d}</small></button>`;
    h=`<h2>${t('roleQ')}</h2><p>${t('roleNote')}</p>
      <div class="gl" style="gap:8px">${rb('H',sideName('H'),t('roleHs2',sideName('H')))}${rb('A',sideName('A'),t('roleHs2',sideName('A')))}${rb('both',t('roleB'),t('roleBs'))}</div>`;
  }else if(sheet.kind==='newgame'){
    const n=sheet.ng;
    const opt=(k,v,l)=>`<button class="big" data-act="ng" data-k="${k}" data-v="${v}" aria-pressed="${n[k]===v}">${l}</button>`;
    const g3='style="grid-template-columns:repeat(3,1fr)"';
    const x=n.kind==='x';
    h=`<h2>${t('newGameT')}</h2>
      <div class="grid2">${opt('kind','h',`${t('ngOurs')}<small>${t('ngOursS')}</small>`)}${opt('kind','x',`${t('ngOther')}<small>${t('ngOtherS')}</small>`)}</div>
      ${x?'':`<span class="lbl2">${t('team')}</span><div class="grid4" ${g3}>${TEAMS.map(x=>opt('team',x,x)).join('')}</div>`}
      <span class="lbl2">${t('competition')}</span><div class="grid4" ${g3}>${allComps().map(x=>opt('comp',x,esc(x))).join('')}<button class="big" data-act="ngcompnew" aria-pressed="${!!n.compNew}">+ ${t('compOther')}</button></div>
      ${n.compNew?`<input class="field-in" id="ng-comp" maxlength="40" value="${esc(n.compTxt||'')}" placeholder="${t('compPh')}" autocomplete="off">`:''}
      ${x?`<label class="lbl2" for="ng-home">${t('ngTeam1')}</label><input class="field-in" id="ng-home" value="${esc(n.home||'')}" placeholder="${t('teamName')}" autocomplete="off">`:''}
      <label class="lbl2" for="ng-opp">${x?t('ngTeam2'):t('opponent')}</label><input class="field-in" id="ng-opp" value="${esc(n.opp)}" placeholder="${t('teamName')}" autocomplete="off">
      <span class="lbl2">${t('starts')}</span><div class="grid2">${opt('start','H',x?esc(n.home||t('ngTeam1')):'Hammers')}${opt('start','A',x?esc(n.opp||t('ngTeam2')):t('opponent'))}</div>
      ${x?`<span class="lbl2">${t('ngQuick')}</span><div class="grid2">${opt('quick','1',`${t('ngQuickY')}<small>${t('ngQuickYS')}</small>`)}${opt('quick','0',`${t('ngQuickN')}<small>${t('ngQuickNS')}</small>`)}</div>`:''}
      ${cloud.db&&cloud.canWrite?`<span class="lbl2">${t('visLbl')}</span><div class="grid2">${opt('vis','team',`${t('visTeam')}<small>${t('visTeamS')}</small>`)}${opt('vis','private',`🔒 ${t('visMe')}<small>${t('visMeS')}</small>`)}</div>`:`<p>${t('willLocal')}</p>`}
      <button class="primary" data-act="ngcreate">${t('start')}</button><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='help'){
    cls='help';const H=helpData();
    h=`<div class="help-head"><h2>${H.title}</h2><div class="lang" role="group" aria-label="Language">
        <button data-act="lang" data-l="pt" aria-pressed="${lang==='pt'}">PT</button><button data-act="lang" data-l="en" aria-pressed="${lang==='en'}">EN</button></div><button class="ghost" data-act="close" aria-label="${t('close')}" style="font-size:22px;margin-left:auto">✕</button></div>
      <span class="lbl2">${H.quickT}</span>
      <div class="quick">${H.quick.map(([k,b,s])=>`<div class="qs"><span class="k">${k}</span><b>${b}</b><span>${s}</span></div>`).join('')}</div>
      <span class="lbl2">${H.full}</span>
      <div class="toc">${H.S.map(x=>`<button data-act="helpgo" data-sec="${x.id}">${x.t}</button>`).join('')}</div>
      ${H.S.map(x=>`<section class="hsec" id="help-${x.id}"><h3>${x.t}</h3>${x.b}</section>`).join('')}
      <button class="primary" data-act="close">${t('close')}</button>`;
  }else if(sheet.kind==='tkp'){
    const yd=!sheet.add, side=sheet.side;
    h=`<h2>${yd?(sheet.k==='yac'?t('tKpYac'):t('tKpYds')):`${t('newNumT')} · ${sideName(side)}`}</h2><div class="kp-out num">${(sheet.neg?'−':'')+(sheet.v||'')||'&nbsp;'}</div>
      <div class="keypad">${[1,2,3,4,5,6,7,8,9].map(k=>`<button class="big num" data-act="tk" data-k="${k}">${k}</button>`).join('')}
      ${yd?`<button class="big" data-act="tk" data-k="neg" aria-pressed="${!!sheet.neg}">±</button>`:'<span></span>'}<button class="big num" data-act="tk" data-k="0">0</button>
      <button class="big" data-act="tk" data-k="back" aria-label="Backspace">⌫</button></div>
      <button class="primary" data-act="tkok">OK</button><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='tspot'){
    const n=parseInt(sheet.v,10);
    h=`<h2>${t('tSpotT')}</h2><p>${t('tSpotNote')}</p>
      <div class="seg tspotseg"><button data-act="tspothalf" data-v="own" aria-pressed="${sheet.half==='own'}">${t('tOwnHalf')}</button><button data-act="tspothalf" data-v="opp" aria-pressed="${sheet.half==='opp'}">${t('tOppHalf')}</button></div>
      <div class="kp-out num">${isNaN(n)?'&nbsp;':(sheet.half==='own'?'▼':'▲')+n}</div>
      <div class="keypad">${[1,2,3,4,5,6,7,8,9].map(k=>`<button class="big num" data-act="tk" data-k="${k}">${k}</button>`).join('')}
      <span></span><button class="big num" data-act="tk" data-k="0">0</button><button class="big" data-act="tk" data-k="back" aria-label="Backspace">⌫</button></div>
      <button class="primary" data-act="tspotok">OK</button><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='tcall'){
    h=`<h2>${t('tNewCall')}</h2>
      <label class="lbl2" for="call-name">${t('tCall')}</label>
      <input class="field-in" id="call-name" maxlength="30" placeholder="${t('tCallPh')}" autocomplete="off">
      <button class="primary" data-act="tcalladd">${t('add')}</button><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='videos'){
    const vs=(g.videos&&g.videos.length)?g.videos:[{yt:null}], ro=readOnly();
    h=`<div class="help-head"><h2>${t('tVideos')}</h2><button class="ghost" data-act="close" aria-label="${t('close')}" style="font-size:22px">✕</button></div><p>${t('vLead')}</p>
      ${vs.map((v,i)=>`<div class="vrow${vid.slot===i?' cur':''}"><div class="vrh"><b>${partName(i)}</b><small>${[v.yt?'YouTube ✓':'',vid.files[i]?t('vLocal',esc(vid.files[i].name)):''].filter(Boolean).join(' · ')||t('vNoneS')}</small></div>
        ${ro?'':`<input class="field-in" id="vurl-${i}" placeholder="${t('vPaste')}" value="${v.yt?'https://youtu.be/'+v.yt:''}" autocomplete="off" inputmode="url">`}
        <div class="row">${ro?'':`<button class="btn" data-act="vsave" data-n="${i}">${t('vSaveLink')}</button>`}<button class="btn" data-act="vfile" data-n="${i}">${t('vFile')}</button>
          ${vs.length>1||v.yt||vid.files[i]?`<button class="btn" data-act="vuse" data-n="${i}">${t('vUse')}</button>`:''}
          ${!ro&&g.videos&&g.videos.length>1?`<button class="btn" data-act="vdel" data-n="${i}" style="color:var(--bad)">${sheet.vdel===i?t('confirm'):t('remove')}</button>`:''}</div></div>`).join('')}
      ${ro?'':`<button class="btn" data-act="vadd">${t('vAdd')}</button>`}
      <p class="note">${t('vNote')}</p>
      <button class="primary" data-act="close">${t('close')}</button>`;
  }else if(sheet.kind==='csv'){
    h=`<h2>CSV</h2><p>${t('selectCopy')}</p><textarea id="csv-out" class="field-in" style="min-height:240px;padding:10px;font-family:monospace;font-size:12px">${esc(sheet.text)}</textarea><button class="ghost" data-act="close">${t('close')}</button>`;
  }
  const fresh=!Lr.querySelector('.scrim')||Lr.querySelector('.scrim.leave');
  Lr.innerHTML=`<div class="scrim${fresh&&motionOK()?' enter':''}" data-act="scrim"><div class="sheet ${cls}" role="dialog" aria-modal="true">${h}</div></div>`;
  const f=Lr.querySelector('#form-name')||Lr.querySelector('#call-name');if(f)f.focus();
  const ta=Lr.querySelector('#csv-out');if(ta){ta.focus();ta.select()}
  if(sheet.kind==='help'&&sheet.sec)setTimeout(()=>goHelp(sheet.sec),30);
}
function goHelp(sec){
  const el=document.getElementById('help-'+sec);if(!el)return;
  el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash');
}
function toast(msg){
  let el=document.querySelector('.toast');if(!el){el=document.createElement('div');el.className='toast';el.setAttribute('role','status');document.body.appendChild(el)}
  el.textContent=msg;el.hidden=false;flash(el,'tin');clearTimeout(toastT);toastT=setTimeout(()=>{el.hidden=true},1600);
}
function numSide(st){const s=draft&&draft.kind==='conv'?draft.side:st.poss;return draft&&draft.step==='by'?other(s):s}
function csv(){
  replay();
  const lines=g.events.filter(e=>e.t==='play'||e.t==='conv').map(e=>[g.date,g.team,g.comp,g.opp,e._half,e._side==='H'?(g.scout?g.home:'Hammers'):g.opp,e.t==='conv'?'':e._down,
    e.t==='conv'?t('kind').conv+' '+e.pts:t('kind')[e.kind],e.t==='conv'?t('kind').conv:isGL(e.zone)?'GL':t('mapField'),e.zone?zoneName(e.zone):'',e.rec??'',e.res,e.dby??'',
    e.fd?1:0,e.form||'',e.qb2?1:0,e.pick6?1:0,e.ret??'',e.annul?1:0,e.yds??'',e.yac??'',e.qb??'',e.call||'',e.fby??'',e.pbu??'',e.vt!=null?fmtT(e.vt):'',e.rv?1:0,e.note||'',e.t==='conv'||e._dist==null?'':e._goal?'goal':e._dist,e.t==='conv'?'':spotTxt(e._spot)]
    .map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','));
  return [t('csvHead'),...lines].join('\n');
}

/* ---------- events ---------- */
document.addEventListener('click',ev=>{
  if(!authed)return;
  const b=ev.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act;
  if(a==='scrim'){if(ev.target===b)closeSheet();return}
  if(a!=='del'&&confirmDel)confirmDel=null;
  const st=replay();
  switch(a){
    case 'view':view=b.dataset.v;render();break;
    case 'home':sheet=null;document.getElementById('layer').innerHTML='';draft=null;runMode=false;view='home';render();break;
    case 'openg':{const v=b.dataset.v||'reg';view=v;if(b.dataset.id!==g.id)selectGame(b.dataset.id);else{render();if(g.store!=='demo'&&!getRole(g.id)&&!readOnly()&&v==='reg')openSheet('role')}break}
    case 'zone':tapZone(b.dataset.z);break;
    case 'num':tapNum(+b.dataset.n);break;
    case 'nonum':if(draft){if(draft.step==='by'){draft.by=null;finalize()}else{draft.rec=null;if(draft.res==='INT'){draft.step='by';render()}else finalize()}}break;
    case 'addnum':openSheet('addnum',{v:''});break;
    case 'kp':{let v=sheet.v||'';v=b.dataset.k==='back'?v.slice(0,-1):(v+b.dataset.k).slice(0,2);sheet.v=v;renderSheet();break}
    case 'kpok':{const n=parseInt(sheet.v,10);if(isNaN(n)){toast(t('typeNum'));break}
      const s=numSide(st);sheet=null;document.getElementById('layer').innerHTML='';
      if(!g.roster[s].includes(n))updGame({roster:{[s]:[...g.roster[s],n]}});
      if(draft)tapNum(n);else render();break}
    case 'form':{const s=st.poss,f=b.dataset.f;updGame({curForm:{[s]:g.curForm[s]===f?null:f}});break}
    case 'addform':openSheet('addform',{side:b.dataset.side||null});break;
    case 'formadd':case 'formaddin':{const s=sheet.side||st.poss;const name=(a==='formadd'?b.dataset.f:(document.getElementById('form-name').value||'').trim());
      if(!name){toast(t('typeForm'));break}
      const fl={[s]:g.formations[s].includes(name)?g.formations[s]:[...g.formations[s],name]};
      if(view==='tape'){updGame({formations:fl});closeSheet();tapeSet('form',name)}else{updGame({formations:fl,curForm:{[s]:name}});closeSheet()}break}
    case 'qb':qbNext=!qbNext;render();break;
    case 'fd':markFD();break;
    case 'res':tapRes(b.dataset.r);break;
    case 'sack':if(draft&&draft.kind==='sack'){draft=null;render()}else startSack();break;
    case 'glset':glOn=b.dataset.v==='1'?st.drive:null;if(draft&&draft.zone&&isGL(draft.zone)!==(glOn!=null))draft.zone=null;render();break;
    case 'convpts':{const cp=convPending();if(cp){draft={kind:'conv',side:cp.side,pts:+b.dataset.p,zone:null,res:'G'};render()}break}
    case 'convskip':{const cp=convPending();if(cp)act(grp=>chEv(cp.ev,{convSkip:true},grp));break}
    case 'convcancel':draft=null;render();break;
    case 'convret':{const e=lastEv();if(e&&e.t==='conv'){const v=+b.dataset.p;act(grp=>chEv(e,{ret:v},grp));if(v)toast(t('retTag',v))}break}
    case 'half':act(grp=>addEv({t:'half'},grp));closeSheet();toast(t('halfT'));break;
    case 'run':toggleRun();break;
    case 'pen':openSheet('pen',{ctx:'live'});break;
    case 'penteam':sheet.team=b.dataset.v||null;sheet.foul=null;renderSheet();break;
    case 'penfoul':{const k=b.dataset.k||null;sheet.foul=k;
      if(k){const P=penCtx(),f=k==='other'?null:foulOf(k),by=sheet.team===(f&&f.when==='pre'?P.offPre:P.offPlay)?'O':'D';sheet.annul=f?penDefaultAnnul(f,by,P.p):!!P.p;sheet.yds=0;sheet.eff='rep'}
      renderSheet();break}
    case 'penyds':sheet.yds=Math.max(0,Math.min(25,(sheet.yds||0)+(+b.dataset.d)));renderSheet();break;
    case 'peneff2':sheet.eff=b.dataset.e;renderSheet();break;
    case 'penapply':if(!readOnly())applyFoul(false);break;
    case 'pendec':if(!readOnly())applyFoul(true);break;
    case 'tpen':{const e=tapeCur().e;if(e&&!readOnly())openSheet('pen',{ctx:'tape',pid:e.id});break}
    case 'tpenrm':{const pe=g.events.find(x=>x.id===b.dataset.id);if(!pe||readOnly())break;
      act(grp=>{if(pe.annulId){const pl=g.events.find(x=>x.id===pe.annulId);if(pl)chEv(pl,{annul:false},grp)}rmEv(pe,grp)});toast(t('deleted'));break}
    case 'pick6':{const p=lastPlay();if(p&&p.res==='INT'){const y=b.dataset.v==='1';act(grp=>chEv(p,{pick6:y},grp));if(y){toast(t('pick6Done',sideName(other(p._side))));celebrate('PICK-6',other(p._side))}}break}
    case 'pat':{const p=lastPlay();if(p)act(grp=>chEv(p,{pat:+b.dataset.p},grp));break}
    case 'undo':undo();break;
    case 'down':openSheet('down');break;
    case 'poss':if(!readOnly()){act(grp=>addEv({t:'poss'},grp));toast(t('possChanged'))}break;
    case 'setdown':act(grp=>addEv({t:'down',down:+b.dataset.d},grp));closeSheet();break;
    case 'flipposs':act(grp=>addEv({t:'poss'},grp));closeSheet();break;
    case 'defover':override=st.drive;render();break;
    case 'close':closeSheet();break;
    case 'games':openSheet('games');break;
    case 'role':setRole(g.id,b.dataset.r);override=null;if(sheet&&sheet.kind==='opts')renderSheet();else closeSheet();render();toast(t('roleSet'));break;
    case 'pickgame':sheet=null;document.getElementById('layer').innerHTML='';if(view==='home')view='reg';selectGame(b.dataset.id);break;
    case 'delgame':if(!sheet.delc){sheet.delc=true;renderSheet();break}
      {const id=g.id;sheet=null;document.getElementById('layer').innerHTML='';S().remove(id);curId=null;selectGame(games.find(x=>x.id!==id).id)}break;
    case 'newgame':openSheet('newgame',{ng:{kind:'h',team:'Elite',comp:'LFFF1',opp:'',home:'',start:'H',vis:'team',quick:'1'}});break;
    case 'ng':case 'ngcompnew':{const o=document.getElementById('ng-opp'),hm=document.getElementById('ng-home'),cp=document.getElementById('ng-comp');
      if(o)sheet.ng.opp=o.value;if(hm)sheet.ng.home=hm.value;if(cp)sheet.ng.compTxt=cp.value;
      if(a==='ngcompnew'){sheet.ng.compNew=true;sheet.ng.comp='';renderSheet();const i=document.getElementById('ng-comp');if(i)i.focus();break}
      if(b.dataset.k==='comp')sheet.ng.compNew=false;sheet.ng[b.dataset.k]=b.dataset.v;renderSheet();break}
    case 'ngcreate':{const n=sheet.ng;n.opp=(document.getElementById('ng-opp').value||'').trim();
      if(n.compNew){const c=(document.getElementById('ng-comp').value||'').trim();if(!c){toast(t('compType'));break}n.comp=c}
      if(n.kind==='x'){n.home=(document.getElementById('ng-home').value||'').trim();if(!n.home||!n.opp){toast(t('ngNames'));break}n.scout=true;n.quick=n.quick!=='0';n.team=teamForComp(n.comp)}
      const target=(cloud.db&&cloud.canWrite)?cloudStore:local;
      const meta=newMeta(n);if(target===cloudStore){meta.owner=me;meta.visibility=n.vis||'team'}const id=target.create(meta);sheet=null;document.getElementById('layer').innerHTML='';view='reg';an.side='H';
      selectGame(id);toast(t('gameCreated'));break}
    case 'an':{const k=b.dataset.k;let v=b.dataset.v;if(k==='down'||k==='dist')v=+v;if(k==='form'&&v==='')v=null;an[k]=v;if(k==='side'){an.rec=null;an.form=null}render();break}
    case 'anannul':an.annul=b.checked;render();break;
    case 'anrec':{const r=b.dataset.r==='?'?null:+b.dataset.r;an.rec=an.rec===r?null:r;render();break}
    case 'andown':{const d=+b.dataset.d;an.down=an.down===d?0:d;render();break}
    case 'annul':{const e=g.events.find(x=>x.id===b.dataset.id);if(e&&!readOnly())act(grp=>chEv(e,{annul:!e.annul},grp));break}
    case 'del':{const id=b.dataset.id;if(readOnly())break;if(confirmDel!==id){confirmDel=id;render();break}
      const e=g.events.find(x=>x.id===id);confirmDel=null;
      if(e)act(grp=>{if(e.t==='pen'&&e.annulId){const p=g.events.find(x=>x.id===e.annulId);if(p)chEv(p,{annul:false},grp)}rmEv(e,grp)});
      toast(t('deleted'));break}
    case 'csv':{const text=csv();
      const fallback=()=>openSheet('csv',{text});
      try{navigator.clipboard.writeText(text).then(()=>toast(t('csvCopied')),fallback)}catch(e){fallback()}break}
    case 'lang':{lang=b.dataset.l;lsSet(LS_LANG,lang);render();if(sheet){if(sheet.kind==='help')sheet.sec=null;renderSheet()}break}
    case 'help':openSheet('help',{sec:b.dataset.sec||''});break;
    case 'members':openSheet('members');break;
    case 'quick':{const q=!g.quick;updGame({quick:q});setTimeout(renderSheet,50);toast(q?t('quickOn'):t('quickOff'));break}
    case 'other':if(!readOnly()){draft=null;runMode=false;openSheet('other')}break;
    case 'safety':case 'badsnap':{closeSheet();const sf=a==='safety';
      act(grp=>addEv({t:'play',kind:sf?'safety':'snap',zone:null,rec:null,res:sf?'SF':'BS',fd:false,form:g.curForm[st.poss]||null,qb2:false,annul:false},grp));
      toast(sf?`${t('safety')} · +2 ${sideName(other(st.poss))}`:`${t('badSnap')} · ${ord(st.down)} ${t('down')}`);if(sf)celebrate('SAFETY',other(st.poss),true);break}
    case 'scout':{sheet=null;document.getElementById('layer').innerHTML='';draft=null;runMode=false;
      if(b.dataset.key&&b.dataset.key!==sc.key){sc.key=b.dataset.key;sc.off={};scReset()}scFresh={};view='scout';render();scrollTo(0,0);break}
    case 'sc':{const k=b.dataset.k;let v=b.dataset.v;if(k==='down'||k==='dist'||k==='pos')v=+v;if(k==='rec')v=v===''?null:+v;if((k==='form'||k==='call')&&v==='')v=null;
      if(b.dataset.tog&&String(sc[k])===String(v))v=k==='form'||k==='rec'||k==='call'?null:0;
      sc[k]=v;if(k==='area'&&v==='conv'){sc.down=0;sc.dist=0;sc.pos=0;sc.form=null}render();break}
    case 'scm':sc.mode=b.dataset.v;render();break;
    case 'zvideo':{const gid=b.dataset.g, x=sheet&&sheet.vids&&sheet.vids[gid];if(!x)break;
      const lbl=(sheet.z==='all'?t('vAllT'):zoneName(sheet.z))+' · '+x.l, start=b.dataset.start||x.ids[0];
      sheet=null;document.getElementById('layer').innerHTML='';
      if(gid!==g.id)selectGame(gid);
      tp.only={ids:x.ids,l:lbl};tp.id=start;tp.seekId=start;tp.gl=null;tp.del=null;view='tape';render();scrollTo(0,0);break}
    case 'tonlyx':tp.only=null;render();break;
    case 'zdet':{const L=zoneSrc[b.dataset.z];if(L)openSheet('zone',{z:b.dataset.z.split('|')[1],L});break}
    case 'teamedit':openSheet('teamedit',{key:b.dataset.key});break;
    case 'tecol':sheet.col=b.dataset.c;renderSheet();break;
    case 'tesave':{const L=document.getElementById('layer'), key=sheet.key, d=teamDoc(key)||{}, players={};
      L.querySelectorAll('[data-pn]').forEach(i=>{const v=i.value.trim();if(v)players[i.dataset.pn]=v});
      const patch={players};const nm=L.querySelector('#te-name');if(nm&&nm.value.trim())patch.name=nm.value.trim();
      if(sheet.col!=null)patch.color=sheet.col;
      const al=L.querySelectorAll('[data-al]');if(al.length)patch.aliases=[...al].filter(i=>i.checked).map(i=>i.dataset.al);
      // a name removed from the list is dropped (the merge would keep it otherwise)
      Object.keys(d.players||{}).forEach(n=>{if(!(n in players))players[n]=''});
      saveTeam(key,patch);if(patch.aliases&&patch.aliases.length)sc.off={};closeSheet();toast(t('tmSaved'));render();break}
    case 'scclear':{const k=sc.key,o=sc.off;scReset();sc.key=k;sc.off=o;render();break}
    case 'scgame':sc.off[b.dataset.id]=!sc.off[b.dataset.id];render();break;
    case 'scprint':window.print();break;
    case 'opts':openSheet('opts');break;
    case 'medit':sheet.medit=b.dataset.id;renderSheet();break;
    case 'mcancel':sheet.medit=null;renderSheet();break;
    case 'mrename':{const nm=(document.getElementById('m-name').value||'').trim();if(!nm){toast(t('nameRequired'));break}
      const id=sheet.medit;(id===me?saveMyName(nm):fb.setDoc(fb.doc(fb.fs,'members/'+id),{name:nm},{merge:true}).then(()=>toast(t('nameSaved')),()=>toast(t('noWrite'))));sheet.medit=null;renderSheet();break}
    case 'madd':{const em=(document.getElementById('m-email').value||'').trim().toLowerCase();
      if(!(document.getElementById('m-name').value||'').trim()){toast(t('nameRequired'));break}
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){toast(t('badEmail'));break}
      addMember(em,b.dataset.r,(document.getElementById('m-name').value||'').trim()).then(()=>{toast(t('memberAdded',em));createAccount(em)});break}
    case 'macc':createAccount(b.dataset.id);break;
    case 'copycreds':{const txt=t('credsMsg',sheet.email,sheet.pw);try{navigator.clipboard.writeText(txt).then(()=>toast(t('copied')),()=>{const ta=document.getElementById('creds-txt');ta.focus();ta.select()})}catch(e){const ta=document.getElementById('creds-txt');ta.focus();ta.select()}break}
    case 'backmembers':openSheet('members');break;
    case 'mrole':addMember(b.dataset.id,b.dataset.r);break;
    case 'mdel':if(sheet.mdel!==b.dataset.id){sheet.mdel=b.dataset.id;renderSheet()}else{removeMember(b.dataset.id);sheet.mdel=null}break;
    case 'signout':signOutNow();break;
    case 'setpw':openSheet('pw');break;
    case 'setvis':if(canChangeVis(g)){updGame({visibility:b.dataset.v});toast(b.dataset.v==='private'?t('visNowMe'):t('visNowTeam'))}break;
    case 'myname':openSheet('myname');break;
    case 'namesave':{const v=(document.getElementById('my-name').value||'').trim();if(v)saveMyName(v);closeSheet();break}
    case 'pwsave':{const p1=document.getElementById('pw1').value||'',p2=document.getElementById('pw2').value||'';
      if(p1.length<8){sheet.err=t('pwShort');renderSheet();break}
      if(p1!==p2){sheet.err=t('pwMismatch');renderSheet();break}
      fb.updatePassword(fb.auth.currentUser,p1).then(()=>{closeSheet();toast(t('pwSaved'))})
        .catch(e=>{const c=e&&e.code||'';sheet.err=c==='auth/requires-recent-login'?t('pwRecent'):c==='auth/weak-password'?t('pwShort'):t('pwFail');renderSheet()});break}
    case 'helpgo':goHelp(b.dataset.sec);break;
    /* tape review */
    case 'tset':tapeSet(b.dataset.k,b.dataset.n!=null?+b.dataset.n:b.dataset.s);break;
    case 'tbool':{const e=tapeCur().e,k=b.dataset.k;if(e)tapeSet(k,!e[k]);break}
    case 'tnoconv':{const e=tapeCur().e;if(!e||e.t!=='conv'||readOnly())break;
      const i=g.events.indexOf(e), last=i===g.events.length-1, td=[...g.events.slice(0,i)].reverse().find(x=>x.t==='play');
      act(grp=>{rmEv(e,grp);if(td)chEv(td,{convSkip:true},grp);if(last)tp.id=tapeAppend(grp,vTime())});render();break}
    case 'tgl':tp.gl=b.dataset.v==='1';render();break;
    case 'tadj':{const e=tapeCur().e;if(e)tapeSet(b.dataset.k,(e[b.dataset.k]??0)+(+b.dataset.d));break}
    case 'tkp':openSheet('tkp',{k:b.dataset.k,v:'',neg:false});break;
    case 'taddnum':openSheet('tkp',{k:b.dataset.k,side:b.dataset.side,add:true,v:''});break;
    case 'tk':{const k=b.dataset.k;if(k==='neg')sheet.neg=!sheet.neg;else if(k==='back')sheet.v=sheet.v.slice(0,-1);else sheet.v=(sheet.v+k).slice(0,2);renderSheet();break}
    case 'tkok':{let n=parseInt(sheet.v,10);if(isNaN(n)){toast(t('typeNum'));break}if(sheet.neg)n=-n;
      const {k,side,add}=sheet;sheet=null;document.getElementById('layer').innerHTML='';
      if(add&&!g.roster[side].includes(n))updGame({roster:{[side]:[...g.roster[side],n]}});
      const e=tapeCur().e;if(e&&e[k]===n)render();else tapeSet(k,n);break}
    case 'tcall':openSheet('tcall');break;
    case 'tspot':{const e=tapeCur().e;if(!e||readOnly())break;const x=e._spot;openSheet('tspot',{half:x!=null&&x>MID?'opp':'own',v:''});break}
    case 'tspothalf':sheet.half=b.dataset.v;renderSheet();break;
    case 'tspotok':{const n=parseInt(sheet.v,10);if(isNaN(n)||n>MID){toast(t('typeNum'));break}const v=sheet.half==='own'?n:FIELD-n;sheet=null;document.getElementById('layer').innerHTML='';tapeSet('spot',v);break}
    case 'tspotadj':{const e=tapeCur().e;if(e)tapeSet('spot',Math.max(0,Math.min(FIELD,(e._spot??SPOT0)+(+b.dataset.d))));break}
    case 'tspotauto':tapeSet('spot',null);break;
    case 'tcalladd':{const nm=(document.getElementById('call-name').value||'').trim();if(!nm){toast(t('tTypeCall'));break}
      const pb=g.playbook||[];if(!pb.includes(nm))updGame({playbook:[...pb,nm]});closeSheet();tapeSet('call',nm);break}
    case 'tlist':tp.list=!tp.list;render();break;
    case 'tgo':tapeGo(b.dataset.id,true);break;
    case 'tnav':tapeNav(+b.dataset.d);break;
    case 'tnext':tapeNext();break;
    case 'tins':tapeInsert();break;
    case 'tdel':{const {L,i,e}=tapeCur();if(!e||readOnly())break;if(tp.del!==e.id){tp.del=e.id;render();break}
      const nx=L[i+1]||L[i-1];tp.del=null;tp.id=nx?nx.id:null;act(grp=>rmEv(e,grp));toast(t('deleted'));break}
    case 'tplay':{const p=vp();if(p)p.toggle();else toast(t('tNoVideo'));break}
    case 'tback':{const p=vp();if(p)p.seek(Math.max(0,p.time()-5));else toast(t('tNoVideo'));break}
    case 'trate':{vid.rate=vid.rate===1?.5:1;const p=vp();if(p)p.rate(vid.rate);render();break}
    case 'tjump':{const e=tapeCur().e;if(e&&e.vt!=null){if(!vp()&&!vSrc()){toast(t('tNoVideo'));break}seekPlay(e)}break}
    case 'tmark':{const e=tapeCur().e,now=vTime();if(!e||readOnly())break;if(now==null){toast(t('tNoVideo'));break}
      act(grp=>chEv(e,{vt:now,vi:vid.slot},grp));toast(`${t('tMarked')} · ${fmtT(now)}`);break}
    case 'videos':openSheet('videos');break;
    case 'vpop':openVideoWindow();break;
    case 'vback':bringVideoBack();break;
    case 'vuse':{const n=+b.dataset.n;if(n!==vid.slot){vid.slot=n;mountPlayer()}if(sheet&&sheet.kind==='videos')closeSheet();else render();break}
    case 'vfile':pickFile(b.dataset.n!=null?+b.dataset.n:vid.slot);break;
    case 'vsave':{const n=+b.dataset.n,inp=document.getElementById('vurl-'+n),raw=(inp&&inp.value||'').trim(),id=ytId(raw);
      if(raw&&!id){toast(t('vBadLink'));break}
      const arr=clone(g.videos||[]);while(arr.length<=n)arr.push({yt:null});arr[n]={...arr[n],yt:id||null};
      updGame({videos:arr});vid.slot=n;toast(t('vSaved'));renderSheet();break}
    case 'vadd':{const arr=clone(g.videos||[]);if(!arr.length)arr.push({yt:null});arr.push({yt:null});updGame({videos:arr});renderSheet();break}
    case 'vdel':{const n=+b.dataset.n;if(sheet.vdel!==n){sheet.vdel=n;renderSheet();break}
      const arr=clone(g.videos||[]);arr.splice(n,1);const f={};Object.keys(vid.files).forEach(k=>{k=+k;if(k<n)f[k]=vid.files[k];else if(k>n)f[k-1]=vid.files[k]});
      vid.files=f;if(vid.slot>=n&&vid.slot>0)vid.slot--;sheet.vdel=null;updGame({videos:arr});renderSheet();break}
  }
});
document.addEventListener('change',ev=>{
  if(authed&&ev.target&&ev.target.id==='sc-plan'){const k=ev.target.dataset.key,v=ev.target.value.trim(),d=teamDoc(k)||{};if(v!==(d.plan||'')){saveTeam(k,{plan:v});toast(t('planSaved'))}return}
  if(authed&&ev.target&&ev.target.id==='sc-team'){sc.key=ev.target.value;sc.off={};scReset();render();return}
  if(authed&&ev.target&&ev.target.id==='pen-annul'&&sheet&&sheet.kind==='pen'){sheet.annul=ev.target.checked;renderSheet();return}
  if(!authed||!ev.target||ev.target.id!=='t-note')return;
  const e=tapeCur().e,v=ev.target.value.trim();
  if(e&&!readOnly()&&v!==(e.note||''))act(grp=>chEv(e,{note:v},grp));
});
document.addEventListener('keydown',e=>{
  if(!authed&&e.key==='Enter'&&e.target&&(e.target.id==='lg-pw'||e.target.id==='lg-email')){e.preventDefault();if(e.target.id==='lg-email'){const p=document.getElementById('lg-pw');if(p)p.focus()}else{const b=document.querySelector('[data-act="lgpw"]');if(b)b.click()}return}
  if(e.key==='Escape'&&sheet)closeSheet();
  if(e.key==='Enter'&&sheet&&sheet.kind==='tcall'){e.preventDefault();document.querySelector('[data-act="tcalladd"]').click();return}
  if(e.key==='Enter'&&e.target&&e.target.id==='t-note'){e.preventDefault();e.target.blur();return}
  const tag=e.target&&e.target.tagName;
  if(authed&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&tag!=='INPUT'&&tag!=='TEXTAREA'&&tag!=='VIDEO'&&tapeKey(e.key))e.preventDefault();
  if(e.key==='Enter'&&sheet&&sheet.kind==='addform'){e.preventDefault();document.querySelector('[data-act="formaddin"]').click()}
});

/* ---------- boot: Firebase login, members, shared games ---------- */
let authed=false, me=null, isAdmin=false, members=[], loginState={step:'email',email:lsGet('hgo.loginEmail')||'',msg:''};
let fb=null;
const SPLASH=`<div class="splash" role="status" aria-label="${t('loading')}"><img src="icons/logo.png" alt="" width="96" height="92"><div class="sbar"><i></i></div></div>`;
function splashView(){const app=document.getElementById('app');if(!app.querySelector('.splash'))app.innerHTML=SPLASH;prevRender=null}
function loginView(){
  if(loginState.step==='loading')return splashView();
  setTimeout(()=>{loginAnimated=true},50);
  const L=loginState;
  const body=L.step==='setup'?`<p>${t('setupMissing')}</p>`
    :L.step==='loading'?`<p>${t('loggingIn')}</p>`
    :L.step==='denied'?`<p>${t('noAccess',esc(L.email))}</p><button class="primary" data-act="lgout">${t('signOut')}</button>`
    :`<p>${t('loginLead')}</p>
      <label class="lbl2" for="lg-email">Email</label>
      <input class="field-in" id="lg-email" type="email" autocomplete="username" value="${esc(L.email)}" placeholder="nome@email.com">
      <label class="lbl2" for="lg-pw">${t('pwOptional')}</label>
      <input class="field-in" id="lg-pw" type="password" autocomplete="current-password" placeholder="••••••••">
      <button class="primary" data-act="lgpw">${t('signInPw')}</button>
      <p class="note">${t('pwHint')}</p>`;
  document.getElementById('app').innerHTML=`<div class="login">
    <div class="lang" role="group" aria-label="Language" style="align-self:flex-end">
      <button data-act="lang" data-l="pt" aria-pressed="${lang==='pt'}">PT</button><button data-act="lang" data-l="en" aria-pressed="${lang==='en'}">EN</button></div>
    <div class="sheet login-card"><div class="login-head${loginAnimated?'':' anim'}"><img src="icons/logo.png" alt="Hammers" width="88" height="85"><h2>Hammers Game Ops</h2></div>${body}${L.msg?`<p class="err">${esc(L.msg)}</p>`:''}</div><p class="appver">${t('version')} ${APP_VERSION}${PREVIEW?' · '+t('previewTag'):''}</p></div>`;
}
const continueUrl=()=>location.origin+location.pathname;
async function onUser(u){
  if(!u){authed=false;me=null;if(loginState.step==='loading')loginState.step='email';return loginView()}
  me=(u.email||'').toLowerCase();
  let m=null;
  try{const snap=await fb.getDoc(fb.doc(fb.fs,'members/'+me));m=snap.exists()?snap.data():null}catch(e){m=null}
  if(!m){loginState={step:'denied',email:me,msg:''};return loginView()}
  isAdmin=m.role==='admin';authed=true;
  cloud.db=fb.shim;cloud.canWrite=true;
  let first=true;
  const parts={};
  const onPart=k=>s=>{parts[k]={};s.docs.forEach(d=>{parts[k][d.id]=d.data()});cloud.remoteGames=Object.assign({},...Object.values(parts));
    if(first){first=false;cloud.ready=true}
    if(isAdmin&&k==='all')backfill(parts.all);
    refresh()};
  const onErr=()=>{cloud.ready=true;refresh()};
  if(isAdmin)fb.shim.collection('games').onSnapshot(onPart('all'),onErr);
  else{fb.shim.collection('games').where('visibility','==','team').onSnapshot(onPart('team'),onErr);
    fb.shim.collection('games').where('owner','==',me).onSnapshot(onPart('own'),onErr)}
  fb.shim.collection('teams').onSnapshot(s=>{const m={};s.docs.forEach(d=>{m[d.id]=d.data()});cloud.remoteTeams=m;refresh()},()=>{});
  fb.shim.collection('members').onSnapshot(s=>{members=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>a.id<b.id?-1:1);if(sheet&&(sheet.kind==='members'||sheet.kind==='games'))renderSheet();refresh()},()=>{});
  setTimeout(()=>{if(!cloud.ready){cloud.ready=true;refresh()}},8000);
  refresh();flush();
}
document.addEventListener('click',async ev=>{
  const b=ev.target.closest('[data-act]');if(!b||authed)return;
  const a=b.dataset.act;
  if(a==='lang'){lang=b.dataset.l;lsSet(LS_LANG,lang);loginView();return}
  if(a==='lgpw'){
    const email=(document.getElementById('lg-email').value||'').trim().toLowerCase(), pw=document.getElementById('lg-pw').value||'';
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){loginState={...loginState,email,msg:t('badEmail')};return loginView()}
    if(!pw){loginState={...loginState,email,msg:t('pwEmpty')};return loginView()}
    loginState={step:'loading',email,msg:''};loginView();
    try{if(!(await fb.getDoc(fb.doc(fb.fs,'members/'+email))).exists()){loginState={step:'email',email,msg:t('notMember',email)};return loginView()}}
    catch(e){loginState={step:'email',email,msg:t('sendFail')};return loginView()}
    try{await fb.signInWithEmailAndPassword(fb.auth,email,pw);lsSet('hgo.loginEmail',email)}
    catch(e){const c=e&&e.code||'';loginState={step:'email',email,msg:c==='auth/too-many-requests'?t('pwTooMany'):t('pwWrong')};loginView()}
    return;
  }
  if(a==='lgout'){await fb.signOut(fb.auth);loginState={step:'email',email:'',msg:''};loginView()}
});
async function addMember(email,roleName,name){
  const prev=members.find(x=>x.id===email);
  const body=prev?{role:roleName}:{role:roleName,added:Date.now(),addedBy:me,...(name?{name}:{})};
  try{await fb.setDoc(fb.doc(fb.fs,'members/'+email),body,{merge:true})}catch(e){toast(t('noWrite'))}
}
async function saveMyName(name){try{await fb.setDoc(fb.doc(fb.fs,'members/'+me),{name},{merge:true});toast(t('nameSaved'))}catch(e){toast(t('noWrite'))}}
/* older games had no owner/visibility: an admin fills them in once */
function backfill(all){for(const id in all){const d=all[id];if(!d.owner||!d.visibility)cloudStore.updGame(id,{...(d.owner?{}:{owner:me}),...(d.visibility?{}:{visibility:'team'})})}}
/* admins create a member's sign-in account with a temporary password (no email sent: the free plan only allows 5 emails a day).
   A second, in-memory Firebase app is used so the admin stays signed in. */
function tempPassword(){const w=['Hammers','Flag','Field','Endzone','Huddle','Blitz'];const n=crypto.getRandomValues(new Uint32Array(2));
  return w[n[0]%w.length]+'-'+String(1000+n[1]%9000)+'!'}
async function createAccount(email){
  const pw=tempPassword();
  try{
    const app2=fb.A.getApps().find(a=>a.name==='creator')||fb.A.initializeApp(fb.cfg,'creator');
    const auth2=fb.U.initializeAuth?(()=>{try{return fb.U.initializeAuth(app2,{persistence:fb.U.inMemoryPersistence})}catch(e){return fb.U.getAuth(app2)}})():fb.U.getAuth(app2);
    await fb.U.createUserWithEmailAndPassword(auth2,email,pw);
    try{await fb.U.signOut(auth2)}catch(e){}
    openSheet('creds',{email,pw});
  }catch(e){const c=e&&e.code||'';
    if(c==='auth/email-already-in-use')openSheet('creds',{email,exists:true});
    else toast(t('accFail')+(c?` (${c})`:''));
  }
}
async function removeMember(email){try{await fb.deleteDoc(fb.doc(fb.fs,'members/'+email))}catch(e){toast(t('noWrite'))}}
function personName(email){if(!email)return '';const m=members.find(x=>x.id===email);return (m&&m.name)||email.split('@')[0]}
const canChangeVis=x=>x.store==='cloud'&&(isAdmin||x.owner===me);
async function signOutNow(){try{await fb.signOut(fb.auth)}catch(e){}location.reload()}

(async()=>{
  if(PREVIEW){document.body.classList.add('preview');authed=true;me='';isAdmin=false;cloud.ready=true;refresh();return}
  const cfg=window.HGO_FIREBASE||{};
  if(!cfg.apiKey||/COLOCAR|PASTE/i.test(cfg.apiKey)){loginState={step:'setup',email:'',msg:''};return loginView()}
  loginState.step='loading';loginView();
  try{
    const V='10.12.2', base=`https://www.gstatic.com/firebasejs/${V}/`;
    const [A,U,F]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
    const app=A.initializeApp(cfg);
    const auth=U.getAuth(app);
    let fs;try{fs=F.initializeFirestore(app,{localCache:F.persistentLocalCache({tabManager:F.persistentMultipleTabManager()})})}catch(e){fs=F.getFirestore(app)}
    const shim={
      doc:p=>{const d=F.doc(fs,p);return {set:b=>F.setDoc(d,b),update:b=>F.setDoc(d,b,{merge:true}),delete:()=>F.deleteDoc(d)}},
      collection:p=>{const cons=[];const q=()=>cons.length?F.query(F.collection(fs,p),...cons):F.collection(fs,p), wrap=s=>({docs:s.docs.map(d=>({id:d.id,data:()=>d.data()}))});
        const api={where(f,op,v){cons.push(F.where(f,op,v));return api},orderBy(f,dir){cons.push(F.orderBy(f,dir||'asc'));return api},limit(n){cons.push(F.limit(n));return api},
        onSnapshot(next,err){return F.onSnapshot(q(),s=>next(wrap(s)),err)},
        get(){return F.getDocs(q()).then(wrap)}};return api}
    };
    fb={auth,fs,shim,doc:F.doc,getDoc:F.getDoc,setDoc:F.setDoc,deleteDoc:F.deleteDoc,
      sendSignInLinkToEmail:U.sendSignInLinkToEmail,isSignInWithEmailLink:U.isSignInWithEmailLink,signInWithEmailLink:U.signInWithEmailLink,signOut:U.signOut,signInWithEmailAndPassword:U.signInWithEmailAndPassword,updatePassword:U.updatePassword,A,U,cfg};
    U.onAuthStateChanged(auth,u=>{onUser(u)});
  }catch(e){loginState={step:'email',email:'',msg:t('offlineStart')};loginView()}
})();
/* updates: check for a new version when the app opens or comes back to the front, and reload as soon as nothing is in progress */
function reloadIfIdle(){if(pendingReload&&!draft&&!sheet)location.reload()}
if('serviceWorker' in navigator&&!PREVIEW){
  const hadController=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController&&!pendingReload){pendingReload=true;reloadIfIdle()}});
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{
    const check=()=>reg.update().catch(()=>{});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()});
    setInterval(check,30*60*1000);
  }).catch(()=>{}));
}
})();
