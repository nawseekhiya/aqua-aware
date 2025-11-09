// Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import RouteTransition from "./RouteTransition";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 ease-in-out">
      <RouteTransition />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
