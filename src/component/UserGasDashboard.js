import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Form,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Protected from "./partials/Protected";
import "./UserGasDashboard.css"; // ✅ custom styles

// --------------------------------------------
// 🌤️ Weather Prediction using Temperature & Humidity
// --------------------------------------------
const predictWeather = (temp, humidity) => {
  if (temp === null || humidity === null) return "Unknown";

  if (temp >= 28 && humidity < 50) return "Sunny ☀️";
  if (temp >= 25 && humidity >= 50 && humidity <= 70) return "Partly Cloudy 🌤️";
  if (temp < 25 && humidity > 70) return "Rainy 🌧️";
  if (temp < 20 && humidity > 80) return "Humid / Foggy 🌫️";
  if (temp >= 32 && humidity > 70) return "Hot & Humid 🌡️";

  return "Mild / Stable Weather 🌥️";
};

function UserGasDashboard() {
  // --------------------------------------------
  // 🧠 State Variables
  // --------------------------------------------
  const [data, setData] = useState(null);
  const [macList, setMacList] = useState([]);
  const [selectedMac, setSelectedMac] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const phoneNumber = localStorage.getItem("phonenumber");

  // --------------------------------------------
  // 📦 Load stored MAC addresses from localStorage
  // --------------------------------------------
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("macAddresses") || "[]");
    if (stored.length > 0) {
      setMacList(stored);
      setSelectedMac(stored[stored.length - 1]);
    } else {
      const fallbackMac = localStorage.getItem("macAddress");
      if (fallbackMac) {
        setMacList([fallbackMac]);
        setSelectedMac(fallbackMac);
      }
    }
  }, []);

  // --------------------------------------------
  // 🌐 Fetch Gas Detector Data from API
  // --------------------------------------------
  const fetchDetectorData = () => {
    if (!token || !selectedMac || !phoneNumber) {
      setError("Missing credentials or MAC address.");
      setLoading(false);
      return;
    }

    setRefreshing(true);
    const apiUrl = `https://copper-imprint-479922-p4.uc.r.appspot.com/user/user-gas-details?phoneNumber=${phoneNumber}&macAddress=${encodeURIComponent(
      selectedMac
    )}`;

    fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed with status " + res.status);
        return res.json();
      })
      .then((json) => {
        setData(json);
        localStorage.setItem("name", json.user.name);
        setChartData((prev) => [
          ...prev.slice(-9),
          {
            time: new Date().toLocaleTimeString(),
            temp: json.gasDetector.temperature,
            co2: json.gasDetector.co2 ,
          },
        ]);
        setToastMessage("Data refreshed");
        setToastVisible(true);
        setError(null);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setToastMessage("Failed to fetch: " + err.message);
        setToastVisible(true);
        setError("Failed to fetch data: " + err.message);
        setLoading(false);
        setRefreshing(false);
      });
  };

  // Auto-refresh every 5s
  useEffect(() => {
    if (!selectedMac) return;
    fetchDetectorData();
    const interval = setInterval(fetchDetectorData, 5000);
    return () => clearInterval(interval);
  }, [selectedMac]);

  // --------------------------------------------
  // 🗑️ Delete a MAC Address
  // --------------------------------------------
  const handleDelete = (mac) => {
    const updatedList = macList.filter((item) => item !== mac);
    setMacList(updatedList);
    localStorage.setItem("macAddresses", JSON.stringify(updatedList));

    if (mac === selectedMac && updatedList.length > 0) {
      setSelectedMac(updatedList[0]);
    } else if (updatedList.length === 0) {
      setSelectedMac("");
      setData(null);
    }
  };

  // --------------------------------------------
  // 📤 Export current reading as CSV
  // --------------------------------------------
  const exportCSV = () => {
    if (!data) return;
    const headers = [
      "MAC Address",
      "Location",
      "Status",
      "Temperature",
      "Humidity",
      "CO2",
    ];
    const values = [
      data.gasDetector.macAddress,
      data.gasDetector.location,
      data.gasDetector.status ? "call for Alarm" : "No call for Alarm",
      data.gasDetector.temperature ?? "N/A",
      data.gasDetector.humidity ?? "N/A",
      data.gasDetector.co2 ?? "N/A",
    ];
    const csvContent = `${headers.join(",")}\n${values.join(",")}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "gas-detector-log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --------------------------------------------
  // 🖥️ UI Rendering
  // --------------------------------------------
  return (
    <Protected>
      <Container fluid className="user-dashboard-container py-4">
        <Row>
          <Col xs={12}>
            <h2 className="mb-3 text-center text-md-start">User & Detector Details</h2>
          </Col>
        </Row>

        {/* MAC selection */}
        <Row>
          <Col xs={12} className="mb-4">
            <Form.Group controlId="macDropdown">
              <Form.Label>Select MAC Address</Form.Label>
              <Form.Select
                value={selectedMac}
                onChange={(e) => setSelectedMac(e.target.value)}
              >
                {macList.map((mac, index) => (
                  <option key={index} value={mac}>
                    {mac}
                  </option>
                ))}
              </Form.Select>

              {macList.length > 0 && (
                <div className="mt-3 d-flex flex-wrap gap-2">
                  <Button variant="danger" onClick={() => handleDelete(selectedMac)}>
                    Remove MAC
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={fetchDetectorData}
                    disabled={refreshing}
                  >
                    {refreshing ? "Refreshing..." : "Refresh Now"}
                  </Button>
                  <Button variant="success" onClick={exportCSV}>
                    Export CSV
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* Main Content */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : data ? (
          <>
            <Row className="g-4">
              {/* Gas Detector Info */}
              <Col xs={12} md={6}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-success text-white">Weather Detector</Card.Header>
                  <Card.Body>
                    <p><strong>MAC Address:</strong> {data.gasDetector.macAddress}</p>
                    <p><strong>Location:</strong> {data.gasDetector.location}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          data.gasDetector.status ? "text-danger" : "text-success"
                        }
                      >
                        {data.gasDetector.status ? "call for Alarm" : "No call for Alarm"}
                      </span>
                    </p>
                    <p>
                      <strong>Temperature:</strong>{" "}
                      <span
                        className={
                          data.gasDetector.temperature > 50 ? "text-danger" : "text-body"
                        }
                      >
                        {data.gasDetector.temperature ?? "N/A"} °C
                      </span>
                    </p>
                    <p><strong>Humidity:</strong> {data.gasDetector.humidity ?? "N/A"} %</p>
                    <p><strong>CO2:</strong> {data.gasDetector.co2 ?? "N/A"}</p>

                    {/* 🌤️ Weather Prediction */}
                    <p>
                      <strong>Predicted Weather:</strong>{" "}
                      <span className="text-info">
                        {predictWeather(
                          data.gasDetector.temperature,
                          data.gasDetector.humidity
                        )}
                      </span>
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              {/* User Info */}
              <Col xs={12} md={6}>
                <Card className="shadow-sm h-100">
                  <Card.Header className="bg-primary text-white">User Info</Card.Header>
                  <Card.Body>
                    <p><strong>Name:</strong> {data.user.name}</p>
                    <p><strong>Email:</strong> {data.user.email}</p>
                    <p><strong>Phone:</strong> {data.user.phoneNumbers}</p>
                    <p><strong>Notification:</strong> {data.user.notificationPreference}</p>
                    <p><strong>MAC Addresses:</strong> {data.user.macAddress.join(", ")}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Live Chart */}
            <Row className="mt-4">
              <Col xs={12}>
                <Card className="shadow-sm">
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
          <p className="text-muted text-center">No data to display yet.</p>
        )}

        {/* Toast Notification */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            show={toastVisible}
            onClose={() => setToastVisible(false)}
            delay={3000}
            autohide
            bg="info"
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </Protected>
  );
}

export default UserGasDashboard;
