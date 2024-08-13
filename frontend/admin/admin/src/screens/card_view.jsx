import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/loader/loader";
import "./css/cardview.css";
import NavBar from "../navbar/navbar";
import Sidenav from "../navbar/sidenav";
import View_Card from "../components/view_card";
import { useAuth } from "../auth";

const CardView = () => {
  const params = useParams();
  const { gettoken } = useAuth();
  const nav = useNavigate();
  const [data, setdata] = useState([]);
  const [loader, setloader] = useState(true);
  const [error, seterror] = useState();
  const apiurl = process.env.REACT_APP_API_URL;

  const { isauth } = useAuth();
  useEffect(() => {
    if (!gettoken()) {
      nav("/admin/login");
    }
    axios({
      method: "post",
      url: apiurl + "/api/admin/viewcard/",
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
  }, [nav, setdata, seterror, setloader, gettoken, params.card_number]);
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
    </div>
  );
};

export default CardView;
