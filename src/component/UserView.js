import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import React, { useState, useEffect } from "react";
import EmployeeService from "../services/EmployeeService";
import { Col, Container,  Row } from "react-bootstrap";
import HeaderComponent from "./HeaderComponent";
import Whatsapp from "./Whatsapp";
import Protected from "./partials/Protected";
import ProductType from "./ButtonType ";
import ButtonType from "./ButtonType ";
const UserView = () => {
 
  const [imageData, setImageData] = useState([]);
  const [time, setTime] = useState("");
  useEffect(() => {
    getAllEmployees();
  }, []);
  const getAllEmployees = () => {
    EmployeeService.getAllImages()
      .then((response) => {
        setImageData(response.data);
        setTime(response.data.createDateTime.data);
        console.log(response.data);
        console.log(response.data.createDateTime.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const element=[...imageData].reverse().map((product,idx) => (
        
             
  

    <Col   className=" m-1" key={product.id}>
                
                <Card m-3 style={{ width:"8rem"}} >
            <Card.Img 
              className=""
              minBreakpoint="sm"
              size="lg"
              variant="top"
              src={`http://localhost:8080/api/v1/product/${product.id}/image/download`}
              alt=""
            />
            <div className="mt-1">
              <p className="m-1">{product.title}</p>
            <p className="m-1"> {product.description}</p>
            <p className="m-1"> {product.size}</p>
            <p className="m-1"> {product.price}</p>
            </div>
            
    </Card>
              </Col>
            
          )
       )
        return (
          <div>
            <HeaderComponent/>
            <div><ButtonType /></div>
            <Container className="mt-3"> 
              <Row>
                {element}  
              </Row> 
              <Whatsapp/>
            </Container>       
            
          </div>
  );
};

export default UserView;
