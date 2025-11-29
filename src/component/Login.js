import { useState } from "react";
import { Container, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

const Login = () => {
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ New loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ Start loading

    try {
      const response = await fetch(
        "http://fireeyes-env-1.eba-9rmeyscd.eu-north-1.elasticbeanstalk.com/user/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({ phoneNumber: phonenumber, password }),
        }
      );

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      const token = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("phonenumber", phonenumber);

      const decoded = jwtDecode(token);
      const user = {
        phoneNumber: decoded.phoneNumber,
        name: decoded.name,
        role: decoded.role || "ROLE_USER",
        isVerified: decoded.isVerified || true,
      };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      if (user.role === "ROLE_ADMIN") {
        navigate("/home");
      } else {
        const userResponse = await fetch(
          `http://fireeyes-env-1.eba-9rmeyscd.eu-north-1.elasticbeanstalk.com/user/${phonenumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to retrieve user info.");
        }

        const userDetails = await userResponse.json();

        if (userDetails.macAddress && userDetails.macAddress.length > 0) {
          localStorage.setItem("macAddress", JSON.stringify(userDetails.macAddress));
          navigate("/user/dashboard");
        } else {
          localStorage.setItem("macAddress", JSON.stringify([]));
          navigate("/user/linkdetector");
        }
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Something went wrong during login.");
    } finally {
      setLoading(false); // ✅ Stop loading whether success or fail
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6} lg={5}>
            <div className="login-form-container">
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    value={phonenumber}
                    onChange={(e) => setPhonenumber(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* ✅ Login Button with Spinner */}
                <Button
                  variant="dark"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        role="status"
                        className="me-2"
                      />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <div className="text-center mt-2">
                  New user?{" "}
                  <Button
                    variant="link"
                    onClick={() => navigate("/register")}
                    disabled={loading} // ✅ Prevent click during loading
                  >
                    Register here
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
