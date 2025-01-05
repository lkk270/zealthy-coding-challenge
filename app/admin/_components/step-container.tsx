import { Droppable } from "@hello-pangea/dnd";
import { ComponentItem } from "./component-item";

interface StepContainerProps {
  title: string;
  droppableId: string;
  components: string[];
}

export function StepContainer({ title, droppableId, components }: StepContainerProps) {
  return (
    <div className="border border-primary/10 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[200px] bg-secondary/5 p-4 rounded-md"
          >
            {components.map((componentId, index) => (
              <ComponentItem key={componentId} componentId={componentId} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
