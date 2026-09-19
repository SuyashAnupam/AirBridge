# Simple WebRTC Chat (Same Wi‑Fi)

A minimal signalling server + client to test peer‑to‑peer video/audio chat over WebRTC on the same local network.

## Prerequisites

- **Node.js** (v14 or later) installed on your machine.
- A modern browser (Chrome, Edge, Firefox) that supports WebRTC.
- Both devices must be on the same Wi‑Fi/network.

## Setup

1. **Clone / copy the repository** containing the files:
   - `server.js`
   - `public/index.html`
   - `package.json` (added in this update)

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the signalling server**

   ```bash
   npm start
   ```

   The server will listen on port **3000** (or the port defined in `process.env.PORT`).  
   You should see a log like:

   ```
   🚀 Signalling server running at http://localhost:3000
   ```

4. **Open the client page**

   - On the same machine, open `http://localhost:3000` in a browser.
   - On another device (still on the same Wi‑Fi), open `http://<your‑computer‑IP>:3000`.

   Example: `http://192.168.1.42:3000`

5. **Test the chat**

   - Both browsers will request permission to use the camera and microphone.
   - After a short delay (≈3 seconds), the first client creates an offer; the second client answers automatically.
   - You should see your own video on the left and the remote video on the right.

## How It Works

- **Server (`server.js`)**  
  Uses **Express** to serve static files from the `public` folder and **Socket.io** for signalling.  
  Every `signal` message received from a client is broadcast to all other connected clients.

- **Client (`public/index.html`)**  
  - Captures local media with `navigator.mediaDevices.getUserMedia`.  
  - Sets up an `RTCPeerConnection` with a public Google STUN server.  
  - Exchanges SDP offers/answers and ICE candidates via the Socket.io signalling channel.  
  - Displays local and remote video streams.

## Debugging Tips

- Open the browser console (F12) to see status messages (`📹 Local media acquired`, errors, etc.).
- Server console logs show when clients connect/disconnect and when signals are forwarded.
- If the remote video stays black:
  1. Ensure both devices can reach each other’s IP/port (no firewall blocking).
  2. Verify that the STUN server is reachable (you can replace it with another public STUN server if needed).
  3. Check the console for any ICE‑candidate errors.

## Stopping the Server

Press `Ctrl + C` in the terminal where `npm start` is running.

---

Enjoy experimenting with WebRTC! If you need a more robust solution (multiple rooms, TURN server, etc.), consider extending this base or using libraries like **simple‑peer** or **mediasoup**.