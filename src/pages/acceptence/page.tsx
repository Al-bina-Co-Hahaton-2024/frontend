
import orange_search from '../../assets/orange_search.svg'
import {useGetDoctorChangesQuery} from "../../store/api/doctors/doctorsApi";
import {useState} from "react";

export const AcceptanceUsersPage = () => {

    const [hrPage, setHrPage] = useState(0)
    const [docPage, setDocPage] = useState(0)

    const {data: hrData, isSuccess: hrSuccess, isLoading: hrLoading} = useGetDoctorChangesQuery({page: hrPage})

    console.log(hrData)

    return(
        <div className={'mt-[38px] w-[1450px] mx-auto flex flex-col items-center h-[90%] relative'}>
            <div className={'absolute w-full h-full bg-white bg-opacity-30 rounded-[20px] shadow-lg'}></div>
            <div className={'w-full my-[30px] px-[65px] h-full flex flex-col z-10'}>

                <div className={'flex flex-col w-full h-[50%]'}>

                    <div className={'flex items-center justify-between'}>

                        <div
                            className={'flex items-center gap-[15px] bg-[#FFA842] rounded-[50px] pt-[10px] pr-[25px] pb-[10px] pl-[25px]'}>
                            <span className={'font-[700] text-white text-[18px]'}>Кадровое отделение</span>
                            <span className={'w-[28px] h-[28px] rounded-[50%] bg-white text-black text-center'}><div
                                className={'translate-y-0.5'}>12</div></span>
                        </div>

                        <div className={'flex items-center gap-2 rounded-[20px] px-[25px] py-[12px] bg-white h-[40px]'}>
                            <img src={orange_search} alt={'search'}/>
                            <input className={'border-none m-0 p-0'} placeholder={'Искать сверхразума...'} type="text" />
                        </div>

                    </div>

                    <div className={'flex items-center gap-[5px] overflow-hidden'}>



                    </div>

                </div>

                <div className={'flex flex-col w-full h-[50%]'}>

                </div>

            </div>
        </div>
    )
}