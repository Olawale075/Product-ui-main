import Protected from "../component/partials/Protected";
import * as ReactBootStrap from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import swal from "sweetalert";
import axios from "axios";

const DetectorList = () => {
  const [loading, setLoading] = useState(true);
  const [detectors, setDetectors] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedDetector, setSelectedDetector] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    macAddress: "",
    location: "",
    status: true,
    temperature: 0,
    humidity: 0,
    phoneNumbers: [""]
  });
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({
    macAddress: "",
    location: "",
    status: true,
    temperature: 0,
    humidity: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDetectors();
  }, []);

  const fetchDetectors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://fireeyes-detector-wokt.onrender.com/gas-detectors/admin/all?page=0&size=10&sortBy=macAddress&order=asc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*"
          }
        }
      );
      const data = response.data;
      setDetectors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching detectors:", error);
      swal("Error", "Failed to fetch detectors", "error");
      setDetectors([]);
    }
    setLoading(false);
  };

  const handleEditModal = async (detector) => {
    try {
      const res = await axios.get(
        `https://fireeyes-detector-wokt.onrender.com/gas-detectors/admin/getDetector?macAddress=${detector.macAddress}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*"
          }
        }
      );
      setEditData(res.data);
      setShowEdit(true);
    } catch (err) {
      swal("Error", "Failed to fetch detector data", "error");
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    if (name === "phoneNumbers") {
      setEditData((prev) => ({
        ...prev,
        phoneNumbers: finalValue.split(",").map((num) => num.trim())
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [name]: finalValue
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://fireeyes-detector-wokt.onrender.com/gas-detectors/admin/update/${editData.macAddress}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      swal("Success", "Detector updated successfully", "success");
      setShowEdit(false);
      fetchDetectors();
    } catch (err) {
      console.error(err);
      swal("Error", "Failed to update detector", "error");
    }
  };

  const handleDeleteModal = (detector) => {
    setSelectedDetector(detector);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://fireeyes-detector-wokt.onrender.com/gas-detectors/admin/delete/${selectedDetector.macAddress}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      swal("Success", "Detector deleted", "success");
      setShowDelete(false);
      fetchDetectors();
    } catch (err) {
      console.error(err);
      swal("Error", "Failed to delete detector", "error");
    }
  };

  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setCreateData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleCreate = async () => {
    try {
      await axios.post(
        `https://fireeyes-gwetb3h6fchrb4hm.westeurope-01.azurewebsites.net/gas-detectors/admin/register`,
        createData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      swal("Success", "Detector created successfully", "success");
      setShowCreate(false);
      fetchDetectors();
    } catch (err) {
      console.error(err);
      swal("Error", "Failed to create detector", "error");
    }
  };

  return (
    <Protected>
      <div className="mb-3 text-end">
        <Button variant="dark" title="Add Detector" onClick={() => setShowCreate(true)}>
          <FaPlus />
        </Button>
      </div>

      <ReactBootStrap.Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>MAC Address</th>
            <th>Location</th>
            <th>Status</th>
            <th>Temperature</th>
            <th>Humidity</th>
            <th>Phone Numbers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center">
                <Spinner animation="border" />
              </td>
            </tr>
          ) : (
            detectors.map((detector, index) => (
              <tr className="text-center" key={index}>
                <td>{index + 1}</td>
                <td>{detector.macAddress}</td>
                <td>{detector.location}</td>
                <td>{detector.status ? "Active" : "Inactive"}</td>
                <td>{detector.temperature}</td>
                <td>{detector.humidity}</td>
                <td>{Array.isArray(detector.phoneNumbers) ? detector.phoneNumbers.join(", ") : "N/A"}</td>
                <td>
                  <Button variant="outline-dark" onClick={() => handleEditModal(detector)}>
                    Edit
                  </Button>
                  <Button className="m-2" variant="danger" onClick={() => handleDeleteModal(detector)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </ReactBootStrap.Table>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Detector "{editData.macAddress}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-2">
              <label>Location</label>
              <input type="text" name="location" className="form-control" value={editData.location} onChange={handleEditChange} />
            </div>
            <div className="mb-2">
              <label>Status</label>
              <input type="checkbox" name="status" checked={editData.status} onChange={handleEditChange} />
            </div>
            <div className="mb-2">
              <label>Temperature</label>
              <input type="number" name="temperature" className="form-control" value={editData.temperature} onChange={handleEditChange} />
            </div>
            <div className="mb-2">
              <label>Humidity</label>
              <input type="number" name="humidity" className="form-control" value={editData.humidity} onChange={handleEditChange} />
            </div>
            <div className="mb-2">
              <label>Phone Numbers (comma-separated)</label>
              <input type="text" name="phoneNumbers" className="form-control" value={editData.phoneNumbers.join(", ")} onChange={handleEditChange} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Create Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Register New Detector</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-2">
              <label>MAC Address</label>
              <input type="text" name="macAddress" className="form-control" value={createData.macAddress} onChange={handleCreateChange} />
            </div>
            <div className="mb-2">
              <label>Location</label>
              <input type="text" name="location" className="form-control" value={createData.location} onChange={handleCreateChange} />
            </div>
            <div className="mb-2">
              <label>Status</label>
              <input type="checkbox" name="status" checked={createData.status} onChange={handleCreateChange} />
            </div>
            <div className="mb-2">
              <label>Temperature</label>
              <input type="number" name="temperature" className="form-control" value={createData.temperature} onChange={handleCreateChange} />
            </div>
            <div className="mb-2">
              <label>Humidity</label>
              <input type="number" name="humidity" className="form-control" value={createData.humidity} onChange={handleCreateChange} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button variant="success" onClick={handleCreate}>Register</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Detector "{selectedDetector?.macAddress}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this detector?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
        </Modal.Footer>
      </Modal>
    </Protected>
  );
};

export default DetectorList;
