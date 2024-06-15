import search from '../../assets/search.svg';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  useGetDoctorsByIdsMutation,
  useGetFioDocsByIdMutation,
  useGetIdByFioElasticMutation,
} from '../../store/api/doctors/doctorsApi';
import { toast } from 'react-toastify';

export const DocGroupsSearch = ({ setGroups, startDate }) => {
  const [searchTerm, setSearchTerm] = useState<any>(null);
  const [getIdsByFioTrigger] = useGetIdByFioElasticMutation();

  const [getDoctors] = useGetDoctorsByIdsMutation();
  const [fioDocs] = useGetFioDocsByIdMutation();

  useEffect(() => {
    if (searchTerm !== null) {
      const handler = setTimeout(() => {
        getIdsByFioTrigger({
          fullName: searchTerm,
        })
          .unwrap()
          .then((res) => {
            getDoctors(res)
              .unwrap()
              .then((docs) => {
                fioDocs(res)
                  .unwrap()
                  .then((fio) => {
                    const mapped = docs.map((el) => {
                      const f = fio.find((v) => v.id === el.id);
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
                      setGroups(mapped);
                    }
                  });
                console.log(docs);
              });
          });
      }, 1000);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchTerm]);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <div
      className={
        'flex items-center gap-2 rounded-[20px] px-[25px] py-[12px] bg-white h-[40px] absolute z-[8000] top-14 left-12 border '
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
  );
};
