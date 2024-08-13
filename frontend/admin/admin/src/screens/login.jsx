import { useAuth } from "../auth";
import logo from "../images/logo-bg.png";
import NavBar from "../navbar/navbar";
import "./css/login.css";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import locimg from "../images/locandimg.jpg";

import LoginForm from "../components/loginfom";
export default function Login() {
  const { gettoken, isauth } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (isauth()) {
      nav("/admin/dashboard");
    }
  }, [nav, gettoken, isauth]);
  return (
    <div className='cointiner'>
      <NavBar />
      <div className='login_form'>
        <img src={locimg} alt='' className='login_image' />
        <LoginForm />
      </div>
    </div>
  );
}
