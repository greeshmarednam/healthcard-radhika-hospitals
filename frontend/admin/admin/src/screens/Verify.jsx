import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth";
import NavBar from "../navbar/navbar";
import Sidenav from "../navbar/sidenav";
import VerifyCard from "../components/VerifyCard";

const Verify = () => {
  const { gettoken } = useAuth();
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
        <VerifyCard />
      </div>
    </div>
  );
};
export default Verify;
