import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import './RegisterPage.css';
import { useNavigate } from "react-router-dom";
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

  const [loadingSMS, setLoadingSMS] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // === SEND SMS OTP ===
  const handleSendOtp = async () => {
    if (!formData.phonenumber) return alert('Please enter a phone number first.');
    setLoadingSMS(true);
    try {
      await axios.post(
        `https://copper-imprint-479922-p4.uc.r.appspot.com/user/sendOtp/${formData.phonenumber}`
      );
      alert('SMS OTP sent successfully!');
    } catch (error) {
      console.error('Error sending SMS OTP:', error);
      alert('Failed to send SMS OTP.');
    } finally {
      setLoadingSMS(false);
    }
  };

  // === SEND EMAIL OTP ===
  const handleSendEmailOtp = async () => {
    if (!formData.email) return alert('Please enter an email first.');
    setLoadingEmail(true);
    try {
      await axios.post(
        `https://copper-imprint-479922-p4.uc.r.appspot.com/user/sendOtpToEmail/${encodeURIComponent(formData.email)}`
      );
      alert('Email OTP sent successfully!');
    } catch (error) {
      console.error('Error sending Email OTP:', error);
      alert('Failed to send Email OTP.');
    } finally {
      setLoadingEmail(false);
    }
  };

  // === SUBMIT FORM ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      const response = await axios.post(
        'https://copper-imprint-479922-p4.uc.r.appspot.com/user/verifyOtpAndCreateUser',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200 && response.data.includes('User registered successfully')) {
        alert('Registration successful!');
        navigate("/login");
      } else {
        alert('Registration failed: ' + response.data);
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert('Registration failed: ' + (error.response?.data?.message || 'An error occurred'));
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="register-background">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="register-card p-4 shadow-lg">
              <h3 className="text-center text-blue mb-4">Weather Station Registration</h3>
              <Form onSubmit={handleSubmit}>

                {/* Phone Number */}
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Name */}
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

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Password */}
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

                {/* Notification Preference */}
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

                {/* SMS OTP Field + Button */}
                <Form.Group className="mb-2">
                  <Form.Label>SMS Verification Code</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter SMS OTP"
                      required
                    />
                    <Button
                      variant="danger"
                      className="ms-1"
                      onClick={handleSendOtp}
                      disabled={loadingSMS}
                    >
                      {loadingSMS ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        'GetOTP'
                      )}
                    </Button>
                  </div>
                </Form.Group>

                {/* Email OTP Field + Button */}
                <Form.Group className="mb-1">
                  <Form.Label>Email Verification Code</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      name="emailVerificationCode"
                      value={formData.emailVerificationCode}
                      onChange={handleChange}
                      placeholder="Enter Email OTP"
                      required
                    />
                    <Button
                      variant="danger"
                      className="ms-1"
                      onClick={handleSendEmailOtp}
                      disabled={loadingEmail}
                    >
                      {loadingEmail ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        'GetOTP'
                      )}
                    </Button>
                  </div>
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid">
                  <Button type="submit" variant="danger" disabled={loadingSubmit}>
                    {loadingSubmit ? (
                      <>
                        <Spinner animation="border" size="sm" /> Registering...
                      </>
                    ) : (
                      'Submit Registration'
                    )}
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
