import { useState } from "react";
import "./loginform.css";
import "../../../buttons/button.css";
import axios from "axios";
import { useAuth } from "../../auth/auth";
import { useNavigate } from "react-router";
import Loader from "../../../loader/loader";

export default function LoginForm() {
  const { login } = useAuth();
  const [otpsent, setotpsent] = useState(false);
  const [logintoggle, setlogintoggle] = useState(true);
  const [otpdata, setotpdata] = useState();

  const [loader, setloader] = useState(false);
  const [loginloader, setloginloader] = useState();
  const [mobile_number, setmobile_number] = useState("");
  const [otp, setotp] = useState("");
  const [fullname, setfullanme] = useState();
  const [signuploader, setsignuploader] = useState(false);
  const [error, seterror] = useState();

  const nav = useNavigate();
  const apiurl = process.env.REACT_APP_API_URL;

  const handlesendotp = () => {
    setloader(true);
    setotpsent(false);
    seterror();
    if (mobile_number === "" || mobile_number.length < 10) {
      setloader(false);
      seterror("Invalid Mobile number");
      return;
    }
    axios({
      method: "post",
      url: apiurl + "/api/users/generateotp/",
      data: {
        mobile_number: mobile_number,
      },
    })
      .then(function (res) {
        if (res.data.status === "sent") {
          setotpdata(res.data.otp);
          setotpsent(true);
          setloader(false);
        } else {
          seterror("OTP Not sent, Verify your Mobile Number and try again");
          setloader(false);
        }
      })
      .catch(function (error) {
        seterror("OTP not sent, Verify your phone number" + error);
        setloader(false);
      });
  };

  const handle_logintoggle = () => {
    setotpsent(false);
    setlogintoggle(!logintoggle);
  };

  const handlelogin = () => {
    seterror();
    setloginloader(true);
    if (mobile_number === "") {
      setloginloader(false);
      seterror("Enter mobilenumber ");
      return;
    }
    if (otp === "" || otp.length < 6) {
      setloginloader(false);
      seterror("Enter valid OTP");
      return;
    }
    if (otp === otpdata) {
      axios({
        method: "post",
        url: apiurl + "/api/users/login/",
        data: {
          mobile_number: mobile_number,
        },
      })
        .then((res) => {
          if (res.data.status === "token success") {
            login(res.data.token);
            nav("/users/dashboard");
          } else {
            seterror("User Not Found. Signup Now");
            setloginloader(false);
          }
        })
        .catch((e) => seterror(e));
    } else {
      seterror("Invalid OTP");
      setloginloader(false);
    }
  };

  const handlesignup = () => {
    seterror();
    setsignuploader(true);
    if (otp === "" || otp.length < 6) {
      setsignuploader(false);
      seterror("Enter valid OTP");
      return;
    }
    if (fullname === "") {
      setsignuploader(false);
      seterror("Enter Fulllname");
      return;
    }
    if (otp === otpdata) {
      setsignuploader(true);
      axios({
        method: "post",
        url: apiurl + "/api/users/signup/",
        data: {
          mobile_number: mobile_number,
          fullname: fullname,
        },
      })
        .then((res) => {
          if (res.data.status === "token success") {
            login(res.data.token);
            nav("/users/dashboard");
          } else if (res.data.status === "Already exists") {
            seterror("Mobile Number Already exists. Login to continue");
            setsignuploader(false);
          } else {
            seterror("Signup Failed");
            setsignuploader(false);
          }
        })
        .catch((e) => console.log(e));
    } else {
      seterror("Invalid OTP");
      setsignuploader(false);
    }
  };
  return (
    <div className='cointainer'>
      <div className='head'>
        <h2 style={{ fontSize: "22px" }}>Free Health Card</h2>
      </div>
      <div className='toggle'>
        {logintoggle ? (
          <div className='toggle'>
            <button>Login </button>
            <div
              onClick={handle_logintoggle}
              className='login'
              style={{ cursor: "pointer" }}
            >
              Signup
            </div>
          </div>
        ) : (
          <div className='toggle'>
            <div
              onClick={handle_logintoggle}
              className='login'
              style={{ cursor: "pointer" }}
            >
              Login
            </div>
            <button>Signup </button>
          </div>
        )}
      </div>
      <>
        <div>
          <div className='mobile'>
            <div className='login-input'>
              <label htmlFor='mobile_nummber'>Mobile number *</label>
              <input
                type='text'
                name='mobile_number'
                id='mobile_number'
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/, "")
                    .slice(0, 10);
                  seterror();
                  setmobile_number(e.target.value);
                }}
              />
            </div>
            {!logintoggle && (
              <div className='login-input'>
                <label htmlFor='fullname'>Fullname *</label>
                <input
                  type='text'
                  name='fullname'
                  id='fullname'
                  onChange={(e) => setfullanme(e.target.value)}
                />
              </div>
            )}
            <button onClick={handlesendotp}>
              {loader ? <Loader /> : "Send OTP"}
            </button>
          </div>
          {logintoggle ? (
            <>
              {otpsent && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "10px",
                    gap: "10px",
                  }}
                >
                  <div className='login-input'>
                    <label htmlFor='OTP'>OTP *</label>
                    <input
                      type='text'
                      name='OTP'
                      id='OTP'
                      onChange={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/, "")
                          .slice(0, 6);
                        setotp(e.target.value);
                      }}
                    />
                  </div>
                  <button onClick={handlelogin} style={{ marginTop: "10px" }}>
                    {loginloader ? <div className='loader'></div> : "Login"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {otpsent && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "10px",
                    gap: "10px",
                  }}
                >
                  <div className='login-input'>
                    <label htmlFor='OTP'>OTP *</label>
                    <input
                      type='text'
                      name='OTP'
                      id='OTP'
                      onChange={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/, "")
                          .slice(0, 6);
                        setotp(e.target.value);
                      }}
                    />
                  </div>
                  <button onClick={handlesignup}>
                    {signuploader ? <div className='loader'></div> : "SignUp"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </>
      <div style={{ color: "red", fontSize: "14px" }}>{error}</div>
      {logintoggle ? (
        <div className='loginfoot' onClick={handle_logintoggle}>
          New User? <div className='loginfoot_btn'>Sign Up</div>
        </div>
      ) : (
        <div className='loginfoot' onClick={handle_logintoggle}>
          Already have an account?
          <div className='loginfoot_btn'>Login Here</div>
        </div>
      )}
    </div>
  );
}
