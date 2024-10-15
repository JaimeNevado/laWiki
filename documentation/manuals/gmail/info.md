
# SendGrid - Enviar correos electrónicos desde tu aplicación

**SendGrid** es una plataforma popular para enviar correos electrónicos transaccionales y de marketing a través de una API o servidor SMTP. Es utilizado por desarrolladores para enviar correos electrónicos escalables, ya que facilita la integración y proporciona un buen soporte para la entrega y seguimiento de correos.

## Plan Gratuito de SendGrid

- **100 correos electrónicos/día** gratis.
- Envío de correos electrónicos mediante API o SMTP.
- Acceso a funcionalidades como plantillas de correo, análisis, y seguimiento de envíos.
- Ideal para pequeñas aplicaciones o proyectos en fase de desarrollo.

Puedes registrarte y obtener una clave API en el sitio web de [SendGrid](https://sendgrid.com/free/).

## Ejemplo de Código para Enviar Correos con SendGrid

### Paso 1: Instalar la biblioteca de SendGrid

Primero, instala el cliente oficial de Python para SendGrid:

```bash
pip install sendgrid
```

### Paso2: Ejemplo con python

```python
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def send_email_via_sendgrid(recipient_email: str, subject: str, message: str):
    try:
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        email = Mail(
            from_email='tu_email@example.com',
            to_emails=recipient_email,
            subject=subject,
            html_content=message
        )
        response = sg.send(email)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(f'Error al enviar correo: {str(e)}')

@app.post("/enviar-correo/")
async def enviar_correo(email: str, subject: str, mensaje: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email_via_sendgrid, email, subject, mensaje)
    return {"mensaje": "Correo enviado en segundo plano"}
```

### Paso 3: configurar la clave API
- Regístrate en SendGrid y genera una clave API desde tu panel de control de SendGrid.
Guarda la clave API en una variable de entorno, por ejemplo:
    ```bash
    export SENDGRID_API_KEY='tu_clave_api_aqui'
    ````