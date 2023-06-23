import styled from 'styled-components';

interface hamburgerInterface {
  display: string;
}

export const BasicPhotoBoxStyle = styled.div`
  & {
    display: flex;
    width: 5.375rem;
    height: 5.375rem;
    /* border: 1px dashed #f2f2f280; */
    border-radius: 5px;
    /* min-height: 100vh; */
    /* position: absolute; */
  }
`;

export const RegisterPhotoBoxStyle = styled(BasicPhotoBoxStyle)`
  & {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    border: 1px dashed #f2f2f280;
    cursor: pointer;
  }
`;

export const RegisteredPhotoBoxStyle = styled(BasicPhotoBoxStyle)`
  & {
    border: 1px solid #f2f2f280;
    position: relative;
    .delete-button {
      position: absolute;
      top: 2px;
      right: 2px;
    }
  }
`;
