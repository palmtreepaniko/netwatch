\# Netwatch



\*\*A network monitoring dashboard built with Flask, React, and SQLite.\*\*



Netwatch is a personal network monitoring project designed to monitor devices, track their availability, view monitoring history, and receive real-time Discord notifications when a device goes offline or comes back online.



The project aims to provide a simple monitoring dashboard inspired by the tools used in Network Operations Centers (NOCs).



\## Features



\- \*\*Device Management\*\* — Add and remove network devices.

\- \*\*ICMP Monitoring\*\* — Check whether devices are reachable using ping.

\- \*\*Automatic Monitoring\*\* — Monitor registered devices periodically in the background.

\- \*\*Device Status\*\* — Identify online and offline devices.

\- \*\*Monitoring History\*\* — Store and review previous monitoring results.

\- \*\*Uptime Statistics\*\* — Calculate availability percentages from recorded checks.

\- \*\*Discord Notifications\*\* — Receive alerts when a device goes offline or recovers.

\- \*\*Dashboard\*\* — Manage and monitor devices through a React interface.



\## Technologies Used



| Technology | Purpose |

|---|---|

| Python | Backend programming |

| Flask | Backend and REST API |

| React | Frontend |

| Chakra UI | Dashboard interface |

| SQLite | Database |

| Discord Webhooks | Notifications |

| Git \& GitHub | Version control |



\## Project Structure



```text

netwatch/

│

├── database/

│   └── database.py

│

├── monitoring/

│   ├── ping.py

│   ├── monitor.py

│   └── discord\_alert.py

│

├── frontend/

│   └── src/

│

├── templates/

├── data/

│

├── app.py

├── .gitignore

└── README.md

```



\## Getting Started



\### Requirements



\- Python 3

\- Node.js and npm

\- Git



\### 1. Clone the repository



```bash

git clone https://github.com/palmtreepaniko/netwatch.git

cd netwatch

```



\### 2. Set up the Python backend



Create a virtual environment:



```bash

python -m venv venv

```



Activate it on Windows:



```powershell

venv\\Scripts\\activate

```



Install the backend dependencies:



```bash

pip install flask flask-cors

```



\### 3. Configure Discord notifications



Set your Discord webhook URL as an environment variable in PowerShell:



```powershell

$env:DISCORD\_WEBHOOK\_URL="YOUR\_DISCORD\_WEBHOOK\_URL"

```



Replace the placeholder with your own webhook URL.



\*\*Important:\*\* Never publish your webhook URL or other private credentials.



\### 4. Start the backend



```bash

python app.py

```



The Flask backend should be available at:



`http://localhost:5000`



\### 5. Start the frontend



Open another terminal:



```powershell

cd frontend

npm install

npm start

```



The React dashboard should be available at:



`http://localhost:3000`



\## Current Development Status



Netwatch is actively being developed.



Planned improvements include:



\- TCP port monitoring

\- HTTP/HTTPS service monitoring

\- DNS monitoring

\- Network topology visualization

\- SNMP monitoring

\- Improved uptime calculations and alert handling



\## Project Goal



The goal of Netwatch is to develop practical skills in network administration, infrastructure monitoring, Python development, and full-stack application development.



\---



\*\*Developed by \[palmtreepaniko](https://github.com/palmtreepaniko)\*\*

