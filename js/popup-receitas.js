// Pop-up "Onde você quer receber suas receitas?" — abre nos botões da página de vendas antes do checkout.
// Pede nome, e-mail e WhatsApp, chama registrarLeadPopup (js/lead-popup.js: checkout já preenchido,
// carrinho, CRM e amostra grátis em 15 min) e segue para o checkout. Uso: abrirPopupReceitas(urlDoCheckout).
//
// LIGADO = false: os botões vão direto ao checkout. Para ver o pop-up mesmo desligado, abra a página com ?popup=1.
// A dona pediu para ligar só depois que a Meta aprovar as mensagens do funil no CRM.
(function () {
  var LIGADO = false;
  window.popupReceitasAtivo = function () { return LIGADO || /[?&]popup=1(&|$)/.test(location.search); };

  var DDDS = '11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'.split(' ');
  var destino = '';

  // País do WhatsApp (lista em /js/paises.js). Abre no país do IP da pessoa; Brasil é o padrão.
  var PAISES = window.PAISES || [{ sigla: 'BR', nome: 'Brasil', ddi: '55', bandeira: '🇧🇷' }];
  var pais = PAISES[0];
  function ehBR() { return pais.sigla === 'BR'; }
  function soDig(v) { return String(v || '').replace(/\D/g, ''); }
  // Número de fora: só dígitos, sem o código do país se a pessoa digitou ele também
  function digitosExterior(v) {
    var d = soDig(v);
    if (d.indexOf(pais.ddi) === 0 && d.length >= pais.ddi.length + 8) d = d.slice(pais.ddi.length);
    return d.slice(0, 14);
  }
  function digitosBR(v) { var d = soDig(v); if (d.length >= 12 && d.slice(0, 2) === '55') d = d.slice(2); return d.slice(0, 11); }
  function celularOk(v) {
    if (ehBR()) { var d = digitosBR(v); return d.length === 11 && DDDS.indexOf(d.slice(0, 2)) >= 0 && d.charAt(2) === '9'; }
    var x = digitosExterior(v);
    if (pais.ddi === '1') return x.length === 10 && /[2-9]/.test(x.charAt(0)) && /[2-9]/.test(x.charAt(3)); // EUA/Canadá
    return x.length >= 6 && x.length <= 14;
  }
  // O que vai para o checkout/CRM: Brasil só DDD + número (como o checkout salva); fora, "+<código do país><número>"
  function telefoneParaEnvio(v) { return ehBR() ? digitosBR(v) : '+' + pais.ddi + digitosExterior(v); }
  function escolherPais(sigla) {
    pais = PAISES.filter(function (p) { return p.sigla === sigla; })[0] || PAISES[0];
    var sel = document.getElementById('pr-pais');
    if (!sel) return;
    sel.value = pais.sigla;
    document.getElementById('pr-bandeira').textContent = pais.bandeira;
    document.getElementById('pr-ddi').textContent = '+' + pais.ddi;
    var cel = document.getElementById('pr-cel');
    var estreito = window.innerWidth <= 340;
    cel.placeholder = ehBR() ? (estreito ? 'DDD + número' : 'WhatsApp com DDD') : (estreito ? 'Número' : 'Número com código da cidade');
    cel.value = mascara(cel.value);
    document.getElementById('pr-cel-erro').textContent = ehBR()
      ? 'Digite o celular com DDD e o 9 na frente.'
      : 'Confira o número: ele precisa estar completo para o WhatsApp encontrar.';
  }
  // Seleção de país manual, sem detecção de IP.
  function mascara(v) {
    if (!ehBR()) return digitosExterior(v);
    var d = digitosBR(v);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  var ICONES = {
    pessoa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.3L4.4 7H4v.6l8 5.5 8-5.5V7h-.4L12 12.3Z"/></svg>',
    zap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.6.4.1.1.1.7-.1 1.4Z"/></svg>',
    seta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 5.3 19.9 12l-6.7 6.7-1.4-1.4 4.3-4.3H4v-2h12.1l-4.3-4.3 1.4-1.4Z"/></svg>'
  };

  var css = '' +
    '.pr-fundo{position:fixed;inset:0;z-index:2147483000;background:rgba(36,20,8,.66);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .22s}' +
    '.pr-fundo.on{opacity:1}' +
    '.pr-caixa{position:relative;width:100%;max-width:410px;max-height:calc(100dvh - 24px);overflow:auto;background:#fffaf4;border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.4);font-family:Raleway,Montserrat,Arial,sans-serif;color:#2b1a0e;transform:translateY(16px) scale(.98);transition:transform .25s cubic-bezier(.2,.9,.3,1.2)}' +
    '.pr-fundo.on .pr-caixa{transform:none}' +
    '.pr-topo{position:relative;display:flex;align-items:center;gap:12px;padding:20px 48px 18px 16px;background:linear-gradient(135deg,#5a2e12 0%,#8a4a1c 55%,#b8692a 100%);color:#fff;border-radius:22px 22px 0 0;overflow:hidden}' +
    '.pr-topo:after{content:"";position:absolute;right:-40px;top:-40px;width:140px;height:140px;border-radius:50%;background:rgba(255,213,127,.16)}' +
    '.pr-capa{width:84px;height:auto;flex:none;filter:drop-shadow(0 8px 14px rgba(0,0,0,.35));position:relative;z-index:1}' +
    '.pr-topo-txt{position:relative;z-index:1}' +
    '.pr-passo{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#ffd57f;margin-bottom:6px}' +
    '.pr-passo i{display:inline-block;width:34px;height:4px;border-radius:4px;background:rgba(255,255,255,.25);overflow:hidden;position:relative}' +
    '.pr-passo i:before{content:"";position:absolute;top:0;bottom:0;left:0;width:50%;background:#ffd57f;border-radius:4px}' +
    '.pr-topo h2{margin:0;font-family:Montserrat,Raleway,Arial,sans-serif;font-size:21px;line-height:1.2;font-weight:800;letter-spacing:-.01em}' +
    '.pr-topo h2 b{color:#ffd57f}' +
    '.pr-x{position:absolute;top:10px;right:10px;z-index:2;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font-size:22px;line-height:36px;cursor:pointer;padding:0}' +
    '.pr-corpo{padding:18px 18px 16px}' +
    '.pr-sub{margin:0 0 14px;font-size:14.5px;line-height:1.45;color:#5d4636}' +
    '.pr-sub b{color:#2b1a0e}' +
    '.pr-campo{margin-bottom:11px}' +
    '.pr-input{position:relative}' +
    '.pr-input svg{position:absolute;left:14px;top:50%;width:20px;height:20px;transform:translateY(-50%);fill:#c08a5c;pointer-events:none}' +
    '.pr-input input{width:100%;box-sizing:border-box;height:54px;border:1.5px solid #ead9c6;border-radius:14px;padding:0 14px 0 44px;font-size:16px;font-family:inherit;font-weight:600;background:#fff;color:#2b1a0e;outline:none;transition:border-color .15s,box-shadow .15s}' +
    '.pr-input input::placeholder{color:#a8927f;font-weight:500}' +
    '.pr-input input:focus{border-color:#d97a32;box-shadow:0 0 0 4px rgba(217,122,50,.16)}' +
    '.pr-campo.ok .pr-input input{border-color:#7fb38a}' +
    '.pr-campo.erro .pr-input input{border-color:#d33;box-shadow:0 0 0 4px rgba(211,51,51,.1)}' +
    '.pr-tel input{padding-left:112px}' +
    '.pr-ddi{position:absolute;left:6px;top:6px;bottom:6px;display:flex;align-items:center;gap:5px;padding:0 9px;border-radius:10px;background:#fbefe2;color:#2b1a0e;font-weight:800;font-size:15px}' +
    '.pr-ddi #pr-bandeira{font-size:19px;line-height:1}' +
    '.pr-ddi svg{position:static;transform:none;width:14px;height:14px;fill:#a0714a}' +
    '.pr-ddi select{position:absolute;inset:0;width:100%;height:100%;opacity:0;font-size:16px;cursor:pointer;border:0}' +
    '.pr-erro{display:none;color:#c62828;font-size:12.5px;font-weight:600;margin:5px 2px 0}' +
    '.pr-campo.erro .pr-erro{display:block}' +
    '.pr-dica{font-size:12px;color:#977d69;margin:5px 2px 0}' +
    '.pr-btn{position:relative;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:60px;margin-top:8px;border:0;border-radius:14px;background:#ffd57f;box-shadow:0 6px 0 0 #9e6000,0 14px 30px rgba(158,96,0,.28);color:#2b1a0e;font-family:Montserrat,Arial,sans-serif;font-size:17px;font-weight:900;letter-spacing:.01em;cursor:pointer;text-transform:uppercase;overflow:hidden}' +
    '.pr-btn svg{width:22px;height:22px;fill:#2b1a0e}' +
    '.pr-btn:after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);animation:pr-brilho 2.8s infinite}' +
    '@keyframes pr-brilho{0%{left:-60%}55%,100%{left:130%}}' +
    '.pr-btn:active{transform:translateY(3px);box-shadow:0 3px 0 0 #9e6000}' +
    '.pr-btn[disabled]{opacity:.75}' +
    '.pr-selos{display:flex;justify-content:center;flex-wrap:wrap;gap:6px 14px;margin:14px 0 0;padding:0;list-style:none;font-size:12px;font-weight:700;color:#6f5848}' +
    '.pr-selos li{display:flex;align-items:center;gap:4px}' +
    '.pr-nota{margin:10px 0 0;text-align:center;font-size:11.5px;color:#a08b7a}' +
    '@media (max-width:360px){.pr-capa{width:66px}.pr-topo{padding:16px 46px 14px 12px}.pr-topo h2{font-size:18.5px}.pr-corpo{padding:14px 12px 12px}.pr-btn{font-size:15.5px;gap:6px;padding:0 10px}.pr-tel input{padding-left:104px}.pr-ddi{padding:0 7px}}' +
    '@media (max-width:340px){.pr-fundo{padding:10px}.pr-btn{font-size:14.5px;letter-spacing:0}.pr-btn svg{width:18px;height:18px}.pr-input input{font-size:16px;padding-right:8px}.pr-selos{font-size:11.5px;gap:4px 10px}}' +
    /* Tela baixa (celular com o teclado aberto): topo compacto para os campos e o botão caberem */
    '@media (max-height:560px){.pr-fundo{align-items:flex-start;padding-top:8px}.pr-capa{display:none}.pr-topo{padding:12px 46px 12px 14px}.pr-topo h2{font-size:17px}.pr-passo{margin-bottom:2px}.pr-sub{margin-bottom:10px}.pr-campo{margin-bottom:8px}.pr-input input{height:48px}.pr-btn{height:54px}}' +
    '@media (prefers-reduced-motion:reduce){.pr-btn:after{animation:none}.pr-fundo,.pr-caixa{transition:none}}';

  function campoHtml(id, icone, rotulo, attrs, erro, dica) {
    return '<div class="pr-campo"><label class="pr-sr" for="' + id + '" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">' + rotulo + '</label>' +
      '<div class="pr-input">' + ICONES[icone] + '<input id="' + id + '" ' + attrs + '></div>' +
      '<div class="pr-erro">' + erro + '</div>' + (dica ? '<div class="pr-dica">' + dica + '</div>' : '') + '</div>';
  }

  function montar() {
    if (document.getElementById('pr-fundo')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var f = document.createElement('div');
    f.id = 'pr-fundo'; f.className = 'pr-fundo'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-labelledby', 'pr-titulo');
    f.innerHTML = '<form class="pr-caixa" id="pr-form" novalidate>' +
      '<div class="pr-topo">' +
        '<img class="pr-capa" src="/images/mockup-282.webp" width="282" height="341" alt="E-book Receitas de Bolo Sem Glúten">' +
        '<div class="pr-topo-txt"><span class="pr-passo"><i></i>Passo 1 de 2</span>' +
        '<h2 id="pr-titulo">Onde você quer receber <b>suas receitas?</b></h2></div>' +
        '<button type="button" class="pr-x" id="pr-x" aria-label="Fechar">×</button>' +
      '</div>' +
      '<div class="pr-corpo">' +
        '<p class="pr-sub">Coloque seus dados para <b>baixar suas receitas</b>.</p>' +
        campoHtml('pr-nome', 'pessoa', 'Seu nome', 'name="nome" autocomplete="name" autocapitalize="words" enterkeyhint="next" placeholder="Seu nome"', 'Digite seu nome.') +
        campoHtml('pr-email', 'email', 'Seu melhor e-mail', 'name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" enterkeyhint="next" placeholder="Seu melhor e-mail"', 'Confira o e-mail — falta algo?') +
        '<div class="pr-campo"><label for="pr-cel" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Seu WhatsApp</label>' +
          '<div class="pr-input pr-tel"><div class="pr-ddi"><span id="pr-bandeira">' + pais.bandeira + '</span><span id="pr-ddi">+' + pais.ddi + '</span>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>' +
            '<select id="pr-pais" aria-label="País do seu WhatsApp">' + PAISES.map(function (p) { return '<option value="' + p.sigla + '">' + p.bandeira + ' ' + p.nome + ' (+' + p.ddi + ')</option>'; }).join('') + '</select></div>' +
          '<input id="pr-cel" name="tel" type="tel" inputmode="tel" autocomplete="tel-national" enterkeyhint="go" placeholder="WhatsApp com DDD"></div>' +
          '<div class="pr-erro" id="pr-cel-erro">Digite o celular com DDD e o 9 na frente.</div></div>' +
        '<button type="submit" class="pr-btn" id="pr-btn"><span>Baixar minhas receitas</span>' + ICONES.seta + '</button>' +
        '<ul class="pr-selos"><li>⚡ Acesso imediato</li><li>🔒 Ambiente seguro</li></ul>' +
        '' +
      '</div>' +
    '</form>';
    document.body.appendChild(f);

    var cel = document.getElementById('pr-cel');
    cel.addEventListener('input', function () {
      var t = cel.value.trim();
      // Quem digita ou cola com + e o código do país: troca o país sozinho e deixa só o número
      if (t.charAt(0) === '+') {
        var dd = soDig(t);
        if (dd.length < 3 || !window.paisDoTelefone) return; // ainda digitando o código do país
        var p = window.paisDoTelefone(t);
        if (p.sigla && PAISES.some(function (x) { return x.sigla === p.sigla; })) {
          mexeuNoPais = true; escolherPais(p.sigla); cel.value = dd.slice(p.ddi.length).slice(0, 14); return;
        }
      }
      cel.value = mascara(cel.value);
    });
    document.getElementById('pr-pais').addEventListener('change', function () {
      mexeuNoPais = true; escolherPais(this.value); cel.closest('.pr-campo').classList.remove('erro'); cel.focus();
    });
    escolherPais(pais.sigla);
    // Marca o campo como certo/errado quando a pessoa sai dele
    [['pr-nome', function (v) { return v.trim().length >= 2; }], ['pr-email', emailOk], ['pr-cel', celularOk]].forEach(function (c) {
      var el = document.getElementById(c[0]);
      el.addEventListener('blur', function () { if (el.value.trim()) { var ok = c[1](el.value); el.closest('.pr-campo').classList.toggle('erro', !ok); el.closest('.pr-campo').classList.toggle('ok', ok); } });
      el.addEventListener('input', function () { el.closest('.pr-campo').classList.remove('erro'); });
    });
    ['pr-nome', 'pr-email'].forEach(function (id, i, l) {
      document.getElementById(id).addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); document.getElementById(l[i + 1] || 'pr-cel').focus(); }
      });
    });
    f.addEventListener('focusin', function (e) {
      if (e.target.tagName === 'INPUT') setTimeout(function () { e.target.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 300);
    });
    f.addEventListener('click', function (e) { if (e.target === f) fechar(); });
    document.getElementById('pr-x').addEventListener('click', fechar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && f.classList.contains('on')) fechar(); });
    document.getElementById('pr-form').addEventListener('submit', enviar);
  }

  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()); }
  function campo(id) { return document.getElementById(id); }
  function marcar(id, ok) { var c = campo(id).closest('.pr-campo'); c.classList.toggle('erro', !ok); c.classList.toggle('ok', ok); return ok; }

  function enviar(e) {
    e.preventDefault();
    var nome = campo('pr-nome').value.trim(), email = campo('pr-email').value.trim().toLowerCase(), telDigitado = campo('pr-cel').value.trim();
    var ok = marcar('pr-nome', nome.length >= 2);
    ok = marcar('pr-email', emailOk(email)) && ok;
    ok = marcar('pr-cel', celularOk(telDigitado)) && ok;
    var tel = telefoneParaEnvio(telDigitado);
    if (!ok) { var primeiro = document.querySelector('.pr-campo.erro input'); if (primeiro) primeiro.focus(); return; }
    var btn = campo('pr-btn'); btn.disabled = true; btn.firstChild.textContent = 'Enviando…';
    var ir = function () { location.href = destino; };
    if (window.registrarLeadPopup) {
      var feito = false;
      window.registrarLeadPopup({ nome: nome, email: email, telefone: tel }).then(function () { if (!feito) { feito = true; ir(); } });
      setTimeout(function () { if (!feito) { feito = true; ir(); } }, 1500); // não prende a cliente se a rede demorar
    } else {
      try { sessionStorage.setItem('lead', JSON.stringify({ nome: nome, email: email, telefone: tel })); } catch (er) {}
      ir();
    }
  }

  function fechar() {
    var f = document.getElementById('pr-fundo');
    if (!f) return;
    f.classList.remove('on');
    document.documentElement.style.overflow = '';
    setTimeout(function () { f.style.display = 'none'; }, 220);
  }

  window.abrirPopupReceitas = function (url) {
    destino = url || 'checkout.html';
    montar();
    var f = document.getElementById('pr-fundo');
    // Volta preenchido se a pessoa já tinha preenchido antes
    try {
      var lead = JSON.parse(sessionStorage.getItem('lead') || '{}');
      if (lead.nome && !campo('pr-nome').value) campo('pr-nome').value = lead.nome;
      if (lead.email && !campo('pr-email').value) campo('pr-email').value = lead.email;
      if (lead.telefone && !campo('pr-cel').value) {
        var tl = String(lead.telefone);
        if (tl.charAt(0) === '+' && window.paisDoTelefone) { mexeuNoPais = true; escolherPais(window.paisDoTelefone(tl).sigla || 'BR'); }
        campo('pr-cel').value = mascara(tl);
      }
    } catch (e) {}
    var btn = campo('pr-btn'); btn.disabled = false; btn.firstChild.textContent = 'Baixar minhas receitas';
    f.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { f.classList.add('on'); });
  };
})();
