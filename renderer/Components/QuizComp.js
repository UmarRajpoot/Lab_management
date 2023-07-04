import { Radio, Typography } from "antd";
const { Title } = Typography;

import { useState } from "react";

const QuizComp = ({ question, options, answer, setSubAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  return (
    <div style={{ marginTop: 30 }}>
      <Title level={3}>{question}</Title>
      <Radio.Group
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {options?.map((opt, index) => {
          return (
            <Radio
              key={index}
              value={`${opt}`}
              style={{ fontSize: 18, padding: 5 }}
              onChange={(e) => {
                setSubAnswer(e.target.value);
              }}
            >
              {opt}
            </Radio>
          );
        })}
      </Radio.Group>
    </div>
  );
};

export default QuizComp;
