import styled from 'styled-components';

interface photoBoxInterface {
  photoUrl: string;
}

export const BasicPhotoBoxStyle = styled.div`
  & {
    display: flex;
    width: 5.375rem;
    height: 5.375rem;
    border-radius: 5px;
    position: relative;
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

    .register-photo {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
`;

export const PreviewPhotoBoxStyle = styled(BasicPhotoBoxStyle)`
  & {
    border: 1px solid #f2f2f280;
    position: relative;
    background: url(${(props: photoBoxInterface) => props.photoUrl});
    background-position: center;
    background-size: cover;

    .delete-button {
      height: fit-content;
      position: absolute;
      top: 2px;
      right: 2px;
      cursor: pointer;
    }
  }
`;
