(function(){
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
  newForm:'+ nova', fd:'1º Down', td:'TD', int:'INT', penalty:'Falta', run:'Corrida', game:'Jogo ▾',
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
  csvHead:'data,equipa,competicao,adversario,parte,lado,down,tipo,mapa,zona,recetor,resultado,defensor,primeiro_down,formacao,dois_qb,pick6,retorno_conv,anulada',
  typeNum:'Escreve um número', typeForm:'Escreve o nome da formação', deleted:'Apagada', possChanged:'Posse mudada',
  gameCreated:'Jogo criado', csvCopied:'CSV copiado', selectCopy:'Seleciona e copia.', kind:{pass:'passe',run:'corrida',sack:'sack',conv:'conversão'},
  loginLead:'Escreve o teu email. Recebes um link para entrar, sem password.', sendLink:'Enviar link', linkSent:e=>`Enviámos um link para <b>${e}</b>. Abre o email neste aparelho e toca no link. Se não aparecer, vê a pasta de spam.`,
  pasteLabel:'Se usas a app instalada no iPhone, copia o link do email e cola-o aqui', signIn:'Entrar', otherEmail:'Usar outro email',
  confirmEmail:'Para terminar, confirma o email para onde foi enviado o link.', noAccess:e=>`<b>${e}</b> ainda não tem acesso. Pede a um admin da Game Ops para te acrescentar.`,
  signOut:'Sair', setupMissing:'Falta configurar o Firebase (ficheiro firebase-config.js).', loggingIn:'A entrar...', linkInvalid:'O link não é válido ou já expirou. Pede um novo.',
  badEmail:'Escreve um email válido.', sendFail:'Não foi possível enviar o link. Tenta outra vez.', offlineStart:'Sem rede. Liga-te à internet para entrar pela primeira vez.',
  signedAs:'Sessão:', members:'Membros', membersLead:'Só estes emails conseguem entrar na app. Membros criam e editam jogos. Admins também apagam jogos e gerem esta lista.',
  addMember:'Acrescentar email', roleMember:'Membro', roleAdmin:'Admin', memberS:'cria e edita jogos', adminS:'também gere membros',
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
  willShare:'O jogo fica partilhado com a equipa e aparece em todos os aparelhos.', willLocal:'O jogo fica guardado só neste aparelho.'
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
  newForm:'+ new', fd:'1st Down', td:'TD', int:'INT', penalty:'Penalty', run:'Run', game:'Game ▾',
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
  csvHead:'date,team,competition,opponent,half,side,down,type,map,zone,receiver,result,defender,first_down,formation,double_qb,pick6,conv_return,nullified',
  typeNum:'Type a number', typeForm:'Type the formation name', deleted:'Deleted', possChanged:'Possession changed',
  gameCreated:'Game created', csvCopied:'CSV copied', selectCopy:'Select and copy.', kind:{pass:'pass',run:'run',sack:'sack',conv:'conversion'},
  loginLead:'Type your email. You will get a link to sign in, no password.', sendLink:'Send link', linkSent:e=>`We sent a link to <b>${e}</b>. Open the email on this device and tap the link. If you can't find it, check spam.`,
  pasteLabel:'If you use the installed app on iPhone, copy the link from the email and paste it here', signIn:'Sign in', otherEmail:'Use another email',
  confirmEmail:'To finish, confirm the email the link was sent to.', noAccess:e=>`<b>${e}</b> has no access yet. Ask a Game Ops admin to add you.`,
  signOut:'Sign out', setupMissing:'Firebase is not configured yet (firebase-config.js file).', loggingIn:'Signing in...', linkInvalid:'The link is not valid or has expired. Ask for a new one.',
  badEmail:'Type a valid email.', sendFail:'Could not send the link. Try again.', offlineStart:'No network. Connect to the internet to sign in for the first time.',
  signedAs:'Signed in:', members:'Members', membersLead:'Only these emails can sign in. Members create and edit games. Admins also delete games and manage this list.',
  addMember:'Add email', roleMember:'Member', roleAdmin:'Admin', memberS:'creates and edits games', adminS:'also manages members',
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
  willShare:'The game is shared with the team and shows on every device.', willLocal:'The game is saved on this device only.'
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
      <li>Toca em ${btn('',t('game'))} e depois em <b>+ Novo jogo</b>.</li>
      <li>Escolhe a equipa (Elite, Academy, Girls), a competição (LFFF1, LFFF2, LFFFW) e escreve o adversário.</li>
      <li>Escolhe quem começa a atacar.</li>
      <li>Escolhe <b>que equipa segues</b>: Hammers, Adversário ou as duas (se estiveres sozinho).</li></ol>
      <p>O jogo "Demo FC" é só um exemplo para veres como fica. Podes trocar de jogo a qualquer momento em ${btn('',t('game'))}.</p>`},
    {id:'track',t:'Registar uma jogada',b:`<ol>
      <li>Toca na <b>zona</b> para onde a bola foi lançada.</li>
      <li>Escolhe o <b>resultado</b> na linha que aparece: ${btn('','Completo')} (já vem marcado), ${btn('','Incompleto')}, ${btn('td','TD')} ou ${btn('int','INT')}.</li>
      <li>Toca no <b>número</b> do recetor. A jogada fica gravada.</li></ol>
      <dl class="hl">
      <dt>${btn('int','INT')}</dt><dd>Depois do número do recetor, a app pede o número de <b>quem intercetou</b>. A posse muda e a barra pergunta se foi <b>pick-6</b>.</dd>
      <dt>${btn('','?')}</dt><dd>Grava sem número, quando não deu para ver quem foi.</dd>
      <dt>${btn('','+')}</dt><dd>Acrescenta um número novo ao plantel deste jogo.</dd></dl>
      <p>Antes do número podes mudar de ideias: toca noutra zona ou noutro resultado. Tocar outra vez na mesma zona apaga a marca.</p>`},
    {id:'zones',t:'O campo',b:`<p>O ataque vai sempre para cima. São 12 zonas: 3 colunas e 4 faixas a partir da linha de scrimmage.</p>
      <ul><li><b>Fundo</b>: mais de 15 jardas</li><li><b>Médio</b>: 5 a 15 jardas</li><li><b>Curto</b>: 0 a 5 jardas</li><li><b>Atrás da linha</b>: passes atrás da linha de scrimmage (screens, laterais), completos ou incompletos</li></ul>
      <p>Cada zona mostra as jogadas anteriores de quem está a atacar: C1 = completo no 1º down, x3 = incompleto no 3º down.</p>`},
    {id:'gl',t:'Goal line e conversões',b:`<p>Perto da end zone, toca em ${btn('','GL')} por cima do campo para usar o mapa de goal line: <b>EZ fundo</b> e <b>EZ frente</b> (a end zone em 2 faixas), <b>0-5</b> e <b>5-10 jardas</b>, sempre em 3 colunas. O GL desliga-se sozinho quando muda a posse.</p>
      <p>Depois de um TD aparece a barra <b>Conversão</b>:</p>
      <ol><li>Escolhe <b>1 pt</b> ou <b>2 pts</b>. Abre o mapa GL.</li>
      <li>Toca na zona e escolhe ${btn('','Good')}, ${btn('','No Good')} ou ${btn('int','INT')}. Um passe incompleto é No Good.</li>
      <li>Toca no número do recetor. Se for INT, toca também em quem intercetou e diz se a defesa a devolveu. O retorno vale o mesmo que a tentativa: <b>+1</b> numa de 1 pt, <b>+2</b> numa de 2 pts.</li></ol>
      <p>Se não houve tentativa, toca em <b>Sem conversão</b>. Na Análise, escolhe <b>Campo</b>, <b>GL</b> ou <b>Conversões</b>.</p>`},
    {id:'buttons',t:'Botões',b:`<dl class="hl">
      <dt>${btn('',t('fd'))}</dt><dd>Passaram o meio-campo ou ganharam novo 1º down. O down volta a 1.</dd>
      <dt>${btn('pen',t('penalty'))}</dt><dd>Abre 4 opções: repetir down, 1º down automático, perde o down ou recusada. Por defeito anula a última jogada.</dd>
      <dt>${btn('',t('run'))}</dt><dd>A jogada é uma corrida. Toca na zona, escolhe Corrida ou TD e toca no número de quem correu.</dd>
      <dt>${btn('int',t('sack'))}</dt><dd>Sack. Toca no número de quem fez o sack. O down avança.</dd>
      <dt>${btn('','GL')}</dt><dd>Troca o campo pelo mapa de goal line.</dd>
      <dt>${btn('','Double')}</dt><dd>Formação. Fica selecionada até mudares. Toca outra vez para tirar.</dd>
      <dt>${btn('','2 QB')}</dt><dd>Marca a próxima jogada como Double QB.</dd>
      <dt>${btn('','↶ '+t('undo'))}</dt><dd>Apaga o último toque ou a última jogada.</dd></dl>`},
    {id:'downs',t:'Down e posse automáticos',b:`<ul>
      <li>Cada jogada avança 1 down.</li>
      <li>${btn('',t('fd'))} volta ao 1º down.</li>
      <li>TD, INT ou falhar o 4º down mudam a posse e voltam ao 1º down.</li>
      <li>Se a app se enganar, toca no <b>down</b> no topo para o corrigir ou para mudar a posse. Também podes tocar na caixa <b>ataca</b>.</li>
      <li>No <b>intervalo</b>, toca no down e depois em <b>Intervalo</b>: a 2ª parte começa no 1º down, a atacar quem não começou o jogo.</li></ul>`},
    {id:'analysis',t:'Análise',b:`<ul>
      <li><b>Filtros</b>: Hammers ou adversário, passes ou corridas, down, formação e se as jogadas anuladas contam.</li>
      <li><b>Marcas</b>: o mapa do caderno, com cada jogada na sua zona.</li>
      <li><b>Heatmap</b>: quanto mais amarelo, mais bolas foram para essa zona. Mostra o número de bolas e a % de completos.</li>
      <li><b>Alvos por jogador</b>: alvos, completos, %, TD, INT e corridas. Toca num jogador para ver só as bolas dele no mapa.</li>
      <li><b>Por down</b>: zona, alvo e formação mais usados em cada down. Toca num down para filtrar.</li></ul>`},
    {id:'plays',t:'Lista de jogadas',b:`<ul>
      <li>Todas as jogadas do jogo, a mais recente primeiro.</li>
      <li><b>Anular</b> tira a jogada das stats mas guarda-a. <b>Apagar</b> remove-a (pede confirmação).</li>
      <li><b>Copiar CSV</b> copia tudo para colar numa folha de Excel ou Google Sheets.</li></ul>`},
    {id:'team',t:'Duas pessoas no mesmo jogo',b:`<ol>
      <li>Uma pessoa cria o jogo. Ele aparece logo em ${btn('',t('game'))} para toda a equipa.</li>
      <li>A outra pessoa abre o mesmo link e escolhe esse jogo na lista.</li>
      <li>Cada uma escolhe a equipa que segue: <b>Hammers</b> ou <b>Adversário</b>.</li>
      <li>Quando a tua equipa ataca, registas normalmente. Quando a outra ataca, o ecrã fica em espera e mostra as jogadas da outra pessoa ao vivo.</li></ol>
      <p>O down, a posse e o resultado são os mesmos nos dois aparelhos. Se a outra pessoa ficar sem bateria, toca em <b>Registar eu esta posse</b>. Para mudar de equipa, toca no nome do jogo no topo.</p>`},
    {id:'data',t:'Onde ficam os dados',b:`<p>Os jogos com a etiqueta <b>Partilhado</b> ficam guardados online e aparecem em qualquer aparelho, também para a tape review depois do torneio. Só os emails da lista de <b>Membros</b> conseguem entrar. Os admins gerem a lista em ${btn('',t('game'))} → <b>Membros</b>.</p>
      <p>Sem rede, a app continua a funcionar: guarda as jogadas e envia-as quando a rede voltar. No topo aparece <b>A enviar</b> enquanto houver jogadas por enviar.</p>
      <p>Usa o botão <b>PT / EN</b> no topo para mudar a língua. Os dados não mudam.</p>`}
  ]:[
    {id:'start',t:'Before the game',b:`<ol>
      <li>Tap ${btn('',t('game'))} and then <b>+ New game</b>.</li>
      <li>Pick the team (Elite, Academy, Girls), the competition (LFFF1, LFFF2, LFFFW) and type the opponent.</li>
      <li>Pick who starts on offense.</li>
      <li>Pick <b>which team you follow</b>: Hammers, Opponent or both (if you are alone).</li></ol>
      <p>The "Demo FC" game is just a sample so you can see how it looks. Switch games at any time with ${btn('',t('game'))}.</p>`},
    {id:'track',t:'Track a play',b:`<ol>
      <li>Tap the <b>zone</b> the ball was thrown to.</li>
      <li>Pick the <b>result</b> on the row that appears: ${btn('','Complete')} (already selected), ${btn('','Incomplete')}, ${btn('td','TD')} or ${btn('int','INT')}.</li>
      <li>Tap the receiver's <b>number</b>. The play is saved.</li></ol>
      <dl class="hl">
      <dt>${btn('int','INT')}</dt><dd>After the receiver's number, the app asks for the number of <b>who intercepted</b>. Possession changes and the bar asks whether it was a <b>pick-6</b>.</dd>
      <dt>${btn('','?')}</dt><dd>Saves without a number, when you couldn't see who it was.</dd>
      <dt>${btn('','+')}</dt><dd>Adds a new number to this game's roster.</dd></dl>
      <p>Before the number you can change your mind: tap another zone or another result. Tapping the same zone again clears the mark.</p>`},
    {id:'zones',t:'The field',b:`<p>Offense always goes up. There are 12 zones: 3 columns and 4 bands from the line of scrimmage.</p>
      <ul><li><b>Deep</b>: more than 15 yards</li><li><b>Mid</b>: 5 to 15 yards</li><li><b>Short</b>: 0 to 5 yards</li><li><b>Behind the line</b>: passes behind the line of scrimmage (screens, laterals), complete or incomplete</li></ul>
      <p>Each zone shows earlier plays by the team on offense: C1 = complete on 1st down, x3 = incomplete on 3rd down.</p>`},
    {id:'gl',t:'Goal line and conversions',b:`<p>Near the end zone, tap ${btn('','GL')} above the field to use the goal line map: <b>EZ back</b> and <b>EZ front</b> (the end zone in 2 bands), <b>0-5</b> and <b>5-10 yards</b>, always in 3 columns. GL turns off by itself when possession changes.</p>
      <p>After a TD the <b>Conversion</b> bar appears:</p>
      <ol><li>Pick <b>1 pt</b> or <b>2 pts</b>. The GL map opens.</li>
      <li>Tap the zone and pick ${btn('','Good')}, ${btn('','No Good')} or ${btn('int','INT')}. An incomplete pass is No Good.</li>
      <li>Tap the receiver's number. On an INT, also tap who intercepted and say whether the defense returned it. The return is worth the same as the attempt: <b>+1</b> on a 1 pt try, <b>+2</b> on a 2 pt try.</li></ol>
      <p>If there was no attempt, tap <b>No conversion</b>. In Analysis, pick <b>Field</b>, <b>GL</b> or <b>Conversions</b>.</p>`},
    {id:'buttons',t:'Buttons',b:`<dl class="hl">
      <dt>${btn('',t('fd'))}</dt><dd>They crossed midfield or earned a new 1st down. The down goes back to 1.</dd>
      <dt>${btn('pen',t('penalty'))}</dt><dd>Opens 4 options: replay the down, automatic 1st down, loss of down or declined. By default it nullifies the last play.</dd>
      <dt>${btn('',t('run'))}</dt><dd>The play is a run. Tap the zone, pick Run or TD and tap the runner's number.</dd>
      <dt>${btn('int',t('sack'))}</dt><dd>Sack. Tap the number of who made the sack. The down moves forward.</dd>
      <dt>${btn('','GL')}</dt><dd>Switches the field to the goal line map.</dd>
      <dt>${btn('','Double')}</dt><dd>Formation. Stays selected until you change it. Tap again to clear.</dd>
      <dt>${btn('','2 QB')}</dt><dd>Marks the next play as Double QB.</dd>
      <dt>${btn('','↶ '+t('undo'))}</dt><dd>Removes the last tap or the last play.</dd></dl>`},
    {id:'downs',t:'Automatic down and possession',b:`<ul>
      <li>Each play moves the down forward by 1.</li>
      <li>${btn('',t('fd'))} goes back to 1st down.</li>
      <li>TD, INT or failing on 4th down change possession and reset to 1st down.</li>
      <li>If the app gets it wrong, tap the <b>down</b> at the top to fix it or to change possession. You can also tap the <b>offense</b> box.</li>
      <li>At <b>halftime</b>, tap the down and then <b>Halftime</b>: the 2nd half starts on 1st down, with the team that did not start on offense.</li></ul>`},
    {id:'analysis',t:'Analysis',b:`<ul>
      <li><b>Filters</b>: Hammers or opponent, passes or runs, down, formation and whether nullified plays count.</li>
      <li><b>Marks</b>: the notebook map, each play in its zone.</li>
      <li><b>Heatmap</b>: the more yellow, the more balls went to that zone. Shows the number of balls and completion %.</li>
      <li><b>Targets by player</b>: targets, completions, %, TD, INT and runs. Tap a player to show only their balls on the map.</li>
      <li><b>By down</b>: most used zone, target and formation on each down. Tap a down to filter.</li></ul>`},
    {id:'plays',t:'Play list',b:`<ul>
      <li>Every play of the game, most recent first.</li>
      <li><b>Nullify</b> removes the play from stats but keeps it. <b>Delete</b> removes it (asks to confirm).</li>
      <li><b>Copy CSV</b> copies everything to paste into Excel or Google Sheets.</li></ul>`},
    {id:'team',t:'Two people, one game',b:`<ol>
      <li>One person creates the game. It shows up right away in ${btn('',t('game'))} for the whole team.</li>
      <li>The other person opens the same link and picks that game from the list.</li>
      <li>Each person picks the team they follow: <b>Hammers</b> or <b>Opponent</b>.</li>
      <li>When your team is on offense, you track as usual. When the other team is on offense, your screen waits and shows the other person's plays live.</li></ol>
      <p>Down, possession and score are the same on both devices. If the other person's battery dies, tap <b>I will track this drive</b>. To change team, tap the game name at the top.</p>`},
    {id:'data',t:'Where the data lives',b:`<p>Games tagged <b>Shared</b> are saved online and show on any device, including for tape review after the tournament. Only emails on the <b>Members</b> list can sign in. Admins manage the list in ${btn('',t('game'))} → <b>Members</b>.</p>
      <p>Without network the app keeps working: it saves plays and sends them when the network is back. <b>Sending</b> shows at the top while plays are waiting to be sent.</p>
      <p>Use the <b>PT / EN</b> switch at the top to change the language. Your data stays the same.</p>`}
  ];
  return {quick,S,title:pt?'Guia':'Guide',quickT:pt?'Guia rápido':'Quick start',full:pt?'Guia completo':'Full guide'};
}
const qh=sec=>`<button class="qh" data-act="help" data-sec="${sec}" aria-label="${t('help')}">?</button>`;

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
  return {team:o.team,comp:o.comp,opp:o.opp||t('opponent'),date:new Date().toISOString().slice(0,10),start:o.start||'H',mode:'both',
    roster:{H:o.rosterH||[2,5,8,11,17,23,31,77],A:o.rosterA||[]},
    formations:{H:o.formH||['Double','Trips','Bunch'],A:o.formA||[]},curForm:{H:null,A:null},created:Date.now(),by:DEV};
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
const cloud={db:null,ready:false,canWrite:true,remoteGames:{},remoteEv:{},subGid:null,unsubEv:null,recent:[],
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
  for(const op of overlayOps()){const p=op.path.split('/');if(p.length!==2)continue;const id=p[1];
    if(op.k==='set')m[id]=op.body;else if(op.k==='upd'&&m[id])m[id]=merge(m[id],op.patch);else if(op.k==='del')delete m[id]}
  return Object.entries(m).map(([id,b])=>({id,...clone(b)})).sort((a,b)=>(b.created||0)-(a.created||0));
}
function cloudEvents(gid){
  const m={};if(cloud.subGid===gid)for(const id in cloud.remoteEv)m[id]=cloud.remoteEv[id];
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

/* ---------- current game ---------- */
let games=[], g=null, curId=lsGet(LS_CUR), draft=null, runMode=false, qbNext=false, override=null;
let view='reg', undoStack=[], sheet=null, toastT=null, confirmDel=null, rendering=false;
const an={side:'H',down:0,rec:null,form:null,kind:'pass',mode:'marks',annul:false,area:'field',half:0};
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
  if(!rendering&&authed)render();
}
function role(){if(!g||g.store==='demo')return 'both';const r=getRole(g.id);if(r)return r;return g.mode&&g.mode!=='both'?g.mode:'both'}
const readOnly=()=>g.store==='cloud'&&!cloud.canWrite;
function selectGame(id){
  curId=id;lsSet(LS_CUR,id);undoStack=[];draft=null;runMode=false;qbNext=false;override=null;an.rec=null;an.form=null;
  refresh();
  if(g.store!=='demo'&&!getRole(g.id)&&!readOnly())openSheet('role');
}

/* state machine: replay events to get down, possession, score, half */
function replay(G){
  G=G||g;
  const legacy=G.mode&&G.mode!=='both';
  let poss=legacy?G.mode:G.start, down=1, drive=0, half=1; const score={H:0,A:0};
  const flip=()=>{if(!legacy)poss=other(poss);down=1;drive++};
  for(const e of G.events){
    e._side=poss;e._down=down;e._tod=false;e._half=half;
    if(e.t==='play'){
      if(e.annul) continue;
      if(e.res==='TD'){score[poss]+=6+(e.pat||0);flip()}
      else if(e.res==='INT'){flip();if(e.pick6){score[poss]+=6+(e.pat||0);flip()}}
      else if(e.fd){down=1}
      else{down++;if(down>4){e._tod=true;flip()}}
    }else if(e.t==='conv'){
      e._side=e.side;
      if(e.res==='G')score[e.side]+=e.pts||0;
      else if(e.res==='INT'&&e.ret)score[other(e.side)]+=e.ret;
    }else if(e.t==='pen'){
      if(e.eff==='fd')down=1;
      else if(e.eff==='loss'){down++;if(down>4){e._tod=true;flip()}}
    }else if(e.t==='down'){down=e.down}
    else if(e.t==='poss'){flip()}
    else if(e.t==='half'){half=2;if(!legacy)poss=other(G.start);down=1;drive++}
  }
  return {poss,down,score,drive,half};
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
function addEv(ev,grp){ev.id=Date.now().toString(36)+uid();ev.ts=Date.now();ev.by=DEV;S().put(g.id,ev);grp.push({k:'add',id:ev.id})}
function chEv(e,patch,grp){const before=strip(e);S().put(g.id,{...before,...patch});grp.push({k:'put',before})}
function rmEv(e,grp){grp.push({k:'put',before:strip(e)});S().del(g.id,e.id)}
function updGame(patch){S().updGame(g.id,patch)}

function makeSample(){
  const G={id:'demo',...newMeta({team:'Elite',comp:'LFFF1',opp:'Demo FC',rosterA:[7,13,88,4,21],formA:['Double','Double QB','Trips']}),events:[]};
  G.roster.A=[7,13,88,4,21,3,9];
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const pick=w=>{const tt=w.reduce((a,b)=>a+b[1],0);let r=rnd()*tt;for(const [v,p] of w){if((r-=p)<=0)return v}return w[0][0]};
  const recW={H:[[11,5],[23,4],[8,3],[17,3],[5,1]],A:[[13,6],[7,4],[88,3],[4,1],[21,1]]};
  const defW={H:[[3,2],[9,1]],A:[[2,1],[31,2],[77,1]]};
  const zW={H:[['21',4],['20',3],['11',3],['22',3],['12',2],['10',2],['01',1],['02',1],['30',1],['32',1]],
            A:[['22',6],['12',5],['02',3],['21',3],['20',1],['11',2],['01',1],['32',2]]};
  const fW={H:[['Double',3],['Trips',2],['Bunch',1]],A:[['Double',3],['Double QB',2],['Trips',1]]};
  let ts=1;const push=e=>{e.id='d'+ts;e.ts=ts++;G.events.push(e)};
  for(let i=0;i<46;i++){
    if(i===24)push({t:'half'});
    const st=replay(G), s=st.poss;
    const prev=G.events[G.events.length-1];
    if(prev&&prev.t==='play'&&prev.res==='TD'&&!prev.convSkip){
      const pts=rnd()<.6?1:2,res=rnd()<.6?'G':'NG';
      push({t:'conv',side:prev._side||s,pts,zone:pick([['g11',2],['g10',1],['g12',1],['g01',1]]),rec:pick(recW[prev._side||s]),res});
      replay(G);continue;
    }
    if(rnd()<.06){push({t:'play',kind:'sack',zone:null,rec:null,res:'SACK',dby:pick(defW[s]),fd:false,form:pick(fW[s]),qb2:false,annul:false});continue}
    if(rnd()<.1){push({t:'play',kind:'run',zone:pick([['21',1],['20',1],['22',1]]),rec:pick(recW[s]),res:'R',fd:rnd()<.3,form:pick(fW[s]),qb2:false,annul:false});continue}
    const zone=pick(zW[s]);let res=rnd()<.64?'C':'X';
    if(res==='C'&&zone[0]==='0'&&rnd()<.45)res='TD';
    if(res==='X'&&rnd()<.08)res='INT';
    if(res==='C'&&st.down>=3&&rnd()<.25&&s==='H')res='TD';
    const form=pick(fW[s]);
    push({t:'play',kind:'pass',zone,rec:pick(recW[s]),res,fd:res==='C'&&rnd()<.35,form,
      qb2:form==='Double QB'||(s==='A'&&rnd()<.08),annul:false,...(res==='INT'?{dby:pick(defW[s]),pick6:false}:{})});
    if(i===17){const p=G.events[G.events.length-1];p.annul=true;push({t:'pen',eff:'rep',annulId:p.id})}
    replay(G);
  }
  G.events.forEach(e=>{delete e._side;delete e._down;delete e._tod;delete e._half});
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
function tapRes(r){if(!draft)return;draft.res=r;render()}
function startSack(){draft={kind:'sack',zone:null,res:'SACK',step:'by'};runMode=false;render()}
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
function applyPen(eff,annul){
  act(grp=>{
    draft=null;
    const p=lastPlay();let annulId=null;
    if(annul&&p&&eff!=='dec'&&!p.annul){chEv(p,{annul:true},grp);annulId=p.id}
    addEv({t:'pen',eff,annulId},grp);
  });
  closeSheet();toast(t('pen')[eff]);
}

/* ---------- render ---------- */
const isGL=z=>!!z&&z[0]==='g';
function markOf(e){
  const d=e._down;
  if(e.t==='conv'){
    if(e.res==='G')return `<span class="mk">+${e.pts}</span>`;
    if(e.res==='INT')return `<span class="mk int">INT+${e.pts}</span>`;
    return `<span class="mk x">x+${e.pts}</span>`;
  }
  if(e.res==='TD')return `<span class="mk td">TD${d}</span>`;
  if(e.res==='INT')return e.pick6?`<span class="mk td">P6·${d}</span>`:`<span class="mk int">INT${d}</span>`;
  if(e.kind==='run')return `<span class="mk">R${d}</span>`;
  return e.res==='C'?`<span class="mk">C${d}</span>`:`<span class="mk x">x${d}</span>`;
}
function sideName(s){return s==='H'?'Hammers':esc(g.opp)}

function render(){
  document.documentElement.lang=lang==='pt'?'pt-PT':'en';
  const st=replay();
  const showPoss=g.mode==='both'&&!readOnly();
  const r=role(), roleTxt=r==='both'?t('roleB'):r==='H'?'Hammers':t('roleA');
  const pend=cloud.outbox.length;
  const sync=g.store==='demo'?`<span class="sample">${t('sample')}</span>`
    :g.store==='local'?`<span class="sync local">${t('localOnly')}</span>`
    :`<span class="sync ${pend?'pend':'ok'}">${pend?t('sending',pend):t('shared')}</span>`;
  document.getElementById('app').innerHTML=`
  <header class="top">
    <button class="chip game" data-act="games" aria-label="${t('chooseGame')}"><span class="gm"><span class="gt">${esc(g.team)} vs ${esc(g.opp)} <small>${esc(g.comp)}</small></span>
      <span class="gs">${g.store!=='demo'?`${t('follows')}: <b>${roleTxt}</b> · `:''}${sync}</span></span></button>
    <button class="chip poss ${st.poss}" data-act="poss" ${showPoss?'':'disabled'}><small style="color:inherit;opacity:.8">${t('offense')}</small>${sideName(st.poss)}</button>
    <button class="chip down num" data-act="down"><b>${ord(st.down)}</b> ${t('down')}<small>${st.half===2?t('h2'):t('h1')}</small></button>
    <div class="chip score num"><small>${t('ham')}</small><span class="s">${st.score.H}</span><small>:</small><span class="s">${st.score.A}</span><small>${t('opp')}</small></div>
    <button class="chip undo" data-act="undo">↶ ${t('undo')}</button>
    <div class="lang" role="group" aria-label="Language">
      <button data-act="lang" data-l="pt" aria-pressed="${lang==='pt'}">PT</button><button data-act="lang" data-l="en" aria-pressed="${lang==='en'}">EN</button>
    </div>
    <button class="chip icon-btn" data-act="help" data-sec="" aria-label="${t('help')}">? <small>${t('help')}</small></button>
  </header>
  <nav class="tabs" role="tablist">
    ${['reg','ana','log'].map(k=>`<button role="tab" data-act="view" data-v="${k}" aria-selected="${view===k}">${t('tabs')[k]}</button>`).join('')}
  </nav>
  ${view==='reg'?regView(st):view==='ana'?anaView():logView()}`;
}
function hintText(){
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
  let h='';
  for(let r=0;r<4;r++)for(let c=0;c<3;c++){
    const z=(gl?'g':'')+r+c, here=plays.filter(e=>e.zone===z).slice(-6);
    let d='';
    if(live&&draft&&draft.zone===z){
      const cls={C:'',X:'x',TD:'td',INT:'int',R:'r',G:'',NG:'x'}[draft.res]||'';
      const txt={C:'C',X:'x',TD:'TD',INT:'INT',R:'R',G:'✓',NG:'✗'}[draft.res]||'';
      d=`<div class="draft ${cls}"><span>${txt}</span></div>`;
    }
    const ez=gl&&r<2?' ez':'', behind=!gl&&r===3?' behind':'';
    const tag=live?'button':'div';
    h+=`<${tag} class="zone r${r}${ez}${behind}" ${live?`data-act="zone" data-z="${z}"`:''} aria-label="${ROWS[r]} ${COLS[c]}">
      <span class="zl">${ROWS[r]} ${COLS[c]}</span>${c===2&&Y[r]?`<span class="zy">${Y[r]}</span>`:''}${here.map(markOf).join('')}${d}</${tag}>`;
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
        <p>${t('defBody',r==='H'?'Hammers':t('roleA'),s==='H'?'Hammers':t('roleA'))}</p>
        ${recent.length?`<span class="lbl2">${t('lastPlays')}</span><div class="mini">${recent.map(e=>`<div><b class="num">${ord(e._down)}</b><span>${e.rec!=null?'#'+e.rec:e.dby!=null?'#'+e.dby:''}</span><span>${e.zone?zoneName(e.zone):''}</span><span class="tag ${e.res}">${resTxt(e)}</span></div>`).join('')}</div>`:''}
        <button class="btn" data-act="defover">${t('defOverride')}</button>
        <button class="btn" data-act="games">${t('changeRole')}</button></div>`;
    return `<div class="reg side-${s}">
      <section class="fieldwrap">
        <div class="hint">${readOnly()?t('roTitle'):t('defHint',sideName(s))} ${qh('team')}</div>
        ${banner}
        <div class="field watch">${gridHTML(gl,plays,false)}</div>
        <div class="cols"><span>${cl[0]}</span><span>${cl[1]}</span><span>${cl[2]}</span></div>
      </section>
      <section class="controls">${card}</section></div>`;
  }
  const byStep=draft&&draft.step==='by';
  const ns=byStep?other(s):s;
  const cnt={};g.events.forEach(e=>{if(e.t==='play'&&e._side===s&&e.rec!=null)cnt[e.rec]=(cnt[e.rec]||0)+1});
  const roster=[...g.roster[ns]].sort((a,b)=>byStep?a-b:((cnt[b]||0)-(cnt[a]||0)||a-b));
  const ready=!!draft;
  const nums=roster.map(n=>`<button class="n num ${ready?'ready':''}" data-act="num" data-n="${n}">${n}${!byStep&&cnt[n]?`<small>${cnt[n]} ${t('targets')}</small>`:''}</button>`).join('')
    +`<button class="n none" data-act="nonum" ${ready?'':'disabled'} aria-label="${t('saveNoNum')}">?<small>${t('noNumShort')}</small></button>`
    +`<button class="n add" data-act="addnum" aria-label="${t('newNum')}">+</button>`;
  const numLbl=byStep?(draft.kind==='sack'?t('whoSack'):t('whoInt')):t('receiver');
  const numSub=byStep?`${ns==='H'?'Hammers':t('opponent')}, ${t('defense')}`:`${s==='H'?'Hammers':t('opponent')}, ${t('mostUsed')}`;
  let resRow='';
  if(draft&&!byStep&&draft.kind!=='sack'){
    const opts=draft.kind==='conv'?[['G',t('convRes').G],['NG',t('convRes').NG],['INT','INT']]
      :draft.kind==='run'?[['R',t('tagR')],['TD','TD']]
      :[['C',t('tagC')],['X',t('tagX')],['TD','TD'],['INT','INT']];
    resRow=`<div class="block"><div class="lbl"><span style="font:inherit;letter-spacing:inherit;text-transform:inherit">${t('result')}${qh('track')}</span><span>${t('resSub')}</span></div>
      <div class="resrow">${opts.map(([v,l])=>`<button class="rb rb-${v}" data-act="res" data-r="${v}" aria-pressed="${draft.res===v}">${l}</button>`).join('')}</div></div>`;
  }
  const forms=g.formations[s].map(f=>`<button class="f" data-act="form" data-f="${esc(f)}" aria-pressed="${g.curForm[s]===f}">${esc(f)}</button>`).join('')
    +`<button class="f" data-act="addform">${t('newForm')}</button>`
    +`<button class="f qb" data-act="qb" aria-pressed="${qbNext}">2 QB</button>`;
  return `<div class="reg side-${s}">
    <section class="fieldwrap">
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
      <div class="block"><div class="lbl"><span style="font:inherit;letter-spacing:inherit;text-transform:inherit">${numLbl}${qh('track')}</span><span>${numSub}</span></div><div class="nums">${nums}</div></div>
      ${byStep||conv?'':`<div class="block"><div class="lbl"><span style="font:inherit;letter-spacing:inherit;text-transform:inherit">${t('formation')}${qh('buttons')}</span><span>${t('formSticky')}</span></div><div class="forms">${forms}</div></div>`}
      <div class="actions">
        <button class="a" data-act="fd" aria-pressed="${draft?!!draft.fd:false}">${t('fd')}</button>
        <button class="a pen" data-act="pen">${t('penalty')}</button>
        <button class="a" data-act="run" aria-pressed="${runMode||(draft&&draft.kind==='run')}">${t('run')}</button>
        <button class="a int" data-act="sack" aria-pressed="${!!(draft&&draft.kind==='sack')}">${t('sack')}</button>
        <button class="a" data-act="games" style="font-size:16px">${t('game')}</button>
      </div>
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
    &&(e.t==='conv'||!an.down||e._down===an.down)&&(ignoreRec||an.rec==null||e.rec===an.rec));
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
      [passes.filter(e=>e.res==='INT').length,TL[3]],[runs.length,TL[4]],[base.filter(e=>e.kind==='sack').length,t('sacks')],[P.filter(e=>e.fd).length,TL[5]],[P.filter(e=>e.qb2).length,TL[6]]];
  const zl=[];for(let r=0;r<4;r++)for(let c=0;c<3;c++)zl.push((gl?'g':'')+r+c);
  const max=Math.max(1,...zl.map(z=>P.filter(e=>e.zone===z).length));
  let zones='';
  zl.forEach(z=>{
    const r=+z[gl?1:0], c=+z[gl?2:1], h=P.filter(e=>e.zone===z), ez=gl&&r<2?' ez':'', bh=!gl&&r===3?' behind':'';
    if(an.mode==='marks') zones+=`<div class="az r${r}${ez}${bh}"><span class="zl">${ROWS[r]} ${COLS[c]}</span>${h.map(markOf).join('')}</div>`;
    else{
      const a=h.length/max, pc=h.filter(isPassLike), ink=a>.55?'#1a1205':'#fff';
      zones+=`<div class="az heat r${r}${ez}${bh}" style="background:rgba(255,214,10,${(a*.8).toFixed(2)})"><span class="zl">${ROWS[r]} ${COLS[c]}</span>
        <b class="num" style="color:${ink}">${h.length}</b><span style="color:${ink}">${pc.length?pct(pc.filter(isComp).length,pc.length)+' '+t('comp'):h.length?t('runsLow'):''}</span></div>`;
    }
  });
  const by={};all.filter(e=>e.kind!=='sack').forEach(e=>{const k=e.rec==null?'?':e.rec;(by[k]=by[k]||[]).push(e)});
  const rows=Object.entries(by).map(([k,l])=>{const p=l.filter(isPassLike);return{k,t:p.length,c:p.filter(isComp).length,td:l.filter(e=>e.res==='TD').length,int:p.filter(e=>e.res==='INT').length,r:l.filter(e=>e.kind==='run').length}})
    .sort((a,b)=>b.t-a.t||b.r-a.r);
  const tbody=rows.map(r=>`<tr data-act="anrec" data-r="${r.k}" aria-selected="${String(an.rec)===r.k}"><td class="jn">${r.k==='?'?t('noNum'):'#'+r.k}</td><td>${r.t}</td><td>${r.c}</td><td>${pct(r.c,r.t)}</td><td>${r.td}</td><td>${r.int}</td><td>${r.r}</td></tr>`).join('');
  const top=(arr,f)=>{const m={};arr.forEach(e=>{const k=f(e);if(k!=null)m[k]=(m[k]||0)+1});const s=Object.entries(m).sort((a,b)=>b[1]-a[1])[0];return s||null};
  const dn=conv?'':[1,2,3,4].map(d=>{
    const l=base.filter(e=>e._down===d&&(an.rec==null||e.rec===an.rec));
    const p=l.filter(e=>e.kind==='pass');
    const tz=top(p,e=>e.zone), tr=top(p,e=>e.rec), tf=top(l,e=>e.form);
    return `<tr data-act="andown" data-d="${d}" aria-selected="${an.down===d}"><td class="jn">${ord(d)}</td><td>${p.length}</td><td>${pct(p.filter(isComp).length,p.length)}</td><td>${tz?zoneName(tz[0])+' ('+tz[1]+')':'-'}</td><td>${tr?'#'+tr[0]+' ('+tr[1]+')':'-'}</td><td>${tf?esc(tf[0]):'-'}</td><td>${l.filter(e=>e.kind==='run').length}</td></tr>`;
  }).join('');
  // defensive plays made against this offense: interceptions and sacks by number
  const dv={};g.events.filter(e=>(e.t==='play'||e.t==='conv')&&e._side===an.side&&!e.annul&&(e.res==='INT'||e.res==='SACK')&&(!an.half||e._half===an.half))
    .forEach(e=>{const k=e.dby==null?'?':e.dby;dv[k]=dv[k]||{i:0,s:0,p6:0};if(e.res==='SACK')dv[k].s++;else{dv[k].i++;if(e.pick6)dv[k].p6++}});
  const drows=Object.entries(dv).sort((a,b)=>(b[1].i+b[1].s)-(a[1].i+a[1].s)).map(([k,v])=>`<tr><td class="jn">${k==='?'?t('noNum'):'#'+k}</td><td>${v.i}</td><td>${v.p6}</td><td>${v.s}</td></tr>`).join('');
  const forms=[...new Set(g.events.filter(e=>e.t==='play'&&e._side===an.side&&e.form).map(e=>e.form))];
  const seg=(key,opts,cls='')=>`<div class="seg ${cls}">${opts.map(([v,l,c])=>`<button class="${c||''}" data-act="an" data-k="${key}" data-v="${v}" aria-pressed="${String(an[key])===String(v)}">${l}</button>`).join('')}</div>`;
  const D=t('downs'), thP=t('thP'), thD=t('thD');
  return `<div class="filters">
      ${seg('side',[['H','Hammers','H'],['A',esc(g.opp),'A']],'side')}
      ${seg('area',[['field',t('mapField')],['gl','GL'],['conv',t('convs')]])}
      ${conv?'':seg('kind',[['pass',t('passes')],['run',t('runs')],['all',t('all')]])}
      ${conv?'':seg('down',[[0,t('allM')],[1,D[0]],[2,D[1]],[3,D[2]],[4,D[3]]])}
      ${seg('half',[[0,t('game_')],[1,t('h1')],[2,t('h2')]])}
      ${forms.length&&!conv?seg('form',[['',t('allF')],...forms.map(f=>[esc(f),esc(f)])]):''}
      <label class="check" style="padding:6px 10px"><input type="checkbox" id="an-annul" data-act="anannul" ${an.annul?'checked':''}>${t('inclAnnul')}</label>
      ${qh('analysis')}
    </div>
    <div class="tiles">${tiles.map(([v,l])=>`<div class="tile"><b class="num">${v}</b><span>${l}</span></div>`).join('')}</div>
    <div class="ana">
      <section class="panel">
        <div class="toolbar"><h3>${t('distribution')}${an.rec!=null?' · #'+an.rec:''}</h3>${seg('mode',[['marks',t('marks')],['heat',t('heatmap')]])}</div>
        <div class="amap${gl?' glmap':''}">${zones}</div>
        ${an.mode==='marks'?`<p class="note">${conv?t('marksConv'):t('marksNote')}</p>`:`<div class="legend"><span>${t('fewer')}</span><i></i><span>${t('more')}</span></div>`}
        ${an.rec!=null?`<button class="btn" data-act="anrec" data-r="${an.rec}">${t('showAll')}</button>`:''}
      </section>
      <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
        <section class="panel"><h3>${t('byPlayer')}</h3>
          <div class="tablewrap"><table><thead><tr>${thP.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${tbody||`<tr><td colspan="7">${t('noMatch')}</td></tr>`}</tbody></table></div>
          <p class="note">${t('tapPlayer')}</p>
        </section>
        ${conv?'':`<section class="panel"><h3>${t('byDown')}</h3>
          <div class="tablewrap"><table><thead><tr>${thD.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${dn}</tbody></table></div>
        </section>`}
        <section class="panel"><h3>${t('defTable',sideName(other(an.side)))}</h3>
          <div class="tablewrap"><table><thead><tr>${t('thDef').map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${drows||`<tr><td colspan="4">${t('noMatch')}</td></tr>`}</tbody></table></div>
        </section>
      </div>
    </div>`;
}
function logView(){
  replay();
  const delB=e=>`<button class="del" data-act="del" data-id="${e.id}">${confirmDel===e.id?t('confirm'):t('del')}</button>`;
  const sd=e=>`<span class="sd ${e._side}"></span>`;
  const items=[...g.events].reverse().map(e=>{
    if(e.t==='pen')return `<div class="ev">${sd(e)}<span class="dn">${ord(e._down)}</span><span class="tx"><b>${t('penalty')}</b><span class="tag">${t('penShort')[e.eff]}</span>${e.annulId?`<span class="tag">${t('annulledPlay')}</span>`:''}</span><span class="ops">${delB(e)}</span></div>`;
    if(e.t==='down')return `<div class="ev">${sd(e)}<span class="dn">→${ord(e.down)}</span><span class="tx">${t('downManual')}</span><span class="ops">${delB(e)}</span></div>`;
    if(e.t==='poss')return `<div class="ev"><span class="sd ${other(e._side)}"></span><span class="dn">⇄</span><span class="tx">${t('possManual')}</span><span class="ops">${delB(e)}</span></div>`;
    if(e.t==='half')return `<div class="ev"><span class="sd"></span><span class="dn">½</span><span class="tx"><b>${t('halfT')}</b></span><span class="ops">${delB(e)}</span></div>`;
    if(e.t==='conv'){
      const rt={G:`<span class="tag C">${t('convRes').G}</span>`,NG:`<span class="tag X">${t('convRes').NG}</span>`,INT:'<span class="tag INT">INT</span>'}[e.res];
      return `<div class="ev">${sd(e)}<span class="dn">+${e.pts}</span><span class="tx"><b>${e.rec!=null?'#'+e.rec:t('noNum')}</b>${rt}<span class="tag">${t('conv')}</span>${e.zone?`<span class="tag">${zoneName(e.zone)}</span>`:''}
        ${e.res==='INT'?`<span class="tag">${t('byTag',e.dby)}</span>${e.ret?`<span class="tag TD">${t('retTag',e.ret)}</span>`:''}`:''}</span><span class="ops">${delB(e)}</span></div>`;
    }
    const resTag={C:`<span class="tag C">${t('tagC')}</span>`,X:`<span class="tag X">${t('tagX')}</span>`,R:`<span class="tag">${t('tagR')}</span>`,TD:'<span class="tag TD">TD</span>',INT:'<span class="tag INT">INT</span>',SACK:`<span class="tag INT">${t('sack')}</span>`}[e.res];
    return `<div class="ev ${e.annul?'annul':''}">${sd(e)}<span class="dn">${ord(e._down)}</span>
      <span class="tx">${e.kind==='sack'?'':`<b>${e.rec!=null?'#'+e.rec:t('noNum')}</b>`}${resTag}${e.zone?`<span class="tag">${zoneName(e.zone)}</span>`:''}${e.kind==='run'&&e.res==='TD'?`<span class="tag">${t('runLow')}</span>`:''}
      ${(e.res==='INT'||e.res==='SACK')?`<span class="tag">${t('byTag',e.dby)}</span>`:''}
      ${e.fd?`<span class="tag">${t('fdLow')}</span>`:''}${e.form?`<span class="tag">${esc(e.form)}</span>`:''}${e.qb2?'<span class="tag">2 QB</span>':''}
      ${e.pick6?'<span class="tag TD">pick-6</span>':''}${e.pat!=null?`<span class="tag">${t('convTag',e.pat)}</span>`:''}${e._tod?`<span class="tag">${t('tod')}</span>`:''}${e.annul?`<span class="tag">${t('annulTag')}</span>`:''}</span>
      <span class="ops"><button data-act="annul" data-id="${e.id}">${e.annul?t('restore'):t('annul')}</button>${delB(e)}</span></div>`;
  }).join('');
  return `<div class="toolbar"><p class="note">${t('logCount',g.events.filter(e=>e.t==='play').length)} ${qh('plays')}</p>
    <button class="btn" data-act="csv">${t('copyCsv')}</button></div>
    <div class="log">${items||`<p class="note">${t('logEmpty')}</p>`}</div>`;
}


/* ---------- sheets ---------- */
function openSheet(kind,data){sheet={kind,...(data||{})};renderSheet()}
function closeSheet(){sheet=null;document.getElementById('layer').innerHTML='';render()}
function renderSheet(){
  const Lr=document.getElementById('layer');if(!sheet){Lr.innerHTML='';return}
  const st=replay();let h='', cls='';
  if(sheet.kind==='pen'){
    const p=draft?{rec:null,res:draft.res,zone:draft.zone,_down:st.down}:lastPlay();
    const canAnnul=!!p&&!p.annul;
    h=`<h2>${t('penTitle')}</h2><p>${t('penQ')}</p>
      ${canAnnul?`<label class="check"><input type="checkbox" id="pen-annul" checked> ${t('annulLast',ord(p._down),p.rec!=null?'#'+p.rec:t('noNum'),zoneName(p.zone))}</label>`:''}
      <div class="grid2">
        <button class="big" data-act="peneff" data-e="rep">${t('penRep')}<small>${t('penRepS',ord(st.down))}</small></button>
        <button class="big" data-act="peneff" data-e="fd">${t('penFd')}<small>${t('penFdS')}</small></button>
        <button class="big" data-act="peneff" data-e="loss">${t('penLoss')}<small>${t('penLossS')}</small></button>
        <button class="big" data-act="peneff" data-e="dec">${t('penDec')}<small>${t('penDecS')}</small></button>
      </div><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='down'){
    h=`<h2>${t('fixDown')}</h2><div class="grid4">${[1,2,3,4].map(d=>`<button class="big num" data-act="setdown" data-d="${d}" aria-pressed="${st.down===d}">${ord(d)}</button>`).join('')}</div>
      ${g.mode==='both'?`<button class="big" data-act="flipposs">${t('changePoss')}<small>${t('nowOff')}${sideName(other(st.poss))}</small></button>`:''}
      ${st.half===1&&!readOnly()?`<button class="big" data-act="half">${t('halfT')}<small>${t('halfS',sideName(g.mode&&g.mode!=='both'?g.mode:other(g.start)))}</small></button>`:''}
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
    const s=st.poss, have=g.formations[s];
    h=`<h2>${t('newFormT')} · ${sideName(s)}</h2>
      <div class="row">${FORM_SUGG.filter(f=>!have.includes(f)).map(f=>`<button class="f" data-act="formadd" data-f="${f}">${f}</button>`).join('')}</div>
      <label class="lbl2" for="form-name">${t('orType')}</label>
      <input class="field-in" id="form-name" maxlength="24" placeholder="${t('formPh')}" autocomplete="off">
      <button class="primary" data-act="formaddin">${t('add')}</button><button class="ghost" data-act="close">${t('cancel')}</button>`;
  }else if(sheet.kind==='games'){
    const tag=x=>x.store==='cloud'?`<span class="sync ok">${t('shared')}</span>`:x.store==='local'?`<span class="sync local">${t('localOnly')}</span>`:`<span class="sample">${t('sample')}</span>`;
    const cnt=x=>{const ev=x.id===g.id?g.events:(x.events||null);return ev?`${ev.filter(e=>e.t==='play').length} ${t('playsAbbr')}`:''};
    const rb=(v,l,d)=>`<button class="big" data-act="role" data-r="${v}" aria-pressed="${role()===v}">${l}<small>${d}</small></button>`;
    h=`<h2>${t('games')}</h2>
      ${g.store!=='demo'&&!readOnly()?`<span class="lbl2">${t('roleQ')}</span><div class="grid4" style="grid-template-columns:repeat(3,1fr)">${rb('H','Hammers',t('roleHs'))}${rb('A',t('roleA'),t('roleAs'))}${rb('both',t('roleB'),t('roleBs'))}</div>`:''}
      <span class="lbl2">${t('allGames')}</span>
      <div class="gl">${games.map(x=>`<button data-act="pickgame" data-id="${x.id}" aria-current="${x.id===g.id}"><span><b>${esc(x.team)} vs ${esc(x.opp)}</b><br><small>${esc(x.comp)} · ${x.date}</small> ${tag(x)}</span><span class="num">${cnt(x)}</span></button>`).join('')}</div>
      ${cloud.db&&!cloud.ready?`<p>${t('loadingShared')}</p>`:''}
      <button class="primary" data-act="newgame">${t('newGame')}</button>
      ${g.store==='demo'||readOnly()||(g.store==='cloud'&&!isAdmin)?'':`<button class="ghost" data-act="delgame" style="color:var(--bad)">${sheet.delc?t('delGameC'):t('delGame')}</button>`}
      <div class="acct"><span>${t('signedAs')} <b>${esc(me||'')}</b>${isAdmin?` · ${t('roleAdmin')}`:''}</span>
        ${isAdmin?`<button class="btn" data-act="members">${t('members')}</button>`:''}<button class="btn" data-act="signout">${t('signOut')}</button></div>
      <button class="ghost" data-act="close">${t('close')}</button>`;
  }else if(sheet.kind==='members'){
    h=`<h2>${t('members')}</h2><p>${t('membersLead')}</p>
      <div class="gl">${members.map(m=>`<div class="mrow"><span><b>${esc(m.id)}</b><br><small>${m.role==='admin'?t('roleAdmin'):t('roleMember')}</small></span>
        ${m.id===me?`<small>${t('you')}</small>`:`<span class="row"><button class="btn" data-act="mrole" data-id="${esc(m.id)}" data-r="${m.role==='admin'?'member':'admin'}">${m.role==='admin'?t('makeMember'):t('makeAdmin')}</button>
        <button class="btn" data-act="mdel" data-id="${esc(m.id)}" style="color:var(--bad)">${sheet.mdel===m.id?t('confirm'):t('remove')}</button></span>`}</div>`).join('')}</div>
      <label class="lbl2" for="m-email">${t('addMember')}</label>
      <input class="field-in" id="m-email" type="email" placeholder="nome@email.com" autocomplete="off">
      <div class="grid2"><button class="big" data-act="madd" data-r="member">${t('roleMember')}<small>${t('memberS')}</small></button>
        <button class="big" data-act="madd" data-r="admin">${t('roleAdmin')}<small>${t('adminS')}</small></button></div>
      <button class="ghost" data-act="close">${t('close')}</button>`;
  }else if(sheet.kind==='role'){
    const rb=(v,l,d)=>`<button class="big" data-act="role" data-r="${v}">${l}<small>${d}</small></button>`;
    h=`<h2>${t('roleQ')}</h2><p>${t('roleNote')}</p>
      <div class="gl" style="gap:8px">${rb('H','Hammers',t('roleHs'))}${rb('A',t('roleA'),t('roleAs'))}${rb('both',t('roleB'),t('roleBs'))}</div>`;
  }else if(sheet.kind==='newgame'){
    const n=sheet.ng;
    const opt=(k,v,l)=>`<button class="big" data-act="ng" data-k="${k}" data-v="${v}" aria-pressed="${n[k]===v}">${l}</button>`;
    const g3='style="grid-template-columns:repeat(3,1fr)"';
    h=`<h2>${t('newGameT')}</h2>
      <span class="lbl2">${t('team')}</span><div class="grid4" ${g3}>${TEAMS.map(x=>opt('team',x,x)).join('')}</div>
      <span class="lbl2">${t('competition')}</span><div class="grid4" ${g3}>${COMPS.map(x=>opt('comp',x,x)).join('')}</div>
      <label class="lbl2" for="ng-opp">${t('opponent')}</label><input class="field-in" id="ng-opp" value="${esc(n.opp)}" placeholder="${t('teamName')}" autocomplete="off">
      <span class="lbl2">${t('starts')}</span><div class="grid2">${opt('start','H','Hammers')}${opt('start','A',t('opponent'))}</div>
      <p>${cloud.db&&cloud.canWrite?t('willShare'):t('willLocal')}</p>
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
  }else if(sheet.kind==='csv'){
    h=`<h2>CSV</h2><p>${t('selectCopy')}</p><textarea id="csv-out" class="field-in" style="min-height:240px;padding:10px;font-family:monospace;font-size:12px">${esc(sheet.text)}</textarea><button class="ghost" data-act="close">${t('close')}</button>`;
  }
  Lr.innerHTML=`<div class="scrim" data-act="scrim"><div class="sheet ${cls}" role="dialog" aria-modal="true">${h}</div></div>`;
  const f=Lr.querySelector('#form-name');if(f)f.focus();
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
  el.textContent=msg;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{el.hidden=true},1600);
}
function numSide(st){const s=draft&&draft.kind==='conv'?draft.side:st.poss;return draft&&draft.step==='by'?other(s):s}
function csv(){
  replay();
  const lines=g.events.filter(e=>e.t==='play'||e.t==='conv').map(e=>[g.date,g.team,g.comp,g.opp,e._half,e._side==='H'?'Hammers':g.opp,e.t==='conv'?'':e._down,
    e.t==='conv'?t('kind').conv+' '+e.pts:t('kind')[e.kind],e.t==='conv'?t('kind').conv:isGL(e.zone)?'GL':t('mapField'),e.zone?zoneName(e.zone):'',e.rec??'',e.res,e.dby??'',
    e.fd?1:0,e.form||'',e.qb2?1:0,e.pick6?1:0,e.ret??'',e.annul?1:0]
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
    case 'addform':openSheet('addform');break;
    case 'formadd':case 'formaddin':{const s=st.poss;const name=(a==='formadd'?b.dataset.f:(document.getElementById('form-name').value||'').trim());
      if(!name){toast(t('typeForm'));break}
      updGame({formations:{[s]:g.formations[s].includes(name)?g.formations[s]:[...g.formations[s],name]},curForm:{[s]:name}});closeSheet();break}
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
    case 'pen':openSheet('pen');break;
    case 'peneff':{const c=document.getElementById('pen-annul');applyPen(b.dataset.e,c?c.checked:false);break}
    case 'pick6':{const p=lastPlay();if(p&&p.res==='INT'){const y=b.dataset.v==='1';act(grp=>chEv(p,{pick6:y},grp));if(y)toast(t('pick6Done',sideName(other(p._side))))}break}
    case 'pat':{const p=lastPlay();if(p)act(grp=>chEv(p,{pat:+b.dataset.p},grp));break}
    case 'undo':undo();break;
    case 'down':openSheet('down');break;
    case 'poss':if(!readOnly()){act(grp=>addEv({t:'poss'},grp));toast(t('possChanged'))}break;
    case 'setdown':act(grp=>addEv({t:'down',down:+b.dataset.d},grp));closeSheet();break;
    case 'flipposs':act(grp=>addEv({t:'poss'},grp));closeSheet();break;
    case 'defover':override=st.drive;render();break;
    case 'close':closeSheet();break;
    case 'games':openSheet('games');break;
    case 'role':setRole(g.id,b.dataset.r);override=null;closeSheet();toast(t('roleSet'));break;
    case 'pickgame':sheet=null;document.getElementById('layer').innerHTML='';selectGame(b.dataset.id);break;
    case 'delgame':if(!sheet.delc){sheet.delc=true;renderSheet();break}
      {const id=g.id;sheet=null;document.getElementById('layer').innerHTML='';S().remove(id);curId=null;selectGame(games.find(x=>x.id!==id).id)}break;
    case 'newgame':openSheet('newgame',{ng:{team:'Elite',comp:'LFFF1',opp:'',start:'H'}});break;
    case 'ng':sheet.ng.opp=(document.getElementById('ng-opp')||{}).value||sheet.ng.opp;sheet.ng[b.dataset.k]=b.dataset.v;renderSheet();break;
    case 'ngcreate':{const n=sheet.ng;n.opp=(document.getElementById('ng-opp').value||'').trim();
      const target=(cloud.db&&cloud.canWrite)?cloudStore:local;
      const id=target.create(newMeta(n));sheet=null;document.getElementById('layer').innerHTML='';view='reg';an.side='H';
      selectGame(id);toast(t('gameCreated'));break}
    case 'an':{const k=b.dataset.k;let v=b.dataset.v;if(k==='down')v=+v;if(k==='form'&&v==='')v=null;an[k]=v;if(k==='side'){an.rec=null;an.form=null}render();break}
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
    case 'madd':{const em=(document.getElementById('m-email').value||'').trim().toLowerCase();
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){toast(t('badEmail'));break}
      addMember(em,b.dataset.r).then(()=>toast(t('memberAdded',em)));break}
    case 'mrole':addMember(b.dataset.id,b.dataset.r);break;
    case 'mdel':if(sheet.mdel!==b.dataset.id){sheet.mdel=b.dataset.id;renderSheet()}else{removeMember(b.dataset.id);sheet.mdel=null}break;
    case 'signout':signOutNow();break;
    case 'helpgo':goHelp(b.dataset.sec);break;
  }
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&sheet)closeSheet();
  if(e.key==='Enter'&&sheet&&sheet.kind==='addform'){e.preventDefault();document.querySelector('[data-act="formaddin"]').click()}
});

/* ---------- boot: Firebase login, members, shared games ---------- */
let authed=false, me=null, isAdmin=false, members=[], loginState={step:'email',email:lsGet('hgo.loginEmail')||'',msg:''};
let fb=null;
function loginView(){
  const L=loginState;
  const body=L.step==='setup'?`<p>${t('setupMissing')}</p>`
    :L.step==='loading'?`<p>${t('loggingIn')}</p>`
    :L.step==='sent'?`<p>${t('linkSent',esc(L.email))}</p>
      <label class="lbl2" for="lg-paste">${t('pasteLabel')}</label>
      <input class="field-in" id="lg-paste" autocomplete="off" placeholder="https://...">
      <button class="primary" data-act="lgpaste">${t('signIn')}</button>
      <button class="ghost" data-act="lgback">${t('otherEmail')}</button>`
    :L.step==='confirm'?`<p>${t('confirmEmail')}</p>
      <label class="lbl2" for="lg-email">Email</label>
      <input class="field-in" id="lg-email" type="email" autocomplete="email" value="${esc(L.email)}">
      <button class="primary" data-act="lgconfirm">${t('signIn')}</button>`
    :L.step==='denied'?`<p>${t('noAccess',esc(L.email))}</p><button class="primary" data-act="lgout">${t('signOut')}</button>`
    :`<p>${t('loginLead')}</p>
      <label class="lbl2" for="lg-email">Email</label>
      <input class="field-in" id="lg-email" type="email" autocomplete="email" value="${esc(L.email)}" placeholder="nome@email.com">
      <button class="primary" data-act="lgsend">${t('sendLink')}</button>`;
  document.getElementById('app').innerHTML=`<div class="login">
    <div class="lang" role="group" aria-label="Language" style="align-self:flex-end">
      <button data-act="lang" data-l="pt" aria-pressed="${lang==='pt'}">PT</button><button data-act="lang" data-l="en" aria-pressed="${lang==='en'}">EN</button></div>
    <div class="sheet login-card"><h2>Hammers Game Ops</h2>${body}${L.msg?`<p class="err">${esc(L.msg)}</p>`:''}</div></div>`;
}
const continueUrl=()=>location.origin+location.pathname;
async function finishLink(url,email){
  loginState={...loginState,step:'loading',msg:''};loginView();
  try{await fb.signInWithEmailLink(fb.auth,email,url);lsSet('hgo.loginEmail',email);history.replaceState(null,'',continueUrl())}
  catch(e){loginState={step:'email',email,msg:t('linkInvalid')};loginView()}
}
async function onUser(u){
  if(!u){authed=false;me=null;
    if(fb.isSignInWithEmailLink(fb.auth,location.href)){const em=lsGet('hgo.loginEmail');if(em)return finishLink(location.href,em);loginState={step:'confirm',email:'',msg:''}}
    else if(loginState.step==='loading')loginState.step='email';
    return loginView();
  }
  me=(u.email||'').toLowerCase();
  let m=null;
  try{const snap=await fb.getDoc(fb.doc(fb.fs,'members/'+me));m=snap.exists()?snap.data():null}catch(e){m=null}
  if(!m){loginState={step:'denied',email:me,msg:''};return loginView()}
  isAdmin=m.role==='admin';authed=true;
  cloud.db=fb.shim;cloud.canWrite=true;
  let first=true;
  fb.shim.collection('games').onSnapshot(s=>{
    const mm={};s.docs.forEach(d=>{mm[d.id]=d.data()});cloud.remoteGames=mm;
    if(first){first=false;cloud.ready=true}
    refresh();
  },()=>{cloud.ready=true;refresh()});
  if(isAdmin)fb.shim.collection('members').onSnapshot(s=>{members=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>a.id<b.id?-1:1);if(sheet&&sheet.kind==='members')renderSheet()},()=>{});
  setTimeout(()=>{if(!cloud.ready){cloud.ready=true;refresh()}},8000);
  refresh();flush();
  const seen=lsGet(LS_HELP)==='1';lsSet(LS_HELP,'1');
  if(!seen&&lsGet(LS_HELP)==='1')openSheet('help',{sec:''});
}
document.addEventListener('click',async ev=>{
  const b=ev.target.closest('[data-act]');if(!b||authed)return;
  const a=b.dataset.act;
  if(a==='lang'){lang=b.dataset.l;lsSet(LS_LANG,lang);loginView();return}
  if(a==='lgsend'||a==='lgconfirm'){
    const email=(document.getElementById('lg-email').value||'').trim().toLowerCase();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){loginState={...loginState,email,msg:t('badEmail')};return loginView()}
    if(a==='lgconfirm')return finishLink(location.href,email);
    loginState={step:'loading',email,msg:''};loginView();
    try{await fb.sendSignInLinkToEmail(fb.auth,email,{url:continueUrl(),handleCodeInApp:true});lsSet('hgo.loginEmail',email);loginState={step:'sent',email,msg:''}}
    catch(e){loginState={step:'email',email,msg:t('sendFail')}}
    loginView();
  }
  if(a==='lgpaste'){const url=(document.getElementById('lg-paste').value||'').trim();
    if(!fb.isSignInWithEmailLink(fb.auth,url)){loginState={...loginState,msg:t('linkInvalid')};return loginView()}
    finishLink(url,loginState.email)}
  if(a==='lgback'){loginState={step:'email',email:'',msg:''};loginView()}
  if(a==='lgout'){await fb.signOut(fb.auth);loginState={step:'email',email:'',msg:''};loginView()}
});
async function addMember(email,roleName){
  try{await fb.setDoc(fb.doc(fb.fs,'members/'+email),{role:roleName,added:Date.now(),addedBy:me})}catch(e){toast(t('noWrite'))}
}
async function removeMember(email){try{await fb.deleteDoc(fb.doc(fb.fs,'members/'+email))}catch(e){toast(t('noWrite'))}}
async function signOutNow(){try{await fb.signOut(fb.auth)}catch(e){}location.reload()}

(async()=>{
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
      collection:p=>{const cons=[];const api={orderBy(f,dir){cons.push(F.orderBy(f,dir||'asc'));return api},limit(n){cons.push(F.limit(n));return api},
        onSnapshot(next,err){const q=cons.length?F.query(F.collection(fs,p),...cons):F.collection(fs,p);
          return F.onSnapshot(q,s=>next({docs:s.docs.map(d=>({id:d.id,data:()=>d.data()}))}),err)}};return api}
    };
    fb={auth,fs,shim,doc:F.doc,getDoc:F.getDoc,setDoc:F.setDoc,deleteDoc:F.deleteDoc,
      sendSignInLinkToEmail:U.sendSignInLinkToEmail,isSignInWithEmailLink:U.isSignInWithEmailLink,signInWithEmailLink:U.signInWithEmailLink,signOut:U.signOut};
    U.onAuthStateChanged(auth,u=>{onUser(u)});
  }catch(e){loginState={step:'email',email:'',msg:t('offlineStart')};loginView()}
})();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
