import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Row, Col, Card, Spinner, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Protected from './partials/Protected';

function UserGasDashboard() {
  const [data, setData] = useState(null);
  const [macList, setMacList] = useState([]);
  const [selectedMac, setSelectedMac] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [chartData, setChartData] = useState([]);


  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const phoneNumber = localStorage.getItem('phonenumber');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('macAddresses') || '[]');
    if (stored.length > 0) {
      setMacList(stored);
      setSelectedMac(stored[stored.length - 1]);
    } else {
      const fallbackMac = localStorage.getItem('macAddress');
      if (fallbackMac) {
        setMacList([fallbackMac]);
        setSelectedMac(fallbackMac);
      }
    }
  }, []);

const fetchDetectorData = () => {
  if (!token || !selectedMac || !phoneNumber) {
    setError("Missing credentials or MAC address.");
    setLoading(false);
    return;
  }

  setRefreshing(true);
  const apiUrl = `https://fireeyes-detector-wokt.onrender.com/user/user-gas-details?phoneNumber=${phoneNumber}&macAddress=${encodeURIComponent(selectedMac)}`;

  fetch(apiUrl, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      return res.json();
    })
    .then(json => {
      setData(json);
      localStorage.setItem('name', json.user.name); // ✅ Save name to localStorage
      setChartData(prev => [...prev.slice(-9), {
        time: new Date().toLocaleTimeString(),
        temp: json.gasDetector.temperature,
        co2: json.gasDetector.co2 || 0
      }]);
      setToastMessage("Data refreshed");
      setToastVisible(true);
      setError(null);
      setLoading(false);
      setRefreshing(false);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setToastMessage("Failed to fetch: " + err.message);
      setToastVisible(true);
      setError("Failed to fetch data: " + err.message);
      setLoading(false);
      setRefreshing(false);
    });
};
useEffect(() => {
  const storedMacs = JSON.parse(localStorage.getItem("macAddress")) || [];
  setMacList(storedMacs);
  if (storedMacs.length > 0) {
    setSelectedMac(storedMacs[0]); // Default to the first MAC address
  }
}, []);


  useEffect(() => {
    fetchDetectorData();
    const interval = setInterval(fetchDetectorData, 30000);
    return () => clearInterval(interval);
  }, [selectedMac]);

  const handleDelete = (mac) => {
    const updatedList = macList.filter(item => item !== mac);
    setMacList(updatedList);
    localStorage.setItem('macAddresses', JSON.stringify(updatedList));
    if (mac === selectedMac && updatedList.length > 0) {
      setSelectedMac(updatedList[0]);
    } else if (updatedList.length === 0) {
      setSelectedMac('');
      setData(null);
    }
  };

  const exportCSV = () => {
    if (!data) return;
    const headers = ['MAC Address', 'Location', 'Status', 'Temperature', 'Humidity', 'CO2'];
    const values = [
      data.gasDetector.macAddress,
      data.gasDetector.location,
      data.gasDetector.status ? 'Active' : 'Inactive',
      data.gasDetector.temperature ?? 'N/A',
      data.gasDetector.humidity ?? 'N/A',
      data.gasDetector.co2 ?? 'N/A'
    ];
    const csvContent = `${headers.join(',')}\n${values.join(',')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gas-detector-log.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
       <Protected>
     

      <Container fluid>
        <Row>
         

          <Col md={10} className="p-4">
            <h2 className="mb-3">User & Detector Details</h2>

            <Form.Group className="mb-4" controlId="macDropdown">
              <Form.Label>Select MAC Address</Form.Label>
              <Form.Select value={selectedMac} onChange={(e) => setSelectedMac(e.target.value)}>
    {macList.map((mac, index) => (
      <option key={index} value={mac}>
        {mac}
      </option>
    ))}
  </Form.Select>

              {macList.length > 0 && (
                <div className="mt-2 d-flex gap-2">
                  <Button variant="danger" onClick={() => handleDelete(selectedMac)}>Remove MAC</Button>
                  <Button variant="secondary" onClick={fetchDetectorData} disabled={refreshing}>
                    {refreshing ? 'Refreshing...' : 'Refresh Now'}
                  </Button>
                  <Button variant="success" onClick={exportCSV}>Export CSV</Button>
                </div>
              )}
            </Form.Group>

            {loading ? (
              <Spinner animation="border" />
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : data ? (
              <>
                <Row className="g-4">
                  <Col md={6}>
                    <Card className="shadow">
                      <Card.Header className="bg-primary text-white">User Info</Card.Header>
                      <Card.Body>
                        <p><strong>Name:</strong> {data.user.name}</p>
                        <p><strong>Email:</strong> {data.user.email}</p>
                        <p><strong>Phone:</strong> {data.user.phoneNumbers}</p>
                        <p><strong>Notification:</strong> {data.user.notificationPreference}</p>
                        <p><strong>MAC Addresses:</strong> {data.user.macAddress.join(', ')}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="shadow">
                      <Card.Header className="bg-success text-white">Gas Detector</Card.Header>
                      <Card.Body>
                        <p><strong>MAC Address:</strong> {data.gasDetector.macAddress}</p>
                        <p><strong>Location:</strong> {data.gasDetector.location}</p>
                        <p><strong>Status:</strong> <span className={data.gasDetector.status ? 'text-success' : 'text-danger'}>{data.gasDetector.status ? 'Active' : 'Inactive'}</span></p>
                        <p><strong>Temperature:</strong> <span className={data.gasDetector.temperature > 50 ? 'text-danger' : 'text-body'}>{data.gasDetector.temperature ?? 'N/A'} °C</span></p>
                        <p><strong>Humidity:</strong> {data.gasDetector.humidity ?? 'N/A'} %</p>
                        <p><strong>CO2:</strong> {data.gasDetector.co2 ?? 'N/A'}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col>
                    <Card>
                      <Card.Header>Live Temperature & CO2 Chart</Card.Header>
                      <Card.Body>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData}>
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                            <Line type="monotone" dataKey="temp" stroke="#8884d8" name="Temperature" />
                            <Line type="monotone" dataKey="co2" stroke="#82ca9d" name="CO2" />
                          </LineChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              <p className="text-muted">No data to display yet.</p>
            )}
          </Col>
        </Row>
      </Container>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={toastVisible} onClose={() => setToastVisible(false)} delay={3000} autohide bg="info">
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>


</Protected>
  );
}

export default UserGasDashboard;
