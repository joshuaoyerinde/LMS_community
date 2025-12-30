export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export function sendSuccess<T>(res: any, data: T, message = 'Success', status = 200) {
  res.status(status).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
}

export function sendError(res: any, message = 'Error', status = 500, data?: any) {
  res.status(status).json({
    success: false,
    message,
    data,
  } as ApiResponse);
}
