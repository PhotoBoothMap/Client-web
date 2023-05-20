import styled from 'styled-components';
// import tw from 'twin.macro';

const buttonColor = {
  yellow: '#FEE500',
  white: 'white',
};

const buttonSize = {
  large: {
    width: '20.4375rem',
    height: '3.5rem',
  },
};

interface buttonInterface {
  size: 'large';
  color: 'yellow' | 'white';
}

interface socialLoginButtonInterface {
  type: string;
}

/* ${tw`flex justify-center items-center rounded-lg cursor-pointer`} */
export const BasicLoginButtonStyle = styled.div`
  & {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    cursor: pointer;

    box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.05);
    width: ${(props: buttonInterface) => buttonSize[props.size].width};
    height: ${(props: buttonInterface) => buttonSize[props.size].height};
  }
`;

/* ${tw`relative`} */
export const SocialLoginButtonStyle = styled(BasicLoginButtonStyle)`
  & {
    position: relative;
    background: ${(props: buttonInterface) => buttonColor[props.color]};
  }
`;
