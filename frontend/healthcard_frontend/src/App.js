import MainRoutes from "./components/mainroutes";
import { AuthProvider } from "./components/users/auth/auth";
function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <MainRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
