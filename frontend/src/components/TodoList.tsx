"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, CheckSquare } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendApi } from "@/api/backend";
import { errorTranslated } from "@/api/error_translate";
import { Task } from "@/api/backendDTO";

export default function TodoListScreen() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const [todos, setTodos] = useState<Task[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  async function fetchTodos() {
    const response = await backendApi.getUserTasks();

    if (response.error) {
      toast.error(errorTranslated(response.error.main_message));
      return;
    }

    const data = response.data!;
    setTodos(data);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleAddTodo = async () => {
    if (newTodoTitle.trim()) {
      if (newTodoTitle.length > 40) {
        setTitleError("O título deve ter no máximo 40 caracteres.");
        return;
      }
      const newTodo: Task = {
        id: Math.random().toString(36).substring(7),
        title: newTodoTitle,
        isDone: false,
      };

      const add_todo_response = await backendApi.createTask(newTodoTitle);

      if (add_todo_response.error) {
        toast.error(errorTranslated(add_todo_response.error.main_message));
        return;
      }

      const data = add_todo_response.data!;
      newTodo.id = data.id;
      newTodo.title = data.title;
      newTodo.isDone = data.isDone;

      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
      setTitleError("");
      toast.success("Tarefa adicionada");
    }
  };

  const handleRemoveTodo = async (id: string) => {
    const remove_todo_response = await backendApi.deleteTask(id);

    if (remove_todo_response.error) {
      toast.error(errorTranslated(remove_todo_response.error.main_message));
      return;
    }

    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
      return;
    }

    const update_todo_response = await backendApi.updateTask(
      id,
      todo.title,
      !todo.isDone
    );

    if (update_todo_response.error) {
      toast.error(errorTranslated(update_todo_response.error.main_message));
      return;
    }

    const data = update_todo_response.data!;
    todo.id = data.id;
    todo.title = data.title;
    todo.isDone = data.isDone;

    setTodos(
      todos.map((old_todo) => {
        if (old_todo.id === id) {
          return todo;
        }
        return old_todo;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Olá, {user.email}!</CardTitle>
          </CardHeader>
        </Card>

        <Card className="mb-8 w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Nova tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex-grow">
                <input
                  type="text"
                  value={newTodoTitle}
                  onChange={(e) => {
                    setNewTodoTitle(e.target.value);
                    setTitleError("");
                  }}
                  placeholder="Titulo da tarefa"
                  className="w-full px-3 py-2 border rounded-md"
                  maxLength={35}
                />
                {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
              </div>
              <Button onClick={handleAddTodo} className="w-full sm:w-auto">
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {todos.map((todo: Task) => (
            <Card
              key={todo.id}
              className={`w-full transition-colors duration-300 group ${
                todo.isDone ? "bg-green-100" : "bg-white"
              }`}
            >
              <CardContent className="p-0 flex items-center justify-between">
                <span className={`${todo.isDone ? "line-through" : ""} flex-grow p-4`}>
                  {todo.title}
                </span>
                <div className="flex space-x-2 p-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleTodo(todo.id)}
                    className="flex-1 h-full bg-green-100 hover:bg-green-200 min-h-[40px]"
                  >
                    <CheckSquare className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveTodo(todo.id)}
                    className="flex-1 h-full bg-red-100 hover:bg-red-200 min-h-[40px]"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <ToastContainer limit={3} />
    </div>
  );
}
