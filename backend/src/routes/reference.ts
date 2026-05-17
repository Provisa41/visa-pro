import { Router } from 'express';
import countries from '../data/countries.json' with { type: 'json' };
import faq from '../data/faq.json' with { type: 'json' };
import managers from '../data/managers.json' with { type: 'json' };

export const referenceRouter = Router();

export const VISA_TYPES = [
  { id: 'tourist', label: 'Туристическая' },
  { id: 'business', label: 'Деловая' },
  { id: 'transit', label: 'Транзитная' },
  { id: 'student', label: 'Учебная' },
];

referenceRouter.get('/countries', (_req, res) => {
  res.json(countries);
});

referenceRouter.get('/visa-types', (_req, res) => {
  res.json(VISA_TYPES);
});

referenceRouter.get('/managers', (req, res) => {
  const country = req.query.country as string | undefined;
  const filtered = country
    ? managers.filter((m) => m.specialties.includes(country))
    : managers;
  res.json(filtered);
});

referenceRouter.get('/faq', (_req, res) => {
  res.json(faq);
});
