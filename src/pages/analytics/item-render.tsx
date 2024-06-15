import React, { useRef, useState } from 'react';
import { TooltipPortal } from './tooltip-portal';
import { useGetToolTipModalityMutation } from '../../store/api/schedule/planer';
import { translateModality } from '../../utils/transform';
import { ModalPortal } from './moda-portal';
import zamok from '../../assets/zamok.svg';

export const DocItem = ({
  item,
  itemContext,
  getItemProps,
  getResizeProps,
}) => {
  const [getToolTip] = useGetToolTipModalityMutation();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [toolTipData, setToolTipData] = useState(null);

  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [modalVisible, setModalVisible] = useState(false);

  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    const req = item.doctorWorks.map((el) => {
      return {
        doctorId: item.doctorId,
        modality: el.modality,
        typeModality: el.typeModality,
        hours: el.usedExtraHours + el.usedHours,
      };
    });
    setTooltipPosition({
      top: rect.top + window.scrollY + rect.height / 2,
      left: rect.left + window.scrollX + rect.width + 10,
    });
    setIsTooltipVisible(true);
    getToolTip(req)
      .unwrap()
      .then((res) => {
        setToolTipData(res);
      });
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };
  const privateExtras = item.manualExtraHours > 0;

  const handleClick = (e) => {
    if (privateExtras) return;
    const rect = e.target.getBoundingClientRect();
    setIsTooltipVisible(false);
    setModalPosition({
      top: rect.top + window.scrollY + rect.height / 2,
      left: rect.left + window.scrollX + rect.width + 10,
    });
    setModalVisible(true);
  };

  const className = `${item.status === 'yellow' && '!bg-[#FFA842]'} ${item.status === 'green' && '!bg-[#4FDE77]'} ${item.status === 'gray' && '!bg-black'} ${privateExtras && '!bg-[#FFA842] opacity-60'}`;

  return (
    <>
      <div
        {...getItemProps({
          style: {
            color: 'white',
            borderRadius: 4,
            border: '1px solid blue',
            height: '100%',
            lineHeight: 'normal',
            position: 'relative',
          },
          className,
        })}
        onClick={handleClick}
      >
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="rct-item-Azs"
        >
          {privateExtras && (
            <img
              className={'absolute top-5  w-[15px] h-[15px]'}
              src={zamok}
              alt={'closed'}
            />
          )}
        </div>
        {isTooltipVisible && (
          <TooltipPortal>
            <div
              className="bg-white shadow-xl w-[300px] absolute flex flex-col rounded-xl overflow-hidden"
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
                transform: 'translateY(-50%)',
                zIndex: 1000,
                borderRadius: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              <div className={'w-full h-[55px] p-[20px] bg-[#869189]'}>
                <div
                  className={'font-[700] text-white text-[18px] justify-start'}
                >
                  Планы работы
                </div>
                <div></div>
              </div>
              <div className={'flex flex-col'}></div>
              {toolTipData &&
                translateModality(toolTipData).map((el) => (
                  <div
                    className={
                      'flex items-center gap-[2px] text-black p-[20px]'
                    }
                  >
                    <span className={'font-bold text-[18px]'}>
                      {el.modality}
                    </span>
                    <span className={'text-[18px]'}>-</span>
                    <span className={'text-[18px]'}>
                      {el.hours.toFixed(0)} ч.
                    </span>
                    <span className={'text-[18px]'}>~</span>
                    <span className={'text-[18px]'}>{el.work} УЕ</span>
                  </div>
                ))}
            </div>
          </TooltipPortal>
        )}
        {modalVisible && (
          <ModalPortal>
            <div
              className="bg-white shadow-xl w-[300px] absolute flex flex-col rounded-xl overflow-hidden !z-[9999]"
              style={{
                top: `${modalPosition.top}px`,
                left: `${modalPosition.left}px`,
                transform: 'translateY(-50%)',
                zIndex: 1000,
                borderRadius: '4px',
                whiteSpace: 'nowrap',
              }}
            >
              <div className={'w-full h-[55px] p-[20px] bg-[#869189]'}>
                <div
                  className={'font-[700] text-white text-[18px] justify-start'}
                >
                  Редактирвоание плана работы
                </div>
                <div></div>
              </div>
              <div className={'flex flex-col'}>Мухаморинк эбаут</div>
            </div>
            <div
              onMouseEnter={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setModalVisible(false);
              }}
              className={
                'bg-black opacity-40 fixed top-0 w-screen h-screen z-[9900] overflow-hidden'
              }
            />
          </ModalPortal>
        )}
      </div>
    </>
  );
};
