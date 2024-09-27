const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o cors
require('dotenv').config(); // Carrega variáveis de ambiente

const app = express();
const port = 3000;

// Middleware para habilitar CORS
app.use(cors()); // Habilita CORS
app.use(bodyParser.json());

// Configuração do Nodemailer usando variáveis de ambiente
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,  // Email do administrador
        pass: process.env.EMAIL_PASS   // Senha do administrador
    }
});

// Rota para envio de e-mails
app.post('/send-email', (req, res) => {
    const { nome, email, celular } = req.body;

    const emailParaAdm = {
        from: 'LembreFácil <lembrefacil.org@gmail.com>',
        to: 'lembrefacil.org@gmail.com',
        subject: 'Novo Usuario Cadastrado - LembreFácil',
        html: `<h1>Novo usuario cadastrado</h1>
               <p><strong>Nome:</strong> ${nome}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Celular:</strong> ${celular}</p>`,
        text: `Nome: ${nome}\nEmail: ${email}\nNúmero: ${celular}`
    };

    const emailParaUsuario = {
        from: 'LembreFácil <lembrefacil.org@gmail.com>',
        to: email,
        subject: 'Confirmação de Cadastro - LembreFácil',
        html: `<h1>Bem-vindo(a) ao LembreFácil</h1>
               <p>Obrigado por se cadastrar em nossa plataforma!</p>
               <p><strong>${nome}!</strong> </p>
               <p>Estamos felizes em tê-lo(a) conosco!</p>`,
        text: `Obrigado por se cadastrar no LembreFácil! ${nome}!`
    };

    transport.sendMail(emailParaAdm)
        .then(() => transport.sendMail(emailParaUsuario))
        .then(() => res.status(200).send('Emails enviados com sucesso!'))
        .catch(err => res.status(500).send('Erro ao enviar emails: ' + err));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});