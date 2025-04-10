import { BlockInnerComponent } from "../../types";
import { BlockComponent } from "../BlockComponent";

export const Table: BlockInnerComponent = ({ block }) => {
  return (
    <div>
      {block.children?.map((childId) => (
        <BlockComponent key={childId} blockId={childId} />
      ))}
    </div>
  );
};
