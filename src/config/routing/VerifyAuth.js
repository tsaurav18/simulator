import React from "react";
import { Redirect } from "react-router-dom";
import { WEB_APP_ROUTES } from "../constants/Routes";
export const VerifyAuth = ({ component: Component, authRoles, ...rest }) => {
  //   const user = useSelector(getUserSelector);
  const user = "ADMIN";

  if (authRoles.includes(user)) {
    console.log(authRoles.includes(user));
    //for signed users and user is signed in

    return <Component {...rest} />;
  }
  if (authRoles.length === 0 && user === "") {
    //page is for only guest and user is signed OUT
    return <Component {...rest} />;
  }
  // if page for signed users but user is unsigned IN
  return <Component {...rest} />;
};
