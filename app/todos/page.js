"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function TodosPage() {
    const queryClient = useQueryClient();
    const { data: todos } = useQuery({
        queryKey: ["todos"],
        queryFn: () =>
            fetch("http://localhost:8000/todos").then((res) => res.json()),
    });
    const mutation = useMutation({
        mutationFn: (newTodo) => {
            return fetch("http://localhost:8000/todos", {
                method: "POST",
                body: JSON.stringify(newTodo),
            });
        },
        onMutate: (variable) => {
            console.log("a mutation is about to happen");
        },
        onError: (error, variable, context) => {
            console.error(error.message);
        },
        onSuccess: (data, variable, context) => {
            console.log("success", data, variable);
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    return (
        <div>
            {mutation.isLoading ? (
                "Adding todo..."
            ) : (
                <>
                    {mutation.isError ? (
                        <div>An error occurred: {mutation.error.message}</div>
                    ) : null}

                    {mutation.isSuccess ? <div>Todo added!</div> : null}

                    <button
                        onClick={() => {
                            mutation.mutate({
                                id: new Date(),
                                title: "Do programming",
                            });
                        }}
                    >
                        Create Todo
                    </button>
                </>
            )}

            <h1 className="text-xl mt-10">Todos</h1>
            <div className="flex flex-col gap-2">
                {todos?.slice(0, 5).map((todo) => (
                    <div key={todo.id}>
                        <h2>{` ${todo.title}`}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
