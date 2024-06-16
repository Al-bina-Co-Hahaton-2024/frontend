import search from '../../assets/search.svg';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  useFindDocsMutation,
  useGetDoctorsByIdsMutation,
  useGetFioDocsByIdMutation,
  useGetIdByFioElasticMutation,
} from '../../store/api/doctors/doctorsApi';
import { toast } from 'react-toastify';
import {
  _MEDICAL_MODALITIES,
  _REVERSED_MODALITIES_,
} from '../../constants/constants';

export const DocGroupsSearch = ({ setGroups, startDate }) => {
  const [groupsDoc, setGroupsDoc] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>(null);
  const [getIdsByFioTrigger] = useGetIdByFioElasticMutation();
  const [modalityTerm, setModalityTerm] = useState<any>(null);

  const [getDoctors] = useGetDoctorsByIdsMutation();
  const [fioDocs] = useGetFioDocsByIdMutation();
  const [findDocs] = useFindDocsMutation();

  useEffect(() => {
    if (searchTerm !== null || modalityTerm !== null) {
      const handler = setTimeout(() => {
        findDocs({
          fullName: searchTerm,
          serviceNumberText: null,
          userIds: null,
          modality: modalityTerm !== '' ? modalityTerm : null,
        })
          .unwrap()
          .then((res) => {
            fioDocs(res.map((el) => el.id))
              .unwrap()
              .then((data) => {
                const mapped = res.map((el) => {
                  const f = data.find((v) => v.id === el.id);
                  return {
                    ...el,
                    ...f,
                  };
                });

                if (mapped.length === 0) {
                  toast.error('По данному запросу нет сверхразума', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                  });
                } else {
                  setGroupsDoc(mapped?.map((el) => el?.id));
                  setGroups(mapped);
                }
              })
              .catch(() => {
                toast.error('Что-то пошло не так', {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: 'light',
                });
              });
          })
          .catch(() => {
            toast.error('Что-то пошло не так', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          });
      }, 700);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchTerm, modalityTerm]);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleModalitySearch = (event: any) => {
    setModalityTerm(event.target.value);
  };

  return (
    <>
      <div
        className={
          'flex items-center gap-2 rounded-[20px] px-[25px] py-[12px] bg-white h-[40px] absolute z-[8000] top-14 left-2 border max-w-[200px] overflow-hidden'
        }
      >
        <img src={search} alt={'search'} />
        <input
          className={'border-none m-0 p-0 outline-none'}
          placeholder={'Искать сверхразума...'}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <select
        onChange={handleModalitySearch}
        className={
          'absolute  rounded-[10px] px-[10px] py-[12px] bg-white h-[40px]  z-[8000] top-14 left-[220px] border max-w-[120px] overflow-hidden outline-none'
        }
      >
        <option value={''}>Все модальности</option>
        {Object.entries(_MEDICAL_MODALITIES).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </>
  );
};
