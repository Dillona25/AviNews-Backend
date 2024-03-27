class UNAUTHORIZED_ERROR extends Error {
  constructor(message) {
    super(message);
    this.name = "UNAUTHORIZED_ERROR";
    this.statusCode = 401;
  }
}

module.exports = UNAUTHORIZED_ERROR;
