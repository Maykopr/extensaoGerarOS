window.global = {};
async function esperarElemento(selector) {
  return new Promise((resolve) => {
    function verificarElemento() {
      const elemento = document.querySelector(selector);
      if (elemento) {
        resolve(elemento);
      } else {
        requestAnimationFrame(verificarElemento);
      }
    }
    verificarElemento();
  });
}
async function carregarCadastro() {
  const elemento = await esperarElemento('#nome_cli');

  global.nome = elemento.value;
  global.cpf = (
    document.querySelector('#cpf') ?? document.querySelector('#cnpj')
  ).value;
  global.id = document.querySelector('#codcli').value;
  global.contato = document.querySelector('#celular').value;
  global.endereco = document.querySelector('#endereco').value;
  global.complemento = document.querySelector('#apto').value;
  global.bairro = document.querySelector('#bairro').value;
  global.cidade = document.querySelector('#cidade').value;
  global.caixaObs = document.querySelector('#obs').value;

  document.querySelector('#planos-cliente > a > div').click();
}
async function carregarPagPlanos() {
  await esperarElemento(
    '#conteudo-site > div > div > elite-menu-cliente > div:nth-child(2) > div > elite-planos-cliente > p-card > div > div > div > div.grid-row > div > div.col-md-12.no-padding > p-tree > div > ul > p-treenode > li > div > span.ui-treenode-label.ui-corner-all > span',
  );
  const quantidadePlanos = document.querySelector(
    '#conteudo-site > div > div > elite-menu-cliente > div:nth-child(2) > div > elite-planos-cliente > p-card > div > div > div > div.grid-row > div > div.col-md-12.no-padding > p-tree > div > ul > p-treenode > li > ul',
  );

  if (quantidadePlanos == null) {
    // eslint-disable-next-line no-undef
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Este cliente não possui planos ativos!',
      showConfirmButton: false,
      timer: 2000,
    });
    throw new Error('Este cliente não possui planos ativos!');
  } else if (quantidadePlanos.children.length === 1) {
    quantidadePlanos.children[0].children[0].children[0].click();
  } else if (quantidadePlanos.children.length > 1) {
    const planos = {};
    for (let i = 0; i < quantidadePlanos.children.length; i + 1) {
      planos[i] = quantidadePlanos.children[i].innerText.toString();
    }

    // eslint-disable-next-line no-undef
    await Swal.fire({
      title: 'O CLIENTE POSSUI MAIS DE UM PLANO',
      input: 'select',
      inputOptions: planos,
      inputPlaceholder: 'SELICIONE O PLANO DESEJADO:',
      showCancelButton: true,
    }).then((e) => {
      if (e.isConfirmed === false) {
        // eslint-disable-next-line no-undef
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Você não selecionou nenhum plano!',
          showConfirmButton: false,
          timer: 2000,
        });
        throw new Error('Você não selecionou nenhum plano!');
      }
      const plan = quantidadePlanos.children[Number(e.value)].children[0].children[0];
      plan.click();
    });
  }
}
async function clickBotaoDireito() {
  setTimeout(() => {
    const elemento = document.querySelector(
      '#conteudo-site > div > div > elite-menu-cliente > div:nth-child(2) > div > elite-planos-cliente > p-card > div > div > div > div.grid-row > div > div.col-md-12.no-padding > p-tree > div > ul > p-treenode > li > ul > p-treenode > li > ul > p-treenode > li > div > span.ui-treenode-label.ui-corner-all > span',
    );

    const e = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      button: 2,
    });

    if (elemento) {
      elemento.dispatchEvent(e);
    } else {
      // eslint-disable-next-line no-undef
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'O plano selecionado não possui PPPoE, tente novamente!',
        showConfirmButton: false,
        timer: 2000,
      });
      throw new Error('O plano selecionado não possui PPPoE');
    }
  }, 500);
}
async function verPropriedades() {
  const elemento = await esperarElemento(
    'body > div > p-contextmenusub > ul > li:nth-child(2) > a > span.ui-menuitem-text',
  );
  elemento.click();
}
async function buscaPlano() {
  await esperarElemento(
    '#conteudo-site > div > div > elite-menu-cliente > div:nth-child(2) > div > elite-planos-cliente > p-dialog > div > div.ui-dialog-content.ui-widget-content > elite-propriedades-login > div.grid > p-table > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  );

  global.plano = document.querySelector('#descri_ser').value;
  global.loginPPPoE = document.querySelector(
    '#conteudo-site > div > div > elite-menu-cliente > div:nth-child(2) > div > elite-planos-cliente > p-dialog > div > div.ui-dialog-content.ui-widget-content > elite-propriedades-login > div.grid > p-table > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(2) > td:nth-child(3)',
  ).innerText;
  global.senhaPPPoE = document.querySelector(
    '#conteudo-site > div > div > elite-menu-cliente > div:nth-child(2) > div > elite-planos-cliente > p-dialog > div > div.ui-dialog-content.ui-widget-content > elite-propriedades-login > div.grid > p-table > div > div.ui-table-scrollable-wrapper.ng-star-inserted > div > div.ui-table-scrollable-body > table > tbody > tr:nth-child(3) > td:nth-child(3)',
  ).innerText;

  document
    .querySelector(
      '#conteudo-site > div > div > elite-menu-cliente > div:nth-child(2) > div > elite-planos-cliente > p-dialog > div > div.ui-dialog-content.ui-widget-content > elite-propriedades-login > div.buttons > div > div:nth-child(4) > button',
    )
    .click();
}
async function promptQuery() {
  // eslint-disable-next-line no-undef
  const { value: protocolo } = await Swal.fire({
    title: 'Selecione um tipo de OS',
    input: 'select',
    inputOptions: {
      1: 'DESCRIÇÃO PERSONALIZADA',
      'APARTAMENTO - ONU GERAL': {
        2: 'APARTAMENTO OFF E ONU OK',
        3: 'APARTAMENTO OFF e ONU COM LOS',
        4: 'APARTAMENTO COM ATENUAÇÃO',
      },
      'CASA/AP - FIBRADO': {
        5: 'CASA COM ONU OK E ROTEADOR OFF',
        6: 'CASA COM ATENUAÇÃO',
        7: 'CASA COM ONU COM LOS',
      },
      'LENTIDÃO E WIFI-CAINDO': {
        8: 'LENTIDÃO',
        9: 'WIFI CAINDO',
      },
      'FECHAMENTO DE ATENDIMENTOS': {
        10: 'LENTIDÃO',
        11: 'SEM CONEXÃO',
        12: 'QUEDAS',
        13: 'READEQUAÇÃO PREDIAL',
        14: 'OS INTELBRAS',
      },
    },
    inputPlaceholder: 'Selecione um modelo de protocolo/OS',
    showCancelButton: true,
  });
  global.conteudo = `NOME: ${global.nome}
  CONTATO: ${global.contato}
  Cliente solicita contato antes de ir.
  ==================================================
  PLANO: ${global.plano}
  LOGIN : ${global.loginPPPoE}
  SENHA: ${global.senhaPPPoE}
  ENDEREÇO: ${global.endereco}, ${global.complemento}, ${global.bairro}, ${global.cidade}
  ==================================================`;

  switch (protocolo) {
    case '1': {
      // eslint-disable-next-line no-undef
      const { value: text } = await Swal.fire({
        input: 'textarea',
        inputLabel: 'Message',
        inputPlaceholder: 'Digite sua descrição aqui...',
        inputAttributes: {
          'aria-label': 'Digite sua descrição aqui',
        },
        showCancelButton: true,
      });

      global.conteudo += `
  ${text}\n
  ==================================================
  INFORMAÇÕES:
  ${global.caixaObs}`;
      break;
    }
    case '2':
      global.conteudo += `
  DESCRIÇÃO: CLIENTE SEM CONEXÃO.

  TESTES:
  - ONU DO PRÉDIO OK, DEMAIS CLIENTES CONECTADOS
  - FEITO TESTE DE CABO NO ROTEADOR
  - FEITO TESTE DE CABO NO SWITCH DO PRÉDIO
  - ROTEADOR NÃO ESTAVA RESETADO
  - NOME DA REDE WIFI ESTÁ APARECENDO PRA CONECTAR

  POSSÍVEL SOLUÇÃO:
  - AVALIAR CABO DE REDE / ROTEADOR
  ==================================================
  INFORMAÇÕES: ${global.caixaObs}`;
      break;
    case '3':
      global.conteudo += `
  DESCRIÇÃO: CLIENTE SEM CONEXÃO(LOS)

  TESTES:
  - ONU COM L.O.S
  - FEITO TESTE DE FIBRA
  - ONU COM LUZ DE L.O.S
  - OUTROS CLIENTES DA MESMA CAIXA ESTÃO OK

  POSSÍVEL SOLUÇÃO:
  - AVALIAR ONU/FIBR
  ==================================================
  INFORMAÇÕES: ${global.caixaObs}`;
      break;

    case '4':
      global.conteudo += `
  DESCRIÇÃO: ATENUAÇÃO

  CLIENTE COM INSTABILIDADE DE CONEXÃO

  TESTES:
  - FEITO TESTE DE FIBRA
  - DESLIGOU E LIGOU ONU
  - ONU COM SINAL -

  POSSÍVEL SOLUÇÃO:
  - AVALIAR FIBRA / ONU
  ==================================================
  INFORMAÇÕES: ${global.caixaObs}`;
      break;

    case '5':
      global.conteudo += `
  DESCRIÇÃO: SEM CONEXÃO

  CLIENTE SEM CONEXÃO.

  TESTES:
  - SINAL DE FIBRA OK
  - FEITO TESTE DE CABO NO ROTEADOR
  - ROTEADOR NÃO ESTAVA RESETADO
  - NOME DA REDE WIFI ESTAVA APARECENDO PRA CONECTAR
  - COMO TESTE FOI RESETADO E CONFIGURADO O ROTEADOR
  - ONU INDICANDO CONEXÃO COM O ROTEADOR (LAN ACESO/APAGADO)
  - CLIENTE NÃO TINHA OUTRO CABO PARA TESTAR

  POSSÍVEL SOLUÇÃO:
  - AVALIAR CABO DE REDE / ROTEADOR
  ==================================================
  INFORMAÇÕES: ${global.caixaObs}`;
      break;

    case '6':
      global.conteudo += `
  DESCRIÇÃO: ATENUAÇÃO

  CLIENTE COM INSTABILIDADE DE CONEXÃO

  TESTES:
  - FEITO TESTE DE FIBRA
  - DESLIGOU E LIGOU ONU
  - ONU COM SINAL -

  POSSÍVEL SOLUÇÃO:
  - AVALIAR FIBRA / ONU
  ==================================================
  INFORMAÇÕES: ${global.caixaObs}`;
      break;

    case '7':
      global.conteudo += `
  DESCRIÇÃO: L.O.S

  CLIENTE SEM CONEXÃO.

  TESTES:
  - ONU COM L.O.S
  - FEITO TESTE DE FIBRA
  - ONU COM LUZ DE L.O.S
  - OUTROS CLIENTES DA MESMA CAIXA ESTÃO OK
  - DESLIGOU / LIGOU ONU

  POSSÍVEL SOLUÇÃO:
  - AVALIAR ONU/FIBRA
  ==================================================
  INFORMAÇÕES: ${global.caixaObs}`;
      break;

    case '8':
      global.conteudo += `
  DESCRIÇÃO: LENTIDÃO

  CLIENTE ALEGANDO LENTIDÃO E INSTABILIDADE:

  TESTES:
  - SINAL DE FIBRA OK
  - CONFIGURADO DNS/CANAL/IPV6
  - DEPOIS RETIRADO IPV6 PARA TESTE
  - INFORMOU LENTIDÃO PARA ACESSO EM QUALQUER SITE/APP
  - RELATOU QUE PROBLEMA OCORRE EM QUALQUER DISPOSITIVO CONECTADO NA REDE
  - ONU FOI DESPROVISIONADA E PROVISIONADA
  - COMO TESTE FOI RESETADO E CONFIGURADO O ROTEADOR

  POSSÍVEL SOLUÇÃO:
  - AVALIAR ROTEADOR / TESTES JUNTO AO CLIENTE
  ==================================================
  INFORMAÇÕES: ${global.caixaObs}`;
      break;

    case '9':
      global.conteudo += `
  DESCRIÇÃO: QUEDAS

  CLIENTE ALEGANDO QUEDAS NO WIFI

  TESTES:
  - SINAL DE FIBRA OK
  - CONFIGURADO CANAL E LARGURA DO WIFI
  - INFORMOU QUE SINAL FICA CHEIO E SUBTAMENTE CAI
  - RELATOU QUE PROBLEMA OCORRE EM QUALQUER DISPOSITIVO CONECTADO NA REDE
  - RELATOU QUE ANTES O WIFI CHEGAVA EM UMA DISTANCIA MAIOR

  POSSÍVEL SOLUÇÃO:
  - AVALIAR ROTEADOR / TESTES JUNTO AO CLIENTE / AVALIAR NECESSIDADE DE UM SEGUNDO PONTO / AVALIAR CABEAMENTO EM DISPOSITIVO DO CLIENTE
  ==================================================
  INFORMAÇÕES: ${global.caixaObs}`;
      break;

    case '10':
      global.conteudo += `
  DESCRIÇÃO: LENTIDÃO

  Cliente relatava lentidão para o acesso em:

  Ações realizadas:
  - Troca de canal [] para []
  - Troca de largura [] para []
  - Ativado/desativado ipv6
  - Configurado MTU 1480/1492
  - DNS alterado de [] para []
  - Sinal de fibra em: []
  - Feito atualização do Firmware

  Após procedimentos a conexão foi normalizada com sucesso e cliente validou o atendimento.`;
      break;

    case '11':
      global.conteudo += `
  DESCRIÇÃO: SEM CONEXÃO

  Ações realizadas:
  - Teste de cabos
  - Cabos de rede invertidos WAN na LAN
  - Teste de fibra
  - Desligou / ligou ONU e Roteador
  - Roteador estava resetado, foi feito a configuração
  - Feito atualização do Firmware

  Após procedimentos a conexão foi restabelecida com sucesso e cliente validou o atendimento.`;
      break;

    case '12':
      global.conteudo += `
  DESCRIÇÃO: QUEDAS
  Ações realizadas:

  - Sinal de fibra atenuado, feito teste de fibra e ficou em: [ ]
  - Teste de cabo de rede entre roteador e ONU
  - Troca de canal [] para  []
  - Troca de largura [] para []
  - Ativado ipv6
  - Desativado ipv6
  - Configurado MTU 1480/1492
  - DNS alterado de [] para []
  - Feito atualização do Firmware

  Após procedimentos a conexão foi normalizada com sucesso e cliente validou o atendimento.`;
      break;

    case '13':
      global.conteudo += `
  DESCRIÇÃO: READEQUAÇÃO DE FTTB PARA FTTA

  OS de readequação, onde será levado fibra + ONU individual até apartamento do cliente.
  ==================================================
  INFORMAÇÕES: SEM NECESSIDADE, READEQUAÇÃO PREDIAL LEVA ONU INDIVIDUAL`;
      break;

    case '14':
      global.conteudo += `
  DESCRIÇÃO: READEQUAÇÃO

  INFORMAÇÕES: TROCAR O EQUIPAMENTO ONU ITBS PARA OUTRO SEGUNDO SOLICITAÇÃO DO NOC.
  Regional: Ipatinga- Tipo de Manutencao: Planejada - Motivo: Migração PoP Limoeiro - ID 15558`;
      break;

    default:
      // eslint-disable-next-line no-undef
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Você não selecionou nenhuma opção válida!',
        showConfirmButton: false,
        timer: 1500,
      });
      throw new Error('Você não selecionou nenhuma opção válida!');
  }

  navigator.clipboard
    .writeText(global.conteudo)
    .then(() => {
      // eslint-disable-next-line no-undef
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Texto copiado com sucesso! ATENÇÃO ESPECIAL NO ENDEREÇO DA OS',
        showConfirmButton: false,
        timer: 2000,
      });
    })
    .catch(() => {
      // eslint-disable-next-line no-undef
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao copiar o texto',
        showConfirmButton: false,
        timer: 2000,
      });
    });
}

// o chamado das funções foi feito dentro de um async para não gerar muitas promisses
async function gerarOS() {
  document.querySelector('#cadastro-cliente > a > div').click();
  await carregarCadastro();
  await carregarPagPlanos();
  await clickBotaoDireito();
  await verPropriedades();
  await buscaPlano();
  promptQuery();
}
gerarOS();
