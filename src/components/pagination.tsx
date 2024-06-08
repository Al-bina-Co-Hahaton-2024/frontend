import React from 'react';
import ReactPaginate from 'react-paginate';
import prevArrow from '../assets/arrow.svg'

export const Pagination = ({ pageCount, onPageChange }) => {
    return (
        <ReactPaginate
            previousLabel={<img src={prevArrow} alt={'<'} />}
            nextLabel={<img src={prevArrow} alt={'>'}/>}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={onPageChange}
            containerClassName={'flex items-center justify-center space-x-2 mt-[15px] bg-white rounded-full p-2 shadow-md w-fit mx-auto relative'}
            activeClassName={'bg-blue-500 text-white'}
            pageClassName={'w-8 h-8 flex items-center justify-center rounded-full'}
            pageLinkClassName={'w-full h-full flex items-center justify-center'}
            previousClassName={'w-10 h-10 flex items-center justify-center rounded-full bg-white absolute -left-[60px] hover:bg-blue-500 '}
            previousLinkClassName={'w-full h-full flex items-center justify-center'}
            nextClassName={'w-10 h-10 flex items-center justify-center rounded-full bg-white absolute -right-[60px] hover:bg-blue-500 '}
            nextLinkClassName={'w-full h-full flex items-center justify-center rotate-180'}
            breakClassName={'w-8 h-8 flex items-center justify-center rounded-full border border-gray-300'}
            breakLinkClassName={'w-full h-full flex items-center justify-center'}
        />
    );
};

