import styled from 'styled-components';

import Map from '@components/map/map';

export default function Main() {
  return (
    <Page>
      <Map />
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  position: relative;
  & {
    div.loading {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      z-index: 9999;
      position: absolute;
      top: 0;
      left: 0;
      backdrop-filter: blur(12px);
    }
  }
`;
