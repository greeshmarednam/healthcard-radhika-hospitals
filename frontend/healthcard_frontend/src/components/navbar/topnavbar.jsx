import logo from "../../images/logo-bg.png";
import "./topnavbar.css";
import { Menu } from "@mui/icons-material";
import { useAuth } from "../users/auth/auth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const { isauth, getusername, logout } = useAuth();
  const pathname = window.location.pathname;
  const [sidemenu, setsidemenu] = useState("topnavbar-items");
  const handlelogout = () => {
    if (isauth()) {
      logout();
    }
  };
  const [selected, setselected] = useState("dashbaord");
  useEffect(
    (e) => {
      if (pathname === "/users/dashboard") setselected("dashboard");
      else if (pathname === "/users/add_card") setselected("add");
      else if (pathname === "/users/cards_list") setselected("view");
      else if (pathname === "/users/profile") setselected("profile");
      else if (pathname === "/users/feature") setselected("feature");
    },
    [pathname, setselected]
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
            {isauth() ? <Menu onClick={hanldesidemenu} /> : <></>}
          </div>
          <img src={logo} alt='' className='logo' />
        </div>
        <div className='login'>
          {isauth() && (
            <div
              className='username'
              style={{ fontSize: "16px", marginRight: "10px" }}
            >
              {" "}
              {getusername()}{" "}
            </div>
          )}
          {isauth() ? (
            <button onClick={handlelogout}>Logout</button>
          ) : (
            <button>
              <Link to={"/users/login"} /> Login
            </button>
          )}
        </div>
      </div>
      <div className={sidemenu}>
        <ul className='items'>
          <li>
            <Link
              className={selected === "dashboard" ? "selected" : ""}
              to='/users/dashboard'
            >
              Dashboard
            </Link>
          </li>
          <li className={selected === "view" ? "selected" : ""}>
            <Link
              className={selected === "view" ? "selected" : ""}
              to='/users/cards_list'
            >
              View Health Card
            </Link>
          </li>
          <li>
            <Link
              to={"/users/add_card"}
              className={selected === "add" ? "selected" : ""}
            >
              Add Health Card
            </Link>
          </li>
          <li>
            <Link
              className={selected === "profile" ? "selected" : ""}
              to={"/users/profile"}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              className={selected === "feature" ? "selected" : ""}
              to={"/users/feature"}
            >
              Features
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
