import styled from 'styled-components';

interface hamburgerInterface {
  display: string;
}

export const HamburgerStyle = styled.section`
  & {
    display: ${(props: hamburgerInterface) => props.display};
    width: 100%;
    min-height: 100vh;
    position: absolute;

    > div:last-child {
      width: 40%;
      height: 100%;
      min-height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      opacity: 50%;
      cursor: pointer;
    }

    div.body {
      display: flex;
      flex-direction: column;
      background-color: white;
      width: 60%;

      > div.user-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        width: 100%;
        height: 15rem;

        > div:first-child {
          width: 6rem;
          height: 6rem;
          border-radius: 50%;
          overflow: hidden;

          > div {
            width: 100%;
            height: 100%;
            background-color: #d9d9d9;
          }
        }

        > button {
          min-width: 10rem;
          padding: 0.5rem 1rem;
          border: 1px solid #818181;
          border-radius: 15px;
          background-color: white;
        }
      }

      div.menu-section {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        padding: 1.75rem;
        width: 100%;

        > div {
          width: 100%;
        }
      }
    }
  }
`;
