import Protected from "./partials/Protected";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner, Badge, Modal } from "react-bootstrap";
import {
  getFileSeparator,
  getLanguageTypes,
  getSMSTypes,
  getTemplate,
  getVariables,
  TEMPLATE_URL,
} from "../api/base";


const Template = () => {
  const { id } = useParams("id");
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);
  const [smsTypes, setSMSTypes] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [separators, setSeparators] = useState(null);
  const [values, setValues] = useState(null);
  const [variables, setVariables] = useState(null);
  const [btnActive, setBtnActive] = useState(null);
  const [show, setShow] = useState(false);
  const [wordCount, setWordCount] = useState({count : 0, maxCount : 160, exceeded : 'success'});
  let navigate = useNavigate();

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const template = await getTemplate(id);
        const sms = await getSMSTypes();
        const languages = await getLanguageTypes();
        const separator = await getFileSeparator();
        const variables = await getVariables();
        const activeTemplate = template.templateAgnostic.find(temp => temp.isActive === true)
        const initialValues = {
            smsType: template.smsType,
            shortName: template.shortName,
            sourceFolder: template.sourceFolder,
            destinationFolder: template.destinationFolder,
            separator: template.separator,
            key: activeTemplate.key,
            templateAgnostic : template.templateAgnostic,
            template: activeTemplate.template,
        };
        setSMSTypes(sms);
        setLanguages(languages);
        setSeparators(separator);
        setVariables(variables.content);
        setTemplate(template);
        setBtnActive(activeTemplate.key)
        setValues(initialValues)
        setLoading(false);
        setWordCount({...wordCount, count : initialValues.template.length, exceeded : 'success'})
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
    if (e.type === "click") {
      setBtnActive(value);
    }
    if(name === 'template'){
      setWordCount({
        ...wordCount, count : value.length, exceeded : value.length > wordCount.maxCount ? 'danger' : 'success'})
      
    }
    if (name === 'key'){
      const temp = {key : value, isActive : false, template : ''}
      if (!values.templateAgnostic.find(temp => temp.key === value)){
        const agnostic = [temp, ...values.templateAgnostic]
        setValues({
          ...values, templateAgnostic : agnostic, template : temp.template
        })

      }else{
        setValues({ ...values, template : values.templateAgnostic.find(temp => temp.key === value).template})
      }
      
    }
  };
  const handleSubmit = e => {
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
    console.log(JSON.stringify(data))
    fetch(`${TEMPLATE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Access-Control-Allow-Origin": "*",
          accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
          if (data.status === 200) {
            setShow(true);
            setTimeout(() => {
              navigate("/templates");
            }, 2000);
          }
        })
        .catch((err) => console.log(err));
  }
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
      <Container>
        {loading && <Spinner animation="grow" className="m-3" />}
        {template && (
          <h3 className="fw-bolder">Edit Template {values.shortName}</h3>
        )}
        <Container>
          {template && (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>SMS Type</Form.Label>
                    <Form.Select name="smsType" onChange={handleChange} defaultValue={values.smsType}>
                      {smsTypes &&
                        smsTypes.map((sms) => (
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
                      maxLength={160}
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
                            className="mx-1"
                            key={variable.id}
                            style={{cursor : 'pointer'}}
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
                    <Form.Select name="separator" onChange={handleChange} defaultValue={values.separator}>
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
                Edit
              </Button>
            </Form>
          )}
        </Container>
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
        <Modal.Body>Message Template Updated Successfully</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
        </Modal.Footer>
    </Modal>
    </Protected>
  );
};

export default Template;
