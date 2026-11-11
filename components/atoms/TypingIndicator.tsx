export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-3 bg-muted rounded-lg w-fit">
      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-ping [animation-delay:-0.3s]"></div>
      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-ping [animation-delay:-0.15s]"></div>
      <div className="w-1 h-1 bg-muted-foreground rounded-full animate-ping"></div>
    </div>
  );
}
