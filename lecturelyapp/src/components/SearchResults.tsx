import { TranscriptSegment } from "@/types/transcript";

type Props = {
  results: TranscriptSegment[];
  onJump: (time: number) => void;
};

export default function SearchResults({ results, onJump }: Props) {
  return (
    <div>
      {results.map((r, i) => (
        <div
          key={i}
          className="p-2 border cursor-pointer"
          onClick={() => onJump(r.start)}
        >
          {/* <p>{r.text}</p> */}
          <p className="font-medium">{r.original}</p>
          <p className="text-sm text-gray-500">{r.translated}</p>
          {/* <small>{r.start.toFixed(2)} sec</small> */}
        </div>
      ))}
    </div>
  );
}
