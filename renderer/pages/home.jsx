import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Layout, Form, Select, Button, notification, Typography } from "antd";

const { Header, Content } = Layout;
const { Item: FormItem } = Form;
const { Option } = Select;

import { PoweroffOutlined } from "@ant-design/icons";
const { Title } = Typography;
import { io } from "socket.io-client";

var os = require("os");
const exec = require("child_process").exec;

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

  useEffect(() => {
    const socket = io(`http://${interfaces["Wi-Fi"][1].address}:2000`);
    console.log(socket);
    set_Socket_Connection(socket);
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
        // executeForShutDown("shutdown /p", (output) => {
        //   console.log(output);
        // });
      }
    });
  }, [_SocketConnection]);

  let interfaces = os.networkInterfaces();

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
