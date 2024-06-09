import { useState, useEffect } from 'react';
import { useGetDoctorChangesQuery, useGetFioDocsByIdMutation } from '../../../../store/api/doctors/doctorsApi';
import { motion, AnimatePresence } from 'framer-motion';
import orange_search from '../../../../assets/orange_search.svg';
import clock from '../../../../assets/clock.svg';
import eye from '../../../../assets/eye.svg';
import arrow from '../../../../assets/light-arrow.svg';
import { _APPROVE_DICT } from '../../../../constants/constants';
import {HrList} from "./hr-list";

export const HrDep = () => {
    const [hrPage, setHrPage] = useState(0);
    const [hrDocs, setHrDocs] = useState<any>([]);
    const { data: hrData, isSuccess: hrSuccess, isLoading: hrLoading } = useGetDoctorChangesQuery({ page: hrPage });
    const [getFioDocs] = useGetFioDocsByIdMutation();

    useEffect(() => {
        if (hrSuccess && hrData) {
            const ids = hrData.content.map((el) => el.doctorId);

            getFioDocs(ids)
                .unwrap()
                .then((res) => {
                    const result = hrData.content.map((el) => {
                        const element = res.find((fio) => fio.id === el.doctorId);
                        return {
                            ...el,
                            ...element.fullName,
                        };
                    });
                    setHrDocs(result);
                });
        }
    }, [hrData, hrPage, hrSuccess]);

    const nextSlide = () => {
        if (hrData.pageable.pageNumber < hrData.totalPages - 1) {
            setHrPage((prev) => prev + 1);
        }
    };

    const prevSlide = () => {
        if (hrData.pageable.pageNumber > 0) {
            setHrPage((prev) => prev - 1);
        }
    };

    return (
        <div className={'flex flex-col w-full h-[50%] relative'}>
            <div className={'flex items-center justify-between'}>
                <div className={'flex items-center gap-[15px] bg-[#FFA842] rounded-[50px] pt-[5px] pr-[15px] pb-[5px] pl-[15px]'}>
                    <span className={'font-[700] text-white text-[18px]'}>Кадровое отделение</span>
                    <span className={'w-[20px] h-[20px] rounded-[50%] bg-white text-black text-center overflow-hidden'}>
                        <div className={'text-sm'}>{hrData?.totalElements}</div>
                    </span>
                </div>
                <div className={'flex items-center gap-2 rounded-[20px] px-[25px] py-[12px] bg-white h-[40px]'}>
                    <img src={orange_search} alt={'search'} />
                    <input className={'border-none m-0 p-0'} placeholder={'Искать сверхразума...'} type="text" />
                </div>
            </div>
            <HrList hrDocs={hrDocs} />
            <div
                onClick={prevSlide}
                className={`hover:bg-[#FFA980] transition duration-500 ease-in-out absolute top-[50%] -left-10 w-[30px] h-[30px] rounded-[50%] bg-[#FFA842] flex justify-center items-center text-center cursor-pointer`}
            >
                <img src={arrow} alt={'<'} />
            </div>
            <div
                onClick={nextSlide}
                className={`hover:bg-[#FFA980] transition duration-500 ease-in-out absolute top-[50%] -right-10 w-[30px] h-[30px] rounded-[50%] bg-[#FFA842] flex justify-center items-center text-center rotate-[180deg] cursor-pointer`}
            >
                <img src={arrow} alt={'>'} />
            </div>
        </div>
    );
};
