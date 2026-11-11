import { memo } from "react";
import { MessageScrollerItem } from "@/components/ui/message-scroller";
import { Message } from "@/app/types/chat";
import MessageAnimated from "./MessageAnimated";

const MessageItemComponent = ({ message }: { message: Message }) => {
  return (
    <MessageScrollerItem
      key={message.id}
      messageId={message.id}
      scrollAnchor={message.role === "user"}
    >
      <MessageAnimated key={message.id} message={message} />
    </MessageScrollerItem>
  );
};

// 2. Avvolgiamo il componente in React.memo
const MessageItem = memo(MessageItemComponent);

export default MessageItem;