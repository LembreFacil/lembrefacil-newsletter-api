const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://127.0.0.1:5501', 'https://lembrefacil.github.io/lembrefacil-website/'], // Adicione mais origens conforme necessário
    methods: ['GET', 'POST'],
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://lembrefacil.github.io');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
app.use(bodyParser.json());

// Rota raiz para confirmação de que a API está funcionando
app.get('/', (req, res) => {
    res.send('API LembreFácil está rodando!');
});

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/', (req, res) => {
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

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
