import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";

export default function StudentInviteForm() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState<{
    invitationToken: string;
    temporaryPassword: string;
  } | null>(null);
  const { inviteStudent } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await inviteStudent(email, fullName, birthDate);
      setCredentials(result);
      setShowCredentials(true);
      setEmail("");
      setFullName("");
      setBirthDate("");
    } catch (error) {
      console.error("Error inviting student:", error);
      setError("Erro ao convidar estudante. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência.",
      duration: 3000,
    });
  };

  const getInvitationLink = () => {
    if (!credentials) return "";
    return `${window.location.origin}/accept-invitation?token=${credentials.invitationToken}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 w-full">
      <h3 className="text-xl font-semibold mb-4">Convidar Estudante</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="studentName"
            className="text-sm font-medium text-gray-700"
          >
            Nome Completo do Estudante
          </Label>
          <Input
            id="studentName"
            placeholder="Nome do estudante"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-10 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="studentEmail"
            className="text-sm font-medium text-gray-700"
          >
            Email do Estudante
          </Label>
          <Input
            id="studentEmail"
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="birthDate"
            className="text-sm font-medium text-gray-700"
          >
            Data de Nascimento
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="h-10 rounded-lg"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full h-10 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Convite"}
        </Button>
      </form>

      <Dialog open={showCredentials} onOpenChange={setShowCredentials}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convite Enviado</DialogTitle>
            <DialogDescription>
              Compartilhe estas informações com o estudante para que ele possa
              acessar a plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Link de Convite</Label>
              <div className="flex items-center space-x-2">
                <Input value={getInvitationLink()} readOnly className="h-9" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(getInvitationLink())}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Senha Temporária</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={credentials?.temporaryPassword || ""}
                  readOnly
                  className="h-9"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(credentials?.temporaryPassword || "")
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                O estudante precisará desta senha para acessar o link de
                convite.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowCredentials(false)}
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
