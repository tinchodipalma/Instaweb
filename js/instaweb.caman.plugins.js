Caman.Filter.register("edgeDetection", function () {
  // Instead of calling process, we call processKernel.
  // The first argument is an arbitrary name used to 
  // identify the filter. The optional 3rd and 4th arguments
  // are the divisor and bias, respectively.
  this.processKernel("Edge Detection", [
    -1, -1, -1,
    -1, 8, -1,
    -1, -1, -1
  ]);
});

Caman.Filter.register("customMask", function (mask) {
  // Instead of calling process, we call processKernel.
  // The first argument is an arbitrary name used to 
  // identify the filter. The optional 3rd and 4th arguments
  // are the divisor and bias, respectively.
  console.log(mask);
  this.processKernel("Edge Detection", mask);
});