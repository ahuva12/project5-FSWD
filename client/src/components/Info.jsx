import React, { useContext } from "react";
import { UserContext } from "./userContext";
import "../CSS/info.css"; // Adjusted path to CSS/info.css

function Info(props) {
  const { current_user } = useContext(UserContext);

  const userDetailElements = (
    <div className="info-section">
      <p><strong>Id:</strong> {current_user.id}</p>
      <p><strong>Name:</strong> {current_user.name}</p>
      <p><strong>Username:</strong> {current_user.username}</p>
      <p><strong>Email:</strong> {current_user.email}</p>
      <div>
        <h4>Address:</h4>
        <p><strong>Street:</strong> {current_user.address.street}</p>
        <p><strong>Suite:</strong> {current_user.address.suite}</p>
        <p><strong>City:</strong> {current_user.address.city}</p>
        <p><strong>Zipcode:</strong> {current_user.address.zipcode}</p>
        <div>
          <h5>Geo:</h5>
          <p><strong>Lat:</strong> {current_user.address.geo.lat}</p>
          <p><strong>Lng:</strong> {current_user.address.geo.lng}</p>
        </div>
      </div>
      <p><strong>Phone:</strong> {current_user.phone}</p>
      <p><strong>Website:</strong> {current_user.website}</p>
      <div>
        <h4>Company:</h4>
        <p><strong>Name:</strong> {current_user.company.name}</p>
        <p><strong>Catch Phrase:</strong> {current_user.company.catchPhrase}</p>
        <p><strong>BS:</strong> {current_user.company.bs}</p>
      </div>
    </div>
  );

  return (
    <div className="info-container">
      <h1>Your Details</h1>
      <div>
        {userDetailElements}
      </div>
      <button className="info-button" onClick={() => props.setShowInfo(false)}>Close</button>
    </div>
  );
}

export default Info;
