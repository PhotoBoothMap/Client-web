import styled from 'styled-components';

export const GlobalLayout = styled.section`
  & {
    /* min-width: 23.4375rem; */
    width: 100vw;
    max-width: 28.125rem;

    min-height: calc(var(--vh, 1vh) * 100);
    height: 100vh;
    margin: 0 auto;

    position: relative;
    background-color: #242424;
  }
`;
