import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def verify_email(email: str):
    otp = str(random.randint(100000, 999999))

    html_content = f"""
    <html>
      <body>
        <h2>Welcome to Strandify</h2>
        <p>Your OTP is: <strong>{otp}</strong></p>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
      </body>
    </html>
    """

    # --- Use SendGrid if API key is available (Render) ---
    if os.getenv("SENDGRID_API_KEY"):
        message = Mail(
            from_email=os.getenv("SENDER_EMAIL"),
            to_emails=email,
            subject="🔑 Strandify - Verify Your Email",
            html_content=html_content
        )
        try:
            sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
            sg.send(message)
            return otp
        except Exception as e:
            print("SendGrid error:", e)
            return None

    # --- Otherwise, fallback to SMTP (localhost dev) ---
    else:
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", 587))
        sender_email = os.getenv("SENDER_EMAIL")
        password = os.getenv("APP_PASSWORD")

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "🔑 Strandify - Verify Your Email"
        msg["From"] = sender_email
        msg["To"] = email
        msg.attach(MIMEText(html_content, "html"))

        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, [email], msg.as_string())
            server.quit()
            return otp
        except Exception as e:
            print("SMTP error:", e)
            return None
