import AppRoutes from "./AppRoutes";
import Header from "./Component/Header/Header";
//import Loading from "./components/Loading/Loading";
//import { useLoading } from "./hooks/useLoading";
//import { setLoadingInterceptor } from "./interceptors/loadingInterceptor";
//import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

function App() {
  // const { showLoading, hideLoading } = useLoading();

  // useEffect(() => {
  //   setLoadingInterceptor({ showLoading, hideLoading });
  // }, []);
  const { user, isAdmin } = useAuth();

  return (
    <>
      {/* <Loading /> */}
      {/* {user && !isAdmin && <Header />} */}
      <Header />
      <AppRoutes />
    </>
  );
}

export default App;
