import React from "react";

const ProfilePage = async ({ params }: any) => {
  const { id } = await params;
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Id: {id}</p>
    </div>
  );
};

export default ProfilePage;
