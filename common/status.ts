export enum CommonStatusCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  OK = 200,
  CREATE = 201,
  BAD_REQUEST = 400,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum CommonStatusMessage {
  UNAUTHORIZED = "UNAUTHORIZED", // 인증 실패
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND", // 리소스 및 데이터 없음
  OK = "OK", // 정상 처리
  CREATE = "CREATE",
  BAD_REQUEST = "BAD_REQUEST", // 잘못된 요청
  CONFLICT = "CONFLICT", // 리소스 및 데이터 중복
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR", // 기타 예외 처리
}

export enum ErrorStatusMessage {
  IS_NOT_CONNECTED_REDIS = "The connection with Redis is currently not established.",
  IS_EMPTY_EVENT_QUEUE = "Event Queue is Empty",
  IS_EMPTY_COLLECTION = "Collection is Empty",
  IS_EMPTY_DOCUMENT = "Document is Empty",
  IS_NULL_DOMAIN = "Domain is Empty",
  IS_NULL_REPOSITORY = "Repository is Empty",
  VALIDATE_DTO_ERROR = "DTO Validate Error",
}
