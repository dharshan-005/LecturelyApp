"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { BsArrowLeftShort } from "react-icons/bs";

type Lecture = {
  _id: string;
  title: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/lectures", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        const data = await res.json();
        setLectures(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchLectures();
  }, [session]);

  const openLecture = (id: string) => {
    console.log("History click:", id);
    router.push(`/editor/${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 w-36 text-black">
        <a
          href="/"
          className="flex bg-white text-3xl rounded-full w-8 border border-[#081A51] cursor-pointer"
        >
          <BsArrowLeftShort />
        </a>
        <p>Back</p>
      </div>

      <div className="flex justify-center">
        <h1 className="text-2xl font-bold mb-4">History</h1>
      </div>

      {lectures.map((lecture) => (
        <div
          key={lecture._id}
          onClick={() => openLecture(lecture._id)}
          className="p-4 border rounded-lg mb-3 cursor-pointer hover:bg-gray-50"
        >
          <p className="font-semibold">{lecture.title}</p>
          <p className="text-sm text-gray-400">
            {new Date(lecture.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
