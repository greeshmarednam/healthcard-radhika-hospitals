import { AuthProvider } from "./auth";
import Main_Routes from "./routes";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Main_Routes />
      </AuthProvider>
    </div>
  );
}

export default App;
