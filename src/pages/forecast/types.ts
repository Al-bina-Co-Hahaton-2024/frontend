import { IDoctor, IPageable, ISort } from '../../store/api/doctors/types';

export interface IWorkload {
  weekNumber: number;
  manualValue: number;
  generatedValue: number;
}
