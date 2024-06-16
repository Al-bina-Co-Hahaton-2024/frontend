export const _DAYS_OF_WEEKS = [
  { value: 'MONDAY', label: 'Понедельник' },
  { value: 'TUESDAY', label: 'Вторник' },
  { value: 'WEDNESDAY', label: 'Среда' },
  { value: 'THURSDAY', label: 'Четверг' },
  { value: 'FRIDAY', label: 'Пятница' },
  { value: 'SATURDAY', label: 'Суббота' },
  { value: 'SUNDAY', label: 'Воскресенье' },
];
// FLG, RG, MMG, KT, DENSITOMETER, MRT

export const _OPT_MODALITIES = [
  { value: 'FLG', label: 'ФЛГ' },
  { value: 'RG', label: 'РГ' },
  { value: 'MMG', label: 'ММГ' },
  { value: 'KT', label: 'КТ' },
  { value: 'DENSITOMETER', label: 'Денситометрия' },
  { value: 'MRT', label: 'МРТ' },
];

export const _MEDICAL_MODALITIES = {
  RG: 'РГ',
  MRT: 'МРТ',
  KT: 'КТ',
  MMG: 'ММГ',
  FLG: 'ФЛГ',
  DENSITOMETER: 'Денситометр',
};

export const _REVERSED_MODALITIES_ = {
  РГ: 'RG',
  МРТ: 'MRT',
  КТ: 'KT',
  ММГ: 'MMG',
  ФЛГ: 'FLG',
  ДЕНСИТОМЕТР: 'DENSITOMETER',
};

export const _MEDICAL_MODALITIES_WITH_TYPES = {
  RG_DEFAULT: 'РГ',
  MRT_DEFAULT: 'МРТ',
  MRT_U: 'МРТ У',
  MRT_U2: 'МРТ У2',
  KT_DEFAULT: 'КТ',
  KT_U: 'КТ У',
  KT_U2: 'КТ У2',
  MMG_DEFAULT: 'ММГ',
  FLG_DEFAULT: 'ФЛГ',
  DENSITOMETER_DEFAULT: 'Денситометр',
};

export const _APPROVE_DICT = {
  startContract: 'Дата выхода',
  hours: 'Время работы',
  modality: 'Модальность',
  optionalModality: 'Доп. модальность',
  rate: 'Ставка',
  workDays: 'Рабочие дни',
};

export const _GRAPH_DOCS = {
  worksDoc: 'График работы',
  absenceDoc: 'График отгулов',
};
