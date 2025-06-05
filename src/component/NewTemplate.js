import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Badge,
  Modal,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  getFileSeparator,
  getLanguageTypes,
  getSMSTypes,
  getVariables,
  TEMPLATE_URL,
} from "../api/base";
import { useNavigate } from "react-router-dom";
import Protected from "./partials/Protected";
const initialValues = {
  smsType: "FUND_TRANSFER",
  shortName: "",
  sourceFolder: "",
  destinationFolder: "",
  separator: "CARET",
  key: "en",
  template: "",
  templateAgnostic : [],
};

const NewTemplate = () => {
  const [loading, setLoading] = useState(true);
  const [smsTypes, setSMSTypes] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [separators, setSeparators] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [variables, setVariables] = useState(null);
  const [btnActive, setBtnActive] = useState("en");
  const [show, setShow] = useState(false);
  const [wordCount, setWordCount] = useState({count : 0, maxCount : 160, exceeded : 'success'});

  let navigate = useNavigate();
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const sms = await getSMSTypes();
        const languages = await getLanguageTypes();
        const separator = await getFileSeparator();
        const variables = await getVariables();
        setSMSTypes(sms);
        setLanguages(languages);
        setSeparators(separator);
        setVariables(variables.content);
        setLoading(false);
        setValues({
          ...values, templateAgnostic : languages.map((lang) => ({key : lang.value, isActive : lang.value === initialValues.key ? true : false, template:'',})),
        })
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
    
    if(name === 'template'){
      setWordCount({
        ...wordCount, count : value.length, exceeded : value.length > wordCount.maxCount ? 'danger' : 'success'})
      
    }
    if (name === 'key'){
      const newValues = values.templateAgnostic.map(temp => {
        if (temp.key === btnActive){
          return {...temp, template : values.template}
        }
        return temp
      });
      setBtnActive(value)
      setValues({
        ...values, templateAgnostic : newValues, template : values.templateAgnostic.find(temp => temp.key === value).template
      })  
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTempAgnostic = values.templateAgnostic.map(obj => {
      if (btnActive === obj.key){
        obj.isActive = true 
        obj.template = values.template
      }else{
        obj.isActive = false
      }
      
      return obj
    })
    const data = {
        ...values,
        templateAgnostic: newTempAgnostic
    };
    delete data.key;
    delete data.template;
    console.log(data)
    fetch(`${TEMPLATE_URL}/`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin": "*",
        accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 201) {
          setShow(true);
          setTimeout(() => {
            navigate("/templates");
          }, 2000);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleShow = (e) => {
    setShow(true);
  };
  const handleClose = () => setShow(false);
  const handleVariableClick = e => {
    const newValue = values.template + ' ' + e
    setValues({
      ...values,
      template: newValue,
    });
    setWordCount({...wordCount, count : newValue.length, exceeded : newValue.length > 160 ? 'danger' : 'success'})
  }
  return (
    <Protected>
      {loading ? (
        <Spinner animation="grow" className="m-3" />
      ) : (
        <Container>
          <h3 className="fw-bolder">New Template</h3>
          <Container>
            <Form onSubmit={handleSubmit}>
              <Row>
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
                    <Form.Label>Short Name</Form.Label>
                    <Form.Control
                      name="shortName"
                      onChange={handleChange}
                      value={values.shortName}
                    />
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="mb-3 border rounded p-2">
                    <div className="my-2 d-flex justify-content-between">
                      <div>
                      {languages &&
                        languages.map((lang) => (
                          <Button
                            size="sm"
                            variant={
                              btnActive === lang.value ? "dark" : "primary"
                            }
                            className="mx-1"
                            value={lang.value}
                            name="key"
                            onClick={handleChange}
                            key={lang.value}
                          >
                            {lang.description}
                          </Button>
                        ))}
                      </div>
                        <div className=''>
                          <span className={`text text-${wordCount.exceeded}`}>{wordCount.count}</span>/160
                        </div>
                    </div>

                    <Form.Control
                      as="textarea"
                      rows={5}
                      className="border-0"
                      onChange={handleChange}
                      name="template"
                      value={values.template}
                      placeholder="Message"
                      maxLength={wordCount.maxCount}
                    />
                    <div>
                      <small className="fw-bold">
                        Below are the Available Variable Names
                      </small>
                      <br />
                      {variables &&
                        variables.map((variable) => (
                          <Badge
                            bg="secondary"
                            className="mx-1 variable__btn"
                            key={variable.id}
                            onClick={() => handleVariableClick(`{{${variable.actionName}}}`)}
                          >
                            {`{{${variable.actionName}}}`}
                          </Badge>
                        ))}
                    </div>
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>File Separator</Form.Label>
                    <Form.Select name="separator" onChange={handleChange}>
                      {separators &&
                        separators.map((separator) => (
                          <option key={separator.value} value={separator.value}>
                            {separator.value}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Source Folder</Form.Label>
                    <Form.Control
                      value={values.sourceFolder}
                      type="text"
                      name="sourceFolder"
                      placeholder="path/to/folder"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Destination Folder</Form.Label>
                    <Form.Control
                      value={values.destinationFolder}
                      type="text"
                      name="destinationFolder"
                      placeholder="path/to/folder"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="dark" type="submit" disabled={wordCount.count > wordCount.maxCount ? true : false}>
                Submit
              </Button>
            </Form>
          </Container>
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>Message Template Created Successfully</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )}
    </Protected>
  );
};

export default NewTemplate;
