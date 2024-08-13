import "./css/profile.css";
import "./buttons/button.css";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth";
import Loader from "./loader/loader";

const ProfileView = (props) => {
  const [name, setname] = useState(props.data.fullname);
  const [loader, setloader] = useState(false);
  const [result, setresult] = useState();
  const [password, setpassword] = useState(props.data.password);
  const { gettoken } = useAuth();
  const apiurl = process.env.REACT_APP_API_URL;

  const handlesubmit = () => {
    setloader(true);
    axios({
      method: "post",
      url: apiurl + "/api/admin/profileview/",
      data: {
        token: gettoken(),
        access_type: "update",
        fullname: name,
        password: password,
      },
    }).then((res) => {
      if (res.data.status === "updated") {
        setresult("Profile Updated");
        setloader(false);
      }
    });
  };

  return (
    <div className='profilemain'>
      <div>Profile</div>
      {result && result}
      <div className='input'>
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          name='username'
          id='username'
          disabled
          defaultValue={props.data.username}
        />
      </div>
      <div className='input'>
        <label htmlFor='name'>Fullname</label>
        <input
          type='text'
          name='name'
          id='name'
          defaultValue={props.data.fullname}
          onChange={(e) => setname(e.target.value)}
        />
      </div>
      <div className='input'>
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='password'
          id='password'
          value={props.data.password}
          onChange={(e) => setpassword(e.target.value)}
        />
      </div>
      <button onClick={handlesubmit}>{loader ? <Loader /> : "Save"}</button>
    </div>
  );
};
export default ProfileView;
