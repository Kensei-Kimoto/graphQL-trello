import { FC } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card, { CardType } from "./Card";
import { TaskStatus } from "../types/taskStatus";

export type ColumnType = {
  columnId: TaskStatus;
  cards: CardType[];
};

const Column: FC<ColumnType> = ({ columnId, cards }) => {
  const { setNodeRef } = useDroppable({ id: columnId });
  return (
    // ソートを行うためのContextです。
    // strategyは4つほど存在しますが、今回は縦・横移動可能なリストを作るためrectSortingStrategyを採用
    <SortableContext id={columnId} items={cards} strategy={rectSortingStrategy}>
      <div
        ref={setNodeRef}
        style={{
          width: "400px",
          background: "rgba(245,247,249,1.00)",
          marginRight: "10px"
        }}
      >
        <p
          style={{
            padding: "5px 20px",
            textAlign: "left",
            fontWeight: "500",
            color: "#575757"
          }}
        >
          {columnId}
        </p>
        {cards.map((card) => (
          <Card key={card.id} id={card.id} task={card.task} userId={card.userId}></Card>
        ))}
      </div>
    </SortableContext>
  );
};

export default Column;
