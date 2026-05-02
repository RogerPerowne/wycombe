// ═══════════════════════════════════════════════════════════════
//  Wycombe Abbey · Multi-Format Quiz Engine · v1.0
// ═══════════════════════════════════════════════════════════════
//  Topic files just provide:
//    var Qs    = [ ...question objects... ];
//    var TOPIC = { title, subtitle, badge };
//    bootQuiz(Qs, TOPIC);
//
//  Question types: elastic_sort, calculation, diagnostic_pair,
//  mcq, confidence_mcq, odd_one_out, multi_select, rank,
//  para_fill, data_table, diagram_interp, chain
// ═══════════════════════════════════════════════════════════════

var TYPE_META = {
  elastic_sort:   { label:'Visual Sort',           colour:'#e07a5f', bg:'rgba(224,122,95,.12)',  hint:'Classify each item' },
  calculation:    { label:'Calculation',            colour:'#9775b5', bg:'rgba(151,117,181,.12)', hint:'Show your working' },
  diagnostic_pair:{ label:'Compare Answers',        colour:'#2a9d8f', bg:'rgba(42,157,143,.12)',  hint:'Who gives the stronger response?' },
  mcq:            { label:'Multiple Choice',         colour:'#4a7fb5', bg:'rgba(74,127,181,.12)',  hint:'Select the correct answer' },
  confidence_mcq: { label:'Rate Your Confidence',   colour:'#c9a84c', bg:'rgba(201,168,76,.12)',  hint:'Answer, then rate how sure you are' },
  odd_one_out:    { label:'Odd One Out',             colour:'#e0933a', bg:'rgba(224,147,58,.12)',  hint:'Three share a property - find the exception' },
  multi_select:   { label:'Select All That Apply',   colour:'#4caf80', bg:'rgba(76,175,128,.12)',  hint:'More than one answer may be correct' },
  rank:           { label:'Rank in Order',           colour:'#6fa8d8', bg:'rgba(111,168,216,.12)', hint:'Tap items in correct order' },
  para_fill:      { label:'Complete the Analysis',   colour:'#2a9d8f', bg:'rgba(42,157,143,.12)',  hint:'Fill each blank to build the argument' },
  data_table:     { label:'Data Interpretation',     colour:'#d4a72c', bg:'rgba(212,167,44,.12)',  hint:'Read the data, then apply and evaluate' },
  diagram_interp: { label:'Read the Diagram',        colour:'#4a7fb5', bg:'rgba(74,127,181,.12)',  hint:'Interpret the labelled diagram' },
  chain:          { label:'Sequence the Chain',      colour:'#6fa8d8', bg:'rgba(111,168,216,.12)', hint:'Order the steps logically' }
};

var Qs = [];
var TOPIC = { title:'Quiz', subtitle:'', badge:'' };
var S = { qi:0, score:0, results:[], answered:false, rankOrder:[], pfSel:{}, msChecked:[], esChosen:{}, confChosen:-1, confPhase:'pick' };

// ═══════════════════════════════════════════════════════════════
//  OPTION SHUFFLING - randomise answer positions
// ───────────────────────────────────────────────────────────────
//  Set a question type to false to keep its original option order.
//  rank/chain are deliberately false because their renderers
//  already shuffle the display independently.
// ═══════════════════════════════════════════════════════════════
var SHUFFLE_CONFIG = {
  mcq:             true,
  confidence_mcq:  true,
  calculation:     true,
  data_table:      true,
  diagram_interp:  true,
  multi_select:    true,
  odd_one_out:     true,
  diagnostic_pair: true,
  elastic_sort:    true,
  para_fill:       true,
  rank:            false,
  chain:           false
};

// Fisher-Yates shuffle. Returns {arr, perm} where perm[i] = original index of item now at position i
function shuffleArr(arr){
  var a = arr.slice();
  var perm = []; for(var i=0;i<a.length;i++) perm.push(i);
  for(var i=a.length-1;i>0;i--){
    var j=Math.floor(Math.random()*(i+1));
    var tmp=a[i]; a[i]=a[j]; a[j]=tmp;
    var tp=perm[i]; perm[i]=perm[j]; perm[j]=tp;
  }
  return {arr:a, perm:perm};
}

function shuffleQuestion(q){
  if(!SHUFFLE_CONFIG[q.type]) return q;
  var nq={}; for(var k in q) nq[k]=q[k];

  if(q.type==='mcq' || q.type==='confidence_mcq' || q.type==='calculation' ||
     q.type==='data_table' || q.type==='diagram_interp'){
    var s=shuffleArr(q.opts);
    nq.opts=s.arr;
    nq.ans=s.perm.indexOf(q.ans);
  }
  else if(q.type==='multi_select'){
    var s=shuffleArr(q.opts);
    nq.opts=s.arr;
    nq.correct=q.correct.map(function(orig){ return s.perm.indexOf(orig); })
                        .sort(function(a,b){ return a-b; });
  }
  else if(q.type==='odd_one_out'){
    var s=shuffleArr(q.items);
    nq.items=s.arr;
    nq.ans=s.perm.indexOf(q.ans);
  }
  else if(q.type==='diagnostic_pair'){
    var s=shuffleArr(q.students);
    nq.students=s.arr;
    nq.ans=s.perm.indexOf(q.ans);
  }
  else if(q.type==='elastic_sort'){
    // Each good carries its own ans field, so no remap needed
    var s=shuffleArr(q.goods);
    nq.goods=s.arr;
  }
  else if(q.type==='para_fill'){
    nq.blanks=q.blanks.map(function(b){
      var s=shuffleArr(b.opts);
      var nb={}; for(var k in b) nb[k]=b[k];
      nb.opts=s.arr;
      nb.ans=s.perm.indexOf(b.ans);
      return nb;
    });
  }
  return nq;
}

// ═══════════════════════════════════════════════════════════════
//  HEADER + BOOT
// ═══════════════════════════════════════════════════════════════
function buildHeader(){
  var hub = TOPIC.hubUrl || 'micro-quiz.html';
  var home = TOPIC.homeUrl || 'index.html';
  var html = '<header>'
    +'<div class="hl">'
    +'<img class="hlogo" src="https://upload.wikimedia.org/wikipedia/commons/c/c5/Wycombe_Abbey_Lozenge_Grey_on_Blue_for_Wikipedia_19.02.20_KL.jpg" alt="WA" onerror="this.style.display=\'none\'">'
    +'<div><div class="htit">'+TOPIC.title+'</div><div class="hsub">'+(TOPIC.subtitle||'')+'</div></div>'
    +'</div>'
    +'<div class="hnav">'
    +'<a href="'+hub+'" class="hbtn">&#8592; Topics</a>'
    +'<a href="'+home+'" class="hbtn">&#8962; Home</a>'
    +(TOPIC.badge?'<span class="hbdg">'+TOPIC.badge+'</span>':'')
    +'</div></header>'
    +'<div class="app" id="root"></div>';
  document.body.insertAdjacentHTML('afterbegin', html);
}

function bootQuiz(questions, topicConfig){
  Qs = questions.map(shuffleQuestion);
  TOPIC = topicConfig || TOPIC;
  document.title = TOPIC.title + ' - Wycombe Abbey';
  buildHeader();
  renderQ(0);
}

// ═══════════════════════════════════════════════════════════════
//  CORE UTILITIES
// ═══════════════════════════════════════════════════════════════
function r(html){ document.getElementById('root').innerHTML='<div class="fade-up">'+html+'</div>'; window.scrollTo(0,0); }
function typeBadge(type){
  var m=TYPE_META[type];
  return '<span class="type-badge" style="color:'+m.colour+';border-color:'+m.colour+'55;background:'+m.bg+'">'+m.label+'</span>';
}
function qHeader(q){
  var prog=((q.n-1)/Qs.length*100).toFixed(0);
  return '<div class="q-top">'+typeBadge(q.type)+'<div class="q-score-display"><div class="q-score-lbl">Score</div><div class="q-score-val">'+S.score+' / '+(q.n-1)+'</div></div></div>'
    +'<div class="q-progress"><div class="q-prog-fill" style="width:'+prog+'%"></div></div>'
    +'<div class="q-num">Question '+q.n+' of '+Qs.length+'</div>';
}
function feedbackHTML(ok, exp){
  return '<div class="feedback '+(ok?'ok':'bad')+' show" id="fb">'
    +'<div class="fb-head">'+(ok?'&#10003; Correct - well done':'&#10007; Not quite - here is the analysis')+'</div>'
    +'<div class="fb-body">'+exp+'</div></div>';
}
function nextBtnHTML(qi){
  return '<div class="next-row show" id="nr">'
    +(qi<Qs.length-1
      ? '<button class="btn b-blue" onclick="advance()">Next Question &rarr;</button>'
      : '<button class="btn b-blue" onclick="renderResults()">See Results &rarr;</button>')
    +'</div>';
}
function recordResult(ok, summary){
  if(ok) S.score++;
  S.results.push({ok:ok, n:S.qi+1, type:Qs[S.qi].type, summary:summary});
}
function advance(){ S.qi++; S.answered=false; renderQ(S.qi); }

function renderQ(qi){
  S.answered=false;
  var q=Qs[qi];
  if(q.type==='elastic_sort')         renderElasticSort(q);
  else if(q.type==='calculation')     renderCalculation(q);
  else if(q.type==='diagnostic_pair') renderDiagnosticPair(q);
  else if(q.type==='mcq')             renderMCQ(q);
  else if(q.type==='confidence_mcq')  renderConfidenceMCQ(q);
  else if(q.type==='odd_one_out')     renderOddOneOut(q);
  else if(q.type==='multi_select')    renderMultiSelect(q);
  else if(q.type==='rank')            renderRank(q);
  else if(q.type==='para_fill')       renderParaFill(q);
  else if(q.type==='data_table')      renderDataTable(q);
  else if(q.type==='diagram_interp')  renderDiagramInterp(q);
  else if(q.type==='chain')           renderChain(q);
}

// ═══════════════════════════════════════════════════════════════
//  VISUAL SORT (elastic_sort generalised - supports N categories)
// ═══════════════════════════════════════════════════════════════
function renderElasticSort(q){
  S.esChosen={};
  var cats = q.categories || ['elastic','inelastic'];
  var labels = q.categoryLabels || ['Elastic','Inelastic'];
  var cards=q.goods.map(function(g,i){
    var btnHtml = cats.map(function(c, ci){
      return '<button class="es-btn" id="esb'+i+'_'+c+'" onclick="pickES('+i+',\''+c+'\')">'+labels[ci]+'</button>';
    }).join('');
    return '<div class="es-card" id="esc'+i+'">'
      +'<div class="es-icon">'+g.icon+'</div>'
      +'<div class="es-label">'+g.label+'</div>'
      +'<div class="es-note">'+g.note+'</div>'
      +'<div class="es-btns">'+btnHtml+'</div></div>';
  }).join('');
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<div class="es-tally" id="es-tally"><span><strong>0</strong> / '+q.goods.length+' classified</span></div>'
    +'<div class="es-grid">'+cards+'</div>'
    +'<div style="text-align:center;margin-bottom:.9rem"><button class="btn b-submit" id="es-sub" onclick="submitES()" disabled>Check my answers</button></div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function pickES(i, choice){
  if(S.answered) return;
  S.esChosen[i]=choice;
  var q = Qs[S.qi];
  var cats = q.categories || ['elastic','inelastic'];
  var card=document.getElementById('esc'+i);
  card.classList.add('classified');
  cats.forEach(function(c){
    var btn=document.getElementById('esb'+i+'_'+c);
    if(c===choice) btn.classList.add('picked');
    else btn.classList.remove('picked');
  });
  var done=Object.keys(S.esChosen).length;
  document.getElementById('es-tally').innerHTML='<span><strong>'+done+'</strong> / '+q.goods.length+' classified</span>';
  document.getElementById('es-sub').disabled=(done<q.goods.length);
}
function submitES(){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi];
  var cats = q.categories || ['elastic','inelastic'];
  var nCorrect=0;
  q.goods.forEach(function(g,i){
    var card=document.getElementById('esc'+i);
    var chosen=S.esChosen[i];
    var correct=(chosen===g.ans);
    if(correct) nCorrect++;
    card.classList.remove('classified');
    card.classList.add(correct?'es-correct':'es-wrong');
    cats.forEach(function(c){
      var btn=document.getElementById('esb'+i+'_'+c);
      btn.classList.add('locked'); btn.classList.remove('picked');
      if(c===chosen && correct) btn.classList.add('right-pick');
      else if(c===chosen && !correct) btn.classList.add('wrong-pick');
      else if(c===g.ans && !correct) btn.classList.add('true-answer');
    });
  });
  var allOk=(nCorrect===q.goods.length);
  recordResult(allOk, nCorrect+' of '+q.goods.length+' classified correctly');
  document.getElementById('es-sub').disabled=true;
  document.getElementById('es-tally').innerHTML='<span><strong>'+nCorrect+'</strong> / '+q.goods.length+' correct</span>';
  var prefix='<strong>You got '+nCorrect+' out of '+q.goods.length+' right.</strong><br><br>';
  document.getElementById('fb').outerHTML=feedbackHTML(allOk, prefix+q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  CALCULATION
// ═══════════════════════════════════════════════════════════════
function renderCalculation(q){
  var steps=q.working.map(function(w){ return '<div class="calc-step">'+w+'</div>'; }).join('');
  var opts=q.opts.map(function(o,i){
    return '<button class="calc-opt" id="copt'+i+'" onclick="pickCalc('+i+')">'
      +'<span class="calc-letter">'+String.fromCharCode(65+i)+'</span>'
      +'<span class="calc-ped">'+o.ped+'</span>'
      +'<span><div class="calc-type-lbl">'+o.typ+'</div><div class="calc-rev">'+o.rev+'</div></span>'
      +'</button>';
  }).join('');
  r(qHeader(q)+'<div class="calc-context"><div class="calc-ctx-lbl">SCENARIO</div><div class="calc-ctx-text">'+q.context+'</div></div>'
    +'<div style="margin-bottom:.9rem"><button class="calc-toggle" onclick="toggleWorking()">Show working</button>'
    +'<div class="calc-working" id="calc-work">'+steps+'</div></div>'
    +'<div class="q-stem">'+q.stem+'</div>'
    +'<div class="calc-opts">'+opts+'</div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function toggleWorking(){
  var w=document.getElementById('calc-work');
  var btn=document.querySelector('.calc-toggle');
  w.classList.toggle('show');
  btn.textContent=w.classList.contains('show')?'Hide working':'Show working';
}
function pickCalc(i){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi]; var ok=(i===q.ans);
  recordResult(ok,'Selected row '+String.fromCharCode(65+i));
  document.getElementById('calc-work').classList.add('show');
  document.querySelector('.calc-toggle').textContent='Working shown';
  document.querySelectorAll('.calc-opt').forEach(function(el){ el.classList.add('locked'); });
  document.getElementById('copt'+q.ans).classList.add(ok?'correct':'reveal');
  if(!ok) document.getElementById('copt'+i).classList.add('wrong');
  document.getElementById('fb').outerHTML=feedbackHTML(ok,q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  DIAGNOSTIC PAIR
// ═══════════════════════════════════════════════════════════════
function renderDiagnosticPair(q){
  var cards=q.students.map(function(st,i){
    return '<div class="pair-card" id="pc'+i+'" onclick="pickPair('+i+')">'
      +'<div class="pair-header"><div class="pair-name">'+st.name+'</div><span class="pair-badge">'+st.badge+'</span></div>'
      +'<div class="pair-body">'+st.answer+'</div></div>';
  }).join('');
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<p class="pair-instr">Read both answers carefully, then tap the one you think would score more highly in an Edexcel exam.</p>'
    +'<div class="pair-grid">'+cards+'</div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function pickPair(i){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi]; var ok=(i===q.ans);
  recordResult(ok,'Chose '+q.students[i].name);
  document.querySelectorAll('.pair-card').forEach(function(el){ el.classList.add('locked'); });
  document.getElementById('pc'+q.ans).classList.add('winner');
  if(!ok) document.getElementById('pc'+i).classList.add('chosen-wrong');
  else document.querySelectorAll('.pair-card').forEach(function(el,j){ if(j!==q.ans) el.classList.add('loser'); });
  document.getElementById('fb').outerHTML=feedbackHTML(ok,q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  STANDARD MCQ
// ═══════════════════════════════════════════════════════════════
function renderMCQ(q){
  var opts=q.opts.map(function(o,i){
    return '<button class="mcq-opt" id="mo'+i+'" onclick="pickMCQ('+i+')">'
      +'<span class="opt-letter">'+String.fromCharCode(65+i)+'</span>'
      +'<span class="opt-text">'+o+'</span></button>';
  }).join('');
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<div class="mcq-opts">'+opts+'</div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function pickMCQ(i){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi]; var ok=(i===q.ans);
  recordResult(ok,'Selected '+String.fromCharCode(65+i));
  document.querySelectorAll('.mcq-opt').forEach(function(el){ el.classList.add('locked'); });
  document.getElementById('mo'+q.ans).classList.add(ok?'correct':'reveal');
  if(!ok) document.getElementById('mo'+i).classList.add('wrong');
  document.getElementById('fb').outerHTML=feedbackHTML(ok,q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  CONFIDENCE MCQ
// ═══════════════════════════════════════════════════════════════
function renderConfidenceMCQ(q){
  S.confChosen=-1; S.confPhase='pick';
  var opts=q.opts.map(function(o,i){
    return '<button class="mcq-opt" id="cmo'+i+'" onclick="pickConfAnswer('+i+')">'
      +'<span class="opt-letter">'+String.fromCharCode(65+i)+'</span>'
      +'<span class="opt-text">'+o+'</span></button>';
  }).join('');
  var confPanel='<div class="conf-panel" id="conf-panel">'
    +'<div class="conf-q">Now - how confident were you in that answer?</div>'
    +'<div class="conf-btns">'
    +'<button class="conf-btn conf-certain" onclick="pickConfLevel(\'certain\')">&#10003; Very sure</button>'
    +'<button class="conf-btn conf-unsure" onclick="pickConfLevel(\'unsure\')">~ Fairly sure</button>'
    +'<button class="conf-btn conf-guess" onclick="pickConfLevel(\'guess\')">? Just guessing</button>'
    +'</div></div>';
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<div class="mcq-opts">'+opts+'</div>'+confPanel
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function pickConfAnswer(i){
  if(S.answered||S.confChosen!==-1) return;
  S.confChosen=i;
  document.querySelectorAll('.mcq-opt').forEach(function(el){ el.classList.add('locked'); });
  var el=document.getElementById('cmo'+i);
  el.style.borderColor='rgba(201,168,76,.5)';
  el.style.background='rgba(201,168,76,.07)';
  document.getElementById('conf-panel').classList.add('show');
}
function pickConfLevel(level){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi]; var ok=(S.confChosen===q.ans);
  recordResult(ok,'Selected '+String.fromCharCode(65+S.confChosen)+' (confidence: '+level+')');
  document.querySelectorAll('.conf-btn').forEach(function(el){ el.style.opacity='.35';el.style.cursor='default';el.disabled=true; });
  document.getElementById('cmo'+q.ans).classList.add(ok?'correct':'reveal');
  if(!ok) document.getElementById('cmo'+S.confChosen).classList.add('wrong');
  var tone='';
  if(ok && level==='certain') tone='Excellent - you knew this one cold.';
  else if(ok && level==='unsure') tone='Good instinct - trust it next time.';
  else if(ok && level==='guess') tone='Lucky this time - make sure you understand <em>why</em> it is correct.';
  else if(!ok && level==='certain') tone='<strong>Watch out:</strong> you were very confident but this is wrong - a misconception worth fixing.';
  else if(!ok && level==='unsure') tone='The uncertainty was well-founded. Study this one carefully.';
  else tone='At least you knew you were not sure. Now read the explanation below.';
  var tagText=level==='certain'?'Very sure':level==='unsure'?'Fairly sure':'Guessing';
  var prefix='<span class="conf-tag '+level+'">'+tagText+'</span>'+tone+'<br><br>';
  document.getElementById('fb').outerHTML=feedbackHTML(ok,prefix+q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  ODD ONE OUT
// ═══════════════════════════════════════════════════════════════
function renderOddOneOut(q){
  var cards=q.items.map(function(it,i){
    return '<button class="oo-card" id="oo'+i+'" onclick="pickOOO('+i+')">'
      +'<div class="oo-icon">'+it.icon+'</div>'
      +'<div class="oo-label">'+it.label+'</div>'
      +'<div class="oo-note">'+it.note+'</div></button>';
  }).join('');
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<div class="oo-grid">'+cards+'</div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function pickOOO(i){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi]; var ok=(i===q.ans);
  recordResult(ok,'Tapped item '+(i+1)+': '+q.items[i].label);
  document.querySelectorAll('.oo-card').forEach(function(el){ el.classList.add('locked'); });
  document.getElementById('oo'+q.ans).classList.add('is-odd');
  if(!ok) document.getElementById('oo'+i).classList.add('chosen-wrong');
  document.querySelectorAll('.oo-card').forEach(function(el,j){
    if(j!==q.ans&&j!==i) el.classList.add('dimmed');
  });
  document.getElementById('fb').outerHTML=feedbackHTML(ok,q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  MULTI SELECT
// ═══════════════════════════════════════════════════════════════
function renderMultiSelect(q){
  S.msChecked=q.opts.map(function(){ return false; });
  var opts=q.opts.map(function(o,i){
    return '<button class="ms-opt" id="ms'+i+'" onclick="toggleMS('+i+')">'
      +'<div class="ms-box" id="msb'+i+'"></div>'
      +'<span class="ms-opt-text">'+String.fromCharCode(65+i)+'. '+o+'</span></button>';
  }).join('');
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<p class="ms-instr">Tick all that apply. Select as many or as few as you think are correct.</p>'
    +'<div class="ms-opts">'+opts+'</div>'
    +'<div style="text-align:center;margin-bottom:.9rem"><button class="btn b-submit" id="ms-sub" onclick="submitMS()">Check my selection</button></div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function toggleMS(i){
  if(S.answered) return;
  S.msChecked[i]=!S.msChecked[i];
  var opt=document.getElementById('ms'+i);
  var box=document.getElementById('msb'+i);
  opt.classList.toggle('checked',S.msChecked[i]);
  box.innerHTML=S.msChecked[i]?'&#10003;':'';
}
function submitMS(){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi];
  var correctSet={}; q.correct.forEach(function(idx){ correctSet[idx]=true; });
  var allOk=true;
  S.msChecked.forEach(function(checked,i){ if(checked!==!!correctSet[i]) allOk=false; });
  recordResult(allOk,'Multi-select submitted');
  document.querySelectorAll('.ms-opt').forEach(function(el,i){
    el.classList.add('locked');
    var shouldBe=!!correctSet[i];
    var was=S.msChecked[i];
    el.classList.remove('checked');
    if(shouldBe&&was) { el.classList.add('result-correct'); document.getElementById('msb'+i).innerHTML='&#10003;'; }
    else if(!shouldBe&&was) { el.classList.add('result-wrong'); document.getElementById('msb'+i).innerHTML='&#10007;'; }
    else if(shouldBe&&!was) { el.classList.add('result-missed'); document.getElementById('msb'+i).innerHTML='&#9711;'; }
  });
  document.getElementById('ms-sub').disabled=true;
  document.getElementById('fb').outerHTML=feedbackHTML(allOk,q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  RANK ORDER (also used for chain via render wrapper)
// ═══════════════════════════════════════════════════════════════
function renderRank(q){
  renderRankInner(q, q.instr || 'Tap the <strong>most elastic</strong> good first, working down to the <strong>least elastic</strong>. Tap a ranked item again to remove it from the ranking.', q.mostLabel || '&uarr; Most elastic', q.leastLabel || 'Least elastic &darr;');
}
function renderRankInner(q, instr, mostLbl, leastLbl){
  S.rankOrder=[];
  var n = q.items.length;
  var idxArr = []; for(var k=0;k<n;k++) idxArr.push(k);
  var display=idxArr.sort(function(){ return Math.random()-.5; });
  var slots=''; for(var k=1;k<=n;k++){ slots += '<div class="rank-slot" id="rs'+k+'">'+k+'</div>'; }
  var cards=display.map(function(origIdx){
    var it=q.items[origIdx];
    return '<button class="rank-item" id="ri'+origIdx+'" onclick="tapRank('+origIdx+')">'
      +'<div class="rank-badge" id="rb'+origIdx+'">?</div>'
      +'<div class="rank-label">'+it.label+'</div>'
      +'<div class="rank-note">'+it.note+'</div></button>';
  }).join('');
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<div class="rank-instr">'+instr+'</div>'
    +'<div class="rank-tracker"><span class="rank-tracker-lbl">Your order:</span>'+slots+'</div>'
    +'<div style="display:flex;justify-content:space-between"><span class="rank-most-lbl">'+mostLbl+'</span><span class="rank-least-lbl">'+leastLbl+'</span></div>'
    +'<div class="rank-grid">'+cards+'</div>'
    +'<div style="text-align:center;margin-bottom:.9rem"><button class="btn b-submit" id="rank-sub" onclick="submitRank()" disabled>Check my answer</button></div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function tapRank(origIdx){
  if(S.answered) return;
  var q = Qs[S.qi];
  var n = q.items.length;
  var pos=S.rankOrder.indexOf(origIdx);
  if(pos>=0){
    S.rankOrder.splice(pos,1);
    document.getElementById('ri'+origIdx).classList.remove('selected');
    document.getElementById('rb'+origIdx).textContent='?';
  } else {
    if(S.rankOrder.length>=n) return;
    S.rankOrder.push(origIdx);
    document.getElementById('ri'+origIdx).classList.add('selected');
  }
  S.rankOrder.forEach(function(idx,i){ document.getElementById('rb'+idx).textContent=(i+1); });
  for(var nn=1;nn<=n;nn++){
    var slot=document.getElementById('rs'+nn);
    if(nn<=S.rankOrder.length) slot.classList.add('filled');
    else slot.classList.remove('filled');
  }
  document.getElementById('rank-sub').disabled=(S.rankOrder.length<n);
}
function submitRank(){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi];
  var allOk=S.rankOrder.every(function(idx,i){ return idx===q.correctOrder[i]; });
  recordResult(allOk,'Order: '+S.rankOrder.map(function(i){ return q.items[i].label; }).join(' > '));
  document.querySelectorAll('.rank-item').forEach(function(el){ el.classList.add('locked'); el.classList.remove('selected'); });
  q.correctOrder.forEach(function(idx,i){
    var el=document.getElementById('ri'+idx);
    var badge=document.getElementById('rb'+idx);
    var studentPos=S.rankOrder.indexOf(idx);
    var correct=(studentPos===i);
    el.classList.add(correct?'rank-correct':'rank-wrong');
    badge.textContent=(i+1);
  });
  document.getElementById('rank-sub').disabled=true;
  document.getElementById('fb').outerHTML=feedbackHTML(allOk,q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  CHAIN (cause-effect ordering — same UI as rank, different framing)
// ═══════════════════════════════════════════════════════════════
function renderChain(q){
  renderRankInner(q, q.instr || 'Tap the events in the correct logical order, from <strong>first cause</strong> to <strong>final consequence</strong>. Tap an item again to remove it from the sequence.', '&uarr; First cause', 'Final consequence &darr;');
}

// ═══════════════════════════════════════════════════════════════
//  PARA FILL
// ═══════════════════════════════════════════════════════════════
function renderParaFill(q){
  S.pfSel={};
  var anchor = q.anchor ? '<span class="para-anchor">'+q.anchor+'</span>' : '';
  var para=q.para;
  q.blanks.forEach(function(b){
    para=para.replace('['+b.id+']','<span class="blank-pill" id="bp'+b.id+'">['+b.id+']</span>');
  });
  var rows=q.blanks.map(function(b){
    var opts=b.opts.map(function(o,i){
      return '<button class="pf-opt" id="pf'+b.id+'_'+i+'" onclick="pickPFOpt('+b.id+','+i+')">'+o+'</button>';
    }).join('');
    return '<div class="pf-row"><span class="pf-row-num">['+b.id+']</span>'+opts+'</div>';
  }).join('');
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<div class="para-box">'+anchor+para+'</div>'
    +'<div class="pf-controls">'+rows+'</div>'
    +'<div class="pf-submit-row"><button class="btn b-submit" id="pf-sub" onclick="submitPF()" disabled>Check my paragraph</button></div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function pickPFOpt(bi,oi){
  if(S.answered) return;
  S.pfSel[bi]=oi;
  var q=Qs[S.qi];
  var blank = q.blanks.find(function(b){ return b.id===bi; });
  var pill=document.getElementById('bp'+bi);
  if(pill){ pill.textContent=blank.opts[oi]; pill.classList.add('filled'); }
  blank.opts.forEach(function(_,i){
    var btn=document.getElementById('pf'+bi+'_'+i);
    if(btn) btn.classList.toggle('selected',i===oi);
  });
  var allDone=q.blanks.every(function(b){ return S.pfSel[b.id]!==undefined; });
  document.getElementById('pf-sub').disabled=!allDone;
}
function submitPF(){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi];
  var allOk=q.blanks.every(function(b){ return S.pfSel[b.id]===b.ans; });
  recordResult(allOk,'Paragraph completed');
  q.blanks.forEach(function(b){
    var chosen=S.pfSel[b.id];
    var ok=(chosen===b.ans);
    var pill=document.getElementById('bp'+b.id);
    if(pill){
      pill.classList.add(ok?'pf-correct':'pf-wrong');
      if(!ok) pill.textContent=b.opts[b.ans]+' (correct)';
    }
    b.opts.forEach(function(_,i){
      var btn=document.getElementById('pf'+b.id+'_'+i);
      if(btn){
        btn.classList.add('locked'); btn.classList.remove('selected');
        if(i===b.ans) btn.classList.add('pf-opt-correct');
        else if(i===chosen&&!ok) btn.classList.add('pf-opt-wrong');
      }
    });
  });
  document.getElementById('pf-sub').disabled=true;
  document.getElementById('fb').outerHTML=feedbackHTML(allOk,q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  DATA TABLE
// ═══════════════════════════════════════════════════════════════
function renderDataTable(q){
  var thead='<tr>'+q.headers.map(function(h){ return '<th>'+h+'</th>'; }).join('')+'</tr>';
  var tbody=q.rows.map(function(row){
    return '<tr>'+row.map(function(cell,ci){
      var cls=(ci===q.headers.length-1 && q.pedValues)?'ped-cell':'';
      return '<td class="'+cls+'">'+cell+'</td>';
    }).join('')+'</tr>';
  }).join('');
  var opts=q.opts.map(function(o,i){
    return '<button class="mcq-opt" id="dmo'+i+'" onclick="pickDT('+i+')">'
      +'<span class="opt-letter">'+String.fromCharCode(65+i)+'</span>'
      +'<span class="opt-text">'+o+'</span></button>';
  }).join('');
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<div class="tbl-wrap"><table><thead>'+thead+'</thead><tbody>'+tbody+'</tbody></table></div>'
    +'<div class="q-stem" style="margin-bottom:1rem">'+q.question+'</div>'
    +'<div class="mcq-opts">'+opts+'</div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function pickDT(i){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi]; var ok=(i===q.ans);
  recordResult(ok,'Selected '+String.fromCharCode(65+i));
  document.querySelectorAll('.mcq-opt').forEach(function(el){ el.classList.add('locked'); });
  document.getElementById('dmo'+q.ans).classList.add(ok?'correct':'reveal');
  if(!ok) document.getElementById('dmo'+i).classList.add('wrong');
  if(q.pedValues){
    document.querySelectorAll('.ped-cell').forEach(function(cell,ri){
      setTimeout(function(){ cell.innerHTML=q.pedValues[ri]; cell.classList.add('revealed'); }, ri*150);
    });
  }
  document.getElementById('fb').outerHTML=feedbackHTML(ok,q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  DIAGRAM INTERPRETATION
// ═══════════════════════════════════════════════════════════════
function renderDiagramInterp(q){
  var opts=q.opts.map(function(o,i){
    return '<button class="mcq-opt" id="dimo'+i+'" onclick="pickDIM('+i+')">'
      +'<span class="opt-letter">'+String.fromCharCode(65+i)+'</span>'
      +'<span class="opt-text">'+o+'</span></button>';
  }).join('');
  r(qHeader(q)+'<div class="q-stem">'+q.stem+'</div>'
    +'<div class="diag-box">'+q.svg+(q.caption?'<div class="diag-caption">'+q.caption+'</div>':'')+'</div>'
    +'<div class="q-stem" style="margin-bottom:1rem">'+q.question+'</div>'
    +'<div class="mcq-opts">'+opts+'</div>'
    +'<div id="fb"></div><div id="nr" class="next-row"></div>');
}
function pickDIM(i){
  if(S.answered) return; S.answered=true;
  var q=Qs[S.qi]; var ok=(i===q.ans);
  recordResult(ok,'Selected '+String.fromCharCode(65+i));
  document.querySelectorAll('.mcq-opt').forEach(function(el){ el.classList.add('locked'); });
  document.getElementById('dimo'+q.ans).classList.add(ok?'correct':'reveal');
  if(!ok) document.getElementById('dimo'+i).classList.add('wrong');
  document.getElementById('fb').outerHTML=feedbackHTML(ok,q.exp);
  document.getElementById('nr').outerHTML=nextBtnHTML(S.qi);
}

// ═══════════════════════════════════════════════════════════════
//  RESULTS
// ═══════════════════════════════════════════════════════════════
function renderResults(){
  var total=Qs.length;
  var pct=Math.round(S.score/total*100);
  var col=pct>=80?'var(--green)':pct>=60?'var(--goldl)':pct>=40?'var(--orange)':'var(--red)';
  var verdict=pct>=80?'Excellent command of this topic - the full picture is clear.'
    :pct>=60?'Solid understanding. A few analytical gaps remain.'
    :pct>=40?'Developing - some core ideas need more work.'
    :'This topic needs focused revision before the exam.';
  var reviewItems=S.results.map(function(rv){
    var m=TYPE_META[rv.type];
    return '<div class="rv-item">'
      +'<div class="rv-dot '+(rv.ok?'ok':'bad')+'">'+(rv.ok?'&#10003;':'&#10007;')+'</div>'
      +'<div><div class="rv-type" style="color:'+m.colour+'">Q'+rv.n+' &middot; '+m.label+'</div>'
      +'<div class="rv-q">'+rv.summary+'</div></div></div>';
  }).join('');
  var hub = TOPIC.hubUrl || 'micro-quiz.html';
  var home = TOPIC.homeUrl || 'index.html';
  r('<div class="results-wrap">'
    +'<div class="results-hero">'
    +'<div class="results-lbl">'+TOPIC.title+' &middot; Session Complete</div>'
    +'<div class="results-score" style="color:'+col+'">'+S.score+'<span style="font-size:2.2rem;color:var(--mut);opacity:.35"> / '+total+'</span></div>'
    +'<div class="results-lbl">'+pct+'% correct</div>'
    +'<div class="results-verdict">'+verdict+'</div></div>'
    +'<div style="font-family:\'IBM Plex Mono\',monospace;font-size:.55rem;text-transform:uppercase;letter-spacing:.1em;color:var(--mut);opacity:.55;margin-bottom:.65rem">Session Review</div>'
    +'<div class="review-grid">'+reviewItems+'</div>'
    +'<div id="save-status" style="text-align:center;margin-top:.8rem;font-family:\'IBM Plex Mono\',monospace;font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;min-height:1.4em"></div>'
    +'<div style="display:flex;justify-content:center;gap:.7rem;flex-wrap:wrap;margin-top:.6rem">'
    +'<button class="btn b-blue" onclick="restartSession()">Try Again</button>'
    +'<a href="'+hub+'" class="btn b-sec">All Topics</a>'
    +'<a href="'+home+'" class="btn b-sec">Home</a>'
    +'</div><div style="height:2rem"></div></div>');
  // Save score to Supabase if logged in
  if(typeof WA !== 'undefined' && WA.isLoggedIn() && TOPIC.id){
    var el = document.getElementById('save-status');
    el.textContent = 'Saving score...';
    el.style.color = 'var(--mut)';
    el.style.opacity = '.5';
    WA.saveScore(TOPIC.id, S.score, total).then(function(res){
      if(res.ok){
        el.textContent = '\u2713 Score saved to your profile';
        el.style.color = 'var(--green)';
        el.style.opacity = '.7';
      } else {
        el.textContent = 'Could not save — ' + (res.error || 'unknown error');
        el.style.color = 'var(--orange)';
        el.style.opacity = '.6';
      }
    });
  }
}
function restartSession(){
  S={qi:0,score:0,results:[],answered:false,rankOrder:[],pfSel:{},msChecked:[],esChosen:{},confChosen:-1,confPhase:'pick'};
  renderQ(0);
}
