import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Aluno } from "@/pages/Dashboard";

interface AlunoFormDialogProps {
  open: boolean;
  onClose: (success?: boolean) => void;
  editingAluno: Aluno | null;
  userId: string;
}

export const AlunoFormDialog = ({
  open,
  onClose,
  editingAluno,
  userId,
}: AlunoFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  useEffect(() => {
    if (editingAluno) {
      setNome(editingAluno.nome);
      setMatricula(editingAluno.matricula);
      setEmail(editingAluno.email);
      setDataNascimento(editingAluno.data_nascimento);
    } else {
      setNome("");
      setMatricula("");
      setEmail("");
      setDataNascimento("");
    }
  }, [editingAluno, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const alunoData = {
      nome,
      matricula,
      email,
      data_nascimento: dataNascimento,
      user_id: userId,
    };

    let error;

    if (editingAluno) {
      const result = await supabase
        .from("alunos")
        .update(alunoData)
        .eq("id", editingAluno.id);
      error = result.error;
    } else {
      const result = await supabase.from("alunos").insert([alunoData]);
      error = result.error;
    }

    setLoading(false);

    if (error) {
      toast.error("Erro ao salvar aluno: " + error.message);
    } else {
      toast.success(
        editingAluno ? "Aluno atualizado com sucesso!" : "Aluno criado com sucesso!"
      );
      onClose(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="shadow-elevated">
        <DialogHeader>
          <DialogTitle>
            {editingAluno ? "Editar Aluno" : "Adicionar Novo Aluno"}
          </DialogTitle>
          <DialogDescription>
            {editingAluno
              ? "Atualize as informações do aluno abaixo."
              : "Preencha os dados do novo aluno."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Nome do aluno"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              id="matricula"
              type="text"
              placeholder="Número da matrícula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data-nascimento">Data de Nascimento</Label>
            <Input
              id="data-nascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : editingAluno ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
