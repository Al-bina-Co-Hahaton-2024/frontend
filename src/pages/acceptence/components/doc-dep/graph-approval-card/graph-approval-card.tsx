import eye from '../../../../../assets/eye.svg';
import cross_line from '../../../../../assets/cross_line.svg';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../store/hooks/storeHooks';
import {
  useApproveAbsenceSchedulerMutation,
  useApproveByManagerMutation,
  useDeclineAbsenceScheduleMutation,
  useDeclineByManagerMutation,
  useGetAbsenceSchedulersByIdsMutation,
  useGetDoctorsByIdsMutation,
  useGetFioDocsByIdMutation,
} from '../../../../../store/api/doctors/doctorsApi';
import { useEffect, useState } from 'react';
import { CurrentChanges } from '../../hr-dep/approoval-card/current-changes';
import { GraphDatePicker } from './graph-datepicker';
import { setGraphApprovalCard } from '../../../../../store/reducers/serviceSlice';

export const GraphApprovalCard = () => {
  const dispatch = useAppDispatch();
  const docId = useAppSelector((state) => state.serviceSlice.docGraphId);
  const reqId = useAppSelector((state) => state.serviceSlice.reqGraphId);

  const [getDoctor] = useGetDoctorsByIdsMutation();
  const [getDocFio] = useGetFioDocsByIdMutation();
  const [absenceTrigger] = useGetAbsenceSchedulersByIdsMutation();
  const [approveAbsence] = useApproveAbsenceSchedulerMutation();
  const [decline] = useDeclineAbsenceScheduleMutation();

  const [fio, setFio] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);
  const [absenceDoc, setAbsenceDoc] = useState<any>(null);

  useEffect(() => {
    if (docId) {
      getDoctor([docId])
        .unwrap()
        .then((res) => {
          setDoc(res);
        });
      getDocFio([docId])
        .unwrap()
        .then((res) => {
          setFio(res);
        });
      absenceTrigger([reqId])
        .unwrap()
        .then((res) => {
          setAbsenceDoc(res);
        });
    }
  }, [docId]);

  if (!fio || !doc || !absenceDoc) return null;

  return (
    <div
      className={
        'z-10 flex flex-col fixed right-0 top-0 w-[670px] h-screen bg-white rounded-tl-[20px] rounded-bl-[20px] overflow-y-scroll overflow-hidden'
      }
    >
      <div
        className={
          'w-full h-[110px] flex justify-between items-center bg-[#00A3FF] rounded-tl-[20px] py-[33px] px-[45px]'
        }
      >
        <div className={'flex gap-[15px]'}>
          <div className={'translate-y-3'}>
            <img src={eye} alt={'eye'} />
          </div>

          <div className={'flex flex-col '}>
            <div className={'font-[700] text-[24px] text-white'}>
              Просмотр заявки
            </div>
            <div
              className={
                'flex items-center gap-[10px] font-[400] text-[18px] text-white'
              }
            >
              <div className={'flex gap-[2px] items-center'}>
                {/*<img src={clock} alt={'clock'}/>*/}
                <span>14:38</span>
              </div>
              <div className={'opacity-50'}>|</div>
              <div>22.06.2024</div>
              <div className={'opacity-50'}>|</div>
              <div>Кадровое отделение</div>
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            dispatch(
              setGraphApprovalCard({
                isOpen: false,
                docId: null,
                reqId: null,
                type: null,
              })
            );
          }}
          className={'cursor-pointer'}
        >
          <img src={cross_line} alt={'exit'} />
        </div>
      </div>

      <CurrentChanges fioData={fio} docData={doc} />
      <GraphDatePicker doc={doc} absence={absenceDoc} />

      <div className={'mt-[40px] w-full flex items-center mx-[25px] gap-5'}>
        <div
          onClick={() => {
            approveAbsence(reqId)
              .unwrap()
              .then(() => {
                dispatch(
                  setGraphApprovalCard({
                    isOpen: false,
                    docId: null,
                    reqId: null,
                    type: null,
                  })
                );
              })
              .catch((err) => console.log(err));
          }}
          className={
            'w-[50%] text-center font-[700] text-[18px] bg-[#00A3FF] rounded-[40px] text-white py-[15px] cursor-pointer'
          }
        >
          Согласовтаь изменения
        </div>
        <div
          onClick={() => {
            decline(reqId)
              .unwrap()
              .then(() => {
                dispatch(
                  setGraphApprovalCard({
                    isOpen: false,
                    docId: null,
                    reqId: null,
                  })
                );
              });
          }}
          className={
            'w-[35%] text-center font-[700] text-[18px] bg-[#D9E2E8] rounded-[40px] text-black py-[15px] cursor-pointer'
          }
        >
          Отклонить заявку
        </div>
      </div>
    </div>
  );
};
