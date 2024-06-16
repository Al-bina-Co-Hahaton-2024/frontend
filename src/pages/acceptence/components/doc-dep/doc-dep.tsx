import blue_search from '../../../../assets/blue_search.svg';
import clock from '../../../../assets/clock.svg';
import eye from '../../../../assets/eye.svg';
import arrow from '../../../../assets/light-arrow.svg';
import {
  useGetAbsenceSchedulersByIdsMutation,
  useGetDoctorsApplicationsQuery,
  useGetDoctorWorkSchedulersByIdsMutation,
  useGetFioDocsByIdMutation,
} from '../../../../store/api/doctors/doctorsApi';
import { useEffect, useState } from 'react';
import { IDoctorDeps } from './types';
import { _GRAPH_DOCS } from '../../../../constants/constants';
import { DocList } from './doc-list';

//
// useGetDoctorsApplicationsQuery,
//     useGetDoctorWorkSchedulersByIdsMutation,
//     useGetAbsenceSchedulersByIdsMutation

export const DocDep = () => {
  const [page, setPage] = useState(0);
  const [docs, setDocs] = useState<null | IDoctorDeps[]>(null);

  const { data: docData, isSuccess: docSuccess } =
    useGetDoctorsApplicationsQuery(page);
  const [worksDocTrigger] = useGetDoctorWorkSchedulersByIdsMutation();
  const [absenceDocTrigger] = useGetAbsenceSchedulersByIdsMutation();
  const [getFioDocs] = useGetFioDocsByIdMutation();

  useEffect(() => {
    if (docData && docSuccess) {
      const fetchData = async () => {
        const result: any = [];

        const resultsPromise = await Promise.allSettled([
          worksDocTrigger(docData.content).then(
            (result) => ({ type: 'worksDoc', data: result }),
            (error) => ({ type: 'worksDoc', error: error })
          ),
          absenceDocTrigger(docData.content).then(
            (result) => ({ type: 'absenceDoc', data: result }),
            (error) => ({ type: 'absenceDoc', error: error })
          ),
        ]);
        resultsPromise.forEach((el: any) => {
          if (el.status === 'fulfilled') {
            const tmp = el.value.data.data.map((element) => {
              return {
                ...element,
                type: el.value.type,
              };
            });
            result.push(tmp);
          }
        });
        return result.flat();
      };

      fetchData().then((res) => {
        const ids = res.map((el) => el.doctorId);
        getFioDocs(ids)
          .unwrap()
          .then((data) => {
            const result = res.map((element) => {
              const foundElement = data.find((t) => t.id === element.doctorId);
              return {
                ...element,
                ...foundElement.fullName,
              };
            });

            setDocs(result);
          })
          .catch((err) => console.log(err));
      });
    }
  }, [docData, docSuccess, page]);

  const nextSlide = () => {
    if (docData?.pageable?.pageNumber < docData?.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (docData?.pageable?.pageNumber > 0) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className={'flex flex-col w-full h-[50%] relative'}>
      <div className={'flex items-center justify-between'}>
        <div
          className={
            'flex items-center gap-[15px] bg-[#00A3FF] rounded-[50px] pt-[5px] pr-[15px] pb-[5px] pl-[15px]'
          }
        >
          <span className={'font-[700] text-white text-[18px]'}>
            Врачебное отделение
          </span>
          <span
            className={
              'w-[20px] h-[20px] rounded-[50%] bg-white text-black text-center'
            }
          >
            <div className={'text-sm'}>{docData?.totalElements}</div>
          </span>
        </div>

        <div
          className={
            'flex items-center gap-2 rounded-[20px] px-[25px] py-[12px] bg-white h-[40px]'
          }
        >
          <img src={blue_search} alt={'search'} />
          <input
            disabled
            className={'border-none m-0 p-0'}
            placeholder={'В разаработке'}
            type="text"
          />
        </div>
      </div>

      <DocList docs={docs} />

      <div
        onClick={prevSlide}
        className={`cursor-pointer absolute top-[50%] -left-10 w-[30px] h-[30px] rounded-[50%] bg-[#00A3FF] flex justify-center items-center text-center`}
      >
        <img src={arrow} alt={'<'} />
      </div>

      <div
        onClick={nextSlide}
        className={`cursor-pointer absolute top-[50%] -right-10 w-[30px] h-[30px] rounded-[50%] bg-[#00A3FF] flex justify-center items-center text-center rotate-[180deg]`}
      >
        <img src={arrow} alt={'<'} />
      </div>
    </div>
  );
};
