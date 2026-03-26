// "use client";

// import { useState } from "react";
// import { MessageCircle, X } from "lucide-react";

// export default function Chatbot({ context }: { context: string }) {
//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState("");
//   const [open, setOpen] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: "user", text: input };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     const res = await fetch("/api/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         question: input,
//         context,
//       }),
//     });

//     const data = await res.json();

//     const botMessage = { role: "bot", text: data.answer };

//     setMessages((prev) => [...prev, botMessage]);
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       {/* Chat Window */}
//       {open && (
//         <div className="w-[320px] h-[420px] bg-white dark:bg-slate-900 shadow-xl rounded-2xl flex flex-col border border-slate-200 dark:border-slate-700 mb-3">
//           {/* Header */}
//           <div className="flex items-center justify-between p-3 border-b dark:border-slate-700">
//             <h3 className="text-sm font-semibold">Lecture Assistant</h3>

//             <button
//               onClick={() => setOpen(false)}
//               className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
//             >
//               <X size={16} />
//             </button>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
//             {messages.length === 0 && (
//               <p className="text-slate-400">
//                 Ask something about this lecture.
//               </p>
//             )}

//             {messages.map((m, i) => (
//               <div
//                 key={i}
//                 className={`p-2 rounded-lg max-w-[80%] ${
//                   m.role === "user"
//                     ? "bg-indigo-500 text-white ml-auto"
//                     : "bg-slate-100 dark:bg-slate-800"
//                 }`}
//               >
//                 {m.text}
//               </div>
//             ))}
//           </div>

//           {/* Input */}
//           <div className="border-t dark:border-slate-700 p-2 flex gap-2">
//             <input
//               className="flex-1 text-sm border rounded-lg px-2 py-1 dark:bg-slate-800 dark:border-slate-600"
//               placeholder="Ask a question..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//             />

//             <button
//               onClick={sendMessage}
//               className="bg-indigo-600 text-white px-3 rounded-lg text-sm"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Floating Button */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
//       >
//         <MessageCircle size={22} />
//       </button>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";

// export default function Chatbot({ context }: { context: string }) {

//   const [messages, setMessages] = useState<any[]>([]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {

//     const res = await fetch("/api/chat", {
//       method: "POST",
//       body: JSON.stringify({
//         question: input,
//         context
//       })
//     });

//     const data = await res.json();

//     setMessages([
//       ...messages,
//       { role: "user", text: input },
//       { role: "bot", text: data.answer }
//     ]);

//     setInput("");
//   };

//   return (
//     <div>
//       <div>
//         {messages.map((m, i) => (
//           <p key={i}>
//             <b>{m.role}:</b> {m.text}
//           </p>
//         ))}
//       </div>

//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }
