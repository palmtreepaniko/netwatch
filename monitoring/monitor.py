
import time
import threading

from database.database import get_connection
from monitoring.ping import ping_device
from monitoring.discord_alert import send_discord_alert


def monitor_devices():
    while True:
        connection = get_connection()

        devices = connection.execute(
            "SELECT * FROM devices"
        ).fetchall()

        for device in devices:
            result = ping_device(device["ip_address"])

            # Get the previous device status
            previous = connection.execute("""
                SELECT status
                FROM check_history
                WHERE device_id = ?
                ORDER BY id DESC
                LIMIT 1
            """, (device["id"],)).fetchone()

            previous_status = previous["status"] if previous else None

            # Save the new monitoring result
            connection.execute("""
                INSERT INTO check_history
                (device_id, status, latency)
                VALUES (?, ?, ?)
            """, (
                device["id"],
                result["status"],
                result["latency"]
            ))

            # Send Discord alerts when status changes
            if result["status"] != previous_status:

                if result["status"] == "Offline":
                    message = (
                        f"🔴 **Netwatch Alert**\n"
                        f"**{device['name']} is OFFLINE**\n"
                        f"IP Address: `{device['ip_address']}`"
                    )

                    send_discord_alert(message)

                elif previous_status == "Offline" and result["status"] == "Online":
                    message = (
                        f"🟢 **Netwatch Recovery**\n"
                        f"**{device['name']} is back ONLINE!**\n"
                        f"IP Address: `{device['ip_address']}`"
                    )

                    send_discord_alert(message)

        connection.commit()
        connection.close()

        time.sleep(30)


def start_monitoring():
    thread = threading.Thread(
        target=monitor_devices,
        daemon=True
    )

    thread.start()
