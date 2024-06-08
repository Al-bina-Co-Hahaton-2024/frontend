import blue_search from "../../../../assets/blue_search.svg";
import clock from "../../../../assets/clock.svg";
import eye from "../../../../assets/eye.svg";
import arrow from "../../../../assets/light-arrow.svg";


export const DocDep = () => {

    return (
        <div className={'flex flex-col w-full h-[50%] relative'}>

            <div className={'flex items-center justify-between'}>

                <div
                    className={'flex items-center gap-[15px] bg-[#00A3FF] rounded-[50px] pt-[5px] pr-[15px] pb-[5px] pl-[15px]'}>
                    <span className={'font-[700] text-white text-[18px]'}>Кадровое отделение</span>
                    <span className={'w-[20px] h-[20px] rounded-[50%] bg-white text-black text-center'}><div
                        className={'text-sm'}>12</div></span>
                </div>

                <div className={'flex items-center gap-2 rounded-[20px] px-[25px] py-[12px] bg-white h-[40px]'}>
                    <img src={blue_search} alt={'search'}/>
                    <input className={'border-none m-0 p-0'} placeholder={'Искать сверхразума...'} type="text"/>
                </div>

            </div>

            <div className={'flex items-center gap-[10px] overflow-hidden'}>

                <div
                    className={'bg-white min-w-[430px] p-[20px] mt-[10px] shrink-0 grow-0 flex flex-col rounded-[20px] shadow-lg'}>

                    <div className={'flex items-center gap-[10px] text-[14px] font-[400] text-[#00000080]'}>
                        <div className={'flex items-center gap-[5px]'}>
                            <img className={'-translate-y-[1px]'} src={clock} alt={'clock'}/>
                            <div>13:38</div>
                        </div>
                        <div>|</div>
                        <div>22.06.2024</div>
                        <div>|</div>
                        <div>Кадровое отделение</div>
                    </div>

                    <div className={' flex flex-col'}>
                        <div className={'text-[14px] font-[400] text-[#00000080]'}>Врач</div>
                        <div className={'font-[400] text-[18px] text-black'}>Константинопольский</div>
                        <div className={'font-[400] text-[18px] text-black'}>Константин Константинович</div>
                    </div>

                    <div className={'w-full h-[1px] bg-[#00000026] my-[5px]'}></div>

                    <div className={'flex flex-col'}>
                        <div className={'text-[14px] font-[400] text-[#00000080]'}>Изменения в разделах:</div>
                        <div className={'flex w-full h-[110px]'}>
                            <div className={'w-1/2'}>
                                <div className={'font-[600] text-[18px] text-black'}>a</div>
                                <div className={'font-[600] text-[18px] text-black'}>a</div>
                                <div className={'font-[600] text-[18px] text-black'}>a</div>
                                <div className={'font-[600] text-[18px] text-black'}>a</div>
                            </div>
                            <div className={'w-1/2'}>
                                <div className={'font-[600] text-[18px] text-black'}>Ставка</div>
                            </div>
                        </div>

                        <div
                            className={'flex items-center gap-[15px] bg-[#00A3FF] rounded-[50px] py-[6px] px-[15px] max-w-[277px] mt-[10px]'}>
                            <img src={eye} alt={'eye'}/>
                            <span className={'font-[80] text-white text-[18px]'}>Рассмотреть изменения</span>
                        </div>
                    </div>

                </div>


            </div>

            <div
                className={`absolute top-[50%] -left-10 w-[30px] h-[30px] rounded-[50%] bg-[#00A3FF] flex justify-center items-center text-center`}>
                <img src={arrow} alt={'<'}/>
            </div>

            <div
                className={`absolute top-[50%] -right-10 w-[30px] h-[30px] rounded-[50%] bg-[#00A3FF] flex justify-center items-center text-center rotate-[180deg]`}>
                <img src={arrow} alt={'<'}/>
            </div>

        </div>
    )
}