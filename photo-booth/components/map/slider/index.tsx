import styled from 'styled-components';

import { useBoothStore } from '@store/booth';
import { photoBooth } from '@utils/interface/photoBooth';
import { useMemo } from 'react';

interface SliderProps {}

interface SliderElementProps extends SliderProps {
  booth: photoBooth;
}

function SlideElement({ booth }: SliderElementProps) {
  const [curFilters, toggleFilter] = useBoothStore((store) => [
    store.boothFilters,
    store.toggleFilter,
  ]);
  const state = curFilters.has(booth);

  return (
    <BoxWrapper
      onClick={() => {
        toggleFilter(booth);
      }}
    ></BoxWrapper>
  );
}

/**
 * 부스 필터링 용 슬라이더
 */
export default function Slider({}: SliderProps) {
  const boothes = useMemo(() => {
    return [...(Object.keys(photoBooth) as Array<photoBooth>)];
  }, []);

  return (
    <Wrapper>
      {boothes.map((booth) => {
        // filter 된 photoBooth
        return SlideElement({ booth: booth });
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const BoxWrapper = styled.div``;
