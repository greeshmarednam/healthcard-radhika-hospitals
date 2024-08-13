import { useEffect } from "react";
import { useNavigate } from "react-router";
import NavBar from "../navbar/navbar";
import Sidenav from "../navbar/sidenav";
import AddCardform from "../components/addcard";
import { useAuth } from "../auth";

const AddCard = () => {
  const { isauth, gettoken } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!gettoken()) {
      nav("/admin/login");
    }
  }, [gettoken, nav]);
  return (
    <div className='maindiv'>
      <NavBar />
      <div className='sidenav_card'>
        <Sidenav />
        <AddCardform />
      </div>
    </div>
  );
};
export default AddCard;
