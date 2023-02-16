/* eslint-disable prettier/prettier */
import type { icons } from '@/utils/data';

export type StatCardType = {
  title: string;
  icon: keyof typeof icons;
  value: string;
  diff: number;
};

export type StatItemType = {
  label: string;
  stats: string;
  progress: number;
  color: string;
  icon: 'up' | 'down';
};

export type StatsRingProps = {
  data: StatItemType[];
};

export type NavLinkItemType = {
  label: string;
  link: string;
};

export type NavLinkType = {
  label: string;
  icon: any;
  link?: string;
  initiallyOpened?: boolean;
  links?: NavLinkItemType[];
};

export type OrderRowType = {
  orderId: string;
  user: string;
  paymentMode: 'cod' | 'online';
  paymentId?: string;
  orderAmount: number;
  orderCurrency: 'INR';
  orderStatus: 'pending' | 'processing' | 'dispached' | 'arrived' | 'failed';
};

export type StudentRowType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  batch: string;
  mailStatus: 'sent' | 'standby' | 'error';
};

export type LoginCredentialsType = {
  email: string;
  password: string;
  username?: string;
  confirmPassword?: string;
}

/**
  * Transactional email status
 * Sent: the transactional email has been sent to the recipient
 * Delivered: the transactional email has been successfully delivered to the recipient
 * First opening: the recipient opened the transactional email for the first time
 * Opened: the recipient opened the transactional email
 * Clicked: the recipient opened the transactional email and clicked a link inside of it
 * Hard bounce: the transactional email could not be delivered due to a permanent issue (e.g. misspelled or nonexistent email address)
 * Soft bounce: the transactional email could not be delivered due to a temporary issue (e.g. mail server temporarily unavailable or full inbox)
 * Blocked: the recipient has not received the transactional email because the email address is blocklisted
 * Complaint: the transactional email was reported as spam by the recipient
 * Unsubscribed: the recipient unsubscribed from your mailing list
 * Invalid Email: the recipient has not received the transactional email because the email address does not exist
 * Deferred: the transactional email is in Standby Reception and can be received later (e.g. full inbox)
 * Error: the recipient has not received the transactional email because an issue happened during the sending via an API call
 */
