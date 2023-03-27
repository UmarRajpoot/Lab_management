import React, { useEffect, useState } from "react";
import { Radio, Typography } from "antd";
const { Title, Paragraph } = Typography;
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../Components/InitializeApp";
const Quiz = () => {
  const [quiz, setQuiz] = useState([]);

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
    getQuiz();
  }, []);
  //   console.log(quiz);

  const QuizComp = ({ question, options, answer }) => {
    return (
      <div style={{ marginTop: 30 }}>
        <Title level={3}>{question}</Title>
        <Radio.Group>
          {options?.map((opt, index) => {
            return (
              <Radio
                key={index}
                value={`${opt}`}
                style={{ fontSize: 18, padding: 5 }}
              >
                {opt}
              </Radio>
            );
          })}
        </Radio.Group>
        {/* <Paragraph>{paragraph}</Paragraph> */}
      </div>
    );
  };

  return (
    <div>
      <Title>Quiz</Title>
      {quiz.map((qui, qindex) => {
        return qui.data.Quizes.map((quiz, index) => {
          console.log(quiz);
          return (
            <QuizComp
              key={index}
              question={quiz.Question}
              options={quiz.Options}
            />
          );
        });
      })}
    </div>
  );
};

export default Quiz;
