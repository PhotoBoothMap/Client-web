import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { BoothColor } from '@assets/const';
import SearchIcon from '@image/search_icon.png';
import { useBoothStore } from '@store/booth';
import { photoBooth } from '@utils/interface/photoBooth';
import { clone } from '@utils/tools/BasicUtils';
import { searchType } from '../map';

interface SearchBoxProps {
  curSearchType: searchType | null;
  setCurSearchType: (value: searchType | null) => void;
  searchByPlace: (keyword: string) => void;
}

function SearchBox({ curSearchType, setCurSearchType, searchByPlace }: SearchBoxProps) {
  const [isSelectView, setIsSelectView] = useState<boolean>(false);
  const [curInput, setCurInput] = useState<string>('');

  const inputPlaceholder = useMemo(() => {
    console.log(curSearchType);
    switch (curSearchType) {
      case searchType.부스:
        return '브랜드 명으로 검색해보세요';
      case searchType.지역:
        return '지역 명으로 검색해보세요';
      default:
        return '브랜드, 장소를 선택해주세요';
    }
  }, [isSelectView, curSearchType]);

  return (
    <SearchBoxWrapper>
      <DropDown
        state={isSelectView}
        onBlur={() => {
          setIsSelectView(false);
        }}
      >
        <span
          onClick={() => {
            setIsSelectView(!isSelectView);
          }}
        >
          {curSearchType ?? '선택'}
        </span>
        <ul className="dropdown_menus">
          <li
            className="dropdown_menu"
            onClick={() => {
              setCurSearchType(searchType.부스);
              setIsSelectView(false);
            }}
          >
            부스명
          </li>
          <li
            className="dropdown_menu"
            onClick={() => {
              setCurSearchType(searchType.지역);
              setIsSelectView(false);
            }}
          >
            지역
          </li>
        </ul>
      </DropDown>
      <Image src={SearchIcon} alt="searcbox_icon" width="24" onClick={() => {}} />
      <input
        placeholder={inputPlaceholder}
        value={curInput}
        onChange={(e) => {
          setCurInput(e.target.value);
        }}
        disabled={curSearchType === null}
      />
    </SearchBoxWrapper>
  );
}

const SearchBoxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1rem;
  margin-right: 1rem;
  padding: 0.5rem 0.5rem;

  background-color: #242424;
  border-radius: 40px;
  & > input {
    width: 200px;
    background-color: inherit;
    border: none;
    outline: none;
    font-size: 16px;
    color: #979797;
  }
`;

interface DropDownProps {
  state: boolean;
}

const DropDown = styled.button<DropDownProps>`
  width: 100px;
  height: 36px;
  font-size: 16px;
  position: relative;
  color: #979797;
  background-color: #242424;
  border: none;
  border-right: 1px solid #979797;
  margin-right: 10px;

  & > ul {
    position: absolute;
    left: 0;
    top: 48px;
    background-color: #242424;
    width: 100px;
    padding: 0.5rem;
    opacity: ${({ state }) => (state ? 1 : 0)};
    pointer-events: ${({ state }) => (state ? 'auto' : 'none')};
    list-style-type: none;
    z-index: 99;
    li {
      background-color: #242424;
      padding: 0.5rem;
    }
    li:first-child {
      border-bottom: 1px solid #979797;
    }
  }
`;

interface MapHeaderProps {
  curSearchType: searchType | null;
  setCurSearchType: (value: searchType | null) => void;
  searchByPlace: (keyword: string) => void;
}

export default function MapHeader({
  curSearchType,
  setCurSearchType,
  searchByPlace,
}: MapHeaderProps) {
  const [boothFilters, toggleFilter] = useBoothStore((store) => [
    store.boothFilters,
    store.toggleFilter,
  ]);

  const [boothes, setBoothes] = useState([...(Object.keys(photoBooth) as Array<photoBooth>)]);

  const boothesOrigin = useMemo(() => {
    return [...(Object.keys(photoBooth) as Array<photoBooth>)];
  }, []);

  useEffect(() => {
    const curBoothes = clone(boothes);
    curBoothes.sort((a, b) => {
      const leftV = boothFilters.has(a) ? -1 * boothesOrigin.indexOf(a) : -99;
      const rightV = boothFilters.has(b) ? -1 * boothesOrigin.indexOf(b) : -99;
      return rightV - leftV;
    });
    setBoothes(curBoothes);
    console.log(curBoothes);
  }, [Array.from(boothFilters).length]);

  return (
    <Wrapper>
      <SearchBox
        curSearchType={curSearchType}
        setCurSearchType={setCurSearchType}
        searchByPlace={searchByPlace}
      />
      <HeaderWrapper>
        <FilterSlide>
          {boothes.map((booth, idx) => {
            return (
              <Filter
                key={`${booth}${idx}`}
                state={boothFilters.has(booth)}
                color={BoothColor[booth]}
                onClick={() => {
                  toggleFilter(booth);
                }}
              >
                <p>{booth}</p>
                <CheckWrapper state={boothFilters.has(booth)} color={BoothColor[booth]}>
                  {boothFilters.has(booth) ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : (
                    <FontAwesomeIcon icon={faPlus} />
                  )}
                </CheckWrapper>
              </Filter>
            );
          })}
        </FilterSlide>
      </HeaderWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: absolute;
  top: 30px;
  z-index: 2;
  color: #979797;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 1rem;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const FilterSlide = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

interface FilterProps {
  state: boolean;
  color: String;
}
const Filter = styled.div<FilterProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  gap: 5px;
  height: 40px;
  padding: 0 1rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04);
  border-radius: 32px;
  background-color: ${({ state, color }) => (state ? color : '#242424')};
  transition: all 0.5s;
  color: white;
`;

interface CheckWrapperProps {
  state: boolean;
  color: string;
}

const CheckWrapper = styled.div<CheckWrapperProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  border-radius: 20px;
  background-color: ${({ state }) => (state ? 'white' : 'rgba(0,0,0,0)')};
  color: ${({ state, color }) => (state ? color : 'rgb(127,127,127)')};
`;
