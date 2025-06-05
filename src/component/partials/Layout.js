import Sidebar from "./Sidebar";
import Header from "./Header";
import { Container } from "react-bootstrap";

const Layout = ({ children }) => {
  return (
    <div >
      <div className = 'row p-0 m-0'>
        <div className='col-sm-12 col-md-3 p-0 m-0'>
          <Sidebar />
        </div>
        <div className='col-sm-12 col-md-9 p-0 m-0'>
            <Header />
            <Container fluid className="p-5">
              {children}
            </Container>
        </div>
      </div>
    </div>
  );
};

export default Layout;
