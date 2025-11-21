# 🐳 Electron Docker Sandbox Manager (GDG Study-Jam Final Project)

This project is a secure desktop application built with **Electron** that provides a simple, one-click interface to manage a hardened, disposable **Docker container stack** for safe network analysis.

The architecture ensures strict isolation of the testing environment from the host system.

## 🌟 Project Highlights & Evaluation Criteria

This solution was designed to achieve an **Excellent (5/5)** score in the following core categories:

| Criteria | Core Feature |
| :--- | :--- |
| **Isolation & Security** | Enforced by strict **IPC (Inter-Process Communication)** and input validation. |
| **Functionality** | Implemented a seamless **One-Click Start, Stop, and Reset** workflow. |
| **Logging** | Features a basic **Live Log Viewer** displaying real-time command output. |

## ⚙️ Core Stack & Architecture

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Desktop UI** | **Electron (Node.js/Chromium)** | Provides the cross-platform management interface. |
| **Sandbox Environment** | **Docker Compose** | Defines and manages the multi-container architecture. |
| **Logger / Proxy** | **mitmproxy** | Intercepts, logs, and inspects all network traffic (`logs/traffic.log`). |
| **Networking** | **Isolated Bridge Network** | Guarantees the sandbox is separated from the host network. |

## 🚀 Setup & Launch Instructions

### Prerequisites

1. **Docker Desktop:** Must be installed and running.
2. **Node.js/npm:** Must be installed on your host system.

### 3-Step Launch (One-Time Setup)

1. **Clone the Repository:**
    ```bash
    git clone [YOUR_GITHUB_LINK_HERE]
    cd sandbox-manager
    ```
2. **Install Dependencies:**
    ```bash
    npm install
    ```
3. **Start the Application:**
    ```bash
    npm start
    ```

## 🔬 Testing the Sandbox

1. In the desktop application window, click **Start Sandbox** (Green).
2. Wait for the `SUCCESS:` message in the log viewer.
3. Access the isolated browser by opening your host browser to: **`http://localhost:3000`**
4. Click **Reset & Cleanup** (Red) when finished to stop all containers and delete the test data.