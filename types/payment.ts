export interface CreateTransactionRequest {
  productId: number;
  quantity: number;
}

export interface CreateTransactionResponse {
  orderId: string;
  snapToken?: string;     // kalau pakai Midtrans Snap
   snapRedirect?: string; // ✅ tambahkan properti ini
  redirectUrl?: string;   // kalau pakai gateway lain
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
}

export interface PaymentNotification {
  orderId: string;
  transactionStatus: "capture" | "settlement" | "pending" | "deny" | "cancel" | "expire";
  paymentType: string;
  fraudStatus?: string;
  grossAmount: string;
}
