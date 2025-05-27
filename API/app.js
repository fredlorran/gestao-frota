const express = require('express');
const pool = require('./db');
const cors = require('cors');

const app = express();

// Habilita CORS para todas as rotas
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Gestão de Frota está rodando!');
});

// --------- GESTORES ---------
app.get('/gestores', (req, res) => {
  pool.query('SELECT * FROM gestores', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar gestores!', detalhe: err });
    res.json(results);
  });
});

app.get('/gestores/:id', (req, res) => {
  pool.query('SELECT * FROM gestores WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar gestor!', detalhe: err });
    if (results.length === 0) return res.status(404).json({ erro: 'Gestor não encontrado.' });
    res.json(results[0]);
  });
});

app.post('/gestores', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });

  pool.query(
    'INSERT INTO gestores (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao cadastrar gestor!', detalhe: err });
      res.status(201).json({ id: result.insertId, nome, email });
    }
  );
});

app.put('/gestores/:id', (req, res) => {
  const { nome, email, senha } = req.body;
  pool.query(
    'UPDATE gestores SET nome = ?, email = ?, senha = ? WHERE id = ?',
    [nome, email, senha, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar gestor!', detalhe: err });
      res.json({ mensagem: 'Gestor atualizado com sucesso.' });
    }
  );
});

app.delete('/gestores/:id', (req, res) => {
  pool.query('DELETE FROM gestores WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar gestor!', detalhe: err });
    res.json({ mensagem: 'Gestor deletado com sucesso.' });
  });
});

// --------- MOTORISTAS ---------
app.get('/motoristas', (req, res) => {
  pool.query('SELECT * FROM motoristas', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar motoristas!', detalhe: err });
    res.json(results);
  });
});

app.get('/motoristas/:id', (req, res) => {
  pool.query('SELECT * FROM motoristas WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar motorista!', detalhe: err });
    if (results.length === 0) return res.status(404).json({ erro: 'Motorista não encontrado.' });
    res.json(results[0]);
  });
});

app.post('/motoristas', (req, res) => {
  const { nome, telefone } = req.body;
  if (!nome) return res.status(400).json({ erro: 'O nome do motorista é obrigatório.' });

  pool.query(
    'INSERT INTO motoristas (nome, telefone) VALUES (?, ?)',
    [nome, telefone],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao cadastrar motorista!', detalhe: err });
      res.status(201).json({ id: result.insertId, nome, telefone });
    }
  );
});

app.put('/motoristas/:id', (req, res) => {
  const { nome, telefone } = req.body;
  pool.query(
    'UPDATE motoristas SET nome = ?, telefone = ? WHERE id = ?',
    [nome, telefone, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar motorista!', detalhe: err });
      res.json({ mensagem: 'Motorista atualizado com sucesso.' });
    }
  );
});

app.delete('/motoristas/:id', (req, res) => {
  pool.query('DELETE FROM motoristas WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar motorista!', detalhe: err });
    res.json({ mensagem: 'Motorista deletado com sucesso.' });
  });
});

// --------- CARROS ---------
app.get('/carros', (req, res) => {
  pool.query('SELECT * FROM carros', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar carros!', detalhe: err });
    res.json(results);
  });
});

app.get('/carros/:id', (req, res) => {
  pool.query('SELECT * FROM carros WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar carro!', detalhe: err });
    if (results.length === 0) return res.status(404).json({ erro: 'Carro não encontrado.' });
    res.json(results[0]);
  });
});

app.post('/carros', (req, res) => {
  const { modelo, placa, odometro, status } = req.body;
  if (!modelo || !placa) return res.status(400).json({ erro: 'Modelo e placa são obrigatórios.' });

  pool.query(
    'INSERT INTO carros (modelo, placa, odometro, status) VALUES (?, ?, ?, ?)',
    [modelo, placa, odometro || 0, status || 'disponível'],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao cadastrar carro!', detalhe: err });
      res.status(201).json({ id: result.insertId, modelo, placa, odometro: odometro || 0, status: status || 'disponível' });
    }
  );
});

app.put('/carros/:id', (req, res) => {
  const { modelo, placa, odometro, status } = req.body;
  pool.query(
    'UPDATE carros SET modelo = ?, placa = ?, odometro = ?, status = ? WHERE id = ?',
    [modelo, placa, odometro, status, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar carro!', detalhe: err });
      res.json({ mensagem: 'Carro atualizado com sucesso.' });
    }
  );
});

app.delete('/carros/:id', (req, res) => {
  pool.query('DELETE FROM carros WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar carro!', detalhe: err });
    res.json({ mensagem: 'Carro deletado com sucesso.' });
  });
});

// --------- EVENTOS ---------
app.get('/eventos', (req, res) => {
  pool.query('SELECT * FROM eventos', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar eventos!', detalhe: err });
    res.json(results);
  });
});

app.get('/eventos/:id', (req, res) => {
  pool.query('SELECT * FROM eventos WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar evento!', detalhe: err });
    if (results.length === 0) return res.status(404).json({ erro: 'Evento não encontrado.' });
    res.json(results[0]);
  });
});

app.post('/eventos', (req, res) => {
  const { gestor_id, motorista_id, carro_id, tipo_evento, odometro, data_hora } = req.body;
  if (!gestor_id || !motorista_id || !carro_id || !tipo_evento || !odometro || !data_hora)
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios para criar um evento.' });

  pool.query(
    'INSERT INTO eventos (gestor_id, motorista_id, carro_id, tipo_evento, odometro, data_hora) VALUES (?, ?, ?, ?, ?, ?)',
    [gestor_id, motorista_id, carro_id, tipo_evento, odometro, data_hora],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao cadastrar evento!', detalhe: err });
      res.status(201).json({ id: result.insertId, gestor_id, motorista_id, carro_id, tipo_evento, odometro, data_hora });
    }
  );
});

app.put('/eventos/:id', (req, res) => {
  const { gestor_id, motorista_id, carro_id, tipo_evento, odometro, data_hora } = req.body;
  pool.query(
    'UPDATE eventos SET gestor_id = ?, motorista_id = ?, carro_id = ?, tipo_evento = ?, odometro = ?, data_hora = ? WHERE id = ?',
    [gestor_id, motorista_id, carro_id, tipo_evento, odometro, data_hora, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: 'Erro ao atualizar evento!', detalhe: err });
      res.json({ mensagem: 'Evento atualizado com sucesso.' });
    }
  );
});

app.delete('/eventos/:id', (req, res) => {
  pool.query('DELETE FROM eventos WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar evento!', detalhe: err });
    res.json({ mensagem: 'Evento deletado com sucesso.' });
  });
});

// --------- EVENTOS DETALHADOS (JOIN) ---------
app.get('/eventos-detalhados', (req, res) => {
  const sql = `
    SELECT 
      eventos.id,
      eventos.tipo_evento,
      eventos.odometro,
      eventos.data_hora,
      gestores.nome AS nome_gestor,
      motoristas.nome AS nome_motorista,
      motoristas.telefone,
      carros.modelo AS modelo_carro,
      carros.placa
    FROM eventos
    JOIN gestores ON eventos.gestor_id = gestores.id
    JOIN motoristas ON eventos.motorista_id = motoristas.id
    JOIN carros ON eventos.carro_id = carros.id
    ORDER BY eventos.data_hora DESC
  `;
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar eventos detalhados!', detalhe: err });
    res.json(results);
  });
});

// --------- RELATÓRIO DE MOTORISTA E PERÍODO ---------
app.get('/relatorio-motorista', (req, res) => {
  const { motorista_id, inicio, fim } = req.query;
  if (!motorista_id || !inicio || !fim) {
    return res.status(400).json({ erro: 'Parâmetros motorista_id, inicio e fim são obrigatórios.' });
  }

  const sql = `
    SELECT 
      eventos.id,
      eventos.tipo_evento,
      eventos.odometro,
      eventos.data_hora,
      gestores.nome AS nome_gestor,
      carros.modelo AS modelo_carro,
      carros.placa
    FROM eventos
    JOIN gestores ON eventos.gestor_id = gestores.id
    JOIN carros ON eventos.carro_id = carros.id
    WHERE eventos.motorista_id = ?
      AND eventos.data_hora BETWEEN ? AND ?
    ORDER BY eventos.data_hora DESC
  `;
  pool.query(sql, [motorista_id, inicio, fim], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao gerar relatório!', detalhe: err });
    res.json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
