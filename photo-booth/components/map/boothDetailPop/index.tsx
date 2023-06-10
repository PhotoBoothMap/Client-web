import styled from 'styled-components';

import { BoothDetail } from '@utils/interface/photoBooth';

interface BoothDetailPopProps {
  boothDetail: BoothDetail;
}

export default function BoothDetailPop({ boothDetail }: BoothDetailPopProps) {
  return <Wrapper>
    <AppBar />
    <Header />
    <MetaWrapper />
    <Pictures />
  </Wrapper>;
}

const Wrapper = styled.div``;

const AppBar = styled.div``;

const Header = styled.div``;

const MetaWrapper = styled.div``;

const Pictures = styled.div``;

