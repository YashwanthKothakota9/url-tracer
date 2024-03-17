import { useState } from 'react';
export default function Popup() {
  const [counter, setCounter] = useState(0);
  function add() {
    setCounter((prev) => prev + 1);
  }
  return (
    <div className="bg-slate-100 text-black w-[400px] h-[600px] flex flex-col items-center justify-center p-5">
      <p className="w-full text-center text-xl">{counter}</p>
      <button onClick={add} className="w-full bg-gray-400 text-black px-4 py-2">
        Add
      </button>
    </div>
  );
}
