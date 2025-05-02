const nodemailer = require("nodemailer");
require("dotenv").config();

// Configurar el transporte
const transporter = nodemailer.createTransport({
    service: "gmail", // puedes cambiar a Outlook, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//Enviar correo al alumno
function enviarCorreoAlumno(destinatario, asunto, mensaje) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: asunto,
        text: mensaje
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar correo:", error);
        } else {
            console.log("Correo enviado:", info.response);
        }
    });
}

module.exports = { enviarCorreoAlumno };
