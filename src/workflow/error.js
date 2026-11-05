export class WorkflowError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
