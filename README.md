# Netwatch

![Project Status](https://img.shields.io/badge/status-work--in--progress-orange)
![Python](https://img.shields.io/badge/Python-3.x-blue)
![Flask](https://img.shields.io/badge/Backend-Flask-black)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![Database](https://img.shields.io/badge/Database-SQLite-blue)

**A network monitoring dashboard built with Flask, React, and SQLite.**

Netwatch is a personal network monitoring project designed to monitor devices, track their availability, view monitoring history, and receive Discord notifications when a device goes offline or comes back online.

Inspired by Network Operations Center (NOC) monitoring tools, the project aims to provide a simple interface for monitoring network infrastructure.

>  **Work in Progress:** Netwatch is currently under development. New features, improvements, and fixes are being added.

---

## Dashboard Template

The Netwatch frontend is built using **Horizon UI Chakra**, a React dashboard template based on Chakra UI.

- **Template:** [Horizon UI Chakra](https://github.com/horizon-ui/horizon-ui-chakra)
- **Original Repository:** https://github.com/horizon-ui/horizon-ui-chakra

The template was customized to create the Netwatch network monitoring dashboard.

## Features

- **Device Management** — Add and remove network devices.
- **ICMP Monitoring** — Check device availability using ping.
- **Automatic Monitoring** — Periodically monitor registered devices in the background.
- **Device Status** — Identify online and offline devices.
- **Monitoring History** — Store and review previous monitoring results.
- **Uptime Statistics** — Calculate availability percentages from recorded checks.
- **Discord Notifications** — Receive alerts when devices go offline or recover.
- **Dashboard** — Manage devices through a React interface.

## Technologies

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Flask | REST API |
| React | Frontend |
| Chakra UI | User interface |
| SQLite | Database |
| Discord Webhooks | Notifications |
| Git & GitHub | Version control |

## Project Structure

```text
netwatch/
│
├── database/
│   └── database.py
│
├── monitoring/
│   ├── ping.py
│   ├── monitor.py
│   └── discord_alert.py
│
├── frontend/
│   └── src/
│
├── templates/
├── app.py
├── requirements.txt
├── .gitignore
└── README.md
```

## Installation

### Requirements

- Python 3
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/palmtreepaniko/netwatch.git
cd netwatch
```

### 2. Set up the backend

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Discord notifications

Set your Discord webhook URL as an environment variable:

```powershell
$env:DISCORD_WEBHOOK_URL="YOUR_DISCORD_WEBHOOK_URL"
```

Replace the placeholder with your own webhook URL.

**Never publish your webhook URL or other private credentials.**

### 4. Start the Flask backend

```bash
python app.py
```

Backend address:

`http://localhost:5000`

### 5. Start the React frontend

Open another terminal:

```powershell
cd frontend
npm install
npm start
```

Frontend address:

`http://localhost:3000`

---

## Roadmap

- [x] Device management
- [x] ICMP ping monitoring
- [x] SQLite monitoring history
- [x] Dashboard statistics
- [x] Automatic background monitoring
- [x] Discord notifications
- [ ] TCP port monitoring
- [ ] HTTP/HTTPS monitoring
- [ ] DNS monitoring
- [ ] Network topology visualization
- [ ] SNMP monitoring
- [ ] Improved alert handling and uptime calculations

## Project Goal

The goal of Netwatch is to develop practical skills in:

- Network administration
- Network monitoring and troubleshooting
- IT infrastructure
- Python and backend development
- Full-stack application development

## Development Status

Netwatch is an ongoing personal project. The current version provides basic device monitoring, history tracking, dashboard statistics, and Discord notifications.

More monitoring capabilities and improvements are planned.

## Credits

- [Horizon UI Chakra](https://github.com/horizon-ui/horizon-ui-chakra) — Dashboard template.

---

**Developed by [palmtreepaniko](https://github.com/palmtreepaniko)**
