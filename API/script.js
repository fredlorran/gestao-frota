const api = 'http://localhost:3000';

// ====== Login/Cadastro Gestor ======
function setGestorLogado(gestor) { localStorage.setItem('gestor', JSON.stringify(gestor)); }
function getGestorLogado() { return JSON.parse(localStorage.getItem('gestor')); }
function logout() { localStorage.removeItem('gestor'); location.reload(); }

function atualizarVisibilidade() {
  if (getGestorLogado()) {
    document.getElementById('tela-login').style.display = 'none';
    document.getElementById('area-gestao').style.display = '';
    preencherSelectGestores();
  } else {
    document.getElementById('tela-login').style.display = '';
    document.getElementById('area-gestao').style.display = 'none';
  }
}

document.getElementById('form-login').onsubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('login_email').value;
  const senha = document.getElementById('login_senha').value;
  fetch(`${api}/gestores`)
    .then(res => res.json())
    .then(gestores => {
      const g = gestores.find(gestor => gestor.email === email && gestor.senha === senha);
      if (g) {
        setGestorLogado(g);
        atualizarVisibilidade();
        inicializarListagens();
      } else {
        document.getElementById('login-erro').innerText = 'Usuário ou senha inválidos!';
      }
    });
};

document.getElementById('btn-cadastro').onclick = function() {
  document.getElementById('form-login').style.display = 'none';
  document.getElementById('form-cadastro').style.display = '';
  document.getElementById('login-erro').innerText = '';
};
document.getElementById('btn-voltar-login').onclick = function() {
  document.getElementById('form-cadastro').style.display = 'none';
  document.getElementById('form-login').style.display = '';
  document.getElementById('login-erro').innerText = '';
};
document.getElementById('form-cadastro').onsubmit = function(e) {
  e.preventDefault();
  const nome = document.getElementById('cadastro_nome').value;
  const email = document.getElementById('cadastro_email').value;
  const senha = document.getElementById('cadastro_senha').value;
  fetch(`${api}/gestores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  })
    .then(res => res.json())
    .then(res => {
      alert('Gestor cadastrado com sucesso! Faça login.');
      document.getElementById('btn-voltar-login').click();
    });
};

// ====== CRUD de Motoristas ======
function listarMotoristas() {
  fetch(`${api}/motoristas`)
    .then(res => res.json())
    .then(motoristas => {
      const tabela = document.getElementById('tabela-motoristas');
      tabela.innerHTML = '';
      motoristas.forEach(motorista => {
        tabela.innerHTML += `
          <tr>
            <td>${motorista.id}</td>
            <td>${motorista.nome}</td>
            <td>${motorista.telefone || ''}</td>
            <td>
              <button class="btn-editar" onclick="editarMotorista(${motorista.id}, '${motorista.nome}', '${motorista.telefone || ''}')"><i class="fa-solid fa-pen"></i> Editar</button>
              <button class="btn-excluir" onclick="deletarMotorista(${motorista.id})"><i class="fa-solid fa-trash"></i> Excluir</button>
            </td>
          </tr>
        `;
      });
    });
}
window.editarMotorista = editarMotorista;
window.deletarMotorista = deletarMotorista;

document.getElementById('form-motorista').onsubmit = function (e) {
  e.preventDefault();
  const id = document.getElementById('motorista_id').value;
  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  if (id) {
    fetch(`${api}/motoristas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, telefone })
    })
      .then(res => res.json())
      .then(() => { listarMotoristas(); cancelarEdicaoMotorista(); preencherSelectMotoristas(); preencherSelectRelatorioMotorista(); });
  } else {
    fetch(`${api}/motoristas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, telefone })
    })
      .then(res => res.json())
      .then(() => {
        listarMotoristas();
        preencherSelectMotoristas();
        preencherSelectRelatorioMotorista();
        document.getElementById('form-motorista').reset();
      });
  }
};
function editarMotorista(id, nome, telefone) {
  document.getElementById('motorista_id').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('telefone').value = telefone;
  document.getElementById('cancelar-edicao').style.display = 'inline';
}
document.getElementById('cancelar-edicao').onclick = cancelarEdicaoMotorista;
function cancelarEdicaoMotorista() {
  document.getElementById('form-motorista').reset();
  document.getElementById('motorista_id').value = '';
  document.getElementById('cancelar-edicao').style.display = 'none';
}
function deletarMotorista(id) {
  if (confirm('Tem certeza que deseja excluir este motorista?')) {
    fetch(`${api}/motoristas/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => { listarMotoristas(); preencherSelectMotoristas(); preencherSelectRelatorioMotorista(); });
  }
}

// ====== CRUD de Carros com filtro ======
let carrosCache = [];
function listarCarros() {
  fetch(`${api}/carros`)
    .then(res => res.json())
    .then(carros => {
      carrosCache = carros;
      mostrarCarrosNaTabela(carros);
      preencherSelectCarros();
    });
}
function mostrarCarrosNaTabela(carros) {
  const tabela = document.getElementById('tabela-carros');
  tabela.innerHTML = '';
  carros.forEach(carro => {
    tabela.innerHTML += `
      <tr>
        <td>${carro.id}</td>
        <td>${carro.modelo}</td>
        <td>${carro.placa}</td>
        <td>${carro.odometro}</td>
        <td>${carro.status}</td>
        <td>
          <button class="btn-editar" onclick="editarCarro(${carro.id}, '${carro.modelo}', '${carro.placa}', ${carro.odometro}, '${carro.status}')"><i class="fa-solid fa-pen"></i> Editar</button>
          <button class="btn-excluir" onclick="deletarCarro(${carro.id})"><i class="fa-solid fa-trash"></i> Excluir</button>
        </td>
      </tr>
    `;
  });
}
window.editarCarro = editarCarro;
window.deletarCarro = deletarCarro;

document.getElementById('filtro-status-carros').onchange = function() {
  const status = this.value;
  if (!status) {
    mostrarCarrosNaTabela(carrosCache);
  } else {
    mostrarCarrosNaTabela(carrosCache.filter(c => c.status === status));
  }
};
document.getElementById('form-carro').onsubmit = function (e) {
  e.preventDefault();
  const id = document.getElementById('carro_id').value;
  const modelo = document.getElementById('modelo').value;
  const placa = document.getElementById('placa').value;
  const odometro = document.getElementById('odometro').value;
  const status = document.getElementById('status').value;
  if (id) {
    fetch(`${api}/carros/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelo, placa, odometro, status })
    })
      .then(res => res.json())
      .then(() => { listarCarros(); cancelarEdicaoCarro(); });
  } else {
    fetch(`${api}/carros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelo, placa, odometro, status })
    })
      .then(res => res.json())
      .then(() => {
        listarCarros();
        document.getElementById('form-carro').reset();
      });
  }
};
function editarCarro(id, modelo, placa, odometro, status) {
  document.getElementById('carro_id').value = id;
  document.getElementById('modelo').value = modelo;
  document.getElementById('placa').value = placa;
  document.getElementById('odometro').value = odometro;
  document.getElementById('status').value = status;
  document.getElementById('cancelar-edicao-carro').style.display = 'inline';
}
document.getElementById('cancelar-edicao-carro').onclick = cancelarEdicaoCarro;
function cancelarEdicaoCarro() {
  document.getElementById('form-carro').reset();
  document.getElementById('carro_id').value = '';
  document.getElementById('cancelar-edicao-carro').style.display = 'none';
}
function deletarCarro(id) {
  if (confirm('Tem certeza que deseja excluir este carro?')) {
    fetch(`${api}/carros/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => listarCarros());
  }
}

// ====== CRUD de Eventos ======
function listarEventos() {
  fetch(`${api}/eventos-detalhados`)
    .then(res => res.json())
    .then(eventos => {
      const tabela = document.getElementById('tabela-eventos');
      tabela.innerHTML = '';
      eventos.forEach(ev => {
        tabela.innerHTML += `
          <tr>
            <td>${ev.id}</td>
            <td>${ev.nome_gestor}</td>
            <td>${ev.nome_motorista} (${ev.telefone || ''})</td>
            <td>${ev.modelo_carro} (${ev.placa})</td>
            <td>${ev.tipo_evento === 'saida' ? 'Saída' : 'Entrada'}</td>
            <td>${ev.odometro}</td>
            <td>${new Date(ev.data_hora).toLocaleString()}</td>
            <td>
              <button class="btn-editar" onclick="editarEvento(${ev.id})"><i class="fa-solid fa-pen"></i> Editar</button>
              <button class="btn-excluir" onclick="deletarEvento(${ev.id})"><i class="fa-solid fa-trash"></i> Excluir</button>
            </td>
          </tr>
        `;
      });
    });
}
window.editarEvento = editarEvento;
window.deletarEvento = deletarEvento;

document.getElementById('form-evento').onsubmit = function (e) {
  e.preventDefault();
  const id = document.getElementById('evento_id').value;
  const gestor_id = document.getElementById('gestor').value;
  const motorista_id = document.getElementById('motorista').value;
  const carro_id = document.getElementById('carro').value;
  const tipo_evento = document.getElementById('tipo_evento').value;
  const odometro = document.getElementById('evento_odometro').value;
  const data_hora = document.getElementById('data_hora').value;
  const obj = { gestor_id, motorista_id, carro_id, tipo_evento, odometro, data_hora };
  if (id) {
    fetch(`${api}/eventos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    })
      .then(res => res.json())
      .then(() => { listarEventos(); cancelarEdicaoEvento(); });
  } else {
    fetch(`${api}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj)
    })
      .then(res => res.json())
      .then(() => {
        listarEventos();
        document.getElementById('form-evento').reset();
      });
  }
};
function editarEvento(id) {
  fetch(`${api}/eventos/${id}`)
    .then(res => res.json())
    .then(ev => {
      document.getElementById('evento_id').value = ev.id;
      document.getElementById('gestor').value = ev.gestor_id;
      document.getElementById('motorista').value = ev.motorista_id;
      document.getElementById('carro').value = ev.carro_id;
      document.getElementById('tipo_evento').value = ev.tipo_evento;
      document.getElementById('evento_odometro').value = ev.odometro;
      document.getElementById('data_hora').value = ev.data_hora ? ev.data_hora.slice(0,16) : '';
      document.getElementById('cancelar-edicao-evento').style.display = 'inline';
    });
}
document.getElementById('cancelar-edicao-evento').onclick = cancelarEdicaoEvento;
function cancelarEdicaoEvento() {
  document.getElementById('form-evento').reset();
  document.getElementById('evento_id').value = '';
  document.getElementById('cancelar-edicao-evento').style.display = 'none';
}
function deletarEvento(id) {
  if (confirm('Tem certeza que deseja excluir este evento?')) {
    fetch(`${api}/eventos/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => listarEventos());
  }
}

// ====== Relatório ======
document.getElementById('form-relatorio-motorista').onsubmit = function(e) {
  e.preventDefault();
  const motorista_id = document.getElementById('relatorio_motorista').value;
  const inicio = document.getElementById('relatorio_inicio').value;
  const fim = document.getElementById('relatorio_fim').value;
  fetch(`${api}/relatorio-motorista?motorista_id=${motorista_id}&inicio=${inicio} 00:00:00&fim=${fim} 23:59:59`)
    .then(res => res.json())
    .then(dados => {
      const tabela = document.getElementById('tabela-relatorio-motorista');
      tabela.innerHTML = '';
      dados.forEach(ev => {
        tabela.innerHTML += `
          <tr>
            <td>${ev.id}</td>
            <td>${ev.tipo_evento}</td>
            <td>${ev.odometro}</td>
            <td>${new Date(ev.data_hora).toLocaleString()}</td>
            <td>${ev.nome_gestor}</td>
            <td>${ev.modelo_carro}</td>
            <td>${ev.placa}</td>
          </tr>
        `;
      });
    });
};

// ====== Funções de preenchimento dos selects ======
function preencherSelectGestores() {
  fetch(`${api}/gestores`)
    .then(res => res.json())
    .then(gestores => {
      const select = document.getElementById('gestor');
      select.innerHTML = '';
      gestores.forEach(gestor => {
        select.innerHTML += `<option value="${gestor.id}">${gestor.nome} (${gestor.email})</option>`;
      });
    });
}
function preencherSelectMotoristas() {
  fetch(`${api}/motoristas`)
    .then(res => res.json())
    .then(motoristas => {
      const select = document.getElementById('motorista');
      select.innerHTML = '';
      motoristas.forEach(motorista => {
        select.innerHTML += `<option value="${motorista.id}">${motorista.nome}</option>`;
      });
    });
}
function preencherSelectCarros() {
  fetch(`${api}/carros`)
    .then(res => res.json())
    .then(carros => {
      const select = document.getElementById('carro');
      select.innerHTML = '';
      carros.forEach(carro => {
        select.innerHTML += `<option value="${carro.id}">${carro.modelo} (${carro.placa})</option>`;
      });
    });
}
function preencherSelectRelatorioMotorista() {
  fetch(`${api}/motoristas`)
    .then(res => res.json())
    .then(motoristas => {
      const select = document.getElementById('relatorio_motorista');
      select.innerHTML = '';
      motoristas.forEach(motorista => {
        select.innerHTML += `<option value="${motorista.id}">${motorista.nome}</option>`;
      });
    });
}

// ====== Inicialização ======
function inicializarListagens() {
  listarMotoristas();
  listarCarros();
  preencherSelectGestores();
  preencherSelectMotoristas();
  preencherSelectCarros();
  listarEventos();
  preencherSelectRelatorioMotorista();
}
window.onload = function () {
  atualizarVisibilidade();
  if (getGestorLogado()) {
    inicializarListagens();
  }
};
