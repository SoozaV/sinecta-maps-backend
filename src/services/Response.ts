export default class Response {
  status: boolean;
  message: any;
  data: any;
  constructor() {
    (this.status = true), (this.message = {}), (this.data = {});
  }

  setStatus(status: boolean) {
    this.status = status;
  }

  setMessage(message: any) {
    this.message = message;
  }

  setData(data: any) {
    this.data = data;
  }
}
