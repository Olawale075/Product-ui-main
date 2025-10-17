import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "react-bootstrap";
import "./Layout.css"; // ✅ Add responsive styles here

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <div className="row g-0 flex-nowrap">
        {/* Sidebar Section */}
        <div className="col-12 col-md-3 col-lg-2 sidebar-section">
          {/* <Sidebar /> */}
        </div>

        {/* Main Content Section */}
        <div className="col-12 col-md-9 col-lg-10 main-section">
          <Header />
          <Container fluid className="p-4 p-md-5">
            {children}
          </Container>
          <footer className="footer text-center py-3">
            Olawale © {new Date().getFullYear()} — Weather Station  Monitoring
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout;
