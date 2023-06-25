import styled from 'styled-components';
// import tw from 'twin.macro';

export type buttonColorType = 'white' | 'yellow' | 'darkYellow';
export type buttonSizeype = 'large' | 'xLarge';

const buttonColor = {
  white: 'white',
  yellow: '#FEE500',
  darkYellow: '#FFC700',
};

const buttonSize = {
  large: {
    width: '20.4375rem',
    height: '3.5rem',
  },
  xLarge: {
    width: '21.4375rem',
    height: '3.5rem',
  },
};

interface buttonInterface {
  size: buttonSizeype;
  color: buttonColorType;
}

interface socialLoginButtonInterface {
  type: string;
}

/* ${tw`flex justify-center items-center rounded-lg cursor-pointer`} */
export const BasicButtonStyle = styled.div`
  & {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    cursor: pointer;

    box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.05);
    width: ${(props: buttonInterface) => buttonSize[props.size].width};
    height: ${(props: buttonInterface) => buttonSize[props.size].height};

    background: ${(props: buttonInterface) => buttonColor[props.color]};
  }
`;

/* ${tw`relative`} */
export const SocialLoginButtonStyle = styled(BasicButtonStyle)`
  & {
    position: relative;
  }
`;
