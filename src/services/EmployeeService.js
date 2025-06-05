import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api/v1/product';

class EmployeeService{
    getAllImages() {
        return axios.get(BASE_URL);
    }

    uploadImage(fileFormData){
        return axios.post(BASE_URL+'/upload', fileFormData);
    }
    getEmployeeById(id){
        return axios.get(BASE_URL + '/' + id);
    }

    updateEmployee(employeeId, employee){
        return axios.put(BASE_URL + '/' +employeeId, employee);
    }

    deleteEmployee(id){
        return axios.delete(BASE_URL + '/' + id);
    }
}

export default new EmployeeService();