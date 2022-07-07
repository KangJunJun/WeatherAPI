export interface ILog {
  title: string;
  apiType: string; // API 종류?
  time: Date;
  success?: boolean; // 성공 여부
  error?: string; // 에러 내용
}

export interface ICallLog {
  route: string;
  time: Date;
  count: number;
}
