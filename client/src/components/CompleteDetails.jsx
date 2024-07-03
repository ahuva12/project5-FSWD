import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import "../CSS/completeDetails.css"; // Adjusted path to css/completeDetails.css

function CompleteDetails() {
  const { current_user, setCurrentUser } = useContext(UserContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    street: "",
    suite: "",
    city: "",
    zipcode: "",
    geo: {
      lat: "",
      lng: ""
    }
  });
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [company, setCompany] = useState({
    name: "",
    catchPhrase: "",
    bs: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !address.street || !address.city || !address.zipcode || !address.geo.lat || !address.geo.lng || !website || !company.name || !company.catchPhrase || !company.bs) {
      alert("Please fill in all fields.");
      return;
    }

    try {      
        const response1 = await fetch('http://localhost:3000/users');
        const users_list = await response1.json();
        let nextId = users_list.length + 1
        const curUser = JSON.parse(localStorage.getItem("currentUser"));

        const newUser = {
          id: nextId,
          name: name,
          username: current_user.username,
          email: email,
          address: {
            street: address.street,
            suite: address.suite,
            city: address.city,
            zipcode: address.city,
            geo: {
              lat: address.geo.lat,
              lng: address.geo.lng
            }
          },
          phone: phone,
          website: current_user.password,
          company: {
            name: company.name,
            catchPhrase: company.catchPhrase,
            bs: company.catchPhrase
          }
        }
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        console.log(newUser)       
       
        const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (response.ok) {
        alert('Details saved successfully!');
        setCurrentUser(newUser); 
        navigate("/Home");
      }

    } catch (error) {
        console.log(error)
      alert('Failed to save details. Please try again.');
    }
  };

  return (
    <div className="details-container">
      <h1>Complete Your Details</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:  </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:  </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:  </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Street:  </label>
          <input
            type="text"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Suite:  </label>
          <input
            type="text"
            value={address.suite}
            onChange={(e) => setAddress({ ...address, suite: e.target.value })}
          />
        </div>
        <div>
          <label>City:  </label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Zipcode:  </label>
          <input
            type="text"
            value={address.zipcode}
            onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Latitude:  </label>
          <input
            type="text"
            value={address.geo.lat}
            onChange={(e) => setAddress({ ...address, geo: { ...address.geo, lat: e.target.value } })}
            required
          />
        </div>
        <div>
          <label>Longitude:  </label>
          <input
            type="text"
            value={address.geo.lng}
            onChange={(e) => setAddress({ ...address, geo: { ...address.geo, lng: e.target.value } })}
            required
          />
        </div>
        <div>
          <label>Website:  </label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Company Name:  </label>
          <input
            type="text"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Company Catch Phrase:  </label>
          <input
            type="text"
            value={company.catchPhrase}
            onChange={(e) => setCompany({ ...company, catchPhrase: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Company BS:  </label>
          <input
            type="text"
            value={company.bs}
            onChange={(e) => setCompany({ ...company, bs: e.target.value })}
            required
          />
        </div>
        <button type="submit">Save Details</button>
      </form>
    </div>
  );
}

export default CompleteDetails;
