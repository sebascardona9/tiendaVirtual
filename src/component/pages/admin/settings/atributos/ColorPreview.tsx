interface Props {
  hex?: string
  size?: number
}

/** Círculo de color de 18×18px (por defecto). Sin dependencias externas. */
const ColorPreview = ({ hex, size = 18 }: Props) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: hex || '#ccc',
      border: '1px solid rgba(0,0,0,0.15)',
      flexShrink: 0,
      display: 'inline-block',
    }}
  />
)

export default ColorPreview
