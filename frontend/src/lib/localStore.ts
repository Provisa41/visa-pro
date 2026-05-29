import type { ChecklistItem } from '@/store/api';

const PREFIX = 'visa_pro_';

export interface ClientProfile {
  middleName?: string;
}

export function loadClientProfile(): ClientProfile {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}profile`) ?? '{}') as ClientProfile;
  } catch {
    return {};
  }
}

export function saveClientProfile(data: ClientProfile) {
  const current = loadClientProfile();
  localStorage.setItem(`${PREFIX}profile`, JSON.stringify({ ...current, ...data }));
}

export function formatFio(parts: {
  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
}): string {
  const { lastName, firstName, middleName } = parts;
  const fio = [lastName, firstName, middleName].filter(Boolean).join(' ');
  return fio || 'Не указано';
}

export function loadChecklist(country: string, visaType: string): ChecklistItem[] | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}checklist_${country}_${visaType}`);
    return raw ? (JSON.parse(raw) as ChecklistItem[]) : null;
  } catch {
    return null;
  }
}

export function saveChecklist(country: string, visaType: string, items: ChecklistItem[]) {
  localStorage.setItem(`${PREFIX}checklist_${country}_${visaType}`, JSON.stringify(items));
  const ready = items.filter((i) => i.status === 'ready').length;
  const progress = items.length ? Math.round((ready / items.length) * 100) : 0;
  const apps = loadApplications();
  const idx = apps.findIndex((a) => a.country === country && a.visaType === visaType);
  const entry = {
    id: `${country}-${visaType}`,
    country,
    visaType,
    progress,
    status: progress === 100 ? 'ready' : 'in_progress',
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) apps[idx] = entry;
  else apps.unshift(entry);
  localStorage.setItem(`${PREFIX}applications`, JSON.stringify(apps.slice(0, 10)));
}

export function loadApplications() {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}applications`) ?? '[]') as Array<{
      id: string;
      country: string;
      visaType: string;
      progress: number;
      status: string;
      updatedAt: string;
    }>;
  } catch {
    return [];
  }
}

export function loadLatestApplication() {
  const apps = loadApplications();
  return apps[0] ?? null;
}

export function loadSubscriptions(): string[] {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}subs`) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function saveSubscription(country: string, add: boolean) {
  let subs = loadSubscriptions();
  if (add && !subs.includes(country)) subs = [...subs, country];
  if (!add) subs = subs.filter((c) => c !== country);
  localStorage.setItem(`${PREFIX}subs`, JSON.stringify(subs));
}

export function loadDocHistory() {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}docs`) ?? '[]') as Array<{
      id: string;
      fileName: string;
      country: string;
      visaType: string;
      report: unknown;
      createdAt: string;
    }>;
  } catch {
    return [];
  }
}

export function saveDocCheck(entry: {
  id: string;
  fileName: string;
  country: string;
  visaType: string;
  report: unknown;
  createdAt: string;
}) {
  const list = [entry, ...loadDocHistory()].slice(0, 20);
  localStorage.setItem(`${PREFIX}docs`, JSON.stringify(list));
}

export function loadConsultations() {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}consults`) ?? '[]') as Array<{
      id: string;
      country: string;
      visaType: string;
      problem: string;
      status: string;
      createdAt: string;
    }>;
  } catch {
    return [];
  }
}

export function saveConsultation(entry: {
  id: string;
  country: string;
  visaType: string;
  problem: string;
  status: string;
  createdAt: string;
}) {
  const list = [entry, ...loadConsultations()].slice(0, 20);
  localStorage.setItem(`${PREFIX}consults`, JSON.stringify(list));
}
