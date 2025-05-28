Gestão de Frota

Sistema Web para Gestão de Frotas de Veículos (PROJETO UNIFG)

Sobre o Projeto

O projeto **Gestão de Frota** é uma aplicação web desenvolvida para ajudar empresas e órgãos públicos a gerenciar motoristas, veículos, eventos de uso/devolução e relatórios de utilização.  
Foi criado como projeto acadêmico para a disciplina de Inovação, Sustentabilidade e Competitividade.

---

Funcionalidades

- **Gestão de Motoristas:** Cadastro, edição, exclusão e listagem de motoristas.
- **Gestão de Carros:** Cadastro, edição, exclusão e filtro de status (disponível/em uso).
- **Gestão de Eventos:** Controle de empréstimos e devoluções de veículos.
- **Gestão de Gestores:** Cadastro e login de usuários gestores.
- **Relatórios:** Consulta detalhada de uso dos veículos por motorista e período.
- **Autenticação:** Tela de login e controle de sessão.
- **Interface Amigável:** Design intuitivo e responsivo, com ícones temáticos.


 Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3, JavaScript (ES6), Font Awesome
- **Back-end:** Node.js, Express.js
- **Banco de Dados:** MySQL
- **Ferramentas:** MySQL Workbench, VSCode, Postman


 Instalação e Execução
 
Clone o repositório
   ```bash
   git clone https://github.com/fredlorran/gestao-frota.git
Codigo do mysql Workbench

USE gestao_frota;
CREATE DATABASE IF NOT EXISTS gestao_frota;
USE gestao_frota;
-- Tabela de gestores (usuários do sistema)
CREATE TABLE IF NOT EXISTS gestores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100)    NOT NULL,
  email VARCHAR(100)   UNIQUE NOT NULL,
  senha VARCHAR(255)   NOT NULL
);

-- Tabela de motoristas
CREATE TABLE IF NOT EXISTS motoristas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100)    NOT NULL,
  telefone VARCHAR(20)
);

-- Tabela de carros
CREATE TABLE IF NOT EXISTS carros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  modelo VARCHAR(100),
  placa VARCHAR(20)    UNIQUE,
  odometro INT         DEFAULT 0,
  status ENUM('disponível','em uso') DEFAULT 'disponível'
);

-- Tabela de eventos de uso e devolução
CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gestor_id    INT    NOT NULL,
  motorista_id INT    NOT NULL,
  carro_id     INT    NOT NULL,
  tipo_evento  ENUM('saida','entrada') NOT NULL,
  odometro     INT    NOT NULL,
  data_hora    DATETIME NOT NULL,
  FOREIGN KEY (gestor_id)    REFERENCES gestores(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (motorista_id) REFERENCES motoristas(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (carro_id)     REFERENCES carros(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
USE gestao_frota;



