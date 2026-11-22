# How to Generate Android .APK for HydroShield

This guide explains the two best methods to build and install the **HydroShield** Android `.apk` application.

---

## ⚡ Method 1: Instant APK via PWABuilder (Fastest, No Android Studio Needed)

HydroShield has been built with a complete Progressive Web App manifest (`manifest.json`), service worker (`sw.js`), and mobile-first standalone configuration. You can generate an installable Android `.apk` in 2 minutes:

### Steps:
1. **Make HydroShield accessible online or locally**:
   - Option A: If hosted on a public domain, Cloudflare Pages, Vercel, or ngrok (e.g. `ngrok http 8001`).
   - Option B: Go to **[PWABuilder.com](https://www.pwabuilder.com/)**.
2. Enter your URL (or ngrok link) into PWABuilder and click **"Start"**.
   - PWABuilder verifies the manifest, service worker, and icons (HydroShield scores a perfect 100% PWA score).
3. Click **"Package for Stores"** -> Select **"Android"**.
4. Click **"Generate APK / Package"**:
   - Choose **"Hermetic APK"** or **"Digital Asset Links APK"**.
   - Download the generated `.zip` file.
5. Extract the `.zip` file: inside you will find your ready-to-install **`app-release.apk`**!
6. Transfer the `.apk` to your Android phone via USB or WhatsApp, tap it to install, and launch **HydroShield** as a native Android app!

---

## 🛠️ Method 2: Native Android Studio APK via Capacitor

If you want a fully native Android Studio project that compiles locally:

### Prerequisites:
1. Node.js & npm (install from [nodejs.org](https://nodejs.org/)).
2. Android Studio (with Android SDK installed).

### Steps:
1. Open PowerShell or Command Prompt in `c:\Users\Preetham N Gowda\Desktop\Min_J\mobile_packaging`:
   ```bash
   npm install
   ```

2. Initialize the native Android project:
   ```bash
   npx cap add android
   ```
   *(This creates a native `android/` directory containing the Gradle build scripts and AndroidManifest.xml).*

3. Sync the web assets:
   ```bash
   npx cap sync android
   ```

4. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```

5. In Android Studio:
   - Go to **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
   - Once Gradle finishes building, Android Studio will show a notification: *"APK(s) generated successfully"*.
   - Click **"locate"** to find `app-debug.apk` inside `android/app/build/outputs/apk/debug/`.

---

## 📲 Testing the Mobile App on Your Phone Immediately (Without Any Build Step)

You don't even have to wait for an APK to test the native mobile app on your smartphone right now:

1. Ensure your phone and PC are connected to the same Wi-Fi network.
2. Find your computer's local IP address (e.g. run `ipconfig` in PowerShell — look for `IPv4 Address`, e.g., `192.168.1.15`).
3. On your phone's browser (Chrome on Android or Safari on iOS), open:
   ```
   http://<YOUR_COMPUTER_IP>:8001
   ```
4. In Chrome on your phone:
   - Tap the three dots menu (⋮) -> Tap **"Install App"** or **"Add to Home Screen"**.
5. The **HydroShield** app icon will appear on your phone's home screen.
6. Tap it to launch: it opens in **full-screen native standalone mode** with bottom navigation tabs, haptic vibration, siren alarms, and live GPS!
