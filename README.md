**AirBridge**

Browser-native, peer-to-peer file transfer — no accounts, no permanent cloud storage. Files move directly between browsers over WebRTC when both people are online; when they're not, an encrypted, self-deleting relay holds the handoff.

**The problem**

Sharing a large file today means picking a trade-off:

Cloud tools (WeTransfer, Drive) are slow, cap free file size, need an account, and keep your file on someone else's server.
LAN-only P2P tools (Snapdrop) are fast and private, but only work on the same WiFi and die the moment a tab closes.
Internet-capable P2P tools (PairDrop) fix cross-network pairing, but still require both people online at the same moment.

Nobody cleanly combines P2P speed and privacy with "leave it for them to grab later." AirBridge does.

**How it works**
Sender picks a file, gets a 6-character room code / QR / link.
Receiver opens it.
Both online → file streams directly browser-to-browser over a WebRTC RTCDataChannel. Nothing touches a server.
Receiver offline → file is encrypted client-side and streamed to a short-lived relay. The relay only ever holds ciphertext it can't read, and auto-deletes on first download or after 24 hours — a dead-drop, not storage.

Why not "zero server, ever"? Two parties who are never online at the same time can't exchange data with literally no intermediary — that's true of any asynchronous handoff, not a gap in this design. The real goal is that the intermediary can't read what it's holding, and doesn't hold it for long. See the PRD for the full reasoning.
