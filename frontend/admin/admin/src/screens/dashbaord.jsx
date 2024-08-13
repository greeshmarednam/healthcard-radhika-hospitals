import { useNavigate } from "react-router";
import "./css/cardslistview.css";
import { useEffect, useRef } from "react";
import { useAuth } from "../auth";
import NavBar from "../navbar/navbar";
import Sidenav from "../navbar/sidenav";
import Cards_List from "../components/card_listView";

const Dashbaord = () => {
  const nav = useNavigate();

  const { isauth, gettoken } = useAuth();
  const scrolldiv = useRef(null);
  useEffect(() => {
    if (!isauth()) {
      nav("/admin/login");
    }
  }, [nav, gettoken.isauth]);
  const handlescroll = (e) => {
    scrolldiv.current.scrollTop = e.target.scrollTop;
  };

  return (
    <div>
      <div className='maindiv'>
        <NavBar />
        <div className='sidenav_card'>
          <Sidenav />
          <div
            className='cards'
            ref={scrolldiv}
            onScroll={handlescroll}
            style={{ overflowY: "scroll", marginBottom: "10px" }}
          >
            <Cards_List />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashbaord;
