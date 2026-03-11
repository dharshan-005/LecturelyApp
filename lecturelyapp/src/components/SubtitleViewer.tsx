interface Props {
  original: any[]
  translated: any[]
}

export default function SubtitleViewer({ original, translated }: Props) {
  return (
    <div>
      <h2>Original</h2>
      {original?.map((segment, index) => (
        <div key={index}>
          <p>
            [{segment.timestamps?.from} - {segment.timestamps?.to}]
          </p>
          <p>{segment.text}</p>
        </div>
      ))}

      <h2>Translated</h2>
      {translated?.map((segment, index) => (
        <div key={index}>
          <p>
            [{segment.start} - {segment.end}]
          </p>
          <p>{segment.text}</p>
        </div>
      ))}
    </div>
  )
}