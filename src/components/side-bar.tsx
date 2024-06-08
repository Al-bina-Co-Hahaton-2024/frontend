import logo from '../assets/logo_doc.svg'
import hr from '../assets/hr.svg'
import anketa from '../assets/anketa.svg'
import {Link, useLocation} from "react-router-dom";

export const SideBar = () => {
    const location = useLocation()
    return(
        <div className={'w-[150px] h-screen bg-white rounded-tl-[0px] rounded-tr-[20px] rounded-br-[20px] p-4 flex flex-col justify-between items-center custom-sidebar-shadow'}>
            <img src={logo} alt={'logo'}/>
            <div className={'flex flex-col gap-[10px]'}>
                <Link to={'/employee'} className={`${location.pathname.includes('employee') ? 'bg-[#E5F6FF]': 'bg-white'} p-2  rounded-[10px]`}>
                    <div className={'flex flex-col items-center'}>
                        <img className={'w-[60px] h-[58px]'} src={hr} alt={'hr'} />
                        <span className={'text-[18px] font-[600] text-center'}>Кадровые данные</span>
                    </div>
                </Link>
                {
                   localStorage.getItem('role') === 'hr' &&  <Link to={'/acc_users'} className={`${location.pathname.includes('acc_users') ? 'bg-[#E5F6FF]': 'bg-white'} p-2  rounded-[10px]`}>
                        <div className={'flex flex-col items-center'}>
                            <img className={'w-[60px] h-[58px]'} src={anketa} alt={'data'}/>
                            <span className={'text-[18px] font-[600] text-center'}>Заявки на согласовании</span>
                        </div>
                    </Link>
                }
                {
                    localStorage.getItem('role') === 'manager' &&  <Link to={'/accept_users'} className={`${location.pathname.includes('accept_users') ? 'bg-[#E5F6FF]': 'bg-white'} p-2  rounded-[10px]`}>
                        <div className={'flex flex-col items-center'}>
                            <img className={'w-[60px] h-[58px]'} src={anketa} alt={'data'}/>
                            <span className={'text-[18px] font-[600] text-center'}>Активные заявки</span>
                        </div>
                    </Link>
                }
            </div>
            <div>User</div>
        </div>
    )
}