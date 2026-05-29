/** Шаблоны документов по умолчанию (используются в router) */

export const SCHENGEN_COUNTRIES = [
  'de', 'fr', 'it', 'es', 'gr', 'pt', 'nl', 'at', 'cz', 'fi',
  'pl', 'hu', 'be', 'ch', 'se', 'no', 'hr',
];

export const schengenTourist = [
  { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен минимум 3 месяца после поездки, не менее 2 чистых страниц.', required: true },
  { id: 'photo', title: 'Биометрическое фото', instruction: '35×45 мм, светлый фон, не старше 6 месяцев, лицо 70–80% кадра.', required: true },
  { id: 'insurance', title: 'Медицинская страховка', instruction: 'Покрытие от 30 000 € на все дни поездки, действует в зоне Шенген.', required: true },
  { id: 'booking', title: 'Подтверждение проживания', instruction: 'Бронь отеля, аренды или приглашение принимающей стороны на весь срок.', required: true },
  { id: 'tickets', title: 'Билеты туда-обратно', instruction: 'Бронь или оплаченные авиабилеты с датами въезда и выезда.', required: true },
  { id: 'finance', title: 'Финансовые документы', instruction: '2-НДФЛ, выписка по счёту, спонсорское письмо при необходимости.', required: true },
  { id: 'employment', title: 'Справка с работы', instruction: 'На фирменном бланке: должность, стаж, зарплата, дата отпуска.', required: true },
  { id: 'application', title: 'Визовая анкета', instruction: 'Заполнена на сайте консульства/VFS, распечатана и подписана заявителем.', required: true },
  { id: 'copies', title: 'Копии документов', instruction: 'Копии всех страниц паспорта, ранее выданных виз, свидетельств.', required: true },
];

export const schengenBusiness = [
  { id: 'passport', title: 'Загранпаспорт', instruction: 'Срок действия +3 месяца после поездки.', required: true },
  { id: 'invitation', title: 'Приглашение от компании', instruction: 'Официальное приглашение с реквизитами, целью и сроками визита.', required: true },
  { id: 'insurance', title: 'Медстраховка', instruction: 'Покрытие от 30 000 €.', required: true },
  { id: 'finance', title: 'Финансы компании/заявителя', instruction: 'Выписки, справки о доходах или финансировании поездки.', required: true },
  { id: 'employment', title: 'Справка с работы', instruction: 'Подтверждение должности и командировки.', required: true },
];

export const countryOverrides: Record<string, Record<string, typeof schengenTourist>> = {
  us: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен на весь период поездки + 6 месяцев.', required: true },
      { id: 'ds160', title: 'Форма DS-160', instruction: 'Заполнена онлайн, баркод подтверждения, фото загружено в анкету.', required: true },
      { id: 'photo', title: 'Фото 5×5 см', instruction: 'По требованиям госдепартамента США, белый фон.', required: true },
      { id: 'interview', title: 'Запись на интервью', instruction: 'Подтверждение даты и времени в посольстве/консульстве.', required: true },
      { id: 'finance', title: 'Финансовые документы', instruction: 'Выписки, 2-НДФЛ, документы о собственности при наличии.', required: true },
      { id: 'ties', title: 'Связи с РФ', instruction: 'Справки о работе, семье, имуществе — доказательство возврата.', required: true },
    ],
    business: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен на весь срок поездки.', required: true },
      { id: 'ds160', title: 'DS-160', instruction: 'Анкета с целью деловой поездки.', required: true },
      { id: 'invitation', title: 'Приглашение US-стороны', instruction: 'Письмо от американской компании с целью визита.', required: true },
    ],
  },
  gb: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен на весь период поездки.', required: true },
      { id: 'application', title: 'Онлайн-заявка', instruction: 'Заполнена на gov.uk, оплачен сбор, биометрия сдана.', required: true },
      { id: 'finance', title: 'Финансовые документы', instruction: 'Выписка за 6 месяцев, справка о доходах.', required: true },
      { id: 'booking', title: 'Проживание', instruction: 'Бронь отеля или приглашение.', required: true },
      { id: 'insurance', title: 'Страховка', instruction: 'Медицинское покрытие на период поездки.', required: true },
    ],
  },
  cn: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Минимум 6 месяцев действия, 2 чистые страницы.', required: true },
      { id: 'photo', title: 'Фото', instruction: '48×33 мм, белый фон, без украшений.', required: true },
      { id: 'application', title: 'Визовая анкета', instruction: 'Заполнена на сайте CVASC или консульства.', required: true },
      { id: 'booking', title: 'Маршрут и проживание', instruction: 'Билеты, брони отелей по маршруту.', required: true },
      { id: 'invitation', title: 'Приглашение (при наличии)', instruction: 'От принимающей стороны в Китае.', required: false },
    ],
  },
  jp: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен на весь срок поездки.', required: true },
      { id: 'photo', title: 'Фото 45×45 мм', instruction: 'Белый фон, не старше 6 месяцев.', required: true },
      { id: 'application', title: 'Анкета', instruction: 'Заполнена, подписана, с указанием цели поездки.', required: true },
      { id: 'finance', title: 'Финансы', instruction: 'Выписка, справка о работе, налоговая декларация.', required: true },
      { id: 'booking', title: 'Маршрут', instruction: 'Билеты и брони жилья.', required: true },
    ],
  },
  ae: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен минимум 6 месяцев.', required: true },
      { id: 'photo', title: 'Фото', instruction: 'Цветное, белый фон, 43×55 мм.', required: true },
      { id: 'booking', title: 'Бронь отеля', instruction: 'Подтверждение проживания в ОАЭ.', required: true },
      { id: 'tickets', title: 'Авиабилеты', instruction: 'Туда-обратно или транзит с выходом в ОАЭ.', required: true },
    ],
  },
  tr: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен 150+ дней на дату въезда.', required: true },
      { id: 'tickets', title: 'Билеты', instruction: 'Подтверждение перелёта.', required: true },
      { id: 'booking', title: 'Проживание', instruction: 'Бронь отеля на весь срок.', required: true },
      { id: 'finance', title: 'Финансы', instruction: 'Выписка — $50/день или эквивалент.', required: true },
    ],
  },
  th: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен 6+ месяцев.', required: true },
      { id: 'photo', title: 'Фото 35×45', instruction: 'Светлый фон, не старше 6 месяцев.', required: true },
      { id: 'tickets', title: 'Билеты', instruction: 'Въезд и выезд из Таиланда.', required: true },
      { id: 'booking', title: 'Проживание', instruction: 'Бронь отеля на весь срок.', required: true },
      { id: 'finance', title: 'Финансы', instruction: '20 000 бат на человека или эквивалент.', required: true },
    ],
  },
  in: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен 6+ месяцев, 2 страницы.', required: true },
      { id: 'photo', title: 'Фото 51×51 мм', instruction: 'Белый фон.', required: true },
      { id: 'application', title: 'Онлайн-заявка e-Visa', instruction: 'Заполнена на indianvisaonline.gov.in.', required: true },
      { id: 'booking', title: 'Проживание и маршрут', instruction: 'Брони по городам поездки.', required: true },
    ],
  },
  ca: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен на весь срок.', required: true },
      { id: 'application', title: 'Заявка IRCC', instruction: 'Онлайн-анкета, биометрия, оплата сбора.', required: true },
      { id: 'finance', title: 'Финансовые документы', instruction: 'Выписки, справки о доходах.', required: true },
      { id: 'purpose', title: 'Цель поездки', instruction: 'Письмо о цели, маршрут, связи с РФ.', required: true },
    ],
  },
  au: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен на период поездки.', required: true },
      { id: 'application', title: 'Заявка ImmiAccount', instruction: 'Подкласс 600, документы загружены онлайн.', required: true },
      { id: 'finance', title: 'Финансы', instruction: 'Подтверждение средств на поездку.', required: true },
      { id: 'health', title: 'Медосмотр (при требовании)', instruction: 'По указанию визового центра.', required: false },
    ],
  },
  eg: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен 6+ месяцев.', required: true },
      { id: 'photo', title: 'Фото', instruction: 'Цветное, белый фон.', required: true },
      { id: 'tickets', title: 'Билеты', instruction: 'Подтверждение въезда/выезда.', required: true },
      { id: 'booking', title: 'Отель', instruction: 'Бронь на весь срок.', required: true },
    ],
  },
  kr: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен на весь срок.', required: true },
      { id: 'application', title: 'Анкета K-ETA / виза', instruction: 'По типу поездки — K-ETA или виза в консульстве.', required: true },
      { id: 'finance', title: 'Финансы', instruction: 'Выписка, справка с работы.', required: true },
      { id: 'booking', title: 'Проживание', instruction: 'Бронь отеля.', required: true },
    ],
  },
  kz: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен на весь срок.', required: true },
      { id: 'id', title: 'Удостоверение личности РФ', instruction: 'Копия внутреннего паспорта.', required: true },
      { id: 'tickets', title: 'Билеты', instruction: 'Подтверждение поездки.', required: true },
    ],
  },
  ge: {
    tourist: [
      { id: 'passport', title: 'Загранпаспорт', instruction: 'Действителен на весь срок (для безвиза — проверьте сроки).', required: true },
      { id: 'finance', title: 'Финансы', instruction: 'Выписка или наличные — $50/день.', required: true },
      { id: 'booking', title: 'Проживание', instruction: 'Бронь отеля или адрес.', required: true },
    ],
  },
};
