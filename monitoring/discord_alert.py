import os
import json
import urllib.request
import urllib.error


def send_discord_alert(message):
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")

    if not webhook_url:
        print("Discord webhook URL is not configured.")
        return

    data = {
        "content": message
    }

    payload = json.dumps(data).encode("utf-8")

    request = urllib.request.Request(
        webhook_url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "Netwatch/1.0"
        },
        method="POST"
    )

    try:
        response = urllib.request.urlopen(request, timeout=10)
        print("Discord notification sent!")
        response.close()

    except urllib.error.HTTPError as error:
        print("Discord HTTP Error:", error.code)
        print("Discord response:", error.read().decode("utf-8"))

    except Exception as error:
        print("Connection error:", error)