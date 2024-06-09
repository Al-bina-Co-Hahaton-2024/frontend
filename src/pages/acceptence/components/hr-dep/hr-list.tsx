import {AnimatePresence, motion} from "framer-motion";
import {_APPROVE_DICT} from "../../../../constants/constants";
import eye from "../../../../assets/eye.svg";
import React from "react";

export const HrList: React.FC<any> = React.memo(({hrDocs}) => {
    return (
        <div className={'flex items-center gap-[10px] overflow-hidden relative'}>
            <AnimatePresence mode={'wait'}>
                {hrDocs.map((doctor, index) => (
                    <motion.li
                        key={doctor.id}
                        className={'bg-white w-[430px] p-[20px] mt-[10px] shrink-0 grow-0 flex flex-col rounded-[20px] shadow-lg'}
                        initial={{x: '120vw'}}
                        animate={{x: 0}}
                        exit={{x: '-120vw'}}
                        transition={{duration: 0.5, ease: 'easeInOut'}}
                    >
                        <div className={' flex flex-col'}>
                            <div className={'text-[14px] font-[400] text-[#00000080]'}>Врач</div>
                            <div className={'font-[400] text-[18px] text-black'}>{doctor.last}</div>
                            <div className={'font-[400] text-[18px] text-black'}>{doctor.first} {doctor.middle}</div>
                        </div>
                        <div className={'w-full h-[1px] bg-[#00000026] my-[5px]'}></div>
                        <div className={'flex flex-col'}>
                            <div className={'text-[14px] font-[400] text-[#00000080]'}>Изменения в разделах:</div>
                            <div className={'flex flex-wrap w-full h-[110px]'}>
                                {Object.keys(doctor).map((k) => {
                                    if (doctor[k] !== null && Object.hasOwn(_APPROVE_DICT, k)) {
                                        return (
                                            <div key={k} className={'w-[50%] font-[600] text-[18px] text-black'}>
                                                {_APPROVE_DICT[k]}
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                            <div
                                className={'flex items-center gap-[15px] bg-[#FFA842] hover:bg-[#FFA980] transition duration-500 ease-in-out rounded-[50px] py-[6px] px-[15px] max-w-[277px] mt-[10px] cursor-pointer'}>
                                <img src={eye} alt={'eye'}/>
                                <span className={'font-[80] text-white text-[18px]'}>Рассмотреть изменения</span>
                            </div>
                        </div>
                    </motion.li>
                ))}
            </AnimatePresence>
        </div>
    )
});