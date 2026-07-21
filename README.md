# URRJA: Gated-Community Peer-to-Peer Solar Energy Trading Platform

URRJA is a complete prototype software system designed to enable peer-to-peer (P2P) solar energy trading within a gated community. Each home is equipped with a solar energy node that monitors local generation, battery status, and available surplus. A central server (e.g., Raspberry Pi) hosts the community marketplace where residents can buy and sell energy dynamically.

---

## 1. System Architecture

```
                                  [ COMMUNITY SUBNET / HOTSPOT ]
                                                 |
         +---------------------------------------+---------------------------------------+
         |                                       |                                       |
  +------+------+                         +------+------+                         +------+------+
  |    Node A   | (Seller)                |    Node B   | (Buyer)                 |    Server   | (Pi or PC)
  |  ESP32-WROOM |                         |  ESP32-WROOM |                         |  Flask App  |
  +------+------+                         +------+------+                         +------+------+
         |                                       |                                       |
         v (HTTP Telemetry)                      v (HTTP Telemetry)                      v (REST API)
   Calculates surplus                      Requests energy                        Matches Listings
   Closes Relay [ON]                       Draws energy                           Settles ledger
```

---

## 2. Hardware Design & Wiring Overview

### Suggested Component List
1. **Microcontroller**: ESP32-WROOM-DA (Dual-Antenna module for reliable outdoor range)
2. **Current/Voltage Sensor**: Adafruit INA219 High-Side I2C Current Sensor (ideal for low-voltage batteries up to 26V, 3.2A)
3. **Actuator**: 5V Relay module or Opto-isolated N-Channel MOSFET load switch
4. **Indicators**: 3x Status LEDs (Wi-Fi, Active Trade, System Error)
5. **Circuit Protection**: 5A Inline fuse and optocoupler for signal isolation

### Wiring Diagram (Node Level)

```
             +---------------------------------------+
             |            ESP32-WROOM-DA             |
             |                                       |
             |  GND  SDA(21)  SCL(22)  IO25  IO26  IO27|
             +---+------+-------+-------+-----+-----+
                 |      |       |       |     |     |
                 |      |       |       |     |     +--> [RED LED] (Error Indicator)
                 |      |       |       |     +--------> [GRN LED] (Trade Active)
                 |      |       |       +--------------> [RELAY IN] (Simulated Load Switch)
                 |      |       |
                 |      |       +---------------+
                 |      +-------------+         |
                 v                    v         v
             +-------+            +-------------+---+
             |  GND  |            |   SDA      SCL  |
             |       |            |                 |
             | SOLAR |            |     INA219      |
             | BAT   |            |  Current Sensor |
             | LOOP  |            | (Vin+      Vin-)|
             +---+---+            +---+---------+---+
                 |                    |         |
     (GND) <-----+                    v         v
                                 (From Solar)  (To Battery + Load)
```

| ESP32 Pin | Component Pin | Description |
|---|---|---|
| **GND** | GND | Common ground connection |
| **I2C SDA (21)** | INA219 SDA | I2C Data Line |
| **I2C SCL (22)** | INA219 SCL | I2C Clock Line |
| **GPIO 25** | Relay IN | Actuates simulated transfer load |
| **GPIO 2** | Built-in LED | Wi-Fi status indicator (Blinking=Connecting, Solid=Online) |
| **GPIO 26** | Green LED | Trade status indicator (Solid=Simulated Transfer active) |
| **GPIO 27** | Red LED | Error indicator (Solid=Sensor/Server connection loss) |

---

## 3. Software Stack & Structure

- **Backend**: Python 3.10+, Flask framework, SQLite
- **Frontend**: HTML5, Vanilla CSS3 (custom variables, modern transitions), Vanilla JavaScript (REST requests, real-time polling)
- **Firmware**: Arduino C++ (Compatible with ESP32 Arduino Core v2.x/v3.x)

```
UrrjaLocalEnergyMarket/
│
├── esp32_firmware/
│   └── esp32_firmware.ino         # ESP32 C++ sketch code
│
└── server/
    ├── app.py                     # Flask server core, P2P matching & API routing
    ├── database.py                # Database setup, table models, and seed values
    ├── urrja.db                   # SQLite database (generated automatically)
    ├── simulate_node.py           # Mock node client utility script
    │
    ├── static/
    │   ├── css/
    │   │   └── style.css          # Design system, variables, layouts, and animations
    │   └── js/
    │       └── main.js            # Frontend logic: polling, calculations, forms
    │
    └── templates/
        ├── base.html              # Layout template (nav menu, profile widget)
        ├── login.html             # Login and community registration form
        ├── dashboard.html         # User overview telemetry & SoC dial
        ├── seller.html            # Solar sale listing register
        ├── marketplace.html       # Market table, listings matching, instant buy
        ├── devices.html           # Live status of all community nodes
        ├── transactions.html      # Community ledger records
        └── admin.html             # Global stats and console logs
```

---

## 4. Setup and Run Guide

### Step 1: Install Server Dependencies
On your Raspberry Pi or local PC, install the required dependencies:
```bash
pip install flask requests werkzeug
```

### Step 2: Initialize Database and Start Server
Initialize the database and launch the Flask server:
```bash
# Go to server directory
cd server

# Initialize database (optional, will auto-run on app start)
python database.py

# Launch the Flask server
python app.py
```
By default, the server runs on `http://0.0.0.0:5000` (listening on all local interfaces).

### Step 3: Flash the ESP32 Node
1. Open the Arduino IDE.
2. Install the following libraries via the Library Manager (`Ctrl + Shift + I`):
   - **Adafruit INA219**
   - **ArduinoJson** (by Benoit Blanchon)
3. Open `esp32_firmware/esp32_firmware.ino`.
4. Update the Wi-Fi credentials (`ssid`, `password`) and the `serverUrl` (substitute your Pi/PC's local IP address).
5. Compile and flash the code to your ESP32 module.

> [!TIP]
> If testing without physical sensors, make sure `#define SIMULATION_MODE 1` is enabled at the top of the sketch.

---

## 5. Local Prototype Testing

You can test the complete trading flow on your local PC using the Python simulator without needing physical hardware:

1. **Start the Flask Server**: `python app.py`
2. **Access the Dashboard**: Open `http://127.0.0.1:5000/` in your browser.
   - Log in as the pre-seeded admin user:
     - **Username**: `admin`
     - **Password**: `admin123`
   - Or log in as a pre-seeded house node owner:
     - **Username**: `house1_owner`
     - **Password**: `urrja123`
3. **Register a New Node**:
   - Go to `/login` and select "Register Node".
   - Create a user (e.g. `house4`), define a house (e.g. `Villa 505`), and write down the generated **Device Token**.
4. **Launch the Node Simulator**:
   - Open a terminal and start the simulator representing your house:
     ```bash
     python simulate_node.py <device_token>
     ```
   - By default, running `python simulate_node.py` without arguments simulates the pre-seeded `token_node_101` (Smart Villa 101).
5. **Create a Transaction**:
   - Log in as `house1_owner` and post an energy listing: **500 Wh** @ **0.40 tokens/Wh**.
   - Open an incognito browser window, log in as `house2_owner`, and place a matching purchase request on the Marketplace: **500 Wh** @ max price **0.45 tokens/Wh**.
   - Observe the terminal console of the running `simulate_node.py` client: it will print `[ACTIVE TRANSFER]` and simulate closed relays immediately.
   - Look at the Flask terminal or the Admin dashboard `http://127.0.0.1:5000/admin` to see the transaction transition from `initiated` $\rightarrow$ `transferring` $\rightarrow$ `completed`.
   - Verify that token balances settle: `house1_owner` wallet increases and `house2_owner` wallet decreases.

---

## 6. Safety & Prototype Limitations

- **Grid Transfer Simulation**: This system is purely a software and low-voltage hardware prototype. It does **NOT** control or route mains electricity (110V/220V AC). 
- **Relay/MOSFET Load Switching**: The relay on the ESP32 only switches a low-voltage DC load (e.g., an LED indicator, a small DC fan, or dummy load resistor) to visually confirm trade actuation safely.
- **Microgrid Control**: In a physical community rollout, this control signal would command localized battery management systems (BMS) or smart grid controllers connected to a dedicated DC microgrid.
