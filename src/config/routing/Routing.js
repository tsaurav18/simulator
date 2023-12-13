import { Routes, Route } from "react-router-dom";

function RouteWithSubRoutes(route) {
  console.log("route>>>>>", route);
  return <Route path={route.path} element={route.element} />;
}

function RenderRoutes({ routes }) {
  console.log("routes", routes);
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.key} {...route} />
      ))}
    </Routes>
  );
}

export default RenderRoutes;
