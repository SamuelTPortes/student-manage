import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { AlunosTable } from "@/components/AlunosTable";
import { AlunoFormDialog } from "@/components/AlunoFormDialog";

export interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  data_nascimento: string;
  user_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchAlunos();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchAlunos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("alunos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar alunos: " + error.message);
    } else {
      setAlunos(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/auth");
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("alunos").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao deletar aluno: " + error.message);
    } else {
      toast.success("Aluno deletado com sucesso!");
      fetchAlunos();
    }
  };

  const handleDialogClose = (success?: boolean) => {
    setDialogOpen(false);
    setEditingAluno(null);
    if (success) {
      fetchAlunos();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sistema de Alunos</h1>
              <p className="text-sm text-muted-foreground">
                Bem-vindo, {user?.email}
              </p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Meus Alunos</h2>
            <p className="text-muted-foreground">Gerencie os registros de alunos</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="shadow-card">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Aluno
          </Button>
        </div>

        <AlunosTable
          alunos={alunos}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <AlunoFormDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          editingAluno={editingAluno}
          userId={user?.id || ""}
        />
      </main>
    </div>
  );
};

export default Dashboard;
