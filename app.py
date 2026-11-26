
from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_cors import CORS
from database.database import get_connection, create_table
from monitoring.ping import ping_device
from monitoring.monitor import start_monitoring
import ipaddress

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {"origins": "http://localhost:3000"}
})

# Initialize database and monitoring
create_table()
start_monitoring()


# HOME
@app.route("/")
def home():
    return render_template("index.html")


# GET ALL DEVICES
@app.route("/api/devices", methods=["GET"])
def get_devices():
    connection = get_connection()

    devices = connection.execute(
        "SELECT * FROM devices"
    ).fetchall()

    connection.close()

    device_list = []

    for device in devices:
        device_list.append({
            "id": device["id"],
            "name": device["name"],
            "ip_address": device["ip_address"],
            "device_type": device["device_type"]
        })

    return jsonify(device_list)


# ADD DEVICE
@app.route("/devices/add", methods=["POST"])
def add_device():
    name = request.form.get("name", "").strip()
    ip_address = request.form.get("ip_address", "").strip()
    device_type = request.form.get("device_type", "")

    allowed_types = ["Router", "Computer", "Server", "Switch", "Other"]

    if not name or device_type not in allowed_types:
        return jsonify({
            "error": "Invalid device information"
        }), 400

    try:
        ipaddress.ip_address(ip_address)
    except ValueError:
        return jsonify({
            "error": "Invalid IP address"
        }), 400

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO devices (name, ip_address, device_type)
        VALUES (?, ?, ?)
        """,
        (name, ip_address, device_type)
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Device added successfully"
    }), 201


# DELETE DEVICE (API)
@app.route("/api/devices/<int:device_id>", methods=["DELETE"])
def api_delete_device(device_id):
    connection = get_connection()

    cursor = connection.execute(
        "DELETE FROM devices WHERE id = ?",
        (device_id,)
    )

    connection.commit()
    connection.close()

    if cursor.rowcount == 0:
        return jsonify({"error": "Device not found"}), 404

    return jsonify({
        "message": "Device deleted successfully"
    })


# CHECK DEVICE MANUALLY
@app.route("/api/devices/<int:device_id>/check", methods=["POST"])
def check_device(device_id):
    connection = get_connection()

    device = connection.execute(
        "SELECT * FROM devices WHERE id = ?",
        (device_id,)
    ).fetchone()

    if device is None:
        connection.close()
        return jsonify({"error": "Device not found"}), 404

    result = ping_device(device["ip_address"])

    connection.execute(
        """
        INSERT INTO check_history
        (device_id, status, latency)
        VALUES (?, ?, ?)
        """,
        (
            device_id,
            result["status"],
            result["latency"]
        )
    )

    connection.commit()
    connection.close()

    return jsonify({
        "id": device["id"],
        "name": device["name"],
        "ip_address": device["ip_address"],
        "status": result["status"],
        "latency": result["latency"]
    })


# GET DEVICE HISTORY
@app.route("/api/devices/<int:device_id>/history", methods=["GET"])
def get_device_history(device_id):
    connection = get_connection()

    history = connection.execute(
        """
        SELECT * FROM check_history
        WHERE device_id = ?
        ORDER BY checked_at DESC
        LIMIT 50
        """,
        (device_id,)
    ).fetchall()

    connection.close()

    history_list = []

    for item in history:
        history_list.append({
            "id": item["id"],
            "device_id": item["device_id"],
            "status": item["status"],
            "latency": item["latency"],
            "checked_at": item["checked_at"]
        })

    return jsonify(history_list)


# GET DEVICE STATISTICS
@app.route("/api/devices/<int:device_id>/stats", methods=["GET"])
def device_stats(device_id):
    connection = get_connection()

    device = connection.execute(
        "SELECT * FROM devices WHERE id = ?",
        (device_id,)
    ).fetchone()

    if device is None:
        connection.close()
        return jsonify({"error": "Device not found"}), 404

    history = connection.execute(
        """
        SELECT status
        FROM check_history
        WHERE device_id = ?
        """,
        (device_id,)
    ).fetchall()

    connection.close()

    total = len(history)

    online = sum(
        1 for check in history
        if check["status"] == "Online"
    )

    offline = total - online

    uptime = 0

    if total > 0:
        uptime = round((online / total) * 100, 2)

    return jsonify({
        "total_checks": total,
        "online_checks": online,
        "offline_checks": offline,
        "uptime": uptime
    })


# OLD HTML ROUTES (KEPT FOR COMPATIBILITY)
@app.route("/devices")
def devices():
    connection = get_connection()

    devices = connection.execute(
        "SELECT * FROM devices"
    ).fetchall()

    connection.close()

    return render_template("devices.html", devices=devices)


@app.route("/devices/delete/<int:device_id>", methods=["POST"])
def delete_device(device_id):
    connection = get_connection()

    connection.execute(
        "DELETE FROM devices WHERE id = ?",
        (device_id,)
    )

    connection.commit()
    connection.close()

    return redirect(url_for("devices"))


if __name__ == "__main__":
    app.run(debug=True)
