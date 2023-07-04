import React, { useEffect, useState } from "react";
import { Button, Typography } from "antd";
const { Title } = Typography;
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../Components/InitializeApp";
import QuizComp from "../Components/QuizComp";
import QuizModel from "../Components/QuizModel";
const Quiz = () => {
  const [quiz, setQuiz] = useState([]);

  const [subAnswer, setSubAnswer] = useState([]);

  const [TotalScore, setTotalScore] = useState(0);
  const [calScore, setCalScore] = useState(0);

  const getQuiz = async () => {
    const dbref = collection(firestore, "Quizes");
    onSnapshot(dbref, (docSnap) => {
      setTotalScore(docSnap.size);
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <QuizModel
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        TotalScore={TotalScore}
        calScore={calScore}
      />
      <Title>
        Quiz {calScore} / {TotalScore}
      </Title>
      {quiz.map((qui, qindex) => {
        return (
          <QuizComp
            key={qindex}
            question={qui.data.question}
            options={qui.data.options}
            answer={qui.data.answer}
            setSubAnswer={(value) => {
              if (value === qui.data.answer) {
                setSubAnswer([
                  ...subAnswer,
                  {
                    question: qui.data.question,
                    answer: value,
                    correct: true,
                  },
                ]);
              } else {
                const removesel = subAnswer.filter(
                  (filans) => filans.question !== qui.data.question
                );
                setSubAnswer(removesel);
              }
            }}
          />
        );
      })}
      <Button
        type="primary"
        style={{ borderRadius: 5, marginTop: 20 }}
        onClick={() => {
          const uniqueArray = subAnswer.filter((item, index) => {
            // Check if the index of the current item is the same as the index of its first occurrence
            return (
              index ===
              subAnswer.findIndex((obj) => obj.question === item.question)
            );
          });
          setCalScore(uniqueArray.length);
          setIsModalOpen(true);
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default Quiz;
