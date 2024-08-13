import { useState } from "react";
import "./buttons/button.css";
import axios from "axios";
import "./searchview.css";
import { useAuth } from "../auth";
import SearchCard from "./searchcard";

const SearchView = () => {
  const [data, setdata] = useState();
  const [search, setsearch] = useState("");
  const [error, seterror] = useState(false);
  const { gettoken } = useAuth();
  const [searchloading, setsearchloading] = useState(false);
  const apiurl = process.env.REACT_APP_API_URL;

  const handlesearch = () => {
    setsearchloading(true);
    if (search !== "") {
      axios({
        method: "post",
        url: apiurl + "/api/admin/search/",
        data: {
          token: gettoken(),
          search: search,
        },
      }).then((res) => {
        if (res.data.status === "found") {
          setdata(res.data.data);
          setsearchloading(false);
        }
      });
    } else {
      seterror(true);
      setsearchloading(false);
    }
  };
  return (
    <div className='search_main'>
      {console.log(data)}
      <div className='search_div'>
        <input
          type='text'
          name='search'
          id='search'
          onChange={(e) => {
            seterror(false);
            setsearch(e.target.value);
          }}
          className={error ? "error" : ""}
        />
        <button onClick={handlesearch}>Search</button>
      </div>
      {searchloading ? (
        <div className='loader'></div>
      ) : data ? (
        data.map((d) => <SearchCard data={d} />)
      ) : (
        <div>No Data Found</div>
      )}
    </div>
  );
};

export default SearchView;
