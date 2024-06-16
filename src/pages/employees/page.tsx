import {
  useGetDoctorsMutation,
  useGetFioDocsByIdMutation,
} from '../../store/api/doctors/doctorsApi';
import { useEffect, useState } from 'react';
import { IDoctor } from '../../store/api/doctors/types';
import add_employee from '../../assets/add_employee.svg';
import pencil from '../../assets/pencil2.svg';
import { Pagination } from '../../components/pagination';
import { EmployeeSearch } from './components/search';
import pencil_white from '../../assets/pencil_white.svg';
import cross_line from '../../assets/cross_line.svg';
import { EditEmployeeForm } from './components/edit-employee-form';
import { AdditionEmployeeForm } from './components/addition-employee-form';
import { _MEDICAL_MODALITIES, _WORKDAYS } from '../../constants/constants';
import { Tooltip } from 'primereact/tooltip';
import { toast } from 'react-toastify';

export const EmployeesPage = () => {
  //add form
  const [addPerson, setAddPerson] = useState(false);

  //edit form
  const [editablePerson, setEditablePerson] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  //states
  const [idsDocd, setIds] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [doctors, setDoctors] = useState<any>([]);
  const [fullData, setFullData] = useState<any>(null);
  // API actions
  const [docsTrigger] = useGetDoctorsMutation();
  const [getFioTrigger] = useGetFioDocsByIdMutation();

  useEffect(() => {
    docsTrigger({
      userIds: idsDocd,
      page: page,
    })
      .unwrap()
      .then((res) => {
        const ids = res.content.map((doc: IDoctor) => doc.id);
        getFioTrigger(ids)
          .unwrap()
          .then((result) => {
            const transformed = res.content.map((doc: IDoctor) => {
              const fioObject = result.find((el) => el.id === doc.id);
              return {
                ...doc,
                ...fioObject,
              };
            });
            setDoctors(transformed);
            setFullData(res);
          });
      })
      .catch((err) => {
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
  }, [editablePerson, addPerson, page]);

  const handlePageClick = (data) => {
    let selected = data.selected;
    setPage(selected);
  };

  const onFormSubmit = () => {
    setEditablePerson(null);
    setEdit(false);
    setAddPerson(false);
  };

  return (
    <div className={'mt-[38px] w-[1450px] flex flex-col items-center mx-auto'}>
      <div className={'flex flex-col w-full '}>
        <div className={'flex justify-between'}>
          <EmployeeSearch setPage={setPage} setIds={setIds} />

          <div
            onClick={() => setAddPerson(true)}
            className={
              'flex items-center gap-2 bg-[#00A3FF] rounded-[20px] px-[25px] py-[12px] h-[40px]'
            }
          >
            <img src={add_employee} alt={'add'} />
            <button className={'border-none m-0 p-0 text-[18px] text-white'}>
              Добавить сотрудника
            </button>
          </div>
        </div>
        <Tooltip
          className={'text-[20px] text-black bg-white p-2 rounded shadow-lg'}
          target=".workdays-tt"
        />
        <div
          className={
            'w-full mt-[15px] flex flex-col gap-[10px] max-h-[800px] overflow-hidden'
          }
        >
          {doctors.length !== 0 &&
            doctors.map((el: IDoctor & any) => {
              return (
                <div
                  onClick={() => {
                    setEdit(true);
                    if (edit) {
                      setEdit(false);
                      setEditablePerson(null);
                      setTimeout(() => {
                        setEdit(true);
                        setEditablePerson(el);
                      }, 200);
                    } else {
                      setEdit(true);
                      setEditablePerson(el);
                    }
                  }}
                  key={el.id}
                  className="bg-white group hover:bg-[#00A3FF] rounded-[20px] shadow-lg p-[15px] flex justify-between items-center cursor-pointer max-h-[60px]"
                >
                  <div className="flex flex-col text-black w-[300px] group-hover:text-white">
                    <span className="p-0 m-0 text-[18px] font-[600]">
                      {el.fullName.last}
                    </span>
                    <span className="p-0 m-0 text-[18px] font-[600]">
                      {el.fullName.first} {el.fullName.middle}
                    </span>
                  </div>
                  <div className="flex flex-col w-[129px]">
                    <span className="text-black opacity-50 text-[14px] font-[400] ite">
                      Модальность
                    </span>
                    <span className="text-black text-[18px] font-[400] group-hover:text-white">
                      {_MEDICAL_MODALITIES[el.modality]}
                    </span>
                  </div>
                  <div className="flex flex-col w-[300px] group-hover:text-white">
                    <span className="text-black opacity-50 text-[14px] font-[400] ite">
                      Доп.модальность
                    </span>
                    <span className="text-black text-[18px] font-[400] group-hover:text-white">
                      {el?.optionalModality?.join(',')}
                    </span>
                  </div>
                  <div className="flex flex-col w-[42px] group-hover:text-white">
                    <span className="text-black opacity-50 text-[14px] font-[400] ite">
                      Ставка
                    </span>
                    <span className="text-black text-[18px] font-[400] group-hover:text-white">
                      {el.rate}
                    </span>
                  </div>
                  <div className="flex flex-col w-[94px] group-hover:text-white">
                    <span className="text-black opacity-50 text-[14px] font-[400] ite">
                      Начало работы
                    </span>
                    <span className="text-black text-[18px] font-[400] group-hover:text-white">
                      {el.startContract}
                    </span>
                  </div>
                  <div className="flex flex-col w-[88px] group-hover:text-white">
                    <span className="text-black opacity-50 text-[14px] font-[400] ite">
                      Время работы
                    </span>
                    <span className="text-black text-[18px] font-[400] group-hover:text-white">
                      {el.hours}
                    </span>
                  </div>
                  <div className="flex flex-col max-w-[46px] group-hover:text-white overflow-hidden truncate">
                    <span className="text-black opacity-50 text-[14px] font-[400] ite">
                      График
                    </span>
                    <span
                      data-pr-tooltip={`${el.workDays.map((d) => _WORKDAYS[d])}`}
                      data-pr-position="top"
                      className="text-black text-[18px] font-[400] group-hover:text-white flex items-center gap-2 workdays-tt"
                    >
                      {el.workDays.map((d) => (
                        <p className={'m-0 p-0'}>{_WORKDAYS[d]}</p>
                      ))}
                    </span>
                  </div>
                  <div className="flex flex-col w-[83px] group-hover:text-white">
                    <span className="text-black opacity-50 text-[14px] font-[400] ite">
                      Табельный №
                    </span>
                    <span className="text-black text-[18px] font-[400] group-hover:text-white">
                      {el.serviceNumber}
                    </span>
                  </div>
                  <div>
                    <img
                      className="w-[50px] h-[50px]"
                      src={pencil}
                      alt="edit"
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <Pagination
          pageCount={fullData?.totalPages || 0}
          onPageChange={handlePageClick}
        />
      </div>

      <div
        className={`absolute top-0 right-0 ${addPerson ? 'translate-x-[0vw]' : 'translate-x-[120vw]'} w-[670px] bg-white flex flex-col h-screen rounded-tl-[20px] rounded-bl-[20px] transition ease-in-out`}
      >
        <div className={'h-[95px] w-full bg-[#00A3FF] rounded-tl-[20px]'}>
          <div
            className={
              'flex items-start justify-between py-[36px] pl-[45px] pr-[24px]'
            }
          >
            <div className={'flex items-center gap-[20px]'}>
              <img src={add_employee} alt={'add_employee'} />
              <span className={'text-white font-[700] text-[24px]'}>
                Добавление нового сотрудника
              </span>
            </div>
            <div
              onClick={() => {
                setAddPerson(false);
              }}
              className={'cursor-pointer'}
            >
              <img src={cross_line} alt={'exit'} />
            </div>
          </div>
        </div>
        {addPerson && <AdditionEmployeeForm onFormSubmit={onFormSubmit} />}
      </div>

      <div
        className={`absolute top-0 right-0 ${edit ? 'translate-x-[0vw]' : 'translate-x-[120vw]'} w-[670px] bg-white flex flex-col h-screen rounded-tl-[20px] rounded-bl-[20px] transition ease-in-out`}
      >
        <div className={'h-[95px] w-full bg-[#00A3FF] rounded-tl-[20px]'}>
          <div
            className={
              'flex items-start justify-between py-[36px] pl-[45px] pr-[24px]'
            }
          >
            <div className={'flex items-center gap-[20px]'}>
              <img src={pencil_white} alt={'edit'} />
              <span className={'text-white font-[700] text-[24px]'}>
                Информация о сотруднике
              </span>
            </div>
            <div
              onClick={() => {
                setEdit(false);
                setEditablePerson(null);
              }}
              className={'cursor-pointer'}
            >
              <img src={cross_line} alt={'exit'} />
            </div>
          </div>
        </div>
        {editablePerson && (
          <EditEmployeeForm
            person={editablePerson}
            onFormSubmit={onFormSubmit}
          />
        )}
      </div>
    </div>
  );
};
