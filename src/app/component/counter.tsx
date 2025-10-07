"use client"; // 只有这个组件是客户端组件

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      点击: {count}
    </button>
  );
}