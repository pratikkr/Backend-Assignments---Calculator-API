const express = require("express");
const Joi = require("joi");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
// your code goes here
app.get("/", (req, res) => {
  res.send("Hello world!");
});

const schema = Joi.object({
  num1: Joi.number().greater(-1000000).less(1000000).required(),
  num2: Joi.number().greater(-1000000).less(1000000).required()
});

const checkError = (errorType) => {
  const response = {
    status: "error",
    message: ""
  };
  if (errorType === "number.base") {
    response.message = "Invalid data types";
    return response;
  }
  if (errorType === "number.less") {
    response.message = "Overflow";
    return response;
  }
  if (errorType === "number.greater") {
    response.message = "Underflow";
    return response;
  }
};

const checkLimitError = (result) => {
  const response = {
    status: "error",
    message: ""
  };
  if (result > 1000000) {
    response.message = "Overflow";
    return response;
  }
  if (result < -1000000) {
    response.message = "Underflow";
    return response;
  }
};
app.post("/add", (req, res) => {
  const validateObj = schema.validate(req.body, { convert: false });
  if (validateObj.error) {
    const errorResponse = checkError(validateObj.error.details[0].type);
    res.send(errorResponse);
    return;
  }
  const num1 = req.body.num1;
  const num2 = req.body.num2;
  const additionResult = num1 + num2;
  if (additionResult > 1000000 || additionResult < -1000000) {
    const limitErrorResponse = checkLimitError(additionResult);
    res.send(limitErrorResponse);
    return;
  }
  const response = {
    status: "success",
    message: "the sum of given two numbers",
    sum: additionResult
  };
  res.send(response);
});

app.post("/sub", (req, res) => {
  const validateObj = schema.validate(req.body, { convert: false });
  if (validateObj.error) {
    const errorResponse = checkError(validateObj.error.details[0].type);
    res.send(errorResponse);
    return;
  }
  const num1 = req.body.num1;
  const num2 = req.body.num2;
  const response = {
    status: "success",
    message: "the difference of given two numbers",
    difference: num1 - num2
  };
  res.send(response);
});

app.post("/multiply", (req, res) => {
  const validateObj = schema.validate(req.body, { convert: false });
  if (validateObj.error) {
    const errorResponse = checkError(validateObj.error.details[0].type);
    res.send(errorResponse);
    return;
  }
  const num1 = req.body.num1;
  const num2 = req.body.num2;
  const product = num1 * num2;
  if (product > 1000000 || product < -1000000) {
    const limitErrorResponse = checkLimitError(product);
    res.send(limitErrorResponse);
    return;
  }
  const response = {
    status: "success",
    message: "The product of given numbers",
    result: product
  };
  res.send(response);
});

app.post("/divide", (req, res) => {
  const validateObj = schema.validate(req.body, { convert: false });
  if (validateObj.error) {
    const errorResponse = checkError(validateObj.error.details[0].type);
    res.send(errorResponse);
    return;
  }
  const num1 = req.body.num1;
  const num2 = req.body.num2;
  if (num2 === 0) {
    const response = {
      status: "error",
      message: "Cannot divide by zero"
    };
    res.send(response);
  }
  const response = {
    status: "success",
    message: "The division of given numbers",
    result: num1 / num2
  };
  res.send(response);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;