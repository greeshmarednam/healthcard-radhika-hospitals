import { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth";
const apiurl = process.env.REACT_APP_API_URL;

const VerifyCard = () => {
  const [cardnumber, setcardnumber] = useState("");
  const [name, setname] = useState("");
  const [result, setresult] = useState();
  const [verifyloader, verifysetloader] = useState(false);
  const [card_error, setcard_error] = useState(false);
  const { gettoken } = useAuth();
  const [name_error, setname_error] = useState(false);
  const handlesubmit = () => {
    verifysetloader(true);
    if (cardnumber === "") {
      setcard_error(true);
      verifysetloader(false);
      return;
    }
    if (name === "") {
      setname_error(true);
      verifysetloader(false);
      return;
    }
    axios({
      method: "post",
      url: apiurl + "/api/admin/verifycard/",
      data: {
        token: gettoken(),
        name: name,
        card_number: cardnumber,
      },
    })
      .then((res) => {
        if (res.data.status === "verified") {
          setresult("Verified");
          verifysetloader(false);
        }
        if (res.data.status === "not found") {
          setresult("Card Not Found");
          verifysetloader(false);
        }
      })
      .catch((e) => {
        console.log(e);
        verifysetloader(false);
      });
  };
  return (
    <div className='profilemain'>
      <div>Verify Card</div>
      <div className='input'>
        <label htmlFor='cardnumber'>Health Cardnumber</label>
        <input
          type='text'
          name='card_number'
          id='card_number'
          className={card_error ? "error" : " "}
          onChange={(e) => {
            setcardnumber(e.target.value);
          }}
        />
      </div>
      <div className='input'>
        <label htmlFor='name'>Fullname</label>
        <input
          type='text'
          name='name'
          id='name'
          className={name_error ? "error" : " "}
          onChange={(e) => setname(e.target.value)}
        />
      </div>
      <button onClick={handlesubmit}>
        {verifyloader ? <div className='loader'></div> : "Search"}
      </button>
      {result && result === "Verified" ? (
        <div style={{ color: "green" }}> Card Verified </div>
      ) : (
        <div style={{ color: "red" }}>Card Not Found</div>
      )}
    </div>
  );
};

export default VerifyCard;
