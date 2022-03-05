export enum ErrorCode {
  AuthBasic = "EAuthBasic",
  AuthBearer = "EAuthBearer",
  AuthForbidden = "EAuthForbidden",
  DataInput = "EDataInput",
}

interface ErrorMapping {
  status: number;
  headers?: { [key: string]: string };
}

interface ErrorMap {
  [key: string]: ErrorMapping;
}

export const Errors: ErrorMap = {
  [ErrorCode.AuthBasic]: {
    status: 401,
    headers: { "WWW-Authenticate": "Basic" },
  },
  [ErrorCode.AuthBearer]: {
    status: 401,
    headers: { "WWW-Authenticate": "Bearer" },
  },
  [ErrorCode.AuthForbidden]: {
    status: 403,
  },
  [ErrorCode.DataInput]: {
    status: 422,
  }
};
