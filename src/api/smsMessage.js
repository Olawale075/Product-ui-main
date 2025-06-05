/** @format */

import axios from 'axios';

const MESSAGE_API_BASE_URL =
  'http://localhost:8082/api/v1/sms/message/template/status';

const STATUS_API_BASE_URL =
  'http://localhost:8082/api/v1/sms/message/status?deliveryStatus=PENDING&page=0&size=3';

class smsMessage {
  getAllTemplateStatus() {
    return axios.get(MESSAGE_API_BASE_URL);
  }

  getAllStatus() {
    return axios.get(STATUS_API_BASE_URL);
  }

  getEmployeeById(employeeId) {
    return axios.get(MESSAGE_API_BASE_URL + '/' + employeeId);
  }

  updateEmployee(employeeId, employee) {
    return axios.put(MESSAGE_API_BASE_URL + '/' + employeeId, employee);
  }

  deleteEmployee(employeeId) {
    return axios.delete(MESSAGE_API_BASE_URL + '/' + employeeId);
  }
}

export default new smsMessage();
