import NavBar from "../../navbar/topnavbar";
import logo from "../../../images/logo-bg.png";
import LoginForm from "../components/Login/loginform";
import "./css/login.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/auth";
import locimg from "../../../images/locandimg.jpg";
export default function Login() {
  const [loginloader, setloginloader] = useState(true);
  const { isauth } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    setloginloader(true);
    if (isauth()) {
      nav("/users/dashboard");
      setloginloader(false);
    } else {
      setloginloader(false);
    }
  });
  return (
    <>
      {loginloader ? (
        <div
          className='loader'
          style={{ position: "absolute", top: "50%", left: "50%" }}
        ></div>
      ) : (
        <div className='cointiner'>
          <NavBar />
          <div className='login_form'>
            <img src={locimg} alt='' className='login_image' />

            <LoginForm />
          </div>
        </div>
      )}
    </>
  );
}
