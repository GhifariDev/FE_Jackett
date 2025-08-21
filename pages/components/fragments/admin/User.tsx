"use client";

import { useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    status: string;
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch("http://localhost:3001/api/users/admin", {
            credentials: "include", // penting supaya cookie token dikirim
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Data from API:", data);
                setUsers(data);
            });
    }, []);




const handleBlock = async (id: number) => {
  const res = await fetch(`http://localhost:3001/api/users/block/${id}`, {
    method: "PATCH",
    credentials: "include"
  });
  if (res.ok) {
    const updatedUser = await res.json();
    setUsers(prev =>
      prev.map(u =>
        u.id === id
          ? { ...u, status: updatedUser.isBlocked ? "blocked" : "active" }
          : u
      )
    );
  }
};


    const handleUnblock = async (id: number) => {
        const res = await fetch(`http://localhost:3001/api/users/unblock/${id}`, {
            method: "PATCH",
            credentials: "include"
        });
        if (res.ok) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id ? { ...u, status: "active" } : u
                )
            );
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manajemen Pengguna</h1>
            <table className="border border-gray-300 w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Nama</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border p-2">{user.id}</td>
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.status}</td>
                            <td className="border p-2">
                                {user.status === "blocked" ? (
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleUnblock(user.id)}
                                    >
                                        Unblock
                                    </button>
                                ) : (
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={() => handleBlock(user.id)}
                                    >
                                        Blokir
                                    </button>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

