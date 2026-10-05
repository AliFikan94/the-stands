// Heraldic Liver Bird crest, ported from a Grok Build prototype
// (grok-workspace/src/lib/crest/anatomy.ts) that modeled it as 5 depth
// layers for a 3D extrusion. We only need the flat 2D artwork here — same
// vector paths, no three.js.

type LayerId = 'farWing' | 'tailLegs' | 'torso' | 'nearWing' | 'beakLaver'

type PathPart = { d: string; material?: 'body' | 'bodyShadow' | 'gold' | 'eye' }

const LAYER_ORDER: LayerId[] = ['farWing', 'tailLegs', 'torso', 'nearWing', 'beakLaver']

const LAYER_DEFAULT_MATERIAL: Record<LayerId, 'body' | 'bodyShadow' | 'gold'> = {
  farWing: 'bodyShadow',
  tailLegs: 'body',
  torso: 'body',
  nearWing: 'body',
  beakLaver: 'gold',
}

const LAYER_PATHS: Record<LayerId, PathPart[]> = {
  farWing: [
    {
      d: 'M120 136 C152 104 184 64 202 34 C210 22 224 14 214 6 C198 2 180 18 168 40 C160 56 164 64 156 60 C146 46 138 62 134 78 C128 70 120 86 118 102 C112 96 106 112 104 128 C102 138 108 142 120 136 Z',
    },
    {
      d: 'M130 98 C150 74 170 48 184 32 C174 48 156 72 138 96 C132 104 128 106 130 98 Z',
    },
    {
      d: 'M124 114 C142 90 160 68 172 52 C162 68 144 92 128 112 C124 118 120 120 124 114 Z',
    },
  ],
  tailLegs: [
    { d: 'M130 178 C150 196 164 228 160 256 C152 268 134 264 126 246 C120 228 122 198 130 178 Z' },
    { d: 'M118 184 C128 208 126 240 116 258 C106 266 96 254 102 236 C106 214 110 194 118 184 Z' },
    { d: 'M138 188 C148 210 156 238 152 258 C144 266 134 256 132 238 C130 216 132 198 138 188 Z' },
    { d: 'M102 174 L96 224 C88 230 80 240 84 252 C98 250 114 244 112 232 L110 176 Z' },
    { d: 'M118 176 L126 228 C130 238 144 246 156 248 C158 238 148 230 142 226 L130 176 Z' },
    { d: 'M78 246 C70 254 68 266 84 270 C104 274 124 266 132 256 C116 252 96 248 78 246 Z', material: 'bodyShadow' },
    { d: 'M134 248 C142 254 160 262 170 256 C172 246 158 240 144 238 C138 240 134 244 134 248 Z', material: 'bodyShadow' },
  ],
  torso: [
    {
      d: 'M116 150 C100 142 92 132 86 116 C74 90 76 66 90 54 C94 46 86 40 66 46 C58 36 78 18 104 16 C122 14 136 28 134 44 C146 58 156 86 158 114 C160 140 152 166 134 178 C116 188 100 180 100 162 C100 154 108 150 116 150 Z',
    },
    { d: 'M128 42 C138 30 154 24 152 14 C140 18 128 32 126 42 Z' },
    { d: 'M116 38 C122 26 134 20 132 12 C122 16 114 30 114 40 Z' },
    { d: 'M90 46 A5 5 0 1 0 90.05 46 Z', material: 'eye' },
  ],
  nearWing: [
    {
      d: 'M100 132 C128 124 160 136 180 160 C190 172 184 186 168 184 C144 176 116 156 96 142 C92 138 94 134 100 132 Z',
    },
    { d: 'M122 148 C142 152 162 166 176 180 C166 176 148 162 130 154 C126 152 122 150 122 148 Z' },
    { d: 'M136 160 C154 170 168 184 180 196 C170 190 154 176 140 166 Z' },
  ],
  beakLaver: [
    { d: 'M54 70 C38 76 22 90 12 104 C10 108 14 114 22 110 C36 96 48 82 56 74 Z', material: 'gold' },
    { d: 'M52 76 C40 86 28 100 22 110 C30 106 44 90 54 80 Z', material: 'gold' },
    { d: 'M26 96 C18 114 22 136 12 152 C28 140 34 116 32 98 Z', material: 'gold' },
    { d: 'M32 94 C36 116 32 138 38 156 C50 142 48 116 38 96 Z', material: 'gold' },
    { d: 'M24 92 C12 110 6 128 4 144 C18 132 28 110 30 94 Z', material: 'gold' },
    { d: 'M34 90 C46 108 56 126 54 144 C44 132 36 110 36 92 Z', material: 'gold' },
  ],
}

const TONE_FILLS: Record<'body' | 'bodyShadow' | 'gold' | 'eye', string> = {
  body: '#2A2A2E',
  bodyShadow: '#1A1A1C',
  gold: '#C9A227',
  eye: '#C9A227',
}

export function LiverBird({
  size = 24,
  className,
  variant = 'mono',
}: {
  size?: number
  className?: string
  /** "mono" fills with currentColor — for small avatar circles against a
   *  solid background. "tone" uses the original body/gold heraldic colors —
   *  for larger showcase contexts like the fan badge medallion. */
  variant?: 'mono' | 'tone'
}) {
  return (
    <svg
      viewBox="0 0 240 300"
      width={size}
      height={size}
      className={className}
      aria-label="Liverpool Liver Bird crest"
      role="img"
    >
      {LAYER_ORDER.map((layerId) => (
        <g key={layerId}>
          {LAYER_PATHS[layerId].map((part, index) => (
            <path
              key={index}
              d={part.d}
              fill={
                variant === 'mono'
                  ? 'currentColor'
                  : TONE_FILLS[part.material ?? LAYER_DEFAULT_MATERIAL[layerId]]
              }
            />
          ))}
        </g>
      ))}
    </svg>
  )
}
