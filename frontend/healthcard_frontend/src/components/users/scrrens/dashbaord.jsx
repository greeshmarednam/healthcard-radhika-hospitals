import { useEffect, useRef, useState } from "react";
import Sidenav from "../../navbar/sidenav";
import NavBar from "../../navbar/topnavbar";
import Card from "../components/dashboard/cards";
import "./css/dashboard.css";
import { useAuth } from "../auth/auth";
import { useNavigate } from "react-router";
import Loader from "../../loader/loader";
import axios from "axios";
import Footer from "../../footer/footer";
import { AddOutlined } from "@mui/icons-material";

function Dashboard() {
  const { isauth, gettoken } = useAuth();
  const [loader, setloader] = useState(true);
  const nav = useNavigate();
  const [carddata, setcarddata] = useState([]);
  const scrooldiv = useRef(null);
  const apiurl = process.env.REACT_APP_API_URL;

  const handlescroll = (e) => {
    scrooldiv.current.scrollTop = e.target.scrollTop;
  };
  useEffect(() => {
    if (!isauth()) {
      nav("/users/login");
    }
    axios({
      method: "post",
      url: apiurl + "/api/users/cardslist/",
      data: { token: gettoken() },
    }).then((res) => {
      setcarddata(res.data.data);
      setloader(false);
    });
  }, [setcarddata, gettoken, isauth, nav, apiurl, setloader]);
  return (
    <div>
      <div className='maindiv'>
        <NavBar />
        <div className='sidenav_card'>
          <Sidenav />
          <div
            className='cards'
            ref={scrooldiv}
            onScroll={handlescroll}
            style={{ overflowY: "scroll", height: "85vh" }}
          >
            {loader ? (
              <Loader />
            ) : carddata.length > 0 ? (
              carddata.map((data) => (
                <Card
                  key={data.card_number}
                  name={data.name}
                  dob={data.dob}
                  gender={data.gender}
                  card_number={data.card_number}
                  profile_img={data.profile_img}
                />
              ))
            ) : (
              <div style={{ justifyContent: "center" }}>
                No Cards Available
                <div>
                  <button onClick={() => nav("/users/add_card")}>
                    <AddOutlined /> Add new card
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
