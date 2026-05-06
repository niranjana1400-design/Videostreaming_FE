import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-pink-500 dark:bg-pink-900">

      <Header />

      <Sidebar />

      {/* MAIN CONTENT (IMPORTANT FIX) */}
      <main className="pt-16 pl-60 min-h-screen">
        {children}
      </main>

    </div>
  );
};

export default MainLayout;