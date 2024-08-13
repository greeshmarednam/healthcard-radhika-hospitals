import logo from "../images/logo-bg.png";
import "./topnavbar.css";
import { Menu } from "@mui/icons-material";
import { useAuth } from "../auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const apiurl = process.env.REACT_APP_API_URL;

export default function NavBar() {
  const { isauth, logout, gettoken } = useAuth();
  const pathname = window.location.pathname;
  const nav = useNavigate();
  const [sidemenu, setsidemenu] = useState("topnavbar-items");
  const handlelogout = () => {
    if (isauth()) {
      logout();
    }
  };
  const [selected, setselected] = useState("dashbaord");
  const [username, setusername] = useState();
  useEffect(
    (e) => {
      if (pathname === "/admin/dashboard") setselected("dashboard");
      else if (pathname === "/admin/add_card") setselected("add");
      else if (pathname === "/admin/search") setselected("search");
      else if (pathname === "/admin/verify") setselected("verify_card");
      else if (pathname === "/admin/profile") setselected("profile");

      axios({
        method: "post",
        url: apiurl + "/api/admin/profileview/",
        data: {
          token: gettoken(),
          access_type: "read",
        },
      }).then((res) => {
        if (res.data.status === "sent") {
          setusername(res.data.fullname);
        } else {
          nav("/admin/login");
        }
      });
    },
    [pathname, setselected, gettoken, setusername, apiurl]
  );

  const hanldesidemenu = () => {
    if (sidemenu === "topnavbar-items") {
      setsidemenu("topnavbar-items open");
    } else {
      setsidemenu("topnavbar-items");
    }
  };
  return (
    <div className='topnavbar-main'>
      <div className='navbar'>
        <div className='navbar-icon'>
          <div className='menu-item'>
            <Menu onClick={hanldesidemenu} />
          </div>
          <img src={logo} alt='' className='logo' />
        </div>
        <div className='login'>
          {isauth() && <div className='username'> {username} </div>}
          {isauth() ? (
            <button onClick={handlelogout}>Logout</button>
          ) : (
            <button>
              <Link to={"/admin/login"} />
              Login
            </button>
          )}
        </div>
      </div>
      <div className={sidemenu}>
        <ul className='items'>
          <li>
            <Link
              className={selected === "dashboard" ? "selected" : ""}
              to='/admin/dashboard'
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to={"/admin/add_card"}
              className={selected === "add" ? "selected" : ""}
            >
              Add Health Card
            </Link>
          </li>
          <li>
            <Link
              className={selected === "search" ? "selected" : ""}
              to={"/admin/search"}
            >
              Search Card
            </Link>
          </li>
          <li>
            <Link
              className={selected === "verify_card" ? "selected" : ""}
              to={"/admin/verify"}
            >
              Verify Card
            </Link>
          </li>
          <li>
            <Link
              className={selected === "profile" ? "selected" : ""}
              to={"/admin/profile"}
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
