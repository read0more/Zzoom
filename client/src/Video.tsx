import React, { useEffect, useRef, VideoHTMLAttributes } from 'react';

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream | null;
};

export default function Video({ srcObject, ...props }: PropsType) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current || !srcObject) return;
    ref.current.srcObject = srcObject;
  }, [srcObject]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <video ref={ref} {...props} />;
}
