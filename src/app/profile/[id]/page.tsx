import React from "react";

const ProfilePage = async ({ params }: any) => {
  const { id } = await params;
  return (
    <div>
      <h1>Profile Page</h1>
      <p className="p-2 rounded bg-orange-500 text-black">Id: {id}</p>
    </div>
  );
};

export default ProfilePage;
