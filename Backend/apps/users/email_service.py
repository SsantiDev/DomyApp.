from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────

def _base_html(content: str) -> str:
    """Wraps content in a branded, responsive email shell."""
    return f"""
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Domy</title>
</head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#6C63FF 0%,#48B2E8 100%);padding:36px 40px;text-align:center;">
              <span style="font-size:32px;font-weight:800;color:#ffffff;letter-spacing:1px;">Domy</span>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Tu hogar, en buenas manos</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#ffffff;padding:40px;">
              {content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#F4F5F7;padding:24px 40px;text-align:center;border-top:1px solid #E8E9EB;">
              <p style="margin:0;font-size:12px;color:#9CA3AF;">
                Este correo fue enviado por <strong>Domy App</strong>.<br/>
                Si no realizaste esta acción, puedes ignorar este mensaje.
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#C4C9D4;">© 2026 Domy. Todos los derechos reservados.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


def _send(subject: str, plain_text: str, html: str, to: str):
    """Sends an email with both plain-text and HTML alternatives."""
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=plain_text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[to],
        )
        msg.attach_alternative(html, "text/html")
        msg.send(fail_silently=False)
        logger.info(f"Email '{subject}' enviado a {to}")
    except Exception as e:
        logger.error(f"Error enviando email a {to}: {str(e)}")


# ─────────────────────────────────────────────
# WELCOME EMAIL
# ─────────────────────────────────────────────

def send_welcome_email(user):
    """Sends a branded HTML welcome email on registration."""
    first_name = getattr(user.profile, 'first_name', None) or user.email.split('@')[0] or 'Usuario'
    is_worker = user.role == 'WORKER'

    role_msg = (
        "Como <strong>operaria</strong>, pronto podrás recibir solicitudes una vez que verifiques tu perfil."
        if is_worker else
        "Ya puedes empezar a <strong>solicitar servicios para tu hogar</strong> con operarias verificadas."
    )
    role_badge_color = "#6C63FF" if is_worker else "#48B2E8"
    role_badge_label = "OPERARIA" if is_worker else "CLIENTE"

    content = f"""
      <h1 style="margin:0 0 4px;font-size:26px;font-weight:700;color:#1A1D23;">
        ¡Bienvenid{'a' if is_worker else 'o'}, {first_name}! 🎉
      </h1>
      <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">Tu cuenta ha sido creada exitosamente.</p>

      <div style="background:#F0F4FF;border-left:4px solid {role_badge_color};border-radius:8px;padding:16px 20px;margin-bottom:28px;">
        <span style="display:inline-block;background:{role_badge_color};color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:1px;margin-bottom:8px;">{role_badge_label}</span>
        <p style="margin:0;font-size:14px;color:#374151;">{role_msg}</p>
      </div>

      <p style="font-size:14px;color:#6B7280;line-height:1.7;margin:0 0 28px;">
        En Domy conectamos hogares con operarias de confianza. Estamos felices de tenerte como parte de nuestra comunidad.
      </p>

      <div style="text-align:center;margin-bottom:8px;">
        <a href="#" style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#48B2E8);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.5px;">
          Ir a la App →
        </a>
      </div>
    """

    plain = f"Hola {first_name}, ¡bienvenid{'a' if is_worker else 'o'} a Domy! Tu cuenta fue creada exitosamente."
    html = _base_html(content)

    _send(
        subject=f"¡Bienvenid{'a' if is_worker else 'o'} a Domy, {first_name}! 🏠",
        plain_text=plain,
        html=html,
        to=user.email,
    )


# ─────────────────────────────────────────────
# PASSWORD RESET EMAIL
# ─────────────────────────────────────────────

def send_password_reset_email(user, code):
    """Sends a branded HTML email with the 6-digit recovery code."""
    first_name = getattr(user.profile, 'first_name', None) or user.email.split('@')[0] or 'Usuario'

    # Format code with spaces for readability: 618592 → 618 592
    formatted_code = f"{code[:3]} {code[3:]}"

    content = f"""
      <h1 style="margin:0 0 4px;font-size:24px;font-weight:700;color:#1A1D23;">
        Recuperar contraseña 🔐
      </h1>
      <p style="margin:0 0 28px;font-size:14px;color:#6B7280;">
        Hola <strong>{first_name}</strong>, recibimos una solicitud para restablecer tu contraseña.
      </p>

      <p style="font-size:13px;color:#6B7280;margin:0 0 12px;text-align:center;">Tu código de verificación es:</p>

      <div style="background:#F0F4FF;border-radius:16px;padding:28px 20px;text-align:center;margin-bottom:28px;">
        <span style="display:inline-block;font-size:42px;font-weight:800;color:#6C63FF;letter-spacing:12px;font-family:'Courier New',monospace;">
          {formatted_code}
        </span>
      </div>

      <div style="background:#FFF8E7;border-left:4px solid #F59E0B;border-radius:8px;padding:14px 18px;margin-bottom:28px;">
        <p style="margin:0;font-size:13px;color:#92400E;">
          ⏱ Este código <strong>expira en 15 minutos</strong>. Si no solicitaste esto, ignora este correo y tu contraseña permanecerá igual.
        </p>
      </div>

      <p style="font-size:12px;color:#9CA3AF;text-align:center;margin:0;">
        Por seguridad, nunca compartas este código con nadie.
      </p>
    """

    plain = f"Hola {first_name}, tu código de recuperación es: {code}. Expira en 15 minutos."
    html = _base_html(content)

    _send(
        subject="Código de recuperación - Domy 🔐",
        plain_text=plain,
        html=html,
        to=user.email,
    )


# ─────────────────────────────────────────────
# SERVICE REMINDER EMAIL
# ─────────────────────────────────────────────

def send_service_reminder_email(service_request, user_to_remind):
    """Sends a branded HTML email reminding the user of a scheduled service request."""
    from django.utils import timezone
    first_name = getattr(user_to_remind.profile, 'first_name', None) or user_to_remind.email.split('@')[0] or 'Usuario'
    is_client = user_to_remind.role == 'CLIENT'
    
    role_msg = (
        "Recuerda que tienes un servicio programado para mañana. ¡Asegúrate de asistir puntualmente!"
        if not is_client else
        "Recuerda que tu hogar estará en buenas manos mañana con nuestro servicio programado."
    )
    
    # Convert UTC datetime from DB to the local timezone configured in settings.TIME_ZONE
    local_dt = timezone.localtime(service_request.scheduled_at)
    formatted_time = local_dt.strftime("%I:%M %p")
    formatted_date = local_dt.strftime("%d/%m/%Y")
    
    content = f"""
      <h1 style="margin:0 0 4px;font-size:26px;font-weight:700;color:#1A1D23;">
        ¡Recordatorio de tu servicio! 🏠⏰
      </h1>
      <p style="margin:0 0 24px;font-size:14px;color:#6B7280;">Hola <strong>{first_name}</strong>, tienes un servicio agendado para mañana.</p>
      
      <div style="background:#F0F4FF;border-left:4px solid #6C63FF;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0 0 8px;font-size:15px;color:#1A1D23;font-weight:700;">Detalles de la labor:</p>
        <p style="margin:0 0 4px;font-size:14px;color:#374151;"><strong>Servicio:</strong> {service_request.category.name}</p>
        <p style="margin:0 0 4px;font-size:14px;color:#374151;"><strong>Fecha:</strong> {formatted_date}</p>
        <p style="margin:0 0 4px;font-size:14px;color:#374151;"><strong>Hora:</strong> {formatted_time}</p>
        <p style="margin:0 0 4px;font-size:14px;color:#374151;"><strong>Dirección:</strong> {service_request.address}</p>
        <p style="margin:12px 0 0;font-size:13px;color:#374151;font-style:italic;">"{role_msg}"</p>
      </div>
      
      <div style="text-align:center;margin-bottom:8px;">
        <a href="#" style="display:inline-block;background:linear-gradient(135deg,#6C63FF,#48B2E8);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.5px;">
          Ver Detalles en la App →
        </a>
      </div>
    """
    
    plain = f"Hola {first_name}, recuerda que tienes un servicio programado de {service_request.category.name} para mañana ({formatted_date} a las {formatted_time})."
    html = _base_html(content)
    
    _send(
        subject=f"⏰ Recordatorio de tu Servicio de Mañana - Domy",
        plain_text=plain,
        html=html,
        to=user_to_remind.email,
    )
