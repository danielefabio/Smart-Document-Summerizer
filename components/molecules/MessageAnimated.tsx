import { Message } from "@/app/types/chat";
import { motion, type Variants } from "motion/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageAnimated({ message }: { message: Message }) {
  const isBot = message.role === "bot";
  const spanStyles = isBot
    ? "bg-muted text-left text-gray-700 dark:text-white/80"
    : "bg-primary/30 dark:bg-primary/50 text-right text-gray-700 dark:text-white/80";
  const divStyles = isBot ? "text-left" : "text-right";

  // Configurazione delle varianti
  const chatVariants: Variants = {
    hidden: {
      opacity: 0,
      y: isBot ? 4 : 12,
      scale: isBot ? 1 : 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "tween",
        ease: [0.16, 1, 0.3, 1],
        duration: isBot ? 0.25 : 0.4,
      },
    },
  };

  return (
    <div className={divStyles}>
      <motion.span
        className={`${spanStyles} inline-block rounded-[var(--radius-xl)] text-sm py-2 px-3 break-words max-w-[85%]`}
        variants={chatVariants}
        initial="hidden"
        animate="visible"
        layout="position"
        transition={{ type: "spring" }}
      >
        {isBot ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ node, ...props }) => (
                  <div className="w-full overflow-x-auto my-4 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
                    <table
                      className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 m-0"
                      {...props}
                    />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="py-1 px-2 md:px-3 md:py-2 bg-zinc-50 dark:bg-zinc-900 text-left font-semibold text-zinc-700 dark:text-zinc-300"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="py-1 px-2 border-b md:px-3 md:py-2 text-zinc-600 dark:text-zinc-400"
                    {...props}
                  />
                ),
              }}
            >
              {message.content}
            </Markdown>
          </div>
        ) : (
          message.content
        )}
      </motion.span>
    </div>
  );
}

export default MessageAnimated;
