import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { setUser } from "@/app/feature/userSlice";
import { backendApi } from "@/api/backend";
import { toast, ToastContainer } from "react-toastify";
import { errorTranslated } from "@/api/error_translate";

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resp = await backendApi.login(formState.email, formState.password);

    if (resp.error) {
      const message = errorTranslated(resp.error.main_message);
      toast.error(message);
      return;
    }

    const { id, email } = resp.data!.user;

    dispatch(setUser({ id, email, token: resp.data!.access_token }));

    navigate("/todo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">Entre na sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="senha"
                    required
                    value={formState.password}
                    onChange={handleInputChange}
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 px-0 py-0 hover:bg-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/register")}
              >
                Criar uma conta
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ToastContainer limit={3} />
    </div>
  );
}
