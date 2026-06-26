import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Brand monogram favicon — white "S" on Stasera navy. Replace with a logo asset
// (app/icon.png) later if a mark is designed.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#334157',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 700,
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
