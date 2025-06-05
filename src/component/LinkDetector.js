import React, { Component } from 'react';

class LinkDetector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      macAddress: '',
      responseMessage: '',
      isError: false,
    };
  }

  handleChange = (e) => {
    this.setState({ macAddress: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const phonenumber = localStorage.getItem("phonenumber");
    const { macAddress } = this.state;

    if (!token || !phonenumber) {
      this.setState({ responseMessage: 'Missing token or phone number. Please log in again.', isError: true });
      return;
    }

    const url = `https://fireeyes-detector-wokt.onrender.com/gas-detectors/admin/assign?phonenumber=${encodeURIComponent(phonenumber)}&macAddress=${encodeURIComponent(macAddress)}`;

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
        this.setState({ responseMessage: text, isError: false }, () => {
          setTimeout(() => {
            window.location.href = 'https://fire-detecter-registeration-portal.vercel.app/home';
          }, 1500);
        });
      } else {
        this.setState({ responseMessage: text, isError: true });
      }
    } catch (error) {
      this.setState({
        responseMessage: 'Network error. Please try again.',
        isError: true
      });
    }
  };

  render() {
    const { macAddress, responseMessage, isError } = this.state;

    return (
      <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
          <h2 className="text-center mb-4">Link Your Gas Detector</h2>

          <form onSubmit={this.handleSubmit}>
            <div className="mb-3">
              <label className="form-label">MAC Address *</label>
              <input
                type="text"
                className="form-control"
                name="macAddress"
                value={macAddress}
                onChange={this.handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Link Detector
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

export default LinkDetector;
