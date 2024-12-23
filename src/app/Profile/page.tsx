"use client";

import { useEffect, useState } from "react";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve email from localStorage
        const email = localStorage.getItem("email");
        if (!email) {
          setError("User not logged in. Please log in first.");
          return;
        }

        // Fetch profile data from API
        const response = await fetch(`/api/profile?email=${email}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to load profile data.");
        } else {
          setUserData(data); // Set user data in state
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("An unexpected error occurred while fetching profile data.");
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!userData) {
    return <div className="text-center">Loading profile...</div>;
  }

  return (
    <div className="profileContainer p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-[#0F6466]">
        Welcome, {userData.firstName} {userData.lastName}
      </h1>
      <div className="mt-4 text-center bg-white p-4 rounded shadow-lg">
        <p className="text-lg text-gray-700">
          <strong>Email:</strong> {userData.email}
        </p>
        <p className="text-lg text-gray-700">
          <strong>Contact Number:</strong>{" "}
          {userData.contactNumber || "Not provided"}
        </p>
      </div>
    </div>
  );
}
