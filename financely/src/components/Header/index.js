import React, { useEffect } from "react";
import "./styles.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userImg from "../../assests/user.svg";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/"); // Navigate to login or home if the user is not logged in
    } else if (user) {
      navigate("/dashboard"); // Only navigate to dashboard if the user is logged in
    }
  }, [user, loading, navigate]);

  function logoutFnc() {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  return (
    <div className="navbar">
      <p className="logo">Financely.</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img
            src={user.photoURL ? user.photoURL : userImg}
            alt="User Avatar"
            style={{ height: "1.5rem", width: "1.5rem", borderRadius: "50%" }}
          />
          <p className="logo link" onClick={logoutFnc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;

