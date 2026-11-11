import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Document } from "@/app/types/chat";

interface DocumentListInterface {
  documents: Document[];
  removeDocumentOnClick: (id: string) => void;
}

export default function DocumentList({
  documents,
  removeDocumentOnClick,
}: DocumentListInterface) {
  if (documents.length === 0) return;

  return (
    <div className="w-full h-15 px-3 py-2.5 space-x-2 flex flex-row overflow-x-auto overflow-y-hidden">
      {documents.map((doc, index) => (
        <Tooltip key={index}>
          <TooltipTrigger
            render={
              <div className="max-w-40 items-center flex px-2 py-1 bg-white rounded-xl">
                <Button
                  className={`h-4 w-4 cursor:pointer mr-1`}
                  variant={`destructive`}
                  size={`icon-xs`}
                  id={"" + index}
                  onClick={() => removeDocumentOnClick(doc.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <span className="line-clamp-1">{doc.name}</span>
              </div>
            }
          />
          <TooltipContent>
            <p>{doc.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
