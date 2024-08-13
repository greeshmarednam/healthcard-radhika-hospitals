import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth";
import NavBar from "../navbar/navbar";
import Sidenav from "../navbar/sidenav";
import EditCardform from "../components/editcardform";
const EditCard = () => {
  const { gettoken } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!gettoken()) {
      nav("/admin/login");
    }
  }, [nav, gettoken]);

  return (
    <div className='maindiv'>
      <NavBar />
      <div className='sidenav_card'>
        <Sidenav />
        <EditCardform />
      </div>
    </div>
  );
};
export default EditCard;
