import { ModalPortal } from './moda-portal';
import { translateModality } from '../../utils/transform';
import React from 'react';

export const EmptyItem = () => {
  return (
    <ModalPortal>
      <div className={'absolute w-full h-screen bg-black opacity-50 z-[9000]'}>
        <div className={''}>
          <div className={'w-full h-[55px] p-[20px] bg-[#869189]'}>
            <div className={'font-[700] text-white text-[18px] justify-start'}>
              Редактирвоание плана работы
            </div>
          </div>
          <div className="flex flex-col">
            {/*  {modalData &&*/}
            {/*    translateModality(modalData).map((el: any) => (*/}
            {/*      <div*/}
            {/*        key={el.defaultModality}*/}
            {/*        className="flex items-center gap-[2px] text-black p-[20px]"*/}
            {/*      >*/}
            {/*        <input*/}
            {/*          type="radio"*/}
            {/*          name="modality"*/}
            {/*          value={el.modality}*/}
            {/*          onChange={() => handleRadioChange(el)}*/}
            {/*          checked={*/}
            {/*            selectedModality &&*/}
            {/*            selectedModality.defaultModality === el.defaultModality*/}
            {/*          }*/}
            {/*        />*/}
            {/*        <span className="font-bold text-[18px]">{el.modality}</span>*/}
            {/*        <span className="text-[18px]">-</span>*/}
            {/*        <span className="text-[18px]">{el.hours.toFixed(0)} ч.</span>*/}
            {/*        <span className="text-[18px]">~</span>*/}
            {/*        <span className="text-[18px]">{el.work} УЕ</span>*/}
            {/*      </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            {/*<div className="mt-4 p-2 flex items-center gap-[10px]">*/}
            {/*  <div></div>*/}
            {/*  <input*/}
            {/*    max={20}*/}
            {/*    type={'number'}*/}
            {/*    autoFocus*/}
            {/*    value={inputValue}*/}
            {/*    onChange={handleInputChange}*/}
            {/*    className="border p-[10px] w-[100px]"*/}
            {/*    placeholder="Введите часы"*/}
            {/*  />*/}
            {/*  <button*/}
            {/*    onClick={handleSubmit}*/}
            {/*    className="p-[10px] bg-blue-500 text-white rounded"*/}
            {/*  >*/}
            {/*    Установить*/}
            {/*  </button>*/}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
