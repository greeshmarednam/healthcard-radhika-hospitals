import { useEffect, useState } from "react";
import "./sidenav.css";
import { Link } from "react-router-dom";
export default function Sidenav() {
  const [selected, setselected] = useState("dashbaord");
  const pathname = window.location.pathname;

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
  return (
    <div className='sidenav'>
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
  );
}
