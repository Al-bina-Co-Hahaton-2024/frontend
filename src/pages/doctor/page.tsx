import { useGetMeQuery } from '../../store/api/auth/authApi';
import { useEffect, useState } from 'react';
import { useGetDoctorsByIdsMutation } from '../../store/api/doctors/doctorsApi';
import { toast } from 'react-toastify';
import { CurrentChanges } from '../acceptence/components/hr-dep/approoval-card/current-changes';

export const DoctorPage = () => {
  const {
    data: userData,
    isSuccess: userSuccess,
    isError: userError,
  } = useGetMeQuery({});

  const [findById] = useGetDoctorsByIdsMutation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (userSuccess) {
      findById([userData.id])
        .unwrap()
        .then((res) => {
          const result = {
            ...res[0],
            ...userData,
          };
          setUser(result);
        })
        .catch(() => {
          toast.error('Что-то пошло не так, перезагрузите страницу!', {
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
    }
  }, [userData, userSuccess]);

  return (
    <div
      className={
        'mt-[20px] w-[1450px] mx-auto flex flex-col items-center h-[95%] relative'
      }
    >
      <div
        className={
          'absolute w-full h-full bg-white bg-opacity-30 rounded-[20px] shadow-lg'
        }
      ></div>
      {user && <CurrentChanges docData={[user]} fioData={[user]} />}
    </div>
  );
};
