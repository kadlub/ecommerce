// src/pages/Profile.js

import React from 'react';

const Profile = () => (
    <main className="profile-section">
        <h1>User Profile</h1>
        <section>
            <h2>Account Information</h2>
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> johndoe@example.com</p>
        </section>

        <section>
            <h2>My Purchases</h2>
            {/* Display purchased items here */}
            <p>No recent purchases.</p>
        </section>

        <section>
            <h2>My Listings</h2>
            {/* Display items listed by the user */}
            <p>No current listings.</p>
        </section>
    </main>
);

export default Profile;
