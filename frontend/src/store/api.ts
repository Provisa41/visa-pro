import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index';

const baseUrl =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface VisaType {
  id: string;
  label: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  instruction: string;
  required: boolean;
  status: 'ready' | 'needed' | 'none';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  country: string;
  visaType: string;
  pinned: boolean;
  publishedAt: string;
}

export interface DocAnalysisReport {
  overall: 'ok' | 'issues' | 'rejected';
  summary: string;
  items: Array<{
    document: string;
    status: 'ok' | 'warning' | 'error';
    message: string;
  }>;
  recommendations: string[];
}

export interface Application {
  id: string;
  country: string;
  visaType: string;
  status: string;
  progress: number;
  updatedAt: string;
}

export interface Manager {
  id: string;
  name: string;
  specialties: string[];
  available: boolean;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User', 'Checklist', 'News', 'Docs', 'Consult'],
  endpoints: (builder) => ({
    loginTelegram: builder.mutation<
      { token: string; user: { id: string; telegramId: string; username?: string; firstName?: string; lastName?: string; photoUrl?: string } },
      { initData: string }
    >({
      query: (body) => ({ url: '/auth/telegram', method: 'POST', body }),
    }),
    getCountries: builder.query<Country[], void>({
      query: () => '/countries',
    }),
    getVisaTypes: builder.query<VisaType[], void>({
      query: () => '/visa-types',
    }),
    getManagers: builder.query<Manager[], string | void>({
      query: (country) =>
        country ? `/managers?country=${country}` : '/managers',
    }),
    getFaq: builder.query<Array<{ id: string; question: string; answer: string }>, void>({
      query: () => '/faq',
    }),
    getChecklist: builder.query<
      { country: string; visaType: string; items: ChecklistItem[] },
      { country: string; visaType: string }
    >({
      query: ({ country, visaType }) => `/checklist/${country}/${visaType}`,
      providesTags: ['Checklist'],
    }),
    saveChecklist: builder.mutation<
      unknown,
      { country: string; visaType: string; items: ChecklistItem[] }
    >({
      query: ({ country, visaType, items }) => ({
        url: `/checklist/${country}/${visaType}`,
        method: 'PUT',
        body: { items },
      }),
      invalidatesTags: ['Checklist', 'User'],
    }),
    getNews: builder.query<
      NewsItem[],
      { country?: string; visaType?: string } | void
    >({
      query: (params) => {
        const q = new URLSearchParams();
        if (params?.country) q.set('country', params.country);
        if (params?.visaType) q.set('visaType', params.visaType);
        const s = q.toString();
        return `/news${s ? `?${s}` : ''}`;
      },
      providesTags: ['News'],
    }),
    getSubscriptions: builder.query<string[], void>({
      query: () => '/news/subscriptions',
      providesTags: ['News'],
    }),
    subscribeNews: builder.mutation<void, { country: string }>({
      query: (body) => ({ url: '/news/subscribe', method: 'POST', body }),
      invalidatesTags: ['News', 'User'],
    }),
    unsubscribeNews: builder.mutation<void, string>({
      query: (country) => ({
        url: `/news/subscribe/${country}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['News', 'User'],
    }),
    analyzeDocument: builder.mutation<
      { id: string; report: DocAnalysisReport; createdAt: string },
      {
        fileName: string;
        mimeType: string;
        base64: string;
        country: string;
        visaType: string;
      }
    >({
      query: (body) => ({
        url: '/documents/analyze',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Docs', 'User'],
    }),
    getDocHistory: builder.query<
      Array<{
        id: string;
        fileName: string;
        country: string;
        visaType: string;
        report: DocAnalysisReport;
        createdAt: string;
      }>,
      void
    >({
      query: () => '/documents/history',
      providesTags: ['Docs'],
    }),
    getConsultations: builder.query<
      Array<{
        id: string;
        country: string;
        visaType: string;
        problem: string;
        status: string;
        createdAt: string;
      }>,
      void
    >({
      query: () => '/consult',
      providesTags: ['Consult'],
    }),
    createConsultation: builder.mutation<
      unknown,
      {
        country: string;
        visaType: string;
        problem: string;
        preferredAt?: string;
        contactType?: string;
        managerId?: string;
      }
    >({
      query: (body) => ({ url: '/consult', method: 'POST', body }),
      invalidatesTags: ['Consult', 'User'],
    }),
    getMe: builder.query<
      {
        id: string;
        telegramId: string;
        firstName?: string;
        lastName?: string;
        username?: string;
        photoUrl?: string;
        applications: Application[];
        docChecks: unknown[];
        consultations: unknown[];
        newsSubscriptions: string[];
      },
      void
    >({
      query: () => '/user/me',
      providesTags: ['User'],
    }),
    getLatestApplication: builder.query<Application | null, void>({
      query: () => '/user/application/latest',
    }),
  }),
});

export const {
  useLoginTelegramMutation,
  useGetCountriesQuery,
  useGetVisaTypesQuery,
  useGetManagersQuery,
  useGetFaqQuery,
  useGetChecklistQuery,
  useSaveChecklistMutation,
  useGetNewsQuery,
  useGetSubscriptionsQuery,
  useSubscribeNewsMutation,
  useUnsubscribeNewsMutation,
  useAnalyzeDocumentMutation,
  useGetDocHistoryQuery,
  useGetConsultationsQuery,
  useCreateConsultationMutation,
  useGetMeQuery,
  useGetLatestApplicationQuery,
} = api;
