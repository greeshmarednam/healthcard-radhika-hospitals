import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setauth] = useState(false);
  const [username, setusername] = useState();
  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      if (token) {
        axios({
          method: "post",
          url: apiurl + "/api/admin/verifytoken/",
          data: { token: token },
        })
          .then((res) => {
            if (res.data.status === "verified") {
              setauth(true);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setauth(false);
      }
    }
  }, [setauth, apiurl]);

  function login(token) {
    window.localStorage.setItem("token", token);
    setauth(true);
  }

  function logout() {
    window.localStorage.removeItem("token");
    setauth(false);
  }

  function isauth() {
    const token = window.localStorage.getItem("token");
    if (token) {
      axios({
        method: "post",
        url: apiurl + "/api/admin/verifytoken/",
        data: { token: token },
      })
        .then((res) => {
          if (res.data.status === "verified") {
            setauth(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setauth(false);
    }
    return auth;
  }
  function getusername() {
    axios({
      method: "post",
      url: apiurl + "/api/admin/profileview/",
      data: {
        token: window.localStorage.getItem("token"),
        access_type: "read",
      },
    })
      .then((res) => {
        var name = res.data.data.fullname;
        setusername(name);
      })
      .catch((e) => console.log(e));
    return username;
  }
  function gettoken() {
    return window.localStorage.getItem("token");
  }
  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        auth,
        isauth,
        getusername,
        gettoken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
