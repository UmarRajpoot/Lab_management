import React, { useEffect, useState } from "react";
import { Card, Typography } from "antd";
const { Title } = Typography;
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, storage, storageRef } from "../Components/InitializeApp";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { io } from "socket.io-client";

var os = require("os");
let interfaces = os.networkInterfaces();

const Assignment = () => {
  const [assignment, setAssignment] = useState([]);

  const [_socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(`http://${interfaces["Wi-Fi"][1].address}:2000`);
    setSocket(socket);
  }, []);

  const getAssignment = async () => {
    const dbref = collection(firestore, "Assignments");

    onSnapshot(dbref, (docSnap) => {
      setAssignment(
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
    if (!_socket) return;
    if (assignment.length)
      _socket.emit("assignmentAdded", (msg) => {
        console.log(msg);
      });
  }, [assignment]);

  useEffect(() => {
    getAssignment();
  }, []);

  const downloadURL = async (url) => {
    // console.log("click");
    const httpsReference = storageRef(storage, url);
    // console.log(httpsReference.fullPath);
    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", url);
    if (httpsReference.name.split(".").splice(-1).toString() !== "pdf") {
      // link.target = "_blank"; // Open in a new tab or window
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      link.target = "_blank"; // Open in a new tab or window
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const AssignmentComp = ({ title, assignementURL }) => {
    // console.log("Here", assignementURL);
    return (
      <Card
        title={title}
        style={{ marginBottom: "5px" }}
        extra={
          <a>
            <CloudDownloadOutlined
              style={{ fontSize: "25px" }}
              onClick={() => {
                downloadURL(`${assignementURL}`);
              }}
            />
          </a>
        }
      >
        <p>Download your Assignment</p>
      </Card>
    );
  };

  return (
    <div>
      <Title>Assignment</Title>

      {assignment.map((assign, index) => {
        // console.log(assign.data.assignmentURL);
        return (
          <AssignmentComp
            key={assign.id}
            title={assign.data.assignmentName}
            assignementURL={assign.data.assignmentURL}
          />
        );
      })}
    </div>
  );
};

export default Assignment;
