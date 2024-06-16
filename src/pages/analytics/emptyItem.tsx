import { ModalPortal } from './moda-portal';
import { getTransformedModality } from '../../utils/transform';
import React, { useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { usePatchEmptyItemMutation } from '../../store/api/schedule/planer';

export const EmptyItem = ({ time, item, setModal, setTime }) => {
  const [selectedModality, setSelectedModality] = useState<any>(null);
  const [inputValue, setInputValue] = useState<any>(0);
  const [addItem] = usePatchEmptyItemMutation();

  const handleRadioChange = (modality) => {
    setSelectedModality(modality);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedModality || !inputValue) {
      let type = '';
      if (!selectedModality) {
        type = 'выбрали Модальность';
      } else {
        type = 'ввели Часы';
      }
      toast.warning(`Вы не ${type}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

      return;
    }
    addItem({
      date: moment(time).format('YYYY-MM-DD'),
      doctorId: item.id,
      extraHours: inputValue,
    })
      .unwrap()
      .then(() => {
        toast.warning(
          `График отредактирован, необходимо сгенерировать график заново!`,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          }
        );
        setTime((prev) => moment(prev).add(1, 'day').valueOf());
      })
      .catch(() => {
        toast.error(`Что-то пошло не так`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      })
      .finally(() => {
        setModal(false);
      });
  };

  return (
    <ModalPortal>
      <div
        className={
          'z-[9002]  absolute flex justify-center items-center left-[50%] top-[40%]'
        }
      >
        <div className={'flex flex-col bg-white rounded'}>
          <div className={' h-[55px] p-[20px] bg-gray-400 rounded'}>
            <div className={'font-[700] text-white text-[18px] justify-start'}>
              Редактирвоание плана работы
            </div>
          </div>
          <div className="flex flex-col">
            {item &&
              getTransformedModality(item).map((el: any) => (
                <div
                  key={el.defaultModality}
                  className="flex items-center gap-[2px] text-black p-[20px]"
                >
                  <input
                    type="radio"
                    name="modality"
                    value={el.modality}
                    onChange={() => handleRadioChange(el)}
                    checked={
                      selectedModality &&
                      selectedModality.defaultModality === el.defaultModality
                    }
                  />
                  <span className="font-bold text-[18px]">{el.modality}</span>
                </div>
              ))}
          </div>
          <div className="mt-4 p-2 flex items-center gap-[10px]">
            <div>
              <div>Введите количество часов</div>
              <div className={'flex gap-5 items-center'}>
                <input
                  max={20}
                  type={'number'}
                  autoFocus
                  value={inputValue}
                  onChange={handleInputChange}
                  className="border p-[10px] w-[100px]"
                  placeholder="Введите часы"
                />
                <button
                  onClick={handleSubmit}
                  className="p-[10px] bg-blue-500 text-white rounded"
                >
                  Установить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          setModal(false);
        }}
        className={
          'absolute w-full h-screen bg-black opacity-50 z-[9000] top-0 flex items-center justify-center'
        }
      ></div>
    </ModalPortal>
  );
};
