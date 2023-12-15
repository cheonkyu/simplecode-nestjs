export interface Response<T> {
    status: {
      message ?: string,
      code : string
    };
    page ?: number
    pageSize ?: number
    data: T;
}