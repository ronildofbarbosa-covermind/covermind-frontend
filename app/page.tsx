import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type PainelData = {
  status_painel: string;
  resumo_executivo: {
    total_contextos_churn: number;
    total_contextos_vulnerabilidade: number;
    total_contextos_reincidencia: number;
    total_postos_maturidade: number;
    postos_maturidade_critica: number;
    feristas_em_atencao: number;
    reserva_operacional_em_atencao: number;
  };
  alertas_operacionais: {
    postos_criticos: Array<{
      cliente: string;
      posto: string;
      grupo_servico: string;
      indice_cobertura_treinada: number;
      necessidade_treinamento: number;
      nivel_maturidade_posto: string;
    }>;
  };
  top_riscos: {
    churn: Array<{
      cliente: string;
      posto: string;
      filial: string;
      score_churn: number;
      nivel_churn: string;
    }>;
    vulnerabilidade: Array<{
      cliente: string;
      posto: string;
      filial: string;
      score_vulnerabilidade: number;
      nivel_vulnerabilidade: string;
    }>;
    reincidencia: Array<{
      cliente: string;
      posto: string;
      filial: string;
      score_reincidencia: number;
      nivel_reincidencia: string;
    }>;
  };
};

async function carregarPainel(): Promise<PainelData | null> {
  try {
    const resposta = await fetch(
      "http://127.0.0.1:8000/painel-executivo-inteligente",
      { cache: "no-store" }
    );

    if (!resposta.ok) {
      return null;
    }

    return resposta.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const painel = await carregarPainel();

  if (!painel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>CoverMind IA</CardTitle>
            <CardDescription>
              Não foi possível conectar ao backend FastAPI.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Confirme se o backend está ativo em http://127.0.0.1:8000.
          </CardContent>
        </Card>
      </main>
    );
  }

  const resumo = painel.resumo_executivo;
  const postosCriticos = painel.alertas_operacionais.postos_criticos ?? [];
  const topChurn = painel.top_riscos.churn ?? [];
  const topVulnerabilidade = painel.top_riscos.vulnerabilidade ?? [];
  const topReincidencia = painel.top_riscos.reincidencia ?? [];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-800 bg-slate-950 p-6 lg:block">
          <div>
            <p className="text-sm font-semibold text-blue-400">CoverMind IA</p>
            <h2 className="mt-2 text-xl font-bold">Operational AI</h2>
          </div>

          <Separator className="my-6 bg-slate-800" />

          <nav className="space-y-2 text-sm text-slate-300">
            <MenuItem ativo texto="Painel Executivo" />
            <MenuItem texto="Coberturas" />
            <MenuItem texto="Clientes" />
            <MenuItem texto="Postos" />
            <MenuItem texto="Reserva Técnica" />
            <MenuItem texto="Planos de Ação" />
          </nav>

          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs font-semibold text-slate-400">
              Status do Painel
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium">Ativo</span>
            </div>
          </div>
        </aside>

        <section className="flex-1 px-6 py-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge className="mb-3 bg-blue-600 hover:bg-blue-600">
                Dashboard Executivo
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Inteligência Operacional Executiva
              </h1>
              <p className="mt-2 max-w-3xl text-slate-400">
                Visão consolidada de churn, vulnerabilidade, reincidência,
                maturidade dos postos, reserva técnica e pressão operacional
                futura.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
              <p className="text-xs text-slate-400">Backend FastAPI</p>
              <p className="mt-1 text-sm font-semibold text-emerald-400">
                Conectado em tempo real
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              titulo="Churn Operacional"
              valor={resumo.total_contextos_churn}
              descricao="contextos monitorados"
              destaque="Risco contratual"
            />
            <KpiCard
              titulo="Postos Críticos"
              valor={resumo.postos_maturidade_critica}
              descricao="baixa maturidade operacional"
              destaque="Elasticidade"
            />
            <KpiCard
              titulo="Reincidência"
              valor={resumo.total_contextos_reincidencia}
              descricao="contextos analisados"
              destaque="Memória operacional"
            />
            <KpiCard
              titulo="Reserva em Atenção"
              valor={resumo.reserva_operacional_em_atencao}
              descricao="filiais/grupos em alerta"
              destaque="Capacidade preventiva"
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <BlocoAnalitico titulo="Postos com Maturidade Crítica">
              {postosCriticos.length === 0 ? (
                <EstadoVazio texto="Nenhum posto crítico identificado." />
              ) : (
                postosCriticos.map((posto, index) => (
                  <ItemRisco
                    key={`${posto.cliente}-${posto.posto}-${index}`}
                    nivel={posto.nivel_maturidade_posto}
                    titulo={`${posto.cliente} · ${posto.posto}`}
                    texto={`Índice de cobertura treinada: ${posto.indice_cobertura_treinada}. Necessidade de treinamento: ${posto.necessidade_treinamento}.`}
                    detalhe={posto.grupo_servico}
                  />
                ))
              )}
            </BlocoAnalitico>

            <BlocoAnalitico titulo="Top Risco de Churn">
              {topChurn.length === 0 ? (
                <EstadoVazio texto="Nenhum risco de churn identificado." />
              ) : (
                topChurn.map((item, index) => (
                  <ItemRisco
                    key={`${item.cliente}-${item.posto}-${index}`}
                    nivel={item.nivel_churn}
                    titulo={`${item.cliente} · ${item.posto}`}
                    texto={`Filial: ${item.filial}. Score churn: ${item.score_churn}.`}
                    detalhe="Churn operacional"
                  />
                ))
              )}
            </BlocoAnalitico>

            <BlocoAnalitico titulo="Top Vulnerabilidade Operacional">
              {topVulnerabilidade.length === 0 ? (
                <EstadoVazio texto="Nenhuma vulnerabilidade identificada." />
              ) : (
                topVulnerabilidade.map((item, index) => (
                  <ItemRisco
                    key={`${item.cliente}-${item.posto}-${index}`}
                    nivel={item.nivel_vulnerabilidade}
                    titulo={`${item.cliente} · ${item.posto}`}
                    texto={`Filial: ${item.filial}. Score vulnerabilidade: ${item.score_vulnerabilidade}.`}
                    detalhe="Vulnerabilidade"
                  />
                ))
              )}
            </BlocoAnalitico>

            <BlocoAnalitico titulo="Top Reincidência Operacional">
              {topReincidencia.length === 0 ? (
                <EstadoVazio texto="Nenhuma reincidência identificada." />
              ) : (
                topReincidencia.map((item, index) => (
                  <ItemRisco
                    key={`${item.cliente}-${item.posto}-${index}`}
                    nivel={item.nivel_reincidencia}
                    titulo={`${item.cliente} · ${item.posto}`}
                    texto={`Filial: ${item.filial}. Score reincidência: ${item.score_reincidencia}.`}
                    detalhe="Reincidência"
                  />
                ))
              )}
            </BlocoAnalitico>
          </div>
        </section>
      </div>
    </main>
  );
}

function MenuItem({
  texto,
  ativo = false,
}: {
  texto: string;
  ativo?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 ${
        ativo
          ? "bg-blue-600 text-white"
          : "text-slate-400 hover:bg-slate-900 hover:text-white"
      }`}
    >
      {texto}
    </div>
  );
}

function KpiCard({
  titulo,
  valor,
  descricao,
  destaque,
}: {
  titulo: string;
  valor: number;
  descricao: string;
  destaque: string;
}) {
  return (
    <Card className="border-slate-800 bg-slate-900 text-slate-100">
      <CardHeader className="pb-3">
        <CardDescription className="text-slate-400">{titulo}</CardDescription>
        <CardTitle className="text-4xl">{valor}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-400">{descricao}</p>
        <Badge variant="secondary" className="mt-4 bg-slate-800 text-slate-200">
          {destaque}
        </Badge>
      </CardContent>
    </Card>
  );
}

function BlocoAnalitico({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-slate-800 bg-slate-900 text-slate-100">
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function ItemRisco({
  nivel,
  titulo,
  texto,
  detalhe,
}: {
  nivel: string;
  titulo: string;
  texto: string;
  detalhe: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center justify-between gap-4">
        <Badge className="bg-slate-800 text-slate-100 hover:bg-slate-800">
          {nivel}
        </Badge>
        <span className="text-xs text-slate-500">{detalhe}</span>
      </div>
      <h3 className="mt-3 font-semibold text-white">{titulo}</h3>
      <p className="mt-2 text-sm text-slate-400">{texto}</p>
    </div>
  );
}

function EstadoVazio({ texto }: { texto: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">
      {texto}
    </div>
  );
}