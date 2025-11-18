import React, { Suspense, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Loader from "./components/Loader";

const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));

export default function App() {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return <Loader />;
  }

  return (
    <Suspense
      fallback={
        <Loader />
      }
    >
      {user ? <ChatPage /> : <LoginPage />}
    </Suspense>
  );
}
