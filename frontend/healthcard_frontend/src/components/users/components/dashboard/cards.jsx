import { useNavigate } from "react-router";
import "./cards.css";

const Card = (props) => {
  const nav = useNavigate();
  const handleonclick = () => {
    nav("/users/view_card/" + props.card_number);
  };

  return (
    <div className='card' onClick={handleonclick} key={props.card_number}>
      <img
        src={props.profile_img}
        className='profile-image'
        style={{
          borderRadius: "6px",
          boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        }}
      />
      <div className='body'>
        <h2 className='name'>{props.name}</h2>
        <p>DOB: {props.dob} </p>
        <p>gender: {props.gender}</p>
        <p
          className='card_number'
          style={{ color: "white", backgroundColor: "#2ca2ad" }}
        >
          {props.card_number}
        </p>
      </div>
    </div>
  );
};

export default Card;
