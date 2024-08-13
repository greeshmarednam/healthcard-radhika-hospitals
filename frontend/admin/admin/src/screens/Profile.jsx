import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../components/loader/loader";
import axios from "axios";
import { useAuth } from "../auth";
import NavBar from "../navbar/navbar";
import Sidenav from "../navbar/sidenav";
import ProfileView from "../components/profileview";

const Profile = () => {
  const nav = useNavigate();
  const { gettoken } = useAuth();
  const [loader, setLoader] = useState(true);
  const [data, setdata] = useState();
  const apiurl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!gettoken()) {
      nav("/admin/login");
    }

    axios({
      method: "post",
      url: apiurl + "/api/admin/profileview/",
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
  }, [nav, setLoader, setdata, gettoken]);
  return (
    <div>
      <div className='maindiv'>
        <NavBar />
        <div className='sidenav_card' style={{ gap: "5%" }}>
          <Sidenav />
          {loader ? <Loader /> : data && <ProfileView data={data} />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
