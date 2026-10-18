# SMV Productivity Ladder - Android & Web Planner

A high-performance Garment Sewing Line Efficiency, SMV Capacity Ladder Planner, and Style Archive built with React, Vite, Tailwind CSS, Capacitor Android, and PWA capabilities.

---

## 🛠️ GitHub Actions Error Fix

### Why the error happened:
GitHub's default **"Android CI"** workflow expects a native Java/Kotlin Android Studio project that already has `build.gradle` and `gradlew` in the root folder. Because this project is built with React/Vite, the default template failed with:
```
Error: No file in /home/runner/work/Ladder/Ladder matched to [**/*.gradle*,**/gradle-wrapper.properties,...]
```

### The Solution:
We configured **Capacitor** to wrap the React web app into a real native Android project inside `/android`, and created an updated GitHub Actions workflow at `.github/workflows/android.yml`.

When you push this repository to GitHub, the workflow automatically:
1. Installs Node.js dependencies
2. Builds the Vite production bundle (`npm run build`)
3. Synchronizes the web bundle into the native Android project (`npx cap sync android`)
4. Uses Java JDK 17 to compile the Android debug APK (`./gradlew assembleDebug`)
5. Uploads `SMV-Productivity-Ladder-Debug-APK` as a downloadable artifact under the **Actions** tab in GitHub!

---

## 📱 2 Ways to Use on Android:

### Option 1: Direct 1-Tap PWA Install (No APK build needed)
1. Open the web URL in Google Chrome or Samsung Internet on your Android phone.
2. Tap the **Install** button in the app banner (or Chrome Menu `⋮` -> **Install App** / **Add to Home screen**).
3. The app installs directly as a standalone Android app with the custom icon and works 100% offline.

### Option 2: Download the Compiled APK from GitHub Actions
1. Push this code to your GitHub repository.
2. In your GitHub repo, go to the **Actions** tab.
3. Click on the latest **Android Build & APK Generator** run.
4. Scroll to **Artifacts** at the bottom and download `SMV-Productivity-Ladder-Debug-APK`.
5. Transfer to your Android device and install!
