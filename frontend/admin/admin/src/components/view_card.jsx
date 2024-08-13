import "./css/view_card.css";
import "./buttons/button";
import { useNavigate } from "react-router";
import { EditOutlined, Download, WhatsApp, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth";

const View_Card = (props) => {
  const nav = useNavigate();
  const [url, seturl] = useState();
  const [deleteloader, setdeleteloader] = useState(false);
  const { gettoken, admin } = useAuth();
  const apiurl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    axios({
      method: "post",
      url: apiurl + "/api/admin/downloadcard/",
      data: {
        token: gettoken(),
        card_number: props.data.card_number,
      },
    })
      .then((res) => {
        seturl(res.data.url);
      })
      .catch((e) => {
        console.log(e);
      });
  });
  const handledelete = () => {
    setdeleteloader(true);
    axios({
      method: "post",
      url: apiurl + "/api/admin/deletecard/",
      data: {
        token: gettoken(),
        card_number: props.data.card_number,
      },
    }).then((res) => {
      if (res.data.status === "card deleted") {
        alert("Deleted");
        nav("/admin/dashboard");
      }
    });
    setdeleteloader(false);
  };
  const handlewhatsappsend = () => {
    axios({
      method: "post",
      url: apiurl + "/api/users/sendcard/",
      data: {
        card_number: props.data.card_number,
      },
    })
      .then((res) => {
        if (res.data.status === "card sent") {
          alert("Card sent to whatsapp");
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <div className="view_cards">
        <div className="text">
          <p style={{ color: "#2CA2AD" }}>
            Health Cardnumber: {props.data.card_number}
          </p>
          <p>Fullname: {props.data.name}</p>
          <p>Gender: {props.data.gender}</p>
          <p>Date Of Birth: {props.data.dob} </p>
          <p>Address: {props.data.address} </p>
          <p>Insurance: {props.data.insurance} </p>
        </div>
        <div className="image_profile">
          <img src={props.data.profile_img} alt="" />
          <p>{props.data.name}</p>
        </div>
      </div>
      <div className="buttons">
        <button
          className="editicon"
          onClick={() => {
            nav("/admin/edit_card/" + props.data.card_number);
          }}
        >
          <EditOutlined />
          Edit
        </button>
        <button onClick={handlewhatsappsend}>
          <WhatsApp />
          Whatsapp
        </button>
        <button
          style={{ textAlign: "center", alignItems: "center", color: "white" }}
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
        <button className="deleteicon" onClick={handledelete}>
          <Delete />
          Delete
        </button>
      </div>
    </div>
  );
};

export default View_Card;
