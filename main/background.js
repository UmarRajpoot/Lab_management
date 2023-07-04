import { app, dialog } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { firestore } from "../renderer/Components/InitializeApp";
import { deleteDoc, doc } from "firebase/firestore";
import os from "os";
let interfaces = os.networkInterfaces();

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  // const NOTIFICATION_TITLE = "Basic Notification";
  // const NOTIFICATION_BODY = "Notification from the Main process";

  // function showNotification() {
  //   new Notification({
  //     title: NOTIFICATION_TITLE,
  //     body: NOTIFICATION_BODY,
  //   }).show();
  // }
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  async function deletedoc() {
    const docRef = doc(firestore, "LabSoftware", interfaces["Wi-Fi"][1].mac);
    await deleteDoc(docRef)
      .then(() => {
        app.quit();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  app.on("before-quit", () => {});
  mainWindow.on("close", async function () {
    await dialog
      .showMessageBox({
        title: "Quit Software",
        message: "Want to Close the Software",
        buttons: ["Yes", "No"],
      })
      .then((result) => {
        console.log(
          "Trigger to remove the IP Address",
          interfaces["Wi-Fi"][1].mac
        );
        deletedoc();
      })
      .catch((err) => {
        console.log(err);
      });
  });
})();

app.on("window-all-closed", () => {
  // app.quit();
});
