import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const nav = useNavigate();
  useEffect(() => {
    nav("/");
  });
  return <div>404</div>;
};

export default ErrorPage;
