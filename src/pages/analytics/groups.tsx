

export const DocGroups = ({ group }) => {
    console.log(group)
    return (
        <div className={'w-[200px] flex flex-col'}>
            <div>{group.fullName.first}</div>
            <div>{group.fullName.last} {group.fullName.middle}</div>
        </div>
    );
};