export default function SearchCard({ data }) {
  return (
    <div className='view_cards'>
      <div className='text'>
        <p style={{ color: "#2CA2AD" }}>
          <b>Health Cardnumber:</b> {data.card_number}
        </p>
        <p>
          <b>Fullname:</b> {data.name}
        </p>
        <p>
          <b>Gender:</b>
          {data.gender}
        </p>
        <p>
          <b>Date Of Birth:</b> {data.dob}
        </p>
        <p>
          <b>Address: </b>
          {data.address}
        </p>
        <p>
          <b>Insurance:</b> {data.insurance}
        </p>
      </div>
      <div className='image_profile'>
        <img src={data.profile_img} alt='' />
        <p>
          <b>{data.name}</b>
        </p>
      </div>
    </div>
  );
}
