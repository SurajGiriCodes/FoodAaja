import AppRoutes from "./AppRoutes";
import AppHeader from "./Component/Header/AppHeader";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, isAdmin } = useAuth();

  return (
    <>
      <AppHeader />
      <AppRoutes />
    </>
  );
}

export default App;
