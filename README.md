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

## 📷 Project Vd Demo:  
#### 1 min quickDemo [RhinoTime Vd Demo](https://drive.google.com/file/d/1_UBr2Ana0qq-Afh3AEaADkJhHO5VkrJ5/view)
#### 4 mins lofiDemo [RhinoTime Vd Demo](https://drive.google.com/file/d/1Bji2vO1ToLQrzcDRP9of5VOQKozrIfSZ/view?usp=sharing)

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

## 🤝 Contributing
#### Contributions are welcome! Feel free to fork this repo, open an issue, or submit a pull request.

### Made with ❤️ by Aung Nanda Oo 🚀