export type AggregatedReport = {
  range: string;
  requests: number;
  delivered: number;
  hardBounces: number;
  softBounces: number;
  clicks: number;
  uniqueClicks: number;
  opens: number;
  uniqueOpens: number;
  spamReports: number;
  blocked: number;
  invalid: number;
  unsubscribed: number;
};
