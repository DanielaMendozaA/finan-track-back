export const resetPasswordEmailTemplate = (name: string, url: string) => {
    return `
         <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecimiento de Contraseña</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;   box-shadow: 0px 3px 12px rgb(47 43 61 / 0.14);" >
            <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.ibb.co/NTy9Rb2/logo-artemisa-2.png" alt="Logo de Artemisa" style="width: 20vw; height: auto;">
            </div>
            <h2 style="color: #181e4b; text-align: center;">Solicitud de Restablecimiento de Contraseña</h2>
            <p style="color: #333;">Hola <span style="color: #181e4b; font-weight: bold;">${name}</span>,</p>
            <p style="color: #333;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si solicitaste este cambio, haz clic en el siguiente enlace para establecer una nueva contraseña:</p>
            <div style="text-align: center; margin: 20px 0;">
            <a target="_blank" href="${url}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #ed411A; text-decoration: none; border-radius: 5px;">
                Restablecer Contraseña
            </a>
            </div>
            <p style="color: #333;">Este enlace es válido por 30 minutos. Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
            <p style="color: #333;">Gracias,</p>
            <p style="color: #333;">El equipo de <span style="color: #181e4b; font-weight: bold;">Artemisa</span></p>
        </div>
        </body>
        </html>
    `;
}
