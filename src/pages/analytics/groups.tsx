

export const DocGroups = ({ group }) => {
    return (
        <div className={'w-[200px] flex flex-col'}>
            <div className={'font-[700] text-[14px]'}>{group.fullName.first}</div>
            <div className={'font-[700] text-[14px]'}>{group.fullName.last} {group.fullName.middle}</div>
            <div className={'flex items-center gap-[5px] text-[12px] font-[600] text-[#00000080]'}>
                <div>{group.modality}</div> /
                <div>{group.optionalModality.join(',')}</div>
            </div>
        </div>
    );
};