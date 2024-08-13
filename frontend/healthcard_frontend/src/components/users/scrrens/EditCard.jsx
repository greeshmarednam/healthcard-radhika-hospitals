import { useEffect } from "react";
import Sidenav from "../../navbar/sidenav";
import NavBar from "../../navbar/topnavbar";
import EditCardform from "../components/edit card/edit_card";
import { useAuth } from "../auth/auth";
import { useNavigate } from "react-router";
import Footer from "../../footer/footer";

const EditCard = () => {
  const { gettoken } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!gettoken()) {
      nav("/users/login");
    }
  }, [nav, gettoken]);

  return (
    <div className='maindiv'>
      <NavBar />
      <div className='sidenav_card'>
        <Sidenav />
        <EditCardform />
      </div>
      <Footer />
    </div>
  );
};
export default EditCard;
