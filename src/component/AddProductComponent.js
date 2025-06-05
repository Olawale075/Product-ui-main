import React, {useState, useEffect} from 'react'
import {Link, useParams } from 'react-router-dom';
import {
    Button,
    Container,
    Form,
    Row,
    Col,
    Spinner,
    Table,
    Pagination,
  } from "react-bootstrap";
  import Layout from "./partials/Layout";
  
  import { FaFilter } from "react-icons/fa";
import EmployeeService from '../services/EmployeeService'
import axios from "axios";
const AddProductComponent = () => {
    const [loading, setLoading] = useState(true);
        const handleFileUpload = (event) => {
          // get the selected file from the input
          const file = event.target.files[0];
          // create a new FormData object and append the file to it
          const formData = new FormData();
          formData.append("file", file);
          const employee = {title, description,file}
          // make a POST request to the File Upload API with the FormData object and Rapid API headers
          axios
            .post("http://localhost:8080/api/v1/product/upload", employee, {
              headers: {
                "Content-Type": "multipart/form-data",
                "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                "x-rapidapi-key": "your-rapidapi-key-here",
              },
            })
            .then((response) => {
              // handle the response
              console.log(response);
            })
            .catch((error) => {
              // handle errors
              console.log(error);
            });
        };

    const [title, setTitle] = useState('')
    const [file, setimageFileName] = useState('')
    const [description, setDescription] = useState('')
   
    // const history = useHistory();
    const {id} = useParams();

    const saveOrUpdateEmployee = (e) => {
        e.preventDefault();

        const employee = {title, description,file}

        if(id){
            EmployeeService.updateEmployee(id, employee).then((response) => {
                // history.push('/employees')
            }).catch(error => {
                console.log(error)
            })

        }else{
            EmployeeService.createEmployee(employee).then((response) =>{

                console.log(response.data)
    
                // history.push('/employees');
    
            }).catch(error => {
                console.log(error)
            })
        }
        
    }

    useEffect(() => {

        EmployeeService.getEmployeeById(id).then((response) =>{
            setTitle(response.data.title)
            setimageFileName(response.data.imageFileName)
            setDescription(response.data.description)
        }).catch(error => {
            console.log(error)
        })
    }, [])

    const titles = () => {

        if(id){
            return <h2 className = "text-center">Update Employee</h2>
        }else{
            return <h2 className = "text-center">Add Employee</h2>
        }
    }

    return (
       
           <Layout>
      {loading ? (
        <Spinner animation="grow"></Spinner>
      ) : (
        <Container>
            
                <div className = "row">
                    <div className = "card col-md-6 offset-md-3 offset-md-3">
                       {
                           titles()
                       }
                        <div className = "card-body">
                            <form>
                                <div className = "form-group mb-2">
                                    <label className = "form-label"> Title :</label>
                                    <input
                                        type = "text"
                                        placeholder = "Enter Title"
                                        name = "title"
                                        className = "form-control"
                                        value = {title}
                                        onChange = {(e) => setTitle(e.target.value)}
                                    >
                                    </input>
                                </div>

                                {/* <div className = "form-group mb-2">
                                    <label className = "form-label"> Last Name :</label>
                                    <input
                                        type = "text"
                                        placeholder = "Enter last name"
                                        name = "imageFileName"
                                        className = "form-control"
                                        value = {imageFileName}
                                        onChange = {(e) => setimageFileName(e.target.value)}
                                    >
                                    </input>
                                </div> */}

                                <div className = "form-group mb-2">
                                    <label className = "form-label"> description :</label>
                                    <input
                                        type = "text"
                                        placeholder = "Enter description"
                                        name = "description"
                                        className = "form-control"
                                        value = {description}
                                        onChange = {(e) => setDescription(e.target.value)}
                                    >
                                    </input>
                                </div>
                                
                                <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
    <button className = "btn btn-success" onClick = {(e) => saveOrUpdateEmployee(e)} >Submit </button>
                                <Link to="/employees" className="btn btn-danger"> Cancel </Link>
                            </form>

                        </div>
                    </div>
                </div>

      
        </Container>
      )}
    </Layout>
    )
}

export default AddProductComponent