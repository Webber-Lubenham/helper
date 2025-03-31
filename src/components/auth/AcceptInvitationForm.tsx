import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function AcceptInvitationForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { acceptStudentInvitation } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!token) {
      setError("Token de convite inválido");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      setLoading(false);
      return;
    }

    try {
      await acceptStudentInvitation(token, password);
      toast({
        title: "Conta criada com sucesso",
        description: "Você pode fazer login agora.",
        duration: 5000,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setError(
        "Erro ao aceitar convite. O convite pode ter expirado ou ser inválido.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Aceitar Convite de Estudante
      </h2>
      {!token ? (
        <div className="text-center text-red-500">
          <p>Token de convite não encontrado.</p>
          <p className="mt-4">
            Por favor, verifique o link que você recebeu por email.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Nova Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              A senha deve ter pelo menos 8 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
            disabled={loading}
          >
            {loading ? "Processando..." : "Criar conta"}
          </Button>

          <div className="text-sm text-center text-gray-600 mt-6">
            Já tem uma conta?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Entrar
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
