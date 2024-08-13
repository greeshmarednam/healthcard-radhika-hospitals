import { useEffect, useRef, useState } from "react";
import profile from "../../../../images/profile.png";
import "../../../buttons/button.css";
import "./edit_card.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../auth/auth";
import Loader from "../../../loader/loader";

const EditCardform = () => {
  const [image, setimage] = useState(profile);
  const fileinputref = useRef();
  const [data, setdata] = useState();
  const params = useParams();
  const { gettoken } = useAuth();
  const [editdata_loader, seteditdata_loader] = useState(true);
  const [fullname, setfullname] = useState("");
  const [gender, setgender] = useState("none");
  const [dob, setdob] = useState("");
  const [number, setnumber] = useState("");
  const [mail, setmail] = useState("");
  const [address, setaddress] = useState("");
  const [insurance, setInsurance] = useState("none");
  const [error, seterror] = useState();
  const card_number = params.card_number;
  const apiurl = process.env.REACT_APP_API_URL;
  const [edit_saveloader, setedit_saveloader] = useState(false);

  const nav = useNavigate();
  useEffect(() => {
    axios({
      method: "post",
      url: apiurl + "/api/users/viewcard/",
      data: {
        token: gettoken(),
        card_number: params.card_number,
      },
    })
      .then((res) => {
        if (res.data.status === "data sent") {
          setdata(res.data.data);
          setfullname(res.data.data.name);
          setgender(res.data.data.gender);
          setInsurance(res.data.data.insurance);
          setaddress(res.data.data.address);
          setdob(res.data.data.dob);
          setnumber(res.data.data.mobile_number);
          setmail(res.data.data.mailid);
          setimage(res.data.data.profile_img);
        }
        seteditdata_loader(false);
      })
      .catch((e) => {
        console.log(e);
        seteditdata_loader(false);
      });
  }, [
    gettoken,
    params,
    setdata,
    setfullname,
    setInsurance,
    setaddress,
    setdob,
    setnumber,
    setmail,
    setInsurance,
    seteditdata_loader,
  ]);
  const handleimg = (e) => {
    const img = e.target.files[0];
    if (img) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setimage(reader.result);
      };
      reader.readAsDataURL(img);
    }
  };
  const handletake = () => {
    fileinputref.current.click();
  };
  const handlesubmit = () => {
    setedit_saveloader(true);
    if (fullname === "") {
      seterror("name");
      setedit_saveloader(false);
      return false;
    }
    if (gender === "none") {
      setedit_saveloader(false);
      seterror("gender");
      return false;
    }
    if (dob === "") {
      setedit_saveloader(false);
      seterror("dob");
      return false;
    }
    if (number === "" || number.length < 10) {
      setedit_saveloader(false);
      seterror("number");
      return;
    }
    if (address === "") {
      setedit_saveloader(false);
      seterror("address");
      return false;
    }
    if (insurance === "none") {
      setedit_saveloader(false);
      seterror("insurance");
      return false;
    }
    setedit_saveloader(true);
    axios({
      method: "post",
      url: apiurl + "/api/users/updatecard/",
      data: {
        token: gettoken(),
        card_number: card_number,
        mobile_number: number,
        name: fullname,
        gender: gender,
        dob: dob,
        address: address,
        mailid: mail,
        insurance: insurance,
      },
    })
      .then((res) => {
        if (res.data.status === "updated") {
          nav("/users/dashbaord");
        }
      })
      .catch((e) => {
        console.log(e);
        setedit_saveloader(false);
      });
  };
  return (
    <div className="add_card" style={{ textAlign: "center" }}>
      {editdata_loader ? (
        <div className="loader"></div>
      ) : data ? (
        <div>
          <div className="uploadpic">
            <img
              src={image}
              alt=""
              style={{
                borderRadius: "6px",
                boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            />
            {/* <input
                type='file'
                accept='image/*'
                onChange={handleimg}
                ref={fileinputref}
                src=''
                alt=''
                style={{ display: "none" }}
              /> */}
            {/* <button onClick={handletake}>Take Photo</button> */}
          </div>
          <div className="form-parent">
            <div className="form">
              <div className="card_number">
                <b>Card number:</b> <span>{data.card_number}</span>
              </div>
              <div className="input">
                <label
                  htmlFor="name"
                  className={error === "name" && "error_input"}
                >
                  Fullname
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={data.name}
                  className={error === "name" && "error_input"}
                  onChange={(e) => {
                    seterror();
                    setfullname(e.target.value);
                  }}
                />
              </div>
              <div className="input">
                <label
                  htmlFor="Gender"
                  className={error === "gender" && "error_input"}
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  className={error === "gender" && "error_input"}
                  onChange={(e) => {
                    seterror();
                    setgender(e.target.value);
                  }}
                  defaultValue={data.gender}
                >
                  <option disabled>Select gender</option>
                  <option
                    value="male"
                    selected={data.gender === "Male" || data.gender === "male"}
                  >
                    Male
                  </option>
                  <option
                    value="female"
                    selected={
                      data.gender === "Female" || data.gender === "female"
                    }
                  >
                    Female
                  </option>
                  <option
                    value="other"
                    selected={
                      data.gender === "Other" || data.gender === "other"
                    }
                  >
                    Others
                  </option>
                </select>
              </div>
              <div className="input">
                <label
                  htmlFor="dob"
                  className={error === "dob" && "error_input"}
                  onChange={(e) => {
                    seterror();
                    setdob(e.target.value);
                  }}
                >
                  Date Of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  className={error === "dob" && "error_input"}
                  defaultValue={data.dob}
                  onChange={(e) => {
                    seterror(false);
                    setdob(e.target.value);
                  }}
                />
              </div>
              <div className="input">
                <label
                  htmlFor="whatsapp"
                  className={error === "number" && "error_input"}
                >
                  Whatsapp number
                </label>
                <input
                  type="text"
                  name="mobile"
                  id="mobile"
                  defaultValue={data.mobile_number}
                  className={error === "number" && "error_input"}
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/, "")
                      .slice(0, 10);
                    seterror();
                    setnumber(e.target.value);
                  }}
                />
              </div>
              <div className="input">
                <label htmlFor="mail">Mail id</label>
                <input
                  type="email"
                  name="mail"
                  id="mail"
                  defaultValue={data.mailid}
                  onChange={(e) => setmail(e.target.value)}
                />
              </div>
              <div className="input">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  defaultValue={data.address}
                  className={error === "address" && "error_input"}
                  onChange={(e) => {
                    seterror();
                    setaddress(e.target.value);
                  }}
                />
              </div>
              <div className="input">
                <label htmlFor="insurance">Any Insurance</label>
                <select
                  name="insurance"
                  id="insurance"
                  onChange={(e) => {
                    seterror();
                    setInsurance(e.target.value);
                  }}
                  className={error === "insurance" && "error_input"}
                  defaultValue={data.insurance}
                >
                  <option value="" disabled>
                    Select Insurance
                  </option>
                  <option value="CGHS" selected={data.insurance === "CGHS"}>
                    CGHS
                  </option>
                  <option value="EHS" selected={data.insurance === "EHS"}>
                    EHS
                  </option>
                  <option value="ESI" selected={data.insurance === "ESI"}>
                    ESI
                  </option>
                  <option
                    value="AarogyaSri"
                    selected={data.insurance === "AarogyaSri"}
                  >
                    AarogyaSri
                  </option>
                  <option
                    value="Private Insurance"
                    selected={data.insurance === "Private Insurance"}
                  >
                    Private Insurance
                  </option>
                </select>
              </div>
              <div className="save">
                <button onClick={handlesubmit}>
                  {edit_saveloader ? <div className="loader"></div> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        "No data Found"
      )}
    </div>
  );
};
export default EditCardform;
