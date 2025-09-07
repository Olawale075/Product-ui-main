import React, { Component } from 'react';
import './LinkDetector.css';
import { useNavigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

class LinkDetector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      macAddress: '',
      responseMessage: '',
      isError: false,
      loading: false,
    };
  }

  handleChange = (e) => {
    this.setState({ macAddress: e.target.value });
  };

  validateMacAddress = (mac) => {
    const macRegex = /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const phonenumber = localStorage.getItem("phonenumber");
    const { macAddress } = this.state;
    const { navigate } = this.props;

    if (!token || !phonenumber) {
      this.setState({ responseMessage: 'Missing token or phone number. Please log in again.', isError: true });
      return;
    }

    if (!this.validateMacAddress(macAddress)) {
      this.setState({ responseMessage: 'Invalid MAC address format. Expected XX:XX:XX:XX:XX:XX', isError: true });
      return;
    }

    // Check for duplicates
    let savedMacs = JSON.parse(localStorage.getItem("macAddresses") || "[]");
    // if (savedMacs.includes(macAddress)) {
    //   this.setState({ responseMessage: 'This MAC address is already linked.', isError: true });
    //  // return;
    //  navigate("/user-gas-dashboard");
    // }

    const url = `https://fireeyes-detector-wokt.onrender.com/gas-detectors/user/assign?phonenumber=${encodeURIComponent(phonenumber)}&macAddress=${encodeURIComponent(macAddress)}`;
    
    this.setState({ loading: true });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        }
      });

      const text = await response.text();

      if (response.ok) {
        // Save MAC address to list
        savedMacs.push(macAddress);
        localStorage.setItem("macAddresses", JSON.stringify(savedMacs));

        this.setState({ responseMessage: text, isError: false, loading: false }, () => {
          setTimeout(() => {
            navigate("/user/dashboard");
          }, 1500);
        });
      } else {
        this.setState({ responseMessage: text, isError: true, loading: false });
      }
    } catch (error) {
      this.setState({
        responseMessage: 'Network error. Please try again.',
        isError: true,
        loading: false
      });
    }
  };

  render() {
    const { macAddress, responseMessage, isError, loading } = this.state;

    return (
      <div className="link-detector-page">
        <div className="card link-detector-card">
          <h2>Link Your Gas Detector</h2>

          <form onSubmit={this.handleSubmit}>
            <div className="mb-3">
              <label className="form-label">MAC Address *</label>
              <input
                type="text"
                className="form-control"
                name="macAddress"
                value={macAddress}
                onChange={this.handleChange}
                placeholder="e.g. 8C:4F:00:3C:A4:AC"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Link Detector"}
            </button>
          </form>

          {responseMessage && (
            <div className={`alert mt-3 ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
              {responseMessage}
            </div>
          )}
        </div>
      </div>
    );
  }
}

// Functional wrapper for navigation
function LinkDetectorWithNavigation() {
  const navigate = useNavigate();
  return <LinkDetector navigate={navigate} />;
}

export default LinkDetectorWithNavigation;
