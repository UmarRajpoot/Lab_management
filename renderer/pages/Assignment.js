import React, { useEffect, useState } from "react";
import { Typography } from "antd";
const { Title, Paragraph } = Typography;
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../Components/InitializeApp";

const Assignment = () => {
  const [assignment, setAssignment] = useState([]);

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
    getAssignment();
  }, []);

  const AssignmentComp = ({ title, paragraph }) => {
    return (
      <div>
        <Title level={3}>{title}</Title>
        <Paragraph>{paragraph}</Paragraph>
      </div>
    );
  };

  return (
    <div>
      <Title>Assignment</Title>
      {assignment.map((assign, index) => {
        return (
          <AssignmentComp
            key={assign.id}
            title={`Assignment ${index + 1}`}
            paragraph={assign.data.text}
          />
        );
      })}
    </div>
  );
};

export default Assignment;
