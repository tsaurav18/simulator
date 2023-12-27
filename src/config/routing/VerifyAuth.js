import React from "react";
import Login from "../../Pages/Login/Login";

export const VerifyAuth = ({ ComponentElement, auth_info, ...rest }) => {

console.log("auth_info",auth_info)
  if (auth_info.is_staff===true) {
    return ComponentElement ;
  }
  if (auth_info.is_staff === false && auth_info.user_id === "") {
    //page is for only guest and user is signed OUT
    return <Login/>;
  }
  // if page for signed users but user is unsigned IN
  return <Login/>;
};
