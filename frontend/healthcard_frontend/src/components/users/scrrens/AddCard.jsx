import { useEffect } from "react";
import Sidenav from "../../navbar/sidenav";
import NavBar from "../../navbar/topnavbar";
import { useAuth } from "../auth/auth";
import AddCardform from "../components/add card/add_card";
import { useNavigate } from "react-router";
import Footer from "../../footer/footer";

const AddCard = () => {
  const { isauth } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!isauth()) {
      nav("/users/login");
    }
  }, [isauth, nav]);
  return (
    <div className='maindiv'>
      <NavBar />
      <div className='sidenav_card'>
        <Sidenav />
        <AddCardform />
      </div>
      <Footer />
    </div>
  );
};
export default AddCard;
