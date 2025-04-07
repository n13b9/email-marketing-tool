"use client";
import { useEffect, useState } from "react";

export default function MySeq() {
  const [seq, setSeq] = useState<any>({
    data: [],
  });

  const getSeq = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/workflows`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setSeq(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSeq();
  }, []);

  return (
    <div>
      <h1>Sequence List</h1>
      {seq.data.map((x: any) => (
        <div key={x._id}>
          <ul>{x._id}</ul>
        </div>
      ))}
    </div>
  );
}
