import { searchType } from '@components/map/map';
import LogoDark from '@image/logo_dark.png';
import SearchIcon from '@image/search_icon.png';
import YellowArrow from '@image/yellow_arrow.png';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

interface SearchBoxProps {
  curSearchType: searchType | null;
  setCurSearchType: (value: searchType | null) => void;
  searchByPlace: (keyword: string) => void;
  searchByBooth: (keyword: string) => void;
}

export default function SearchBox({
  curSearchType,
  setCurSearchType,
  searchByPlace,
  searchByBooth,
}: SearchBoxProps) {
  const [isSelectView, setIsSelectView] = useState<boolean>(false);
  const [curInput, setCurInput] = useState<string>('');

  const inputPlaceholder = useMemo(() => {
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
    <Wrapper>
      <Image src={LogoDark} alt="" width="42" height="42" />
      <SearchBoxWrapper>
        <DropDown
          state={isSelectView}
          onBlur={() => {
            setIsSelectView(false);
          }}
        >
          <div
            className="dropdown_title"
            onClick={() => {
              setIsSelectView(!isSelectView);
            }}
          >
            <span>{curSearchType ?? '선택'}</span>
            <Image src={YellowArrow} alt="" height="8" />
          </div>
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
        <div className="input_wrapper">
          <input
            placeholder={inputPlaceholder}
            value={curInput}
            onChange={(e) => {
              setCurInput(e.target.value);
            }}
            disabled={curSearchType === null}
          />
          <Image
            src={SearchIcon}
            alt="searcbox_icon"
            width="16"
            onClick={() => {
              switch (curSearchType) {
                case searchType.부스:
                  searchByBooth(curInput);
                  break;
                case searchType.지역:
                  searchByPlace(curInput);
                  break;
              }
            }}
          />
        </div>
      </SearchBoxWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;
  gap: 10px;
  & > img {
    flex-shrink: 0;
  }
`;

const SearchBoxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex: 0 0 auto;
  height: 42px;
  padding: 0rem 1.5rem;

  background-color: #242424;
  border-radius: 40px;
  & > .input_wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    input {
      width: 200px;
      background-color: inherit;
      border: none;
      outline: none;
      font-size: 16px;
      color: #f2f2f2;
    }

    input::placeholder {
      font-size: 16px;
      color: #f2f2f2;
      opacity: 0.5;
    }

    img {
      flex: 0 0 auto;
      object-fit: contain;
    }
  }
`;

interface DropDownProps {
  state: boolean;
}

const DropDown = styled.button<DropDownProps>`
  width: 80px;
  height: 36px;
  font-size: 16px;
  position: relative;
  color: #979797;
  background-color: #242424;
  border: none;
  margin-right: 10px;

  & > ul {
    position: absolute;
    left: -1rem;
    top: 40px;
    background-color: #242424;
    width: 80px;
    padding: 0.5rem;
    opacity: ${({ state }) => (state ? 1 : 0)};
    transition-duration: 0.5s;
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

  & div.dropdown_title {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    img {
      flex: 0 0 auto;
      object-fit: contain;
      transform: ${({ state }) => (state ? 'rotateX(180deg)' : 'rotateX(0deg)')};
      transition-duration: 0.5s;
    }
  }
`;
