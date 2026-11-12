export type Severity = 'sev1' | 'sev2' | 'sev3';
export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';
export type Role = 'admin' | 'responder' | 'viewer';

export interface IncidentUpdate {
  at: number;
  status: IncidentStatus;
  message: string;
  author: string;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  owner: string;
  createdAt: number;
  resolvedAt?: number;
  updates: IncidentUpdate[];
}

export interface User {
  name: string;
  role: Role;
}

export interface NewIncident {
  title: string;
  service: string;
  severity: Severity;
  owner: string;
}

export const SERVICES = ['API Gateway', 'Payments', 'Auth', 'Search', 'Notifications'] as const;
export const STATUS_LABEL: Record<IncidentStatus, string> = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
};
export const SEVERITY_LABEL: Record<Severity, string> = { sev1: 'Sev 1', sev2: 'Sev 2', sev3: 'Sev 3' };
