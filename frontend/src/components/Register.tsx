import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { setUser } from "@/app/feature/userSlice";
import { useNavigate } from "react-router-dom";
import { backendApi } from "@/api/backend";
import { errorTranslated } from "@/api/error_transleted";

type PasswordCriteria = {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  passwordsMatch: boolean;
};

export default function RegisterScreen() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });

  const validatePassword = (password: string, confirmPassword: string) => {
    const criteria: PasswordCriteria = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      passwordsMatch: password === confirmPassword && password !== "",
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(Boolean);
  };

  useEffect(() => {
    validatePassword(password, confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password, confirmPassword)) {
      toast.error("Senhas não coincidem ou não atendem aos critérios de segurança.");
      return;
    }

    const resp = await backendApi.createUser(name, email, password);

    if (resp.error) {
      const messages = resp.error.messages.map((message) => {
        return errorTranslated(message);
      });
      for (const message of messages) {
        toast.error(message);
      }
      return;
    }

    const login = await backendApi.login(email, password);

    if (login.error) {
      const message = errorTranslated(login.error.main_message);
      toast.error(message);
      return;
    }

    const { id, email: user_email } = login.data!.user;

    dispatch(setUser({ id, email: user_email, token: login.data!.access_token }));

    navigate("/todo");
  };

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-red-600`}>
      {met ? <Check className="text-green-600" size={16} /> : <X size={16} />}
      <span className={met ? "text-green-600" : ""}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Registro</CardTitle>
          <CardDescription className="text-center">Crie sua nova conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="senha"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
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
                {passwordFocused && (
                  <div className="mt-2 space-y-2 text-sm">
                    {Object.entries(passwordCriteria)
                      .filter(([key, met]) => key !== "passwordsMatch" && !met)
                      .map(([key, met]) => (
                        <CriteriaItem
                          key={key}
                          met={met}
                          text={
                            key === "minLength"
                              ? "Pelo menos 8 caracteres"
                              : key === "hasUpperCase"
                              ? "Pelo menos 1 letra maiúscula"
                              : key === "hasLowerCase"
                              ? "Pelo menos 1 letra minúscula"
                              : key === "hasNumber"
                              ? "Pelo menos 1 número"
                              : "Pelo menos 1 caractere especial"
                          }
                        />
                      ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="senha"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 px-0 py-0 hover:bg-gray-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {confirmPasswordFocused && !passwordCriteria.passwordsMatch && (
                  <div className="mt-2 space-y-2 text-sm">
                    <CriteriaItem
                      met={passwordCriteria.passwordsMatch}
                      text="As senhas devem coincidir"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <Button type="submit" className="w-full mt-6">
                Registrar
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Fazer Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ToastContainer limit={3} />
    </div>
  );
}
