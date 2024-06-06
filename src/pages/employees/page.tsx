import {
    useGetDoctorsQuery,
    useGetFioDocsByIdMutation,
    useGetIdByFioElasticMutation
} from "../../store/api/doctors/doctorsApi";
import {ChangeEvent, useEffect, useState} from "react";
import {IDoctor} from "../../store/api/doctors/types";

import search from '../../assets/search.svg'
import add_employee from '../../assets/add_employee.svg'
import pencil from '../../assets/pencil2.svg'
import {Pagination} from "../../components/pagination";
import {EmployeeSearch} from "./components/search";
import pencil_white from '../../assets/pencil_white.svg'
import cross_line from '../../assets/cross_line.svg'
import {useForm} from "react-hook-form";

// /users/{id}

export const EmployeesPage = () => {

    const [edit, setEdit] = useState(false)
    //states
    const [ids, setIds] = useState<any>(null)
    const [page, setPage] = useState(0)
    const [doctors, setDoctors] = useState<any>([])
    // API actions
    const {data: doctorsData, isSuccess, isError} = useGetDoctorsQuery({page: page, userIds: ids})
    const [getFioTrigger] = useGetFioDocsByIdMutation()

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    useEffect(() => {
        if (isSuccess) {
            const ids = doctorsData.content.map((doc: IDoctor) => doc.id)
            getFioTrigger(ids)
                .unwrap()
                .then((result) => {
                    const transformed = doctorsData.content.map((doc: IDoctor) => {
                        const fioObject = result.find(el => el.id === doc.id)
                        return {
                            ...doc,
                            ...fioObject
                        }
                    })
                    setDoctors(transformed)
                })
        }
    },[doctorsData, isSuccess])

    const handlePageClick = (data) => {
        let selected = data.selected;
        setPage(selected);
    };

    console.log(doctors)

    return(
        <div className={'my-[38px] mx-auto flex flex-col items-center w-full'}>
            <div className={'flex flex-col w-[1437px] '}>
                <div className={'flex justify-between'}>

                    <EmployeeSearch setPage={setPage} setIds={setIds}/>

                    <div className={'flex items-center gap-2 bg-[#00A3FF] rounded-[20px] px-[25px] py-[12px] h-[40px]'}>
                        <img src={add_employee} alt={'add'}/>
                        <button className={'border-none m-0 p-0 text-[18px] text-white'}>Добавить сотрудника</button>
                    </div>

                </div>
                <div className={'w-full mt-[15px] flex flex-col gap-[10px] max-h-[800px] overflow-hidden'}>
                        {
                            doctors.length !== 0 && doctors.map((el: IDoctor & any) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setEdit(true)
                                            console.log(el)
                                        }}
                                        key={el.id}
                                        className="bg-white group hover:bg-[#00A3FF] rounded-[20px] shadow-lg p-[15px] flex justify-between items-center cursor-pointer">
                                        <div className="flex flex-col text-black w-[300px] group-hover:text-white">
                                            <span className="p-0 m-0 text-[18px] font-[600]">{el.fullName.middle}</span>
                                            <span
                                                className="p-0 m-0 text-[18px] font-[600]">{el.fullName.first} {el.fullName.last}</span>
                                        </div>
                                        <div className="flex flex-col w-[84px]">
                                            <span
                                                className="text-black opacity-50 text-[14px] font-[400] ite">Модальность</span>
                                            <span className="text-black text-[18px] font-[400] group-hover:text-white">{el.modality}</span>
                                        </div>
                                        <div className="flex flex-col w-[300px] group-hover:text-white">
                                            <span
                                                className="text-black opacity-50 text-[14px] font-[400] ite">Доп.модальность</span>
                                            <span
                                                className="text-black text-[18px] font-[400] group-hover:text-white">{el.optionalModality.join(',')}</span>
                                        </div>
                                        <div className="flex flex-col w-[42px] group-hover:text-white">
                                            <span
                                                className="text-black opacity-50 text-[14px] font-[400] ite">Ставка</span>
                                            <span className="text-black text-[18px] font-[400] group-hover:text-white">{el.rate}</span>
                                        </div>
                                        <div className="flex flex-col w-[94px] group-hover:text-white">
                                            <span className="text-black opacity-50 text-[14px] font-[400] ite">Начало работы</span>
                                            <span
                                                className="text-black text-[18px] font-[400] group-hover:text-white">{el.startContract}</span>
                                        </div>
                                        <div className="flex flex-col w-[88px] group-hover:text-white">
                                            <span className="text-black opacity-50 text-[14px] font-[400] ite">Время работы</span>
                                            <span className="text-black text-[18px] font-[400] group-hover:text-white">{el.hours}</span>
                                        </div>
                                        <div className="flex flex-col w-[46px] group-hover:text-white">
                                            <span
                                                className="text-black opacity-50 text-[14px] font-[400] ite">График</span>
                                            <span className="text-black text-[18px] font-[400] group-hover:text-white">xx</span>
                                        </div>
                                        <div className="flex flex-col w-[83px] group-hover:text-white">
                                            <span className="text-black opacity-50 text-[14px] font-[400] ite">Табельный №</span>
                                            <span
                                                className="text-black text-[18px] font-[400] group-hover:text-white">{el.serviceNumber}</span>
                                        </div>
                                        <div>
                                            <img className="w-[50px] h-[50px]" src={pencil} alt="edit"/>
                                        </div>
                                    </div>
                                )
                            })
                        }
                </div>
                <Pagination pageCount={doctorsData?.totalPages || 0} onPageChange={handlePageClick}/>
            </div>
            <div
                className={`absolute top-0 right-0 ${edit ? 'translate-x-[0vw]' : 'translate-x-[120vw]'} w-[670px] bg-white flex flex-col h-screen rounded-tl-[20px] rounded-bl-[20px] transition ease-in-out`}>
                <div className={'h-[95px] w-full bg-[#00A3FF] rounded-tl-[20px]'}>
                    <div className={'flex items-start justify-between py-[36px] pl-[45px] pr-[24px]'}>
                        <div className={'flex items-center gap-[20px]'}>
                            <img src={pencil_white} alt={'edit'}/>
                            <span className={'text-white font-[700] text-[24px]'}>Информация о сотруднике</span>
                        </div>
                        <div onClick={() => setEdit(false)} className={'cursor-pointer'}>
                            <img src={cross_line} alt={'exit'}/>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6  max-w-4xl overflow-y-scroll">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="font-[400] text-[14px]  opacity-50">Фамилия <span
                                className="text-red-500">*</span></label>
                            <input placeholder={'Иванов'} {...register("lastName", {required: true})}
                                   className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                            {errors.lastName && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                        </div>
                        <div>
                            <label className="font-[400] text-[14px]  opacity-50">Отчество</label>
                            <input placeholder={'Иванович'} {...register("middleName")}
                                   className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                        </div>
                        <div>
                            <label className="font-[400] text-[14px]  opacity-50">Имя <span
                                className="text-red-500">*</span></label>
                            <input placeholder={'Иван'} {...register("firstName", {required: true})}
                                   className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                            {errors.firstName && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                        </div>

                        <div className={'flex gap-5'}>
                            <div>
                                <label className="font-[400] text-[14px]  opacity-50">Дата выхода <span
                                    className="text-red-500">*</span></label>
                                <input {...register("dateOfExit", {required: true})} type="date"
                                       className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                                {errors.dateOfExit &&
                                    <span className="text-red-500 text-xs">Это поле обязательно</span>}
                            </div>
                            <div>
                                <label className="font-[400] text-[14px]  opacity-50">Ставка <span
                                    className="text-red-500">*</span></label>
                                <input {...register("rate", {required: true})} type="number" step="0.01"
                                       className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                                {errors.rate && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                            </div>
                        </div>

                        <div className={'flex gap-5'}>
                            <div>
                                <label className="font-[400] text-[14px]  opacity-50">Начало работы <span
                                    className="text-red-500">*</span></label>
                                <input {...register("startTime", {required: true})} type="time"
                                       className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                                {errors.startTime && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                            </div>
                            <div>
                                <label className="font-[400] text-[14px] opacity-50">Время работы <span
                                    className="text-red-500">*</span></label>
                                <select {...register("workTime", {required: true})}
                                        className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                    <option value="" disabled selected>Выберите время работы</option>
                                    <option value="4 ч.">4 ч.</option>
                                    <option value="5 ч.">5 ч.</option>
                                    <option value="6 ч.">6 ч.</option>
                                    <option value="7 ч.">7 ч.</option>
                                    <option value="8 ч.">8 ч.</option>
                                </select>
                                {errors.workTime && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                            </div>
                        </div>


                        <div>
                            <label className="font-[400] text-[14px]  opacity-50">Предпочтения в рабочих
                                днях</label>
                            <select {...register("workPreference")}
                                    className="block w-full  px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                <option value="">Выбрать</option>
                                <option value="5/2">5/2</option>
                                <option value="2/2">2/2</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div>
                            <label className="font-[400] text-[14px]  opacity-50">Модальность <span
                                className="text-red-500">*</span></label>
                            <div className="space-y-2 border rounded-lg p-4">
                                {["РГ", "МРТ", "КТ", "ММГ"].map((modality, index) => (
                                    <div key={index}>
                                        <input {...register("modality")} type="checkbox" value={modality}
                                               className="mr-2 leading-tight"/>
                                        <span className="text-gray-700">{modality}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="font-[400] text-[14px]  opacity-50">Доп. модальности <span
                                className="text-red-500">*</span></label>
                            <div className="space-y-2 border rounded-lg p-4">
                                {["РГ", "МРТ", "КТ", "ММГ", "ПЭТ/КТ", "Денситометрия", "НДКТ", "РХ", "ФЛГ"].map((modality, index) => (
                                    <div key={index}>
                                        <input {...register("additionalModality")} type="checkbox" value={modality}
                                               className="mr-2 leading-tight"/>
                                        <span className="text-gray-700">{modality}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center items-center">
                        <button type="submit"
                                className="bg-[#00A3FF] flex items-center justify-center font-[700] text-[18px] text-white px-[25px] py-[24px] rounded-[40px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Отправить
                            изменения на согласование
                        </button>
                        {/*<button type="button"*/}
                        {/*        className="bg-red-500 text-white p[]rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">Удалить*/}
                        {/*    сотрудника из системы*/}
                        {/*</button>*/}
                    </div>
                </form>

            </div>
        </div>
    )
}