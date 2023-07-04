import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Button, notification, Typography } from "antd";

import { PoweroffOutlined } from "@ant-design/icons";
const { Title } = Typography;
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
// Firestore
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
} from "@firebase/firestore";
import { firestore } from "../Components/InitializeApp";
import { getSocketInstance_Data } from "../Store/Socket_State/Socket_Actions";

var os = require("os");
const { exec } = require("child_process");

let interfaces = os.networkInterfaces();

function executeForShutDown(command, callback) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
}

const openNotification = () => {
  notification.open({
    message: "Notification Title",
    description:
      "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
    onClick: () => {
      console.log("Notification Clicked!");
    },
    style: { borderRadius: 10 },
  });
};

function Home() {
  const [connected_device, set_connected_device] = useState({
    IPAddress: "-",
    port: "-",
  });

  const [_SocketConnection, set_Socket_Connection] = useState(null);

  const state = useSelector((state) =>
    console.log("Socket State", state.Socket_Reducer.socketInstance)
  );

  const TaskList = async () => {
    // Define the desired app names
    // console.log("Run");
    const desiredApps = ["chrome", "code", "brave"]; // Add more app names as needed

    // Execute command to get the list of currently running apps
    exec(
      'tasklist /v /fi "STATUS eq running"',
      async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return;
        }

        // Process the output and extract the running app names
        const processes = stdout.split("\n").slice(3, -1);
        const runningApps = new Set();

        processes.forEach((process) => {
          const appName = process.split(/\s+/)[0];
          desiredApps.forEach((desiredApp) => {
            if (appName.toLowerCase().includes(desiredApp)) {
              runningApps.add(appName);
            }
          });
        });

        // Convert the Set to an array
        const uniqueRunningApps = Array.from(runningApps);

        // Print the list of currently running apps
        console.log(uniqueRunningApps);
        // Send it to Firebase
        const docRef = doc(
          firestore,
          "LabSoftware",
          interfaces["Wi-Fi"][1].mac
        );
        let data = {
          Processes: uniqueRunningApps,
        };
        try {
          await updateDoc(docRef, data).then(() => {
            console.log("Processed Added");
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  };

  // useEffect(() => {
  //   console.log("Running");
  //   TaskList();
  // }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(`http://${interfaces["Wi-Fi"][1].address}:2000`);
    console.log(socket);
    set_Socket_Connection(socket);
    dispatch(getSocketInstance_Data(socket));
  }, []);

  // Assignment Notification
  const [assign, setAssign] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const getAssignment = async () => {
    const dbref = collection(firestore, "Assignments");
    onSnapshot(dbref, (docSnap) => {
      setAssign(
        docSnap.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      );
    });
  };
  const getQuiz = async () => {
    const dbref = collection(firestore, "Quizes");
    onSnapshot(dbref, (docSnap) => {
      setQuiz(
        docSnap.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      );
    });
  };

  useEffect(() => {
    if (!_SocketConnection) return;
    _SocketConnection.emit("assignmentAdded", (msg) => {
      console.log(msg);
    });
  }, [assign]);
  useEffect(() => {
    if (!_SocketConnection) return;
    _SocketConnection.emit("quizAdded", (msg) => {
      console.log(msg);
    });
  }, [quiz]);

  useEffect(() => {
    getAssignment();
    getQuiz();
  }, []);

  useEffect(() => {
    if (!_SocketConnection) return;
    _SocketConnection.on("CIPTSoft", (soft_ip) => {
      set_connected_device({ IPAddress: soft_ip.clientIP, port: 2000 });
      _SocketConnection.emit("SOFTIPToCLi", {
        SoftIP: interfaces["Wi-Fi"][1].address,
      });
    });
    _SocketConnection.on("shutdownPC", (shutdownPC) => {
      if (shutdownPC) {
        console.log("PC Shutting down after 5 seconds");
        executeForShutDown("shutdown /p", (output) => {
          console.log(output);
        });
      }
    });
    _SocketConnection.on("assignement", (msg) => {
      console.log(msg);
    });
  }, [_SocketConnection]);

  // Add Firebase Instance
  const AddIpToFirebase = async () => {
    const docRef = doc(firestore, "LabSoftware", interfaces["Wi-Fi"][1].mac);
    let data = {
      IpAddress: interfaces["Wi-Fi"][1].address,
    };
    try {
      await setDoc(docRef, data).then(() => {
        console.log("Ip Address Added");
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    AddIpToFirebase();
  }, []);

  return (
    <div style={{ backgroundColor: "#f5f5f5", width: "100%", height: "100vh" }}>
      <Head>
        <title>Lab Management</title>
      </Head>
      <h1 style={{ textAlign: "center", paddingTop: 20, color: "#737373" }}>
        Lab Management System ‍💻
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#44403c",
            width: "50%",
            justifyContent: "space-around",
            borderRadius: 20,
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              paddingTop: 2,
            }}
          >
            <h3 style={{ color: "wheat" }}>Software IP Address</h3>
            <h3 style={{ color: "wheat" }}>{interfaces["Wi-Fi"][1].address}</h3>
          </div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              paddingTop: 2,
            }}
          >
            <h3 style={{ color: "wheat" }}>Software Port</h3>
            <h3 style={{ color: "wheat" }}>2000</h3>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <h2>Connected Device</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#86efac",
            width: "50%",
            justifyContent: "space-around",
            borderRadius: 20,
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              paddingTop: 2,
            }}
          >
            <h3 style={{ color: "black" }}>Mobile IP Address</h3>
            <h3 style={{ color: "black" }}>{connected_device.IPAddress}</h3>
          </div>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              paddingTop: 2,
            }}
          >
            <h3 style={{ color: "black" }}>Mobile Port</h3>
            <h3 style={{ color: "black" }}>{connected_device.port}</h3>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          marginTop: 10,
        }}
      >
        <Title level={4} style={{ color: "#737373" }}>
          Shut Down your PC
        </Title>
        <Button
          style={{
            backgroundColor: "#f87171",
            borderRadius: 50,
            width: 50,
            height: 50,
          }}
          icon={<PoweroffOutlined />}
          // loading
          onClick={() => SetRsp()}
        />
      </div>
    </div>
  );
}

export default Home;
