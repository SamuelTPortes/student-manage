import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-3xl shadow-elevated">
              <GraduationCap className="w-16 h-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sistema de Gerenciamento de Alunos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Controle completo e eficiente dos registros dos seus alunos em uma plataforma moderna e intuitiva
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="shadow-card text-lg px-8"
            >
              Começar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="shadow-card text-lg px-8"
            >
              Fazer Login
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-card p-6 rounded-2xl shadow-card border border-border/50 hover:shadow-elevated transition-all">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">CRUD Completo</h3>
            <p className="text-muted-foreground">
              Crie, visualize, edite e exclua registros de alunos com facilidade
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-card border border-border/50 hover:shadow-elevated transition-all">
            <div className="bg-secondary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Interface Intuitiva</h3>
            <p className="text-muted-foreground">
              Design moderno e responsivo para uma experiência agradável
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-card border border-border/50 hover:shadow-elevated transition-all">
            <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Segurança Total</h3>
            <p className="text-muted-foreground">
              Autenticação robusta e proteção de dados dos seus alunos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
