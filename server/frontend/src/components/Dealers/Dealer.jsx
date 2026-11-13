
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import "./Dealers.css";
import "../assets/style.css";

import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";

import Header from '../Header/Header';

const Dealer = () => {
  const { id } = useParams();

  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDealerData = async () => {
      try {
        // Get dealer details
        const dealerResponse = await fetch(`/djangoapp/dealer/${id}`);
        if (!dealerResponse.ok) {
          throw new Error("Could not load dealer details.");
        }

        const dealerData = await dealerResponse.json();
        setDealer(dealerData);

        // Get dealer reviews
        const reviewsResponse = await fetch(`/djangoapp/reviews/${id}`);
        if (!reviewsResponse.ok) {
          throw new Error("Could not load dealer reviews.");
        }

        const reviewsData = await reviewsResponse.json();
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDealerData();
  }, [id]);

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}
          {isLoggedIn && (
            <a href={`/postreview/${id}`}>
              <img
                src={review_icon}
                style={{
                  width: "10%",
                  marginLeft: "10px",
                  marginTop: "10px"
                }}
                alt="Post Review"
              />
            </a>
          )}
        </h1>

        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>

      <div className="reviews_panel">
        {loading ? (
          <p>Loading Reviews....</p>
        ) : error ? (
          <p>{error}</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet!</p>
        ) : (
          reviews.map((review) => (
            <div className="review_panel" key={review.id}>
              <img
                src={senti_icon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />

              <div className="review">
                {review.review}
              </div>

              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
