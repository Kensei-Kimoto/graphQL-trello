import "./styles.css";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Column, { ColumnType } from "./Column";
import { useEffect, useState } from "react";
import { Task } from "../types/task";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "../mutations/taskMutations";

export default function Board({ tasks, userId }: { tasks: Task[] | undefined, userId: number }) {
  const [columns, setColumns] = useState<ColumnType[]>([]);

  useEffect(() => {
    const initialColumns: ColumnType[] = [
      {
        columnId: "NOT_STARTED",
        cards: tasks
          ? tasks
            .filter((task) => task.status === "NOT_STARTED")
            .map((task) => ({
              id: task.id.toString(),
              task: task,
              userId: userId
            }))
          : []
      },
      {
        columnId: "IN_PROGRESS",
        cards: tasks
          ? tasks
            .filter((task) => task.status === "IN_PROGRESS")
            .map((task) => ({
              id: task.id.toString(),
              task: task,
              userId: userId
            }))
          : []
      },
      {
        columnId: "COMPLETED",
        cards: tasks
          ? tasks
            .filter((task) => task.status === "COMPLETED")
            .map((task) => ({
              id: task.id.toString(),
              task: task,
              userId: userId
            }))
          : []
      },
    ];

    setColumns(initialColumns);
  }, [tasks, userId]);

  const findColumn = (unique: string | null) => {
    if (!unique) {
      return null;
    }
    // overの対象がcolumnの場合があるためそのままidを返す
    if (columns.some((c) => c.columnId === unique)) {
      return columns.find((c) => c.columnId === unique) ?? null;
    }
    const id = String(unique);
    const itemWithColumnId = columns.flatMap((c) => {
      const columnId = c.columnId;
      return c.cards.map((i) => ({ itemId: i.id, columnId: columnId }));
    });
    const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
    return columns.find((c) => c.columnId === columnId) ?? null;
  };


  const [updateTask] = useMutation(UPDATE_TASK);

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over, delta } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    
    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return null;
    }
  
    const activeItems = activeColumn.cards;
    const overItems = overColumn.cards;
    const activeIndex = activeItems.findIndex((i) => i.id === activeId);
    const overIndex = overItems.findIndex((i) => i.id === overId);
    const newIndex = () => {
      const putOnBelowLastItem = overIndex === overItems.length - 1 && delta.y > 0;
      const modifier = putOnBelowLastItem ? 1 : 0;
      return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    };
    
    // The card that is being moved
    const movedItem = { ...activeItems[activeIndex], task: { ...activeItems[activeIndex].task } };
    movedItem.task.status = overColumn.columnId;
  
    setColumns((prevState) => {
      return prevState.map((c) => {
        if (c.columnId === activeColumn.columnId) {
          c.cards = activeItems.filter((i) => i.id !== activeId);
          return c;
        } else if (c.columnId === overColumn.columnId) {
          c.cards = [
            ...overItems.slice(0, newIndex()),
            movedItem,
            ...overItems.slice(newIndex(), overItems.length)
          ];
          return c;
        } else {
          return c;
        }
      });
    });
  
    // Updating the backend after state has been updated
    updateTask({
      variables: {
        updateTaskInput: {
          id: movedItem.task.id,
          status: movedItem.task.status
        }
      }
    });
  };
  
  

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn) {
      return null;
    }
    const activeIndex = activeColumn.cards.findIndex((i) => i.id === activeId);
    const overIndex = overColumn.cards.findIndex((i) => i.id === overId);
    if (activeIndex !== overIndex) {
      setColumns((prevState) => {
        return prevState.map((column) => {
          if (column.columnId === activeColumn.columnId) {
            column.cards = arrayMove(overColumn.cards, activeIndex, overIndex);
            return column;
          } else {
            return column;
          }
        });
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  return (
    // 今回は長くなってしまうためsensors、collisionDetectionなどに関しての説明は省きます。
    // ひとまずは一番使われていそうなものを置いています。
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div
        className="App"
        style={{ display: "flex", flexDirection: "row", padding: "20px" }}
      >
        {columns.map((column) => (
          <Column
            key={column.columnId}
            columnId={column.columnId}
            cards={column.cards}
          ></Column>
        ))}
      </div>
    </DndContext>
  );
}
