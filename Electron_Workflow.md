# 🦏 RhinoTime - Zoom Session Automation Desktop App

<p align="center">
  <img src="./frontend/src/assets/Rhino.png" alt="RhinoTime Logo" width="200"/>
</p>

## 📌 Overview

RhinoTime is a **cross-platform** desktop application built with **Electron and React**, designed to help tutors automate Zoom session scheduling and notifications. It eliminates the hassle of manually starting and ending Zoom meetings by using **Node-Cron** and **Shell execution**, ensuring punctuality and efficiency.

## 🚀 Features

- ✅ **Automated Zoom Scheduling**: Uses **Node-Cron** to launch and close Zoom meetings at scheduled times.
- ✅ **Cross-Platform Compatibility**: Supports **macOS, Windows, and Linux**.
- ✅ **RESTful API with MongoDB**: Enables tutors to manage **main & overtime sessions** with full CRUD operations.
- ✅ **Auto-Updater**: Seamless updates via **Electron-Updater**, reducing manual update efforts.
- ✅ **AWS Deployment**: Backend hosted on **AWS EC2**, ensuring high availability and zero downtime.
- ✅ **User-Friendly Interface**: Built with **React, Tailwind CSS, and Material UI**.

## 📷 Project Vd Demo:  [RhinoTime Vd Demo](https://drive.google.com/file/d/1_UBr2Ana0qq-Afh3AEaADkJhHO5VkrJ5/view)

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/NikkiAung/RhinoTime.git
cd RhinoTime
```
### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Start the Development Server
```sh
npm run server
```

### 4️⃣ Build for Production
```sh
npm run build
```
### 5️⃣ Run the Electron App
```sh
npm run dev
```

## 🔧 Configuration

- environment Variables (.env)
    - Create a .env file in both frontend and backend with the following:
    ```sh
    MONGODB_URI=<your-mongodb-connection-string>
    JWT_SECRET=<your-secret-key>
    ```
- Zoom Meeting Schedule
    - Add your schedule in the app interface or modify timeSheet in the Electron main process.

## 🚀 Deployment
- Backend: Deployed on AWS EC2 using PM2.
- Frontend: Packaged using Electron-Builder for cross-platform compatibility.
- Auto-Updates: Managed via GitHub Releases.

## 🛠️ Troubleshooting
### macOS Code Signing Issue?
#### If you don’t have an Apple Developer account, use:
```sh
"mac": {
  "identity": null,
  "hardenedRuntime": false
}
```
#### in package.json.

# 📖 Electron Workflow

### Unlike website, ELECTRON is run on two separate environments/worlds
* Main World for UI Web Content
* Isolated World for Main Process (Node.js Backend) 

## Important Steps to make your electron app less risky.

```bash
function createWindow() {
   webPreferences : {
     nodeIntegration : false,  //preventing node.js access to users
     contextIsolation : true, //preventing window/dom manipulation by users
   }
}
```

## If contextIsolation is set to default true by Electron
* Have to communicate through contextBridge inside preload.js 
* Use IPC (Interprocess communication) to request backend nodeAPI to do the task 
* Preload.js acting as a layer allowing specific task/function to call & one backend API func per message
* To prevent hackers access to global javascript window function to overwrite.

**IPC is acting as a walkie-talkie between preload.js and backend API function**

## If contextIsolation : false

* It shares the same window object meaning users can access the whole object without using Bridge. As a result, hackers can access to modify a Global Variable, resulting as below.


```bash
Before Modification:
window.userData = { name: "John Doe", isAdmin: false }; console.log(window.userData.isAdmin); // ✅ false

Hacker Injects Code:
window.userData.isAdmin = true; // ⚠️ Modifying global variable

After Modification:
console.log(window.userData.isAdmin) // ❌ Now prints `true`!
```

## Example case

Let’s say UI wants to schedule the zoom meeting, it talks to the preload.js directly without using IPC. Then, preload.js uses IPC (Inter Process Communication) to talk to the backend Node to do the zoom schedule meeting task. If successful, it can send back a “Success” message using IPC. 

## Electron Workflow

![Electron Workflow](./project_images/ElectronWorkflow.jpg) 


* zoomAutomation.js | Call From UI |

    ```bash
    const scheduleZoomMeetings = (timeSheet, zoomLink) => {
    if (!window.electronAPI) {
        console.error("🚨 window.electronAPI is undefined!");
        return;
    }
    window.electronAPI.scheduleZoom(timeSheet, zoomLink);
    };
    export { scheduleZoomMeetings };
    ```
* Preload.js
    ```bash
    const { contextBridge, ipcRenderer } = require('electron');
    contextBridge.exposeInMainWorld('electronAPI', {
    scheduleZoom: (timeSheet, zoomLink) => ipcRenderer.send('schedule-zoom', timeSheet, zoomLink)
    });
    ```
* main.js
    ```bash
    ipcMain.on('schedule-zoom', (event, timeSheet, zoomLink) => {
        console.log("Scheduling Zoom:", timeSheet);
        shell.openExternal(zoomLink); // ✅ Safe operation
    });
    ```
## 🤝 Contributing
#### Contributions are welcome! Feel free to fork this repo, open an issue, or submit a pull request.

### Made with ❤️ by Aung Nanda Oo 🚀


