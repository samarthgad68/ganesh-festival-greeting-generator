import React from 'react';

interface Page445x1080Props {
  name: string;
  designation?: string;
  address?: string;
  mobile?: string;
  photoUrl?: string | null;
  bgImageUrl?: string;
  scaleRatio?: number;
}

export const Page445x1080: React.FC<Page445x1080Props> = ({
  name = 'श्री गणेश ज्वेलर्स',
  designation = 'श्री महेश जोशी',
  address = 'दादर पूर्व, मुंबई',
  mobile = 'मोबाईल: ९८६५ ४३२१०',
  photoUrl = null,
  bgImageUrl = '/Pages/Page 1.jpg',
  scaleRatio = 1,
}) => {
  const line1 = name.trim() || 'श्री गणेश ज्वेलर्स';
  const line2 = designation.trim() || 'श्री महेश जोशी';
  const line3 = address.trim() || 'दादर पूर्व, मुंबई';
  const line4 = mobile.trim() || 'मोबाईल: ९८७६५ ४३२१०';

  const line1Len = line1.length;
  const maxOtherLen = Math.max(line2.length, line3.length, line4.length);
  const maxCharLen = Math.max(line1Len, maxOtherLen);

  let fontScale = 1;
  if (maxCharLen > 14) {
    fontScale = Math.max(0.48, 1 - (maxCharLen - 14) * 0.018);
  }

  const fontSizeL1 = Math.max(44, Math.round(86 * fontScale));
  const fontSizeL2 = Math.max(36, Math.round(fontSizeL1 * 0.82));
  const fontSizeL3 = Math.max(30, Math.round(fontSizeL1 * 0.72));
  const fontSizeL4 = Math.max(30, Math.round(fontSizeL1 * 0.72));

  const lineGap1 = Math.round(fontSizeL1 * 1.25);
  const lineGap2 = Math.round(fontSizeL2 * 1.25);
  const lineGap3 = Math.round(fontSizeL3 * 1.55);

  const totalTextHeight = fontSizeL1 * 0.8 + lineGap1 + lineGap2 + lineGap3 + fontSizeL4 * 0.2;
  const textTopTarget = 1697 - totalTextHeight / 2;

  const y1 = Math.round(textTopTarget + fontSizeL1 * 0.8);
  const y2 = y1 + lineGap1;
  const y3 = y2 + lineGap2;
  const y4 = y3 + lineGap3;

  return (
    <div
      style={{
        width: '445px',
        height: '791px',
        transform: scaleRatio !== 1 ? `scale(${scaleRatio})` : undefined,
        transformOrigin: 'top center',
      }}
      className="relative rounded-2xl shadow-2xl overflow-hidden select-none bg-[#7A0C16]"
    >
      <svg
        viewBox="0 0 1080 1920"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="photoClip">
            <rect x="665" y="1512" width="370" height="370" rx="18" />
          </clipPath>
        </defs>

        {/* Background Image */}
        {bgImageUrl && (
          <image
            href={bgImageUrl}
            x="0"
            y="0"
            width="1080"
            height="1920"
            preserveAspectRatio="xMidYMid slice"
          />
        )}

        {/* Bottom Personalization Text Group */}
        <g textAnchor="middle">
          {/* Line 1: Bold Reddish-Maroon (#c00000) */}
          <text
            x="330"
            y={y1}
            fontFamily="'Noto Sans Devanagari', 'Lohit Devanagari', 'Georgia', 'Times New Roman', 'DejaVu Serif', serif"
            fontSize={fontSizeL1}
            fontWeight="bold"
            fill="#c00000"
            style={{ color: '#c00000' }}
          >
            {line1}
          </text>

          {/* Line 2: Black (#000000) */}
          <text
            x="330"
            y={y2}
            fontFamily="'Noto Sans Devanagari', 'Lohit Devanagari', 'Arial', 'Helvetica', 'DejaVu Sans', sans-serif"
            fontSize={fontSizeL2}
            fontWeight="bold"
            fill="#000000"
          >
            {line2}
          </text>

          {/* Line 3: Black (#000000) */}
          <text
            x="330"
            y={y3}
            fontFamily="'Noto Sans Devanagari', 'Lohit Devanagari', 'Arial', 'Helvetica', 'DejaVu Sans', sans-serif"
            fontSize={fontSizeL3}
            fontWeight="normal"
            fill="#000000"
          >
            {line3}
          </text>

          {/* Line 4: Black (#000000) */}
          <text
            x="330"
            y={y4}
            fontFamily="'Noto Sans Devanagari', 'Lohit Devanagari', 'Arial', 'Helvetica', 'DejaVu Sans', sans-serif"
            fontSize={fontSizeL4}
            fontWeight="normal"
            fill="#000000"
          >
            {line4}
          </text>
        </g>

        {/* Photo Box */}
        {photoUrl ? (
          <g>
            <image
              href={photoUrl}
              x="665"
              y="1512"
              width="370"
              height="370"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#photoClip)"
            />
            <rect
              x="667"
              y="1514"
              width="366"
              height="366"
              rx="16"
              fill="none"
              stroke="#FFD700"
              strokeWidth="6"
            />
            <rect
              x="672"
              y="1519"
              width="356"
              height="356"
              rx="11"
              fill="none"
              stroke="#7A0C16"
              strokeWidth="2"
              opacity="0.8"
            />
          </g>
        ) : (
          <g>
            <rect x="665" y="1512" width="370" height="370" rx="18" fill="#7A0C16" />
            <rect
              x="670"
              y="1517"
              width="360"
              height="360"
              rx="14"
              fill="none"
              stroke="#FFD700"
              strokeWidth="4"
            />
            <circle cx="850" cy="1652" r="81" fill="#FFD700" />
            <path d="M 720 1837 Q 850 1715 980 1837 Z" fill="#FFD700" />
            <text
              x="850"
              y="1860"
              fontFamily="'Arial', 'Noto Sans Devanagari', sans-serif"
              fontSize="18"
              fontWeight="bold"
              fill="#FFD700"
              textAnchor="middle"
            >
              फोटो स्थान
            </text>
            <rect
              x="667"
              y="1514"
              width="366"
              height="366"
              rx="16"
              fill="none"
              stroke="#FFD700"
              strokeWidth="6"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

