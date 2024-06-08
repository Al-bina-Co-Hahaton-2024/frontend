import orange_search from "../../../../assets/orange_search.svg";
import clock from "../../../../assets/clock.svg";
import eye from "../../../../assets/eye.svg";
import arrow from "../../../../assets/light-arrow.svg";
import {useGetDoctorChangesQuery, useGetFioDocsByIdMutation} from "../../../../store/api/doctors/doctorsApi";
import {useEffect, useState} from "react";
import {_APPROVE_DICT} from "../../../../constants/constants";



export const HrDep = () => {
    const [hrPage, setHrPage] = useState(0)
    const [hrDocs, setHrDocs] = useState<any>([])

    const {data: hrData, isSuccess: hrSuccess, isLoading: hrLoading} = useGetDoctorChangesQuery({page: hrPage})
    const [getFioDocs] = useGetFioDocsByIdMutation()

    useEffect(() => {
        if (hrSuccess && hrData) {
            const ids = hrData.content.map((el) => el.doctorId)

            getFioDocs(ids)
                .unwrap()
                .then((res) => {
                    const result = hrData.content.map((el) => {
                        const element = res.find((fio) => fio.id === el.doctorId )
                            return {
                            ...el,
                            ...element.fullName
                        }
                    })
                    setHrDocs(result)
                })
        }
    },[hrData, hrPage, hrSuccess])

    console.log(hrDocs)
    return (
        <div className={'flex flex-col w-full h-[50%] relative'}>

            <div className={'flex items-center justify-between'}>

                <div
                    className={'flex items-center gap-[15px] bg-[#FFA842] rounded-[50px] pt-[5px] pr-[15px] pb-[5px] pl-[15px]'}>
                    <span className={'font-[700] text-white text-[18px]'}>Кадровое отделение</span>
                    <span className={'w-[20px] h-[20px] rounded-[50%] bg-white text-black text-center overflow-hidden'}><div
                        className={'text-sm'}>{hrDocs.length}</div></span>
                </div>

                <div className={'flex items-center gap-2 rounded-[20px] px-[25px] py-[12px] bg-white h-[40px]'}>
                    <img src={orange_search} alt={'search'}/>
                    <input className={'border-none m-0 p-0'} placeholder={'Искать сверхразума...'} type="text"/>
                </div>

            </div>

            <div className={'flex items-center gap-[10px] overflow-hidden'}>

                {
                    hrDocs.map((doctor) => (
                        <div
                            className={'bg-white w-[430px] p-[20px] mt-[10px] grow-0 flex flex-col rounded-[20px] shadow-lg'}>

                            {/*<div className={'flex items-center gap-[10px] text-[14px] font-[400] text-[#00000080]'}>*/}
                            {/*    <div className={'flex items-center gap-[5px]'}>*/}
                            {/*        <img className={'-translate-y-[1px]'} src={clock} alt={'clock'}/>*/}
                            {/*        <div>13:38</div>*/}
                            {/*    </div>*/}
                            {/*    <div>|</div>*/}
                            {/*    <div>22.06.2024</div>*/}
                            {/*    <div>|</div>*/}
                            {/*    <div>Кадровое отделение</div>*/}
                            {/*</div>*/}

                            <div className={' flex flex-col'}>
                                <div className={'text-[14px] font-[400] text-[#00000080]'}>Врач</div>
                                <div className={'font-[400] text-[18px] text-black'}>{doctor.last}</div>
                                <div className={'font-[400] text-[18px] text-black'}>{doctor.first} {doctor.middle}</div>
                            </div>

                            <div className={'w-full h-[1px] bg-[#00000026] my-[5px]'}></div>

                            <div className={'flex flex-col'}>
                                <div className={'text-[14px] font-[400] text-[#00000080]'}>Изменения в разделах:</div>

                                <div className={'flex flex-wrap w-full h-[110px]'}>
                                    {
                                        Object.keys(doctor).map((k) => {
                                            if (doctor[k] !== null && Object.hasOwn(_APPROVE_DICT,k)) {
                                                return(
                                                    <div className={'w-[50%] font-[600] text-[18px] text-black'}>
                                                        {_APPROVE_DICT[k]}
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>

                                <div
                                    className={'flex items-center gap-[15px] bg-[#FFA842] hover:bg-[#FFA980] transition duration-500 ease-in-out rounded-[50px] py-[6px] px-[15px] max-w-[277px] mt-[10px] cursor-pointer'}>
                                    <img src={eye} alt={'eye'}/>
                                    <span className={'font-[80] text-white text-[18px]'}>Рассмотреть изменения</span>
                                </div>
                            </div>

                        </div>
                    ))
                }


            </div>

            <div
                onClick={() => {
                    if(hrData.pageable.pageNumber > 0) {
                        setHrPage((prev) => prev - 1)
                    }
                }}
                className={`hover:bg-[#FFA980] transition duration-500 ease-in-out absolute top-[50%] -left-10 w-[30px] h-[30px] rounded-[50%] bg-[#FFA842] flex justify-center items-center text-center cursor-pointer`}>
                <img src={arrow} alt={'<'}/>
            </div>

            <div
                onClick={() => {

                    if(hrData.pageable.pageNumber < hrData.totalPages - 1) {
                        setHrPage((prev) => prev + 1)
                    }
                }}
                className={`hover:bg-[#FFA980] transition duration-500 ease-in-out absolute top-[50%] -right-10 w-[30px] h-[30px] rounded-[50%] bg-[#FFA842] flex justify-center items-center text-center rotate-[180deg] cursor-pointer`}>
                <img src={arrow} alt={'<'}/>
            </div>

        </div>
    )
}