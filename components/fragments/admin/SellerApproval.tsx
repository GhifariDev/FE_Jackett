// import { useEffect, useState } from "react";

// type SellerRequest = {
//   id: number;
//   status: "pending" | "approved" | "rejected";
//   user: {
//     name: string;
//     email: string;
//     ktpFile?: string; // nama file KTP
//   };
// };

// export default function SellerApproval() {
//   const [requests, setRequests] = useState<SellerRequest[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchRequests = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("http://localhost:3001/api/seller-requests", { credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch seller requests");
//       const data: SellerRequest[] = await res.json();
//       setRequests(data);
//     } catch (err: any) {
//       setError(err.message || "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async (id: number, newStatus: "approved" | "rejected") => {
//     try {
//       const res = await fetch(`http://localhost:3001/api/seller-requests/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (!res.ok) throw new Error("Failed to update status");
//       setRequests((prev) =>
//         prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
//       );
//     } catch (err) {
//       alert("Error saat update status");
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="text-red-600">Error: {error}</p>;

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">Persetujuan Seller</h2>
//       {requests.length === 0 ? (
//         <p>Tidak ada permintaan seller baru.</p>
//       ) : (
//         <table className="min-w-full border">
//           <thead>
//             <tr>
//               <th className="border px-4 py-2">Nama</th>
//               <th className="border px-4 py-2">Email</th>
//               <th className="border px-4 py-2">KTP</th>
//               <th className="border px-4 py-2">Status</th>
//               <th className="border px-4 py-2">Aksi</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((req) => (
//               <tr key={req.id}>
//                 <td className="border px-4 py-2">{req.user.name}</td>
//                 <td className="border px-4 py-2">{req.user.email}</td>
//                 <td className="border px-4 py-2">
//                   {req.user.ktpFile ? (
//                     <a
//                       href={`http://localhost:3001/uploads/ktp/${req.user.ktpFile}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 underline"
//                     >
//                       Lihat KTP
//                     </a>
//                   ) : (
//                     "Tidak ada file"
//                   )}
//                 </td>
//                 <td className="border px-4 py-2 capitalize">{req.status}</td>
//                 <td className="border px-4 py-2">
//                   {req.status === "pending" ? (
//                     <>
//                       <button
//                         className="mr-2 text-green-600"
//                         onClick={() => handleUpdateStatus(req.id, "approved")}
//                       >
//                         Approve
//                       </button>
//                       <button
//                         className="text-red-600"
//                         onClick={() => handleUpdateStatus(req.id, "rejected")}
//                       >
//                         Reject
//                       </button>
//                     </>
//                   ) : (
//                     <span>-</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
