import logo from '../assets/logo_doc.svg'
import hr from '../assets/hr.svg'
import anketa from '../assets/anketa.svg'

export const SideBar = () => {
    return(
        <div className={'w-[150px] h-screen bg-white rounded-tl-[0px] rounded-tr-[20px] rounded-br-[20px] p-4 flex flex-col justify-between items-center custom-sidebar-shadow'}>
            <img src={logo} alt={'logo'}/>
            <div className={'flex flex-col gap-[10px]'}>
                <div>
                    <div className={'flex flex-col items-center'}>
                        <img className={'w-[60px] h-[58px]'} src={hr} alt={'hr'} />
                        <span className={'text-[18px] font-[600] text-center'}>Кадровые данные</span>
                    </div>
                </div>
                <div>
                    <div className={'flex flex-col items-center'}>
                        <img className={'w-[60px] h-[58px]'} src={anketa} alt={'data'}/>
                        <span className={'text-[18px] font-[600] text-center'}>Активные заявки</span>
                    </div>
                </div>
            </div>
            <div>User</div>
        </div>
    )
}