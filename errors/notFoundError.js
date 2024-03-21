class NOTFOUND_ERROR extends Error {
  constructor(message) {
    super(message);
    this.name = "NOTFOUND_ERROR";
    this.statusCode = 404;
  }
}

module.exports = NOTFOUND_ERROR;
