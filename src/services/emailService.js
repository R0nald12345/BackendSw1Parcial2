const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendInvitationEmail = async (toEmail, projectName, inviterName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: `Invitación al proyecto: ${projectName}`,
        html: `
            <h2>¡Has sido invitado a un proyecto!</h2>
            <p>Hola,</p>
            <p><strong>${inviterName}</strong> te ha invitado a colaborar en el proyecto <strong>"${projectName}"</strong>.</p>
            <p>Inicia sesión en la plataforma para acceder al proyecto.</p>
            <br>
            <p>¡Gracias!</p>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendInvitationEmail
};