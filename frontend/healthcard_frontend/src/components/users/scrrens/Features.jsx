import { useNavigate } from "react-router";
import Footer from "../../footer/footer";
import Sidenav from "../../navbar/sidenav";
import NavBar from "../../navbar/topnavbar";
import Features from "../components/features/features";
import { useAuth } from "../auth/auth";
import { useEffect } from "react";

const FeatureView = () => {
  const nav = useNavigate();
  const { isauth } = useAuth();
  useEffect(() => {
    if (!isauth()) {
      nav("/users/login");
    }
  }, [isauth]);
  return (
    <div>
      <div className="maindiv">
        <NavBar />
        <div className="sidenav_card" style={{ gap: "5%", height: "88vh" }}>
          <Sidenav />
          <Features />
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default FeatureView;
