import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { BoothColor } from '@assets/const';
import { useBoothStore } from '@store/booth';
import { photoBooth } from '@utils/interface/photoBooth';
import { clone } from '@utils/tools/BasicUtils';
import { searchType } from '../map';
import SearchBox from './searchBox';

interface MapHeaderProps {
  curSearchType: searchType | null;
  setCurSearchType: (value: searchType | null) => void;
  searchByPlace: (keyword: string) => void;
  searchByBooth: (keyword: string) => void;
}

export default function MapHeader({
  curSearchType,
  setCurSearchType,
  searchByPlace,
  searchByBooth,
}: MapHeaderProps) {
  const [boothFilters, toggleFilter, resetFilter, deleteFilterAll] = useBoothStore((store) => [
    store.boothFilters,
    store.toggleFilter,
    store.resetFilter,
    store.deleteFilterAll,
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
  }, [Array.from(boothFilters).length]);

  return (
    <Wrapper>
      <SearchBox
        curSearchType={curSearchType}
        setCurSearchType={setCurSearchType}
        searchByPlace={searchByPlace}
        searchByBooth={searchByBooth}
      />
      <HeaderWrapper>
        <FilterSlide>
          <Filter
            state={true}
            color="white"
            style={{ color: 'black' }}
            onClick={() => {
              if (
                Array.from(boothFilters).length ===
                (Object.keys(photoBooth) as Array<photoBooth>).length
              ) {
                deleteFilterAll();
              } else {
                resetFilter();
              }
            }}
          >
            {Array.from(boothFilters).length ===
            (Object.keys(photoBooth) as Array<photoBooth>).length
              ? '전체 해제'
              : '전체 선택'}
          </Filter>
          {boothes.map((booth, idx) => {
            return (
              <Filter
                key={`${booth}${idx}`}
                state={boothFilters.has(booth)}
                color={BoothColor[booth]}
                style={{
                  color: booth === photoBooth.기타 ? '#242424' : 'white',
                }}
                onClick={() => {
                  toggleFilter(booth);
                }}
              >
                <p>{booth}</p>
                <CheckWrapper
                  state={boothFilters.has(booth)}
                  color={booth === photoBooth.기타 ? '#242424' : BoothColor[booth]}
                >
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
  top: 42px;
  z-index: 2;
  color: #979797;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  padding: 0 1.2rem;
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
