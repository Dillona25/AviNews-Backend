class SERVER_ERROR extends Error {
  constructor(message) {
    super(message);
    this.name = "DEFAULT_ERROR";
    this.statusCode = 500;
  }
}

module.exports = SERVER_ERROR;
