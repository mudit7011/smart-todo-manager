import os
import sys
import django
from datetime import datetime, timedelta
from twilio.rest import Client

# ✅ Add path to project root
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# ✅ Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

# ✅ Import models after setting up Django
from tasks.models import Task
from tasks.models import ContextEntry

def fetch_latest_context():
    """
    Fetch latest 3 context entries (notes, emails, etc.)
    """
    latest_contexts = ContextEntry.objects.order_by('-timestamp')[:3]
    context_strings = [
        f"[{entry.source_type.upper()}] {entry.content[:100]}"
        for entry in latest_contexts
    ]
    return "\n".join(context_strings)

def send_whatsapp_reminders():
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_whatsapp = os.getenv("TWILIO_WHATSAPP_FROM")
    to_whatsapp = os.getenv("TWILIO_WHATSAPP_TO")

    if not all([account_sid, auth_token, from_whatsapp, to_whatsapp]):
        print("❌ Missing Twilio environment variables.")
        return

    client = Client(account_sid, auth_token)

    # 🎯 Fetch due tasks for tomorrow
    tomorrow = datetime.now().date() + timedelta(days=1)
    due_tasks = Task.objects.filter(deadline=tomorrow, status__in=["todo", "inprogress"])

    # 🧠 Fetch latest context to attach
    context_text = fetch_latest_context()

    for task in due_tasks:
        message = (
            f"🔔 *Task Reminder*\n"
            f"Title: {task.title}\n"
            f"Due: {task.deadline}\n"
            f"Priority: {task.priority_score:.2f}\n\n"
            f"🧠 Recent Context:\n{context_text}"
        )

        client.messages.create(
            body=message,
            from_=from_whatsapp,
            to=to_whatsapp
        )
        print(f"✅ Reminder sent for task: {task.title}")

if __name__ == "__main__":
    send_whatsapp_reminders()
