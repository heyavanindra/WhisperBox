export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex space-x-2">
        <span className="h-3 w-3 bg-primary rounded-full animate-bounce"></span>
        <span className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></span>
        <span className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]"></span>
      </div>
    </div>
  );
}
