import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import HeaderComponent from '../component/HeaderComponent';
import ProductType from '../component/ButtonType ';
import Whatsapp from '../component/Whatsapp';
import Protected from '../component/partials/Protected';

const Cross = () => {
    const [Product, setProduct] = useState([]);

   useEffect(() => {
      axios.get('http://localhost:8080/api/v1/product?title=Cross').then((response) => {
         setProduct(response.data);
         console.log(response.data)
      });
   }, []);
   const element=[...Product].reverse().map((product,idx) => (
         
              
   
 
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
             <span className="m-1"> {product.description}</span>
             <p className="m-1"> {product.size}</p>
             <p className="m-1"> {product.price}</p>
             </div>
             
     </Card>
               </Col>
             
           )
        )
         return (<Protected>
           <div>
             <HeaderComponent/>
             <div><ProductType/></div>
             <Container className="mt-3"> 
               <Row>
                 {element}  
               </Row> 
               <Whatsapp/>
             </Container>       
             
           </div></Protected>
   );
}

export default Cross
