import { Chat } from "@/components/Chat";
import { ThemeProvider } from "@/components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Chat />
    </ThemeProvider>
  );
}

export default App;
