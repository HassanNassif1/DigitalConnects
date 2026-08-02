// swagger.js
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My Express API",
    description: "Automatically generated Swagger doc for all APIs",
    version: "1.0.0",
  },
  host: "localhost:5000", // match your Express port
  schemes: ["http"],
};

const outputFile = "./swagger-output.json"; // generated Swagger file
const endpointsFiles = ["./index.js"]; // your main server file

// Generate Swagger JSON automatically
swaggerAutogen(outputFile, endpointsFiles).then(() => {
  console.log("Swagger documentation generated successfully.");
});
