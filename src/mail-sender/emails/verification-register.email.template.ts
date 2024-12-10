export const verificationRegisterEmailTemplate = (name: string, url: string) => {
    return `
         <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de Correo Electrónico</title>
        </head>
        <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;   box-shadow: 0px 3px 12px rgb(47 43 61 / 0.14);" >
             <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://i.ibb.co/CBzXV8h/finan-track-logo.png" alt="Logo de Finan Track" style="width: 20vw; height: auto;">
            </div>
            <h2 style="color: #181e4b; text-align: center;">Verificación de Correo Electrónico</h2>
            <p style="color: #333;">Hola <span style="color: #181e4b; font-weight: bold;">${name}</span></p>
            <p style="color: #333;">Por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
            <div style="text-align: center; margin: 20px 0;">
            <a target="_blank" href="${url}" style="display: inline-block; text-align: center; padding: 10px 20px; font-size: 16px; color: white; background-color: #ed411A; text-decoration: none; border-radius: 5px;">
                Verificar Correo
            </a>
            </div>
            <p style="color: #333;">Si no solicitaste esto, por favor ignora este correo.</p>
        </div>
        </body>
        </html>
    `;
}