
import subprocess
import platform
import time


def ping_device(ip_address):

    # Windows and Linux use different ping arguments
    if platform.system().lower() == "windows":
        command = ["ping", "-n", "1", "-w", "1000", ip_address]
    else:
        command = ["ping", "-c", "1", "-W", "1", ip_address]

    try:
        start_time = time.perf_counter()

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=3
        )

        end_time = time.perf_counter()

        if result.returncode == 0:
            latency = round((end_time - start_time) * 1000, 2)

            return {
                "status": "Online",
                "latency": latency
            }

        return {
            "status": "Offline",
            "latency": None
        }

    except (subprocess.TimeoutExpired, FileNotFoundError):
        return {
            "status": "Offline",
            "latency": None
        }
