import {
  BasicButtonStyle,
  SocialLoginButtonStyle,
  buttonColorType,
  buttonSizeype,
} from '@styles/common/ButtonStyle';
import React from 'react';

type buttonProps = {
  text: string;
  color: buttonColorType;
  size: buttonSizeype;
  onClickEvent?: any;
};

const BasicButton = ({ size, text, color, onClickEvent }: buttonProps) => {
  return (
    <BasicButtonStyle size={size} color={color} onClick={() => onClickEvent()}>
      <div>{text}</div>
    </BasicButtonStyle>
  );
};

export default BasicButton;
