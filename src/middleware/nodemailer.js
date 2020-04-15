const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport( {
    host: 'smtp.ukr.net',
    port: 465,
    auth: {
        user: 'konf_kafise@ukr.net',
        pass: 'L9mJjMzkveGiZMp8'
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async (email) => {
    let result = await transporter.sendMail({
        from: 'konf_kafise@ukr.net',
        to: email,
        subject: "Новий Коментар до вашої тезе",
        text: "Доброго Дня до вашої тези було додано коментар, Перевірте За Посиланням." +
            "<a href='https://conference-kneu.herokuapp.com/landing'></a>",
        html: "This <i>message</i> was automatically create <strong>Node js</strong> server."
    });
}

module.exports = { sendEmail };
