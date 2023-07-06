import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Task } from "../types/task";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import { Stack } from "@mui/material";
export type CardType = {
  id: string;
  task: Task;
  userId: number;
};

const Card: FC<CardType> = ({ id, task, userId }) => {
  // useSortableに指定するidは一意になるよう設定する必要があります。s
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id
  });

  const style = {
    margin: "10px",
    opacity: 1,
    color: "#333",
    background: "white",
    padding: "10px",
    transform: CSS.Transform.toString(transform)
  };

  return (
    // attributes、listenersはDOMイベントを検知するために利用します。
    // listenersを任意の領域に付与することで、ドラッグするためのハンドルを作ることもできます。
    <div ref={setNodeRef} {...attributes} style={style}>
      <div id={task.id.toString()}  {...listeners}>
        <p>Name: {task.name}</p>
        <p>Due Date: {task.dueDate}</p>
        <p>Description: {task.description}</p>
      </div>
      <Stack spacing={2} direction='row' justifyContent='flex-end'>
        <EditTask task={task} userId={userId}/>
        <DeleteTask id={task.id} userId={userId}/>
      </Stack>
    </div>
  );
};

export default Card;