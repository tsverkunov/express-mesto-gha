
class DataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400
  }
}
module.exports = DataError

class EmailOrPasswordError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401
  }
}
module.exports = EmailOrPasswordError

class OwnerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403
  }
}
module.exports = OwnerError

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404
  }
}
module.exports = NotFoundError

class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409
  }
}
module.exports = DuplicateError
