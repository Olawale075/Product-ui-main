import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import './RegisterPage.css'; // We’ll create this file below

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    phonenumber: '',
    name: '',
    email: '',
    password: '',
    notificationPreference: 'SMS',
    otp: '',
    emailVerificationCode: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(`https://fireeyes-detector-wokt.onrender.com/user/sendOtp/${formData.phonenumber}`);
      setOtpSent(true);
      alert('SMS OTP sent successfully!');
    } catch (error) {
      console.error('Error sending SMS OTP:', error);
      alert('Failed to send SMS OTP.');
    }
  };

  const handleSendEmailOtp = async () => {
    try {
      await axios.post(`https://fireeyes-detector-wokt.onrender.com/user/sendOtpToEmail/${encodeURIComponent(formData.email)}`);
      setEmailOtpSent(true);
      alert('Email OTP sent successfully!');
    } catch (error) {
      console.error('Error sending Email OTP:', error);
      alert('Failed to send Email OTP.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://fireeyes-detector-wokt.onrender.com/user/verifyOtpAndCreateUser',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 && response.data.includes('User registered successfully')) {
        alert('Registration successful!');
      } else {
        alert('Registration failed: ' + response.data);
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert('Registration failed: ' + (error.response?.data?.message || 'An error occurred'));
    }
  };

  return (
    <div className="register-background">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="register-card p-4 shadow-lg">
              <h3 className="text-center text-danger mb-4">🔥 Fire Detector Registration</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      variant="danger"
                      className="ms-2"
                      onClick={handleSendOtp}
                      disabled={!formData.phonenumber}
                    >
                      Get OTP
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                      <Button
                      variant="danger"
                      className="ms-2"
                      onClick={handleSendEmailOtp}
                      disabled={!formData.email}
                    >
                      Get Email OTP
                    </Button>
                      
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notification Preference</Form.Label>
                  <Form.Select
                    name="notificationPreference"
                    value={formData.notificationPreference}
                    onChange={handleChange}
                  >
                    <option value="SMS">SMS</option>
                    <option value="EMAIL">EMAIL</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>SMS OTP</Form.Label>
                  <Form.Control
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                  
                  
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email OTP</Form.Label>
                  <Form.Control
                    type="text"
                    name="emailVerificationCode"
                    value={formData.emailVerificationCode}
                    onChange={handleChange}
                    required
                  />
            
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="danger">
                    Submit Registration
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
