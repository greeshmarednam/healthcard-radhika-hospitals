import { useEffect, useState } from "react";
import Sidenav from "../../navbar/sidenav";
import NavBar from "../../navbar/topnavbar";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/auth";
import Profile from "../components/profile/profile";
import Loader from "../../loader/loader";
import axios from "axios";
import Footer from "../../footer/footer";

const ProfileView = () => {
  const nav = useNavigate();
  const { gettoken, isauth } = useAuth();
  const [loader, setLoader] = useState(true);
  const [data, setdata] = useState();
  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!isauth()) {
      nav("/users/login");
    }
    setTimeout(() => {
      axios({
        method: "post",
        url: apiurl + "/api/users/profileview/",
        data: {
          token: gettoken(),
          access_type: "read",
        },
      }).then((res) => {
        if (res.data.status === "sent") {
          setdata(res.data.data);
          setLoader(false);
        }
      });
    }, 1000);
  }, [nav, isauth, setLoader, setdata, gettoken]);
  return (
    <div>
      <div className='maindiv'>
        <NavBar />
        <div className='sidenav_card' style={{ gap: "5%", height: "88vh" }}>
          <Sidenav />
          {loader ? <Loader /> : data && <Profile data={data} />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileView;
