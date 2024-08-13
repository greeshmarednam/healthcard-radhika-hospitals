import { useState } from "react";
import "./css/loginform.css";
import "./buttons/button.css";
import axios from "axios";
import { useAuth } from "../auth";
import { useNavigate } from "react-router";
import Loader from "./loader/loader";

export default function LoginForm() {
  const { login } = useAuth();
  const [loginloader, setloginloader] = useState(false);
  const [error, seterror] = useState();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const nav = useNavigate();
  const apiurl = process.env.REACT_APP_API_URL;

  const handlelogin = () => {
    if (username === "") {
      seterror("enter username");
      return;
    }
    if (password === "") {
      seterror("enter password");
      return;
    }
    setloginloader(true);
    axios({
      method: "post",
      url: apiurl + "/api/admin/login/",
      data: { username: username, password: password },
    })
      .then((res) => {
        if (res.data.status === "token success") {
          login(res.data.token);
          nav("/admin/dashbaord");
        } else {
          seterror("username/password incorrect");
          setloginloader(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setloginloader(false);
      });
  };
  return (
    <div className='cointainer'>
      <div className='head'>
        <h2 style={{ fontSize: "22px" }}>Free Health Card</h2>
      </div>
      <div>
        <div className='mobile'>
          <div className='login-input'>
            <label htmlFor='username'>username *</label>
            <input
              type='text'
              name='username'
              id='username'
              onChange={(e) => {
                seterror();
                setusername(e.target.value);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div className='login-input'>
              <label htmlFor='OTP'>password</label>
              <input
                type='password'
                name='password'
                id='password'
                onChange={(e) => {
                  seterror();
                  setpassword(e.target.value);
                }}
              />
            </div>
            <button onClick={handlelogin}>
              {loginloader ? <div className='loader'></div> : "Login"}
            </button>
          </div>
        </div>
        <div style={{ color: "red", fontSize: "14px" }}>{error}</div>
      </div>
    </div>
  );
}
