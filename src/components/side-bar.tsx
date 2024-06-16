import logo from '../assets/logo_doc.svg';
import hr from '../assets/hr.svg';
import anketa from '../assets/anketa.svg';
import forecast from '../assets/forecast.svg';
import work_tabel from '../assets/work_tabel.svg';
import main_doc from '../assets/main_doc.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGetMeQuery } from '../store/api/auth/authApi';

export const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: dataUser, isLoading: isLoadingUser } = useGetMeQuery(1);
  return (
    <div
      className={
        'w-[150px] h-full bg-white rounded-tl-[0px] rounded-tr-[20px] rounded-br-[20px] p-4 flex flex-col justify-between items-center custom-sidebar-shadow'
      }
    >
      <img src={logo} alt={'logo'} />
      <div className={'flex flex-col gap-[10px]'}>
        {localStorage.getItem('role') === 'doc' && (
          <Link
            to={'/lk'}
            className={`${location.pathname.includes('doctor') ? 'bg-[#E5F6FF]' : 'bg-white'} p-2  rounded-[10px]`}
          >
            <div className={'flex flex-col items-center'}>
              <img className={'w-[60px] h-[58px]'} src={main_doc} alt={'doc'} />
              <span className={'text-[18px] font-[600] text-center'}>
                Анализ прогноза
              </span>
            </div>
          </Link>
        )}
        {localStorage.getItem('role') === 'HR' && (
          <Link
            to={'/employees'}
            className={`${location.pathname.includes('employees') ? 'bg-[#E5F6FF]' : 'bg-white'} p-2  rounded-[10px]`}
          >
            <div className={'flex flex-col items-center'}>
              <img className={'w-[60px] h-[58px]'} src={hr} alt={'hr'} />
              <span className={'text-[18px] font-[600] text-center'}>
                Кадровые данные
              </span>
            </div>
          </Link>
        )}
        {localStorage.getItem('role') === 'HR' && (
          <Link
            to={'/acc_users'}
            className={`${location.pathname.includes('acc_users') ? 'bg-[#E5F6FF]' : 'bg-white'} p-2  rounded-[10px]`}
          >
            <div className={'flex flex-col items-center'}>
              <img className={'w-[60px] h-[58px]'} src={anketa} alt={'data'} />
              <span className={'text-[18px] font-[600] text-center'}>
                Заявки на согласовании
              </span>
            </div>
          </Link>
        )}
        {localStorage.getItem('role') === 'HEAD_DEPARTMENT' && (
          <Link
            to={'/forecast'}
            className={`${location.pathname.includes('forecast') ? 'bg-[#E5F6FF]' : 'bg-white'} p-2  rounded-[10px]`}
          >
            <div className={'flex flex-col items-center'}>
              <img
                className={'w-[60px] h-[58px]'}
                src={forecast}
                alt={'data'}
              />
              <span className={'text-[18px] font-[600] text-center'}>
                Анализ прогноза
              </span>
            </div>
          </Link>
        )}
        {localStorage.getItem('role') === 'HEAD_DEPARTMENT' && (
          <Link
            to={'/analytics'}
            className={`${location.pathname.includes('analytics') ? 'bg-[#E5F6FF]' : 'bg-white'} p-2  rounded-[10px]`}
          >
            <div className={'flex flex-col items-center'}>
              <img
                className={'w-[60px] h-[58px]'}
                src={work_tabel}
                alt={'calendar'}
              />
              <span className={'text-[18px] font-[600] text-center'}>
                Рабочий табель
              </span>
            </div>
          </Link>
        )}
        {localStorage.getItem('role') === 'HEAD_DEPARTMENT' && (
          <Link
            to={'/accept_users'}
            className={`${location.pathname.includes('accept_users') ? 'bg-[#E5F6FF]' : 'bg-white'} p-2  rounded-[10px]`}
          >
            <div className={'flex flex-col items-center'}>
              <img className={'w-[60px] h-[58px]'} src={anketa} alt={'data'} />
              <span className={'text-[18px] font-[600] text-center'}>
                Активные заявки
              </span>
            </div>
          </Link>
        )}
      </div>
      <div>
        {dataUser &&
          dataUser.fullName.first +
            ' ' +
            dataUser.fullName.last +
            ' ' +
            dataUser.fullName.middle}
        <hr />
        <button
          onClick={() => navigate('/')}
          className="w-full py-2 px-4 bg-black h-[60px]  text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};
