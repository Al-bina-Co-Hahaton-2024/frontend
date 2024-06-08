import {useForm} from "react-hook-form";
import {_DAYS_OF_WEEKS, _MEDICAL_MODALITIES} from "../../../constants/constants";
import React, {useState} from "react";
import {useAddUserMutation} from "../../../store/api/usersApi/usersApi";
import {useToApproveDoctorChangesMutation} from "../../../store/api/doctors/doctorsApi";

export const AdditionEmployeeForm = ({onFormSubmit}) => {

    const [addUser] = useAddUserMutation()
    const [toApproveDoctor] = useToApproveDoctorChangesMutation()

    const { register, handleSubmit,control, setValue, formState: { errors } } = useForm();


    const [selectedModality, setSelectedModality] = useState('');

    const modalities = ["РГ", "МРТ", "КТ", "ММГ", "Денситометр"];
    const additionalModalities = ["РГ", "МРТ", "КТ", "ММГ", "Денситометр", "ФЛГ"];

    const handleModalityChange = (event) => {
        setSelectedModality(event.target.value);
    };

    const onSubmit = (data) => {

        const optModality: string[] = []
        let convertedModality = ''
        const optionalModality = Object.entries(data.additionalModality).filter(([k,v]) => v).map(([k,v]) => k);
        const k = Object.keys(_MEDICAL_MODALITIES)
        for (const key of k) {
            if (_MEDICAL_MODALITIES[key] === data.modality) {
                convertedModality = key
            }
            for (const t of optionalModality) {
                if (_MEDICAL_MODALITIES[key] === t) {
                    optModality.push(key)
                }
            }
        }
        console.log(data)

        // {
        //     "doctorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        //     "rate": 0,
        //     "modality": "KT",
        //     "optionalModality": [
        //     "KT"
        // ],
        //     "startContract": "2024-06-08",
        //     "endContract": "2024-06-08",
        //     "hours": 0,
        //     "workDays": [
        //     "MONDAY"
        // ]
        // }
        const createdUser = {
            login: `user_${(Math.random() * 3) + 1}`,
            roles: [
                "DOCTOR"
            ],
            fullName: {
                first: data.firstName,
                last: data.lastName,
                middle: data.middleName,
            },
            password: `doctor`,
        }

        addUser(createdUser)
            .unwrap()
            .then((res) => {
                toApproveDoctor({
                    doctorId: res.id,
                    rate: data.rate,
                    modality: convertedModality,
                    optionalModality: optModality,
                    startContract: data.dateOfExit,
                    endContract: null,
                    hours: data.workTime,
                    workDays: data.workPreference?.map((el) => el?.value) ? data.workPreference?.map((el) => el?.value) : null,
                })
            })

        // onFormSubmit()
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 max-w-4xl overflow-y-scroll">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Фамилия <span className="text-red-500">*</span></label>
                    <input placeholder="Иванов" {...register("lastName", {required: true})}
                           className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                    {errors.lastName && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                </div>
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Отчество</label>
                    <input placeholder="Иванович" {...register("middleName")}
                           className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                </div>
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Имя <span
                        className="text-red-500">*</span></label>
                    <input placeholder="Иван" {...register("firstName", {required: true})}
                           className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                    {errors.firstName && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                </div>
                <div className="flex gap-5">
                    <div>
                        <label className="font-[400] text-[14px] opacity-50">Ставка<span
                            className="text-red-500">*</span></label>
                        <input placeholder={'0'} {...register("rate", {required: true})} type="number" step="0.01"
                               className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                        {errors.rate && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                    </div>
                </div>
                <div className="flex gap-5">
                    <div>
                        <label className="font-[400] text-[14px] opacity-50">Начало работы</label>
                        <input {...register("startTime",)} type="time"
                               className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                    </div>
                    <div>
                        <label className="font-[400] text-[14px] opacity-50">Время работы</label>
                        <select {...register("workTime",)}
                                className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                            <option value="" disabled>Выберите время работы</option>
                            <option value="4">4 ч.</option>
                            <option value="5">5 ч.</option>
                            <option value="6">6 ч.</option>
                            <option value="7">7 ч.</option>
                            <option value="8">8 ч.</option>
                            <option value="9">9 ч.</option>
                            <option value="10">10 ч.</option>
                            <option value="11">11 ч.</option>
                            <option value="12">12 ч.</option>
                        </select>
                        {errors.workTime && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                    </div>
                </div>
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Дата выхода <span
                        className="text-red-500">*</span></label>
                    <input {...register("dateOfExit", {required: true})} type="date"
                           className="block w-full bg-[#E6EDF0] px-4 py-2 mt-2 border rounded-[20px] focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"/>
                    {errors.dateOfExit && <span className="text-red-500 text-xs">Это поле обязательно</span>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Модальность <span
                        className="text-red-500">*</span></label>
                    <div className="space-y-2 border rounded-lg p-4">
                        {modalities.map((modality, index) => (
                            <div key={index}>
                                <input {...register("modality", {onChange: handleModalityChange})} type="radio"
                                       value={modality}
                                       className="mr-2 leading-tight" checked={selectedModality === modality}/>
                                <span className="text-gray-700">{modality}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="font-[400] text-[14px] opacity-50">Доп. модальности</label>
                    <div className="space-y-2 border rounded-lg p-4">
                        {additionalModalities.map((modality, index) => (
                            <div key={index}>
                                <input {...register(`additionalModality.${modality}`)} type="checkbox" value={modality}
                                       className="mr-2 leading-tight" disabled={selectedModality === modality}
                                />
                                <span className="text-gray-700">{modality}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-center items-center">
                <button type="submit"
                        className="bg-[#00A3FF] flex items-center justify-center font-[700] text-[18px] text-white px-[25px] py-[24px] rounded-[40px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                    Отправить данные нового сотрудника
                </button>
            </div>
        </form>
    )
}