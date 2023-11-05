declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUCTIONS_TABLE_NAME: string;
      MAIL_QUEUE_URL: string;
      FILE_UPLOAD_BUCKET_NAME: string;
    }
  }
}
