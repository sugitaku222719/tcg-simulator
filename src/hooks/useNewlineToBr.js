import React from 'react';

const useNewlineToBr = () => {
  const convertNewlinesToBr = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return convertNewlinesToBr;
};

export default useNewlineToBr;