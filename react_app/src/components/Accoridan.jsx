import React from 'react';
import { Accordion } from 'react-bootstrap';
import './Accordion.css'; // Import the CSS file

const ForecastingProcessAccordion = () => {
  return (
    <div className="accordion">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header className="custom-accordion-header">Forecasting Process Sub-Steps</Accordion.Header>
          <Accordion.Body>
            <Accordion>
              <Accordion.Item eventKey="1">
                <Accordion.Header className="custom-accordion-header">Receive Input Data</Accordion.Header>
                <Accordion.Body>
                  Extract JSON Payload: Parse the JSON data from the request.
                  Check for Required Fields: Ensure all necessary fields are present in the input data.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header className="custom-accordion-header">VALIDATE INPUT DATA</Accordion.Header>
                <Accordion.Body>
                  Validate Input Data:
                  Data Type Validation: Check that each field has the correct data type.
                  Range Checks: Ensure numerical values fall within expected ranges.
                  Handle Missing Values: Identify and address any missing data points.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header className="custom-accordion-header">PREPROCESS DATA</Accordion.Header>
                <Accordion.Body>
                  Preprocess Data:
                  Handle Missing Values: Fill in or remove any missing data points.
                  Normalize/Standardize Data: Scale the data to a consistent range or distribution.
                  Feature Engineering: Create new features or modify existing ones to improve model performance.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header className="custom-accordion-header">TRANSFORM DATA</Accordion.Header>
                <Accordion.Body>
                  Transform Data:
                  Categorical Encoding: Convert categorical variables into numerical format.
                  Log Transformations: Apply logarithmic transformations to skewed data.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="5">
                <Accordion.Header className="custom-accordion-header">Prepare Data for Model</Accordion.Header>
                <Accordion.Body>
                  Prepare Data for Model:
                  Reshape Data: Ensure the data shape matches the model's input requirements.
                  Convert to Appropriate Data Structures: Transform data into arrays, tensors, or other structures as needed by the model.
                  Split Data: Divide the data into training, validation, and testing sets.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="6">
                <Accordion.Header className="custom-accordion-header">Perform Forecasting</Accordion.Header>
                <Accordion.Body>
                  Perform Forecasting:
                  Load Model: Load the pre-trained forecasting model.
                  Make Predictions: Use the model to generate forecasts based on the prepared data.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="7">
                <Accordion.Header className="custom-accordion-header">Post-process Forecast Results</Accordion.Header>
                <Accordion.Body>
                  Post-process Forecast Results:
                  Inverse Transformations: Apply inverse transformations if any were applied during preprocessing.
                  Format Results: Structure the forecast results into a JSON-compatible format.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="8">
                <Accordion.Header className="custom-accordion-header">Send Results To Front Side App</Accordion.Header>
                <Accordion.Body>
                  Send Results to Front End:
                  Create Response Object: Create a response object containing the forecast results.
                  Add CORS Headers: Use the add_cors_headers function to add CORS headers to the response.
                  Send Response: Return the response object to the client.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default ForecastingProcessAccordion;