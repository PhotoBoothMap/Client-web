import React from 'react';
import Image from 'next/image';

type props = {
  type: 'close' | 'back';
  text: string;
  rightElement?: null | any;
  onClickEvent: () => void;
};

const BasicHeader = ({ type, text, rightElement = null, onClickEvent }: props) => {
  return (
    <div
      className={`review-header flex items-center justify-between p-4 border-[#2A2A2A] border-b`}
    >
      <div
        className={`flex flex-shrink items-center justify-start cursor-pointer w-[30%]`}
        onClick={() => {
          onClickEvent();
        }}
      >
        <Image src={`/common/${type}.svg`} width={25} height={25} alt="버튼" />
      </div>
      <div className={`flex font-semibold flex-grow justify-center items-center w-[30%]`}>
        {text}
      </div>
      <div className={`flex flex-shrink items-center justify-end w-[30%]`}>
        {rightElement && rightElement}
      </div>
    </div>
  );
};

export default BasicHeader;
