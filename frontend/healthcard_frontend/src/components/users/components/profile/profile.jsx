import "./profile.css";
import "../../../buttons/button.css";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/auth";

const Profile = (props) => {
  const [name, setname] = useState(props.data.fullname);
  const [profileloader, setprofileloader] = useState(false);
  const [result, setresult] = useState();
  const { gettoken } = useAuth();
  const apiurl = process.env.REACT_APP_API_URL;

  const handlesubmit = () => {
    setprofileloader(true);
    axios({
      method: "post",
      url: apiurl + "/api/users/profileview/",
      data: {
        token: gettoken(),
        access_type: "update",
        fullname: name,
      },
    }).then((res) => {
      if (res.data.status === "updated") {
        setresult("Profile Updated");
        setprofileloader(false);
      }
    });
    setprofileloader(false);
  };

  return (
    <div className='profilemain'>
      <div style={{ fontSize: "18px", fontWeight: "800" }}>Profile</div>
      {result && result}
      <div className='input'>
        <label htmlFor='whatsapp'>Mobile number</label>
        <input
          type='text'
          name='mobile'
          id='mobile'
          disabled
          defaultValue={props.data.mobile_number}
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
      <button onClick={handlesubmit}>
        {profileloader ? <div className='loader'></div> : "Save"}
      </button>
    </div>
  );
};
export default Profile;
