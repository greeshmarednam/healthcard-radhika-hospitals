import { useNavigate, useParams } from "react-router";
import View_Card from "../components/view card/view_cars";
import NavBar from "../../navbar/topnavbar";
import Sidenav from "../../navbar/sidenav";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/auth";
import Loader from "../../loader/loader";
import "./css/cardview.css";
import Footer from "../../footer/footer";
const CardView = () => {
  const params = useParams();
  const { isauth, gettoken } = useAuth();
  const nav = useNavigate();
  const [data, setdata] = useState([]);
  const [loader, setloader] = useState(true);
  const [error, seterror] = useState();
  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!gettoken()) {
      nav("/users/login");
    }
    axios({
      method: "post",
      url: apiurl + "/api/users/viewcard/",
      data: {
        token: gettoken(),
        card_number: params.card_number,
      },
    })
      .then((res) => {
        if (res.data.status === "data sent") {
          setdata(res.data.data);
        } else {
          seterror("No data Found");
        }
        setloader(false);
      })
      .catch((e) => seterror("No data found"));
  }, [isauth, nav, setdata, seterror, setloader, gettoken, params.card_number]);
  return (
    <div className='maindiv'>
      <NavBar />
      <div className='sidenav_card'>
        <Sidenav />
        {error ? (
          <div className='error'>{error}</div>
        ) : loader ? (
          <Loader />
        ) : (
          //eslint-disable-next-line
          <View_Card data={data} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CardView;
