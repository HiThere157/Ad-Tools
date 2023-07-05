type ApiResult<T> = null | {
  data?: T;
  error?: string;
};

type PSResult = {
  [key: string]: any;
}[];
