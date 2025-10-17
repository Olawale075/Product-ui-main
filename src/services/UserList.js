import Protected from "../component/partials/Protected";
import * as ReactBootStrap from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-bootstrap/Pagination";
import swal from "sweetalert";
import axios from "axios";

const UserList = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [content, setContent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    phoneNumbers: "",
    name: "",
    email: "",
    notificationPreference: "",
    getmacAddress: [],
  });

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchUsers(pageNumber);
  }, [pageNumber]);

  const fetchUsers = async (page = 0) => {
  setLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `https://fireeyes-gwetb3h6fchrb4hm.westeurope-01.azurewebsites.net/user/admin/?page=${page}&size=10&sort=createDateTime&sort=DESC`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUsers(response.data.content);
    setContent(response.data);
    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
    if (error.response?.status === 403) {
      swal("Access Denied", "You are not authorized to view this page", "error");
    }
  }
};

const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditData((prev) => ({ ...prev, [name]: value }));
};

const handleMacChange = (e) => {
  const macs = e.target.value.split(',').map(mac => mac.trim());
  setEditData((prev) => ({ ...prev, getmacAddress: macs }));
};
const handleUpdate = async () => {
  try {
    await axios.put(
      `https://fireeyes-gwetb3h6fchrb4hm.westeurope-01.azurewebsites.net/user/admin/${editData.phoneNumbers}`,
      editData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    swal("Success", "User updated successfully", "success");
    setShowEdit(false);
    fetchUsers(pageNumber);
  } catch (err) {
    console.error(err);
    swal("Error", "Failed to update user", "error");
  }
};

  const handleDeleteModal = (user) => {
    setShowDelete(true);
    setSelectedUser(user);
  };
  const handleEditModal = (user) => {
    setEditData({
      phoneNumbers: user.phoneNumbers,
      name: user.name,
      email: user.email,
      notificationPreference: user.notificationPreference,
      getmacAddress: user.macAddress,
    });
    setShowEdit(true);
  };

  const handleDelete = async () => {
    try {
      // If delete endpoint is supported, replace this with correct API
      await axios.delete(
        `https://fireeyes-gwetb3h6fchrb4hm.westeurope-01.azurewebsites.net/user/admin/delete/${selectedUser.phoneNumbers}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      swal("", "User deleted successfully", "success");
      setShowDelete(false);
      fetchUsers(pageNumber);
    } catch (err) {
      console.error(err);
      swal("Error", "Failed to delete user", "error");
    }
  };

  const handlePagination = (number) => {
    setPageNumber(number);
  };

  return (
    <Protected>
      <div className="mb-3 text-end">
        <Button variant="dark" title="Add User" disabled>
          <FaPlus /> {/* Add functionality as needed */}
        </Button>
      </div>
      <ReactBootStrap.Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Phone</th>
            <th>Name</th>
            <th>Email</th>
            <th>Notification</th>
            <th>MAC Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="7" className="text-center">
                <Spinner animation="border" />
              </td>
            </tr>
          )}
          {!loading &&
            users.map((user, index) => (
              <tr className="text-center" key={index}>
                <td>{index + 1}</td>
                <td>{user.phoneNumbers}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.notificationPreference || "N/A"}</td>
                <td>{user.macAddress.join(", ") || "N/A"}</td>
                <td>
                  <Button
                    variant="outline-dark"
                    onClick={() => handleEditModal(user)}
                  >
                    Edit
                  </Button>

                  <Button
                    className="m-2"
                    variant="danger"
                    onClick={() => handleDeleteModal(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </ReactBootStrap.Table>
      <Pagination>
        {!content?.first && (
          <Pagination.Item onClick={() => handlePagination(pageNumber - 1)}>
            Prev
          </Pagination.Item>
        )}
        <Pagination.Item active>{pageNumber + 1}</Pagination.Item>
        {!content?.last && (
          <Pagination.Item onClick={() => handlePagination(pageNumber + 1)}>
            Next
          </Pagination.Item>
        )}
      </Pagination>
<Modal
  show={showEdit}
  onHide={() => setShowEdit(false)}
  backdrop="static"
  keyboard={false}
>
  <Modal.Header closeButton>
    <Modal.Title>Edit User "{editData.phoneNumbers}"</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form>
      <div className="mb-2">
        <label>Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={editData.name}
          onChange={handleEditChange}
        />
      </div>
      <div className="mb-2">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={editData.email}
          onChange={handleEditChange}
        />
      </div>
      <div className="mb-2">
        <label>Notification Preference</label>
        <input
          type="text"
          name="notificationPreference"
          className="form-control"
          value={editData.notificationPreference}
          onChange={handleEditChange}
        />
      </div>
      <div className="mb-2">
        <label>MAC Addresses (comma-separated)</label>
        <input
          type="text"
          className="form-control"
          value={editData.getmacAddress.join(", ")}
          onChange={handleMacChange}
        />
      </div>
    </form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEdit(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleUpdate}>
      Update
    </Button>
  </Modal.Footer>
</Modal>

      <Modal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete User "{selectedUser?.phoneNumbers}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Protected>
  );
};

export default UserList;
