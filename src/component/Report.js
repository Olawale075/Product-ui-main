import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Spinner,
  Table,
  Pagination,
} from "react-bootstrap";
import Layout from "./partials/Layout";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { getDeliveryStatus, getSMSTypes, SMS_URL } from "../api/base";
// import DateRanges from '../element/DateRange';


const DeliveryReport = () => {
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [smsTypes, setSMSTypes] = useState(null);
  const [statuses, setStatuses] = useState(null);
  const [values, setValues] = useState({
    smsType: "FUND_TRANSFER",
    deliveryStatus: "PENDING",
  });
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const sms = await getSMSTypes();
        const statuses = await getDeliveryStatus();
        setSMSTypes(sms);
        setStatuses(statuses);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAPI();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleFilter = () => {
    setIsFiltering(true);
    fetch(
      `${SMS_URL}message/delivery-reports?smsType=${values.smsType}&deliveryStatus=${values.deliveryStatus}&page=${page}&size=2`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setIsFiltering(false);
        setData(data.data);
      });
  };
  const handlePrev = () => {
    setPage(page-1)
    handleFilter()
  }
  const handlePagination = pageNum => {
    setPage(pageNum)
    
  }

  return (
    <Layout>
      {loading ? (
        <Spinner animation="grow"></Spinner>
      ) : (
        <Container>
          <h1 className="fw-bolder">Reports</h1>
          <Row style={{ alignItems: 'center' }}>
              <Col>
                <Form.Group className="mb-3">
                <Form.Label>Date Range</Form.Label>
                  {/* <DateRanges /> */}
                  </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>SMS Type</Form.Label>
                <Form.Select name="smsType" onChange={handleChange}>
                  {smsTypes &&
                    smsTypes.map((sms, index) => (
                      <option key={sms.value} value={sms.value}>
                        {sms.value}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Status</Form.Label>
                <Form.Select name="deliveryStatus" onChange={handleChange}>
                  {statuses &&
                    statuses.map((status, index) => (
                      <option key={status.value} value={status.value}>
                        {status.value}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md="2">
              <Button onClick={handleFilter}>
                <FaFilter /> Filter{' '}
                {isFiltering && <Spinner animation="grow" size="sm"></Spinner>}
              </Button>
            </Col>
          </Row>
          {!isFiltering && data && (
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr className="text-center">
                    <th>#</th>
                    <th>SMS Type</th>
                    <th>Delivery Status</th>
                    <th>Mobile</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.content &&
                    data.content.map((item, index) => (
                      <tr className="text-center">
                        <td>{index + 1}</td>
                        <td>{item.smsType}</td>
                        <td>{item.deliveryStatus}</td>
                        <td>{item.mobileNumber}</td>
                        <td>{item.message}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <Pagination>
                <Pagination.First onClick={(e) => handlePagination(0)} />
                <Pagination.Prev
                  onClick={(e) =>
                    handlePagination(data.first ? 0 : (page -= 1))
                  }
                />
                <Pagination.Next
                  onClick={(e) =>
                    handlePagination(data.last ? data.totalPages : (page += 1))
                  }
                />
                <Pagination.Last
                  onClick={(e) => handlePagination(data.totalPages)}
                />
              </Pagination>
            </div>
          )}
        </Container>
      )}
    </Layout>
  );
};

export default DeliveryReport;
