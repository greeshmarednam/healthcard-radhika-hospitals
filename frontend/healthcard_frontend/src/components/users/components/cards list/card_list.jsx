import {
  AddOutlined,
  DeleteOutline,
  Download,
  VisibilityOutlined,
} from "@mui/icons-material";
import "./cards_list.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "../../../buttons/button.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/auth";
import { useNavigate } from "react-router";

const Cards_List = () => {
  const [data, setdata] = useState();
  const [lsitloader, setlistloader] = useState(true);
  const { gettoken } = useAuth();
  const apiurl = process.env.REACT_APP_API_URL;
  const [url, seturl] = useState();
  const nav = useNavigate();
  const download_a_ref = useRef();
  const [cardlist_whatsapploader, setcardlist_whatsapploader] = useState(false);
  const [cardlist_whatsapploader_key, setcardlist_whatsapploader_key] =
    useState("");
  const [cardlist_deleteloader, setcardlist_deleteloader] = useState(false);
  const [cardlist_deleteloader_key, setcardlist_deleteloader_key] =
    useState("");
  useEffect(() => {
    axios({
      method: "post",
      url: apiurl + "/api/users/cardslist/",
      data: {
        token: gettoken(),
      },
    }).then((res) => {
      if (res.data.status === "data sent") {
        setdata(res.data.data);
        setlistloader(false);
      }
    });
  }, [gettoken, setdata, apiurl]);

  const handlewhatsappsend = (card_number) => {
    setcardlist_whatsapploader_key(card_number);
    setcardlist_whatsapploader(true);
    axios({
      method: "post",
      url: apiurl + "/api/users/sendcard/",
      data: {
        card_number: card_number,
      },
    })
      .then((res) => {
        if (res.data.status === "sent") {
          alert("Card sent to whatsapp");
          setcardlist_whatsapploader(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setcardlist_whatsapploader(false);
      });
  };

  const handledelete = (card_number) => {
    setcardlist_deleteloader(true);
    setcardlist_deleteloader_key(card_number);
    axios({
      method: "post",
      url: apiurl + "/api/users/deletecard/",
      data: {
        token: gettoken(),
        card_number: card_number,
      },
    }).then((res) => {
      if (res.data.status === "card deleted") {
        alert("Deleted");
        setcardlist_deleteloader(false);
        setlistloader(true);
        axios({
          method: "post",
          url: apiurl + "/api/users/cardslist/",
          data: {
            token: gettoken(),
          },
        }).then((res) => {
          if (res.data.status === "data sent") {
            setdata(res.data.data);
            setlistloader(false);
          }
        });
      }
    });
  };

  return (
    <div className="main">
      <div>
        <button onClick={() => nav("/users/add_card")}>
          <AddOutlined /> Add new card
        </button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>S no</th>
              <th>Card Number</th>
              <th>Name</th>
              <th>Mobile number</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "12px" }}>
            {lsitloader ? (
              <div className="loader"></div>
            ) : data ? (
              data.map((d, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{d.card_number}</td>
                  <td>{d.name}</td>
                  <td>{d.mobile_number}</td>
                  <td> {d.gender} </td>
                  <td className="actions">
                    <div
                      onClick={() => {
                        nav("/users/edit_card/" + d.card_number);
                      }}
                    >
                      <EditOutlinedIcon />
                    </div>
                    <div
                      onClick={() => nav("/users/view_card/" + d.card_number)}
                    >
                      <VisibilityOutlined />
                    </div>
                    <div
                      className="whatsappicon"
                      onClick={() => {
                        handlewhatsappsend(d.card_number);
                      }}
                    >
                      {cardlist_whatsapploader ? (
                        cardlist_whatsapploader_key === d.card_number && (
                          <div className="loader"></div>
                        )
                      ) : (
                        <WhatsAppIcon />
                      )}
                    </div>
                    <div
                      className="deleteicon_cardslist"
                      onClick={() => handledelete(d.card_number)}
                    >
                      {cardlist_deleteloader ? (
                        cardlist_deleteloader_key === d.card_number && (
                          <div className="loader"></div>
                        )
                      ) : (
                        <DeleteOutline />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              "No data found"
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cards_List;
