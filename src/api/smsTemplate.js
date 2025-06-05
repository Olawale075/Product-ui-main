/** @format */

import axios from 'axios';

const TEMPLATE_API_BASE_URL =
  'http://localhost:8082/api/v1/sms/template/smstype';

class smsTemplate {
  getAllTemplateSmsType() {
    return axios.get(TEMPLATE_API_BASE_URL);
  }

  createEmployee(employee) {
    return axios.post(TEMPLATE_API_BASE_URL, employee);
  }

  getEmployeeById(employeeId) {
    return axios.get(TEMPLATE_API_BASE_URL + '/' + employeeId);
  }

  updateEmployee(employeeId, employee) {
    return axios.put(TEMPLATE_API_BASE_URL + '/' + employeeId, employee);
  }

  deleteEmployee(employeeId) {
    return axios.delete(TEMPLATE_API_BASE_URL + '/' + employeeId);
  }
}

export default new smsTemplate();
