import asyncio
import websockets
import json
import base64
from pathlib import Path
from datetime import datetime

SAVE_DIR = Path("reports")
SAVE_DIR.mkdir(exist_ok=True)

async def handler(websocket):
    async for message in websocket:
        try:
            data = json.loads(message)
            mtype = data.get("type")

            if mtype == "location":
                lat, lon, ts = data.get("lat"), data.get("lon"), data.get("timestamp")
                print(f"📍 GPS update: lat={lat}, lon={lon} at {ts}")

            elif mtype == "sos":
                lat, lon, ts = data.get("lat"), data.get("lon"), data.get("timestamp")
                print(f"🚨 SOS at lat={lat}, lon={lon}, time={ts}")

            elif mtype == "incident":
                desc = data.get("description", "")
                ts = data.get("timestamp", datetime.utcnow().isoformat())
                print(f"📝 Incident report at {ts}: {desc}")

                # Save images
                for idx, img_b64 in enumerate(data.get("images", [])):
                    try:
                        img_bytes = base64.b64decode(img_b64)
                        (SAVE_DIR / f"incident_{ts}_{idx}.jpg").write_bytes(img_bytes)
                        print(f"   📷 Saved image {idx}")
                    except Exception as e:
                        print(f"   ⚠️ Failed to decode image {idx}: {e}")

                # Save voice message
                voice_b64 = data.get("voice")
                if voice_b64:
                    try:
                        voice_bytes = base64.b64decode(voice_b64)
                        (SAVE_DIR / f"incident_{ts}_voice.ogg").write_bytes(voice_bytes)
                        print("   🎤 Saved voice message")
                    except Exception as e:
                        print(f"   ⚠️ Failed to decode voice: {e}")

            else:
                print(f"❓ Unknown message type: {mtype}")

        except Exception as e:
            print(f"Invalid message: {message} ({e})")

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        print("✅ WebSocket server started on ws://0.0.0.0:8765")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
