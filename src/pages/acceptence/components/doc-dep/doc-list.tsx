import {_GRAPH_DOCS} from "../../../../constants/constants";
import eye from "../../../../assets/eye.svg";
import React from "react";
import {AnimatePresence, motion} from "framer-motion";


export const DocList: React.FC<any> = React.memo(({docs}) => {
    return (
        <div className={'flex items-center gap-[10px] overflow-hidden'}>
            <AnimatePresence mode={'wait'}>
                {
                    docs && docs.map((doctor) => (
                        <motion.li
                            key={doctor.id}
                            className={'bg-white w-[430px] p-[20px] mt-[10px] shrink-0 grow-0 flex flex-col rounded-[20px] shadow-lg'}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.5, ease: 'easeInOut'}}
                        >

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
                                <div className={'font-[400] text-[18px] text-black'}>{doctor.first}</div>
                                <div className={'font-[400] text-[18px] text-black'}>{doctor.last} {doctor.middle}</div>
                            </div>

                            <div className={'w-full h-[1px] bg-[#00000026] my-[5px]'}></div>

                            <div className={'flex flex-col'}>
                                <div className={'text-[14px] font-[400] text-[#00000080]'}>Изменения в разделах:</div>
                                <div className={'flex w-full h-[110px]'}>
                                    <div className={'w-1/2'}>
                                        {
                                            _GRAPH_DOCS[doctor.type] === 'График работы' && <div
                                                className={'font-[600] text-[18px] text-black'}>{_GRAPH_DOCS[doctor.type]}</div>
                                        }
                                        {
                                            _GRAPH_DOCS[doctor.type] === 'График отгулов' && <div
                                                className={'font-[600] text-[18px] text-black'}>{_GRAPH_DOCS[doctor.type]}</div>
                                        }

                                    </div>
                                </div>

                                <div
                                    className={'cursor-pointer flex items-center gap-[15px] bg-[#00A3FF] rounded-[50px] py-[6px] px-[15px] max-w-[277px] mt-[10px]'}>
                                    <img src={eye} alt={'eye'}/>
                                    <span className={'font-[80] text-white text-[18px]'}>Рассмотреть изменения</span>
                                </div>
                            </div>

                        </motion.li>
                    ))
                }
            </AnimatePresence>

        </div>
    )
})