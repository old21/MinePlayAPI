enum API_STATUS_CODES {
  OK = 2000,
  WARNING = 3000,
}

export class Response {
  static success() {
    return {
      status: API_STATUS_CODES.OK,
    };
  }
  static data(data) {
    return {
      status: API_STATUS_CODES.OK,
      data: data,
    };
  }
}
