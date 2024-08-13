import { useEffect, useState } from "react";
import "./sidenav.css";
import { Link } from "react-router-dom";
export default function Sidenav() {
  const [selected, setselected] = useState("dashbaord");
  const pathname = window.location.pathname;

  useEffect(
    (e) => {
      if (pathname === "/admin/dashboard") setselected("dashboard");
      else if (pathname === "/admin/add_card") setselected("add");
      else if (pathname === "/admin/search") setselected("search");
      else if (pathname === "/admin/verify") setselected("verify_card");
      else if (pathname === "/admin/profile") setselected("profile");
    },
    [pathname, setselected]
  );
  return (
    <div className='sidenav'>
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
  );
}
