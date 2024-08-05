"use client";

import { useQuery, useIsFetching } from "@tanstack/react-query";

export default function Home() {
    const isFetching = useIsFetching();
    const { data: todos, isTodoLoading } = useQuery({
        queryKey: ["todos"],
        queryFn: () =>
            fetch("https://jsonplaceholder.typicode.com/todos").then((res) =>
                res.json()
            ),
        select: (todos) =>
            todos.map((todo) => ({ id: todo.id, title: todo.title })), // adjust the data format here
    });
    const { data: users } = useQuery({
        queryKey: ["users"],
        queryFn: () =>
            fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
                res.json()
            ),
        enabled: !!todos, // only call users when todos are done
    });

    if (isTodoLoading) {
        return (
            <main className="mt-4 flex min-h-screen flex-col items-center">
                All quries are fetching currently
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-xl">Todos</h1>
            <div className="flex flex-col gap-2">
                {todos?.slice(0, 5).map((todo) => (
                    <div key={todo.id}>
                        <h2>{` ${todo.title}`}</h2>
                    </div>
                ))}
            </div>

            <h1 className="text-xl mt-9">Users</h1>
            <div className="flex flex-col gap-2">
                {users?.map((user) => (
                    <div key={user.id}>
                        <h2>{` ${user.name}`}</h2>
                    </div>
                ))}
            </div>
        </main>
    );
}
