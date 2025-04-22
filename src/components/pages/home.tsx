import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  MapPin,
  Bell,
  Shield,
  Settings,
  User,
  Users,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-medium text-xl">
              Sistema Monitore
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm px-4">
                    Começar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-12">
        {/* Hero section */}
        <section className="py-20 text-center bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-5xl font-semibold tracking-tight mb-4 text-blue-900">
              Monitoramento de Localização em Tempo Real
            </h2>
            <h3 className="text-2xl font-medium text-gray-600 mb-8">
              Mantenha seus estudantes seguros com nossa plataforma de
              monitoramento avançada
            </h3>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Link to="/signup">
                <Button className="w-full sm:w-auto rounded-full bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-6">
                  Registrar como Responsável
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
                >
                  Registrar como Estudante
                </Button>
              </Link>
            </div>
            <div className="mt-12 relative">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* MapBox will be integrated here in a future update */}
                <div className="w-full h-[400px] bg-blue-50 flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-blue-600 font-medium mb-2">
                      MapBox Configuration Ready
                    </p>
                    <p className="text-gray-600 text-sm">
                      Token:{" "}
                      {import.meta.env.VITE_MAPBOX_TOKEN
                        ? "✓ Configured"
                        : "✗ Missing"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Style:{" "}
                      {import.meta.env.VITE_MAPBOX_STYLE_URL
                        ? "✓ Configured"
                        : "✗ Missing"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Center:{" "}
                      {import.meta.env.VITE_MAPBOX_INITIAL_CENTER
                        ? "✓ Configured"
                        : "✗ Missing"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Zoom:{" "}
                      {import.meta.env.VITE_MAPBOX_INITIAL_ZOOM
                        ? "✓ Configured"
                        : "✗ Missing"}
                    </p>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-semibold tracking-tight mb-4 text-blue-900">
              Recursos Principais
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-12 max-w-3xl mx-auto">
              Nossa plataforma oferece tudo o que você precisa para monitorar e
              garantir a segurança dos estudantes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-left">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="h-7 w-7 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-blue-900">
                  Localização em Tempo Real
                </h4>
                <p className="text-gray-600">
                  Visualize a localização dos estudantes em tempo real em um
                  mapa interativo e intuitivo.
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-left">
                <div className="h-14 w-14 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Bell className="h-7 w-7 text-red-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-blue-900">
                  Alertas de Emergência
                </h4>
                <p className="text-gray-600">
                  Botão de emergência para estudantes acionarem em situações
                  críticas, enviando alertas imediatos.
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-left">
                <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-blue-900">
                  Privacidade Garantida
                </h4>
                <p className="text-gray-600">
                  Configurações avançadas de privacidade e controle de
                  compartilhamento de localização.
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-left">
                <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-blue-900">
                  Múltiplos Responsáveis
                </h4>
                <p className="text-gray-600">
                  Gerencie múltiplos responsáveis com diferentes níveis de
                  acesso para cada estudante.
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-left">
                <div className="h-14 w-14 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7 text-yellow-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-blue-900">
                  Histórico de Localizações
                </h4>
                <p className="text-gray-600">
                  Acesse o histórico completo de localizações para análise e
                  verificação de rotas.
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-left">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-blue-900">
                  Zonas de Segurança
                </h4>
                <p className="text-gray-600">
                  Defina zonas de segurança e receba notificações quando
                  estudantes entrarem ou saírem delas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-20 bg-blue-50 text-center">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-4xl font-semibold tracking-tight mb-4 text-blue-900">
              Como Funciona
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-16 max-w-3xl mx-auto">
              Sistema Monitore é fácil de usar e oferece tranquilidade para
              responsáveis e estudantes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-blue-200"></div>

              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
                  <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    1
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-blue-900">
                    Registro
                  </h4>
                  <p className="text-gray-600">
                    Crie uma conta como responsável ou estudante e configure seu
                    perfil.
                  </p>
                </div>
                <svg
                  className="h-8 w-8 text-white absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.414l-6.707-6.707 1.414-1.414L12 14.586l5.293-5.293 1.414 1.414z"></path>
                </svg>
              </div>

              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
                  <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    2
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-blue-900">
                    Conexão
                  </h4>
                  <p className="text-gray-600">
                    Vincule estudantes aos responsáveis através de convites
                    seguros.
                  </p>
                </div>
                <svg
                  className="h-8 w-8 text-white absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.414l-6.707-6.707 1.414-1.414L12 14.586l5.293-5.293 1.414 1.414z"></path>
                </svg>
              </div>

              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
                  <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    3
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-blue-900">
                    Monitoramento
                  </h4>
                  <p className="text-gray-600">
                    Acompanhe a localização em tempo real e receba notificações
                    importantes.
                  </p>
                </div>
                <svg
                  className="h-8 w-8 text-white absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.414l-6.707-6.707 1.414-1.414L12 14.586l5.293-5.293 1.414 1.414z"></path>
                </svg>
              </div>
            </div>

            <div className="mt-16">
              <Link to="/signup">
                <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-6">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-semibold tracking-tight mb-4 text-blue-900 text-center">
              O Que Dizem Nossos Usuários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
                      alt="Maria"
                    />
                    <AvatarFallback>MA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-blue-900">Maria Silva</h4>
                    <p className="text-sm text-gray-500">Mãe de 2 estudantes</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "O Sistema Monitore me dá tranquilidade para trabalhar sabendo
                  que posso verificar onde meus filhos estão a qualquer momento.
                  O botão de emergência é um recurso que me faz sentir mais
                  segura."
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos"
                      alt="Carlos"
                    />
                    <AvatarFallback>CA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Carlos Oliveira
                    </h4>
                    <p className="text-sm text-gray-500">Diretor de escola</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Implementamos o Sistema Monitore em nossa escola e notamos
                  uma melhora significativa na comunicação com os pais. A
                  plataforma é intuitiva e fácil de usar para toda a equipe."
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Julia"
                      alt="Julia"
                    />
                    <AvatarFallback>JU</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Julia Santos
                    </h4>
                    <p className="text-sm text-gray-500">Estudante, 16 anos</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Gosto de poder controlar quem vê minha localização e em quais
                  horários. O aplicativo é rápido e não consome muita bateria do
                  meu celular, o que é ótimo."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 bg-blue-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-semibold tracking-tight mb-6">
              Pronto para começar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de responsáveis e estudantes que já utilizam o
              Sistema Monitore para uma experiência mais segura.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/signup">
                <Button className="w-full sm:w-auto rounded-full bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  Criar Conta Grátis
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-white text-white hover:bg-blue-700 text-lg px-8 py-6"
                >
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-medium text-lg mb-4">Sistema Monitore</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Tutoriais
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Reportar Problema
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Política de Cookies
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Licenças
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Conecte-se</h4>
              <div className="flex space-x-4 mb-4">
                <a
                  href="#"
                  className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
              </div>
              <p className="text-gray-400">Receba nossas atualizações</p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="px-4 py-2 rounded-l-lg w-full text-gray-900"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg">
                  Enviar
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Sistema Monitore. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
