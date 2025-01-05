"use client";

import { Draggable } from "@hello-pangea/dnd";
import { COMPONENTS } from "@/lib/constants";

interface ComponentItemProps {
  componentId: string;
  index: number;
}

export function ComponentItem({ componentId, index }: ComponentItemProps) {
  const component = COMPONENTS.find((c) => c.id === componentId);

  return (
    <Draggable draggableId={componentId} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="mb-2 p-3 bg-primary/5 border rounded-md shadow-sm hover:bg-primary/10 transition-colors"
        >
          {component?.label}
        </div>
      )}
    </Draggable>
  );
}
