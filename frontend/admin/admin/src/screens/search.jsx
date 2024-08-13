import { useEffect } from "react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router";
import NavBar from "../navbar/navbar";
import Sidenav from "../navbar/sidenav";
import SearchView from "../components/searchview";

const Search = () => {
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
        <SearchView />
      </div>
    </div>
  );
};
export default Search;
