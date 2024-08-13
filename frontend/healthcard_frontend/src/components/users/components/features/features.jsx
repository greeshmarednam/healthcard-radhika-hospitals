import "./features.css";

const Features = () => {
  return (
    <div className="tc_main">
      <div className="bordermain">
        <b>Applies to:</b>
        <ul className="applies">
          <li>
            All speciality OP Registration will be Rs.100/- only and  Rs.300/-
            doctor consultation will be free
          </li>
          <li>Free Medical Tele Consultation - 9392174489</li>
          <li>Upto 5% discount on Pharmacy.</li>
          <li>Upto 10% discount on Lab And Investigations.</li>
          <i>Upto 5% discount on all admissions.</i>
          <li>Upto 5% discount on all Surgeries And Procedures.</li>
          <li>OP Timings from 9AM - 2 PM only.</li>
        </ul>
        <div className="special">
          <div>
            <b>Specialties - </b>
            <ol>
              <li>General Medicine</li>
              <li>Gynecology, Obstetrics and Fertility</li>
              <li>Pediatrics</li>
              <li>General Surgery</li>
              <li>Orthopedics</li>
              <li>ENT</li>
              <li>Dermatology</li>
            </ol>
          </div>
          <div>
           <b> Super Specialties </b>
            <ol>
              <li>Urology</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
