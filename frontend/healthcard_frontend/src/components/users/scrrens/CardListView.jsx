import { useNavigate } from "react-router";
import { useAuth } from "../auth/auth";
import NavBar from "../../navbar/topnavbar";
import Sidenav from "../../navbar/sidenav";
import Cards_List from "../components/cards list/card_list";
import "./css/cardslistview.css";
import { useEffect, useRef } from "react";
import Footer from "../../footer/footer";

const CardListView = () => {
  const { isauth } = useAuth();
  const scrolldiv = useRef(null);
  const handlescroll = (e) => {
    scrolldiv.current.scrollTop = e.target.scrollTop;
  };
  const nav = useNavigate();
  useEffect(() => {
    if (!isauth()) {
      nav("/users/login");
    }
  }, [isauth, nav]);
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
            style={{
              overflowY: "scroll",
              marginBottom: "10px",
              justifyContent: "flex-start",
            }}
          >
            <Cards_List />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
export default CardListView;
