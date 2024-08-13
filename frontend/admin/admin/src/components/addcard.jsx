import { useEffect, useRef, useState } from "react";
import profile from "../images/profile.png";
import "./buttons/button.css";
import "./css/add_card.css";
import axios from "axios";
import { useAuth } from "../auth";
import { useNavigate } from "react-router";
import ReactModal from "react-modal";

const AddCardform = () => {
  const [image, setimage] = useState(profile);
  const [fullname, setfullname] = useState("");
  const [gender, setgender] = useState("none");
  const [dob, setdob] = useState("");
  const [number, setnumber] = useState("");
  const [mail, setmail] = useState("");
  const [address, setaddress] = useState("");
  const [insurance, setInsurance] = useState("none");
  const [error, seterror] = useState();
  const apiurl = process.env.REACT_APP_API_URL;
  const [addcard_loader, setaddcard_loader] = useState(false);
  const fileinputref = useRef();
  const [profileimg, setprofileimg] = useState();
  const { gettoken } = useAuth();

  const nav = useNavigate();

  const [cameraPresent, setcameraPresent] = useState();
  const [opecampop, setopencampop] = useState(false);
  const closecampop = () => setopencampop(false);
  const [stream, setstream] = useState();
  useEffect(() => {
    const checkcam = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videodevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setcameraPresent(videodevices.length > 0);
    };
    checkcam();
  }, [setcameraPresent]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleimg = (e) => {
    const img = e.target.files[0];
    if (img) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setimage(reader.result);
        setprofileimg(img);
      };
      reader.readAsDataURL(img);
    }
  };
  const handletake = () => {
    fileinputref.current.click();
  };
  const capture = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < 8; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = 350;
    canvas.height = 450;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setprofileimg(new File([blob], randomString + ".png"));
    }, "image/png");
    const imageData = canvas.toDataURL("image/png");
    setimage(imageData);
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    setstream(null);
    closecampop();
  };
  const handlesubmit = () => {
    setaddcard_loader(true);
    if (profileimg === "") {
      seterror("img");
      setaddcard_loader(false);
      alert("Profile Image is required");
      return;
    }
    if (fullname === "") {
      seterror("name");
      setaddcard_loader(false);
      return false;
    }
    if (gender === "none") {
      setaddcard_loader(false);
      seterror("gender");
      return false;
    }
    if (dob === "") {
      setaddcard_loader(false);
      seterror("dob");
      return false;
    }
    if (number === "" || number.length < 10) {
      setaddcard_loader(false);
      seterror("number");
      return;
    }
    if (address === "") {
      setaddcard_loader(false);
      seterror("address");
      return false;
    }
    if (insurance === "none") {
      setaddcard_loader(false);
      seterror("insurance");
      return false;
    }
    const formdata = new FormData();
    formdata.append("token", gettoken());
    formdata.append("profile_img", profileimg);
    formdata.append("mobile_number", number);
    formdata.append("name", fullname);
    formdata.append("gender", gender);
    formdata.append("dob", dob);
    formdata.append("address", address);
    formdata.append("mailid", mail);
    formdata.append("insurance", insurance);
    axios
      .post(apiurl + "/api/admin/addcard/", formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data.status === "card added") {
          alert("card added successfully");
          nav("/users/view_card/" + res.data.data.card_number);
        } else {
          alert("falied");
          console.log(res.data);
          setaddcard_loader(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setaddcard_loader(false);
      });
  };
  return (
    <div className='add_card'>
      <div className='uploadpic'>
        <img
          src={image}
          alt=''
          style={{
            borderRadius: "6px",
            boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            justifyContent: "center",
          }}
        />
      </div>
      <div>
        <div className='form'>
          <div className='input'>
            <label
              htmlFor='file'
              className={error === "img" ? " error_input" : " "}
            >
              Image(jpf/jpeg) *
            </label>
            <input
              type='file'
              accept='image/jpeg,image/jpg'
              onChange={handleimg}
              ref={fileinputref}
              src=''
              alt=''
              style={{ display: "none" }}
              className={error === "img" ? "error_input" : " "}
            />
            <div className='uploadbtn'>
              <button
                onClick={() => {
                  setopencampop(true);
                  navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then((stream) => {
                      videoRef.current.srcObject = stream;
                      setstream(stream);
                    })
                    .catch((error) => {
                      console.error("Error accessing webcam:", error);
                    });
                }}
              >
                Capture Photo
              </button>
              <button onClick={handletake}>Upload Photo</button>
            </div>
            <ReactModal
              isOpen={opecampop}
              contentLabel='Camera'
              className='modal'
            >
              {cameraPresent ? (
                <>
                  <video ref={videoRef} autoPlay playsInline />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <button onClick={capture}>Capture</button>
                    <button onClick={closecampop}>Close</button>
                  </div>
                </>
              ) : (
                <div>
                  No Camera Found
                  <button onClick={closecampop}>Close</button>
                </div>
              )}
            </ReactModal>
          </div>
          <div className='input'>
            <label htmlFor='name' className={error === "name" && "error_input"}>
              Fullname *
            </label>
            <input
              type='text'
              name='name'
              id='name'
              onChange={(e) => {
                seterror();
                setfullname(e.target.value);
              }}
              className={error === "name" && "error_input"}
            />
          </div>

          <div className='input'>
            <label
              htmlFor='Gender'
              className={error === "gender" && "error_input"}
            >
              Gender *
            </label>
            <select
              name='gender'
              id='gender'
              onChange={(e) => {
                seterror();
                setgender(e.target.value);
              }}
              className={error === "gender" && "error_input"}
            >
              <option selected value='none'>
                Select gender
              </option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Others</option>
            </select>
          </div>
          <div className='input'>
            <label htmlFor='dob' className={error === "dob" && "error_input"}>
              Date Of Birth *
            </label>
            <input
              type='date'
              name='dob'
              id='dob'
              onChange={(e) => {
                seterror();
                setdob(e.target.value);
              }}
              className={error === "dob" && "error_input"}
            />
          </div>
          <div className='input'>
            <label
              htmlFor='whatsapp'
              className={error === "number" && "error_input"}
            >
              Whatsapp number *
            </label>
            <input
              type='text'
              name='mobile'
              id='mobile'
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/, "").slice(0, 10);
                seterror();
                setnumber(e.target.value);
              }}
              className={error === "number" && "error_input"}
            />
          </div>
          <div className='input'>
            <label htmlFor='mail' className={error === "mail" && "error_input"}>
              Mail id
            </label>
            <input
              type='email'
              name='mail'
              id='mail'
              onChange={(e) => {
                seterror(false);
                setmail(e.target.value);
              }}
              className={error === "mail" && "error_input"}
            />
          </div>
          <div className='input'>
            <label
              htmlFor='address'
              className={error === "address" && "error_input"}
            >
              Address *
            </label>
            <input
              type='text'
              name='address'
              id='address'
              onChange={(e) => {
                seterror();
                setaddress(e.target.value);
              }}
              className={error === "address" && "error_input"}
            />
          </div>
          <div className='input'>
            <label
              htmlFor='insurance'
              className={error === "insurance" && "error_input"}
            >
              Any Insurance *
            </label>
            <select
              name='insurance'
              id='insurance'
              onChange={(e) => {
                seterror();
                setInsurance(e.target.value);
              }}
              className={error === "insurance" && "error_input"}
            >
              <option value='none' selected>
                Select Insurance
              </option>
              <option value='CGHS'>CGHS</option>
              <option value='EHS'>EHS</option>
              <option value='ESI'>ESI</option>
              <option value='AarogyaSri'>AarogyaSri</option>
              <option value='Private Insurance'>Private Insurance</option>
              <option value='ECHS'>ECHS</option>
              <option value='BSKY'>BSKY</option>
              <option value='Corporate Private Insurance'>
                Corporate Private Insurance
              </option>
              <option value='Individual Private Insurance'>
                Individual Private Insurance
              </option>
              <option value='No Insurance'>No Insurance</option>
            </select>
          </div>
        </div>
        <div className='save'>
          <button onClick={handlesubmit}>
            {addcard_loader ? <div className='loader'></div> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddCardform;
