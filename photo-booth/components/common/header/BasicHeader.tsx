import React from 'react';
import Image from 'next/image';

type props = {
  type: 'close' | 'back';
  text: string;
  onClickEvent: () => void;
};

const BasicHeader = ({ type, text, onClickEvent }: props) => {
  return (
    <div
      className={`review-header flex items-center justify-between p-4 border-[#2A2A2A] border-b`}
    >
      <div
        className={`cursor-pointer`}
        onClick={() => {
          onClickEvent();
        }}
      >
        <Image src={`/common/${type}.svg`} width={25} height={25} alt="버튼" />
      </div>
      <div className={`font-semibold`}>{text}</div>
      <div></div>
    </div>
  );
};

export default BasicHeader;
