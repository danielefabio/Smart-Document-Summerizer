import { MessageCircleDashedIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

interface EmptyMessageInterface {
  title?: string;
  description?: string;
}

export default function EmptyMessage({title, description}: EmptyMessageInterface) {
  const emptyTitle = title ?? "Hello, there!";
  const emptyDescription =
    description ??
    "What are we working on today? Upload a PDF file to start asking questions about it.";

  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircleDashedIcon />
        </EmptyMedia>
        <EmptyTitle>{emptyTitle}</EmptyTitle>
        <EmptyDescription>{emptyDescription}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
