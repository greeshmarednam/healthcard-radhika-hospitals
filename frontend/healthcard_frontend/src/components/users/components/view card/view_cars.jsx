import "./view_card.css";
import "../../../buttons/button.css";
import { useNavigate } from "react-router";
import { EditOutlined, Download, WhatsApp, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/auth";

const View_Card = (props) => {
  const nav = useNavigate();
  const [url, seturl] = useState();
  const [whatsapploader_viewcard, setwhatsapploader_viewcard] = useState(false);
  const [deleteloader, setdeleteloader] = useState(false);
  const [loader, setloader] = useState(true);
  const { gettoken } = useAuth();
  const apiurl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    axios({
      method: "post",
      url: apiurl + "/api/users/downloadcard/",
      data: {
        token: gettoken(),
        card_number: props.data.card_number,
      },
    })
      .then((res) => {
        seturl(res.data.url);
        setloader(false);
      })
      .catch((e) => {
        console.log(e);
        setloader(false);
      });
  });

  const handlewhatsappsend = () => {
    setwhatsapploader_viewcard(true);
    axios({
      method: "post",
      url: apiurl + "/api/users/sendcard/",
      data: {
        card_number: props.data.card_number,
      },
    })
      .then((res) => {
        if (res.data.status === "sent") {
          alert("sent to registered whatsapp number");
          setwhatsapploader_viewcard(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setwhatsapploader_viewcard(false);
      });
  };

  const handledelete = () => {
    setdeleteloader(true);
    axios({
      method: "post",
      url: apiurl + "/api/users/deletecard/",
      data: {
        token: gettoken(),
        card_number: props.data.card_number,
      },
    }).then((res) => {
      if (res.data.status === "card deleted") {
        alert("card deleted");
        nav("/users/dashboard");
      }
    });
  };
  return (
    <>
      {loader ? (
        <div className='loader'></div>
      ) : (
        <div>
          <div className='view_cards'>
            <div className='text'>
              <p style={{ color: "#2CA2AD" }}>
                <b>Health Cardnumber:</b> {props.data.card_number}
              </p>
              <p>
                <b>Fullname:</b> {props.data.name}
              </p>
              <p>
                <b>Gender:</b> {props.data.gender}
              </p>
              <p>
                <b>Date Of Birth:</b> {props.data.dob}{" "}
              </p>
              <p>
                {" "}
                <b>Address:</b> {props.data.address}{" "}
              </p>
              <p>
                <b>Insurance:</b> {props.data.insurance}{" "}
              </p>
            </div>
            <div className='image_profile'>
              <img
                src={props.data.profile_img}
                alt=''
                style={{
                  borderRadius: "6px",
                  boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              />
              <p>{props.data.name}</p>
            </div>
          </div>
          <div className='buttons'>
            <button
              className='editicon'
              onClick={() => {
                nav("/users/edit_card/" + props.data.card_number);
              }}
            >
              <EditOutlined />
              Edit
            </button>
            <button onClick={handlewhatsappsend}>
              {whatsapploader_viewcard ? (
                <div className='loader'></div>
              ) : (
                <>
                  <WhatsApp />
                  Whatsapp
                </>
              )}
            </button>
            <button
              style={{
                textAlign: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              <a
                href={url}
                download={url}
                style={{
                  color: "white",
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <Download />
                Download
              </a>
            </button>
            <button className='deleteicon' onClick={handledelete}>
              {deleteloader ? (
                <div className='loader'></div>
              ) : (
                <>
                  <Delete />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default View_Card;
