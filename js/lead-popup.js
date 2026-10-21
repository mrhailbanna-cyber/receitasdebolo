// Se o pop-up for ativado, guarda apenas os dados preenchidos pelo usuário
// temporariamente para o formulário de checkout, sem API de CRM nem eventos.
(function () {
  window.registrarLeadPopup = function (dados) {
    dados = dados || {};
    var lead = {
      nome: String(dados.nome || '').trim(),
      email: String(dados.email || '').trim().toLowerCase(),
      telefone: String(dados.telefone || dados.celular || '').trim()
    };
    try { sessionStorage.setItem('lead', JSON.stringify(lead)); } catch (e) {}
    return Promise.resolve({ok: true});
  };
})();
