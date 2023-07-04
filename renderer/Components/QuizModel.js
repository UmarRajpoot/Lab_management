import { Modal, Typography } from "antd";
const { Title } = Typography;
import React from "react";

const QuizModel = ({ setIsModalOpen, isModalOpen, TotalScore, calScore }) => {
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const averageScore = () => {
    const avgScore = (calScore / TotalScore) * 100;
    return avgScore;
  };

  return (
    <Modal
      title="Quiz Result"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Title level={4}>
        Attemted
        <Title>
          {calScore} / {TotalScore}
        </Title>
      </Title>
      <Title level={4}>
        Percentage <Title>{averageScore()}%</Title>
      </Title>
      {averageScore() >= 50 ? (
        <Title level={4} style={{ color: "green" }}>
          Congratulation <Title level={4}>You Passed the Quiz.</Title>{" "}
        </Title>
      ) : (
        <Title level={4} style={{ color: "red" }}>
          Sorry <Title level={4}>You Failed the Quiz.</Title>{" "}
        </Title>
      )}
    </Modal>
  );
};

export default QuizModel;
