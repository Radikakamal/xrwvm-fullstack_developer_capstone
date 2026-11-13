
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const { id } = useParams();

  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dealer details
        const dealerResponse = await fetch(`/djangoapp/dealer/${id}`);
        const dealerData = await dealerResponse.json();
        setDealer(dealerData);

        // Load car makes and models
        const carsResponse = await fetch("/djangoapp/get_cars");
        const carsData = await carsResponse.json();

        const carList = [];

        Object.entries(carsData).forEach(([make, models]) => {
          if (Array.isArray(models)) {
            models.forEach((model) => {
              carList.push({
                CarMake: make,
                CarModel: model
              });
            });
          }
        });

        setCarmodels(carList);
      } catch (err) {
        console.error("Error loading form data:", err);
        setError("Unable to load dealer or car information.");
      }
    };

    loadData();
  }, [id]);

  const postreview = async () => {
    if (!selectedCar || !review.trim() || !date || !year) {
      alert("All details are mandatory");
      return;
    }

    const car = JSON.parse(selectedCar);

    let name =
      sessionStorage.getItem("firstname") +
      " " +
      sessionStorage.getItem("lastname");

    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    const jsoninput = {
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: car.CarMake,
      car_model: car.CarModel,
      car_year: year
    };

    try {
      const response = await fetch("/djangoapp/add_review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(jsoninput)
      });

      const result = await response.json();

      if (response.ok && result.status === 200) {
        window.location.href = `/dealer/${id}`;
      } else {
        alert(result.error || "Review could not be submitted.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Unable to submit review. Please try again.");
    }
  };

  return (
    <div>
      <Header />

      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>
          {dealer.full_name}
        </h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <textarea
            id="review"
            cols="50"
            rows="7"
            placeholder="Write your review here"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <div className="input_field">
          Purchase Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="input_field">
          Car Make
          <select
            name="cars"
            id="cars"
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
          >
            <option value="" disabled>
              Choose Car Make and Model
            </option>

            {carmodels.map((car, index) => (
              <option
                key={index}
                value={JSON.stringify(car)}
              >
                {car.CarMake} {car.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="input_field">
          Car Year
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            max="2026"
            min="2015"
          />
        </div>

        <div>
          <button
            className="postreview"
            onClick={postreview}
          >
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
