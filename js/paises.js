// Países do seletor de celular do checkout (Brasil primeiro; depois onde mais moram brasileiros).
// Também usado pelo /admin e pela página /contatos para mostrar de onde é o número.
(function () {
  var PAISES = [
    ['BR', 'Brasil', '55'],
    ['PT', 'Portugal', '351'],
    ['US', 'Estados Unidos', '1'],
    ['JP', 'Japão', '81'],
    ['GB', 'Reino Unido', '44'],
    ['ES', 'Espanha', '34'],
    ['IT', 'Itália', '39'],
    ['IE', 'Irlanda', '353'],
    ['DE', 'Alemanha', '49'],
    ['FR', 'França', '33'],
    ['CA', 'Canadá', '1'],
    ['PY', 'Paraguai', '595'],
    ['AR', 'Argentina', '54'],
    ['UY', 'Uruguai', '598'],
    ['CH', 'Suíça', '41'],
    ['BE', 'Bélgica', '32'],
    ['NL', 'Holanda', '31'],
    ['AU', 'Austrália', '61'],
    ['CL', 'Chile', '56'],
    ['BO', 'Bolívia', '591'],
    ['PE', 'Peru', '51'],
    ['CO', 'Colômbia', '57'],
    ['MX', 'México', '52'],
    ['VE', 'Venezuela', '58'],
    ['EC', 'Equador', '593'],
    ['GF', 'Guiana Francesa', '594'],
    ['AO', 'Angola', '244'],
    ['MZ', 'Moçambique', '258'],
    ['CV', 'Cabo Verde', '238'],
    ['LU', 'Luxemburgo', '352'],
    ['AT', 'Áustria', '43'],
    ['SE', 'Suécia', '46'],
    ['NO', 'Noruega', '47'],
    ['DK', 'Dinamarca', '45'],
    ['IL', 'Israel', '972'],
    ['AE', 'Emirados Árabes', '971'],
    ['NZ', 'Nova Zelândia', '64']
  ].map(function (p) {
    // Bandeira em emoji a partir da sigla (🇵🇹 = letras regionais P + T)
    var bandeira = String.fromCodePoint(0x1F1E6 + p[0].charCodeAt(0) - 65, 0x1F1E6 + p[0].charCodeAt(1) - 65);
    return { sigla: p[0], nome: p[1], ddi: p[2], bandeira: bandeira };
  });

  // De qual país é um número salvo. Sem "+" na frente é número do Brasil (como sempre foi salvo).
  function paisDoTelefone(tel) {
    var t = String(tel || '').trim();
    if (t.charAt(0) !== '+') return PAISES[0];
    var d = t.replace(/\D/g, '');
    var achado = null;
    PAISES.forEach(function (p) {
      if (d.indexOf(p.ddi) === 0 && (!achado || p.ddi.length > achado.ddi.length)) achado = p;
    });
    if (achado && achado.ddi === '1') return { sigla: 'US', nome: 'EUA/Canadá', ddi: '1', bandeira: achado.bandeira };
    return achado || { sigla: '', nome: 'Exterior', ddi: '', bandeira: '🌐' };
  }

  window.PAISES = PAISES;
  window.paisDoTelefone = paisDoTelefone;
})();
