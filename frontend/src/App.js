import AppRoutes from "./AppRoutes";
import AppHeader from "./Component/Header/AppHeader";
import Loading from "./Component/Loading/Loading";
import { useLoading } from "./hooks/useLoading";
import { setLoadingInterceptor } from "./Interceptors/loadingInterceptor";
import { useEffect } from "react";

function App() {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, []);

  return (
    <>
      <Loading />
      <AppHeader />
      <AppRoutes />
    </>
  );
}

export default App;
