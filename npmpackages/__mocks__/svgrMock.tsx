import React from 'react';

// eslint-disable-next-line react/jsx-props-no-spreading
const SvgrMock = React.forwardRef((props, ref: any) => <span ref={ref} {...props} />);

export const ReactComponent = SvgrMock;
export default SvgrMock;
