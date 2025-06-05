import { useEffect, useState } from "react";
import Protected from "./partials/Protected";
import * as ReactBootStrap from 'react-bootstrap';
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Templates = () => {
  const [templates, setTemplates] = useState(null);
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState(false);
  const [id, setId] = useState(null)

  const handleClose = () => setShow(false);
  const handleShow = e => {
    setShow(true)
    setId(e)
  };
  useEffect(() => {
    fetch("http://146.70.88.25:8082/api/v1/sms/template")
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        setTemplates(data)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      });
  }, []);

  const handleDelete = id => {
        fetch(`http://146.70.88.25:8082/api/v1/sms/template/${id}`, {method : 'DELETE'})
          .then((res) => res.json())
          .then((data) => {
            // setTemplates(templates.filter(template => {
            //     return template.id !== id
            // }))
            setShow(false)
          })
          .catch((err) => console.log(err));
  }
  return (
    <Protected>
      <div>
        
        <div className="mb-3 text-end">
            <Link className="btn btn-dark" to="/new-template"><FaFileAlt />New Template</Link>
        </div>
        
        <ReactBootStrap.Table striped bordered hover>
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Short Name</th>
              <th>SMS Type</th>
              <th>Func</th>
            </tr>
          </thead>
          <tbody>
            {loading && <Spinner animation="grow" className="m-3"/>}
            {
                templates && templates.map((template, index) => (
                <tr className="text-center" key={template.id}>
                    <td>{index+1}</td>
                    <td>{template.shortName}</td>
                    <td>{template.smsType}</td>
                    <td>
                    <Link className="btn btn-outline-dark mx-2" to={`/templates/${template.id}`}>Edit</Link>
                    <Link className="btn btn-danger mx-2" onClick={e => handleShow(template.id)}>Delete</Link>
                    </td>
                </tr>
                ))
            }
          </tbody>
        </ReactBootStrap.Table> 
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you Sure you want to delete template with #{id}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={e => handleDelete(id)}>Understood</Button>
        </Modal.Footer>
      </Modal>
    </Protected>
  );
};

export default Templates;
