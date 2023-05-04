export interface TransferSingle {
  from: string;
  to: string;
  id: {
    hex: string;
    raw: string;
  };
}
