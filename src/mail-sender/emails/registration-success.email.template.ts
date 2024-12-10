export const registrationSuccessEmailTemplate = () => {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registro Exitoso</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0px 3px 12px rgb(47 43 61 / 0.14);">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://i.ibb.co/CBzXV8h/finan-track-logo.png" alt="Logo de Finan Track" style="width: 20vw; height: auto;">
            </div>
            <h2 style="color: #181e4b; text-align: center;">Registro Exitoso</h2>
            <p style="color: #333;">¡Tu cuenta ha sido creada exitosamente! Ya puedes acceder a nuestro sistema.</p>
            <p style="color: #333;">Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
            <p style="color: #333;">Gracias por unirte a <span style="color: #181e4b; font-weight: bold;">Finan Track</span>.</p>
        </div>
        </body>
        </html>
    `;
}