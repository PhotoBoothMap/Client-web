import Image from 'next/image';
import styled from 'styled-components';

const tags = {
  PICTURE: '사진이 잘 나와요',
  LIGHT: '조명이 좋아요',
  RETOUCH: '보정이 자연스러워요',
  VARIOUS: '소품이 다양해요',
  CLEAN: '소품이 깨끗해요',
  BOOTH: '부스 구성이 다양해요',
  FACILITY: '시설이 깔끔해요',
  POWDER_ROOM: '파우더룸이 좋아요',
  PARKING: '주차가 편해요',
};

export type tagKey =
  | 'PICTURE'
  | 'LIGHT'
  | 'RETOUCH'
  | 'VARIOUS'
  | 'CLEAN'
  | 'BOOTH'
  | 'FACILITY'
  | 'POWDER_ROOM'
  | 'PARKING';

type props = {
  tagKey: tagKey;
  selected?: boolean;
};

const Tag = ({ tagKey, selected = false }: props) => {
  return (
    <Wrapper
      className={`flex items-center justify-start gap-1 bg-[#2A2A2A] rounded-3xl min-w-[9.125rem] w-fit py-2 px-4 ${
        selected && 'border border-[#FFC700]'
      } box-border cursor-pointer`}
    >
      <Image
        src={`/common/review/tag/${tagKey}.svg`}
        width={24}
        height={24}
        alt={`${tags[tagKey]}`}
      />
      <div className={`text-xs font-semibold text-[#F2F2F2]`}>{tags[tagKey]}</div>
    </Wrapper>
  );
};

export default Tag;

const Wrapper = styled.div`
  width: 165px;
  padding: 0.5rem;
`;
