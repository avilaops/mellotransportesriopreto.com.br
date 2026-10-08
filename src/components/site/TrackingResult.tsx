import { ArrowRight, CheckCircle2, Circle, MapPin, XCircle } from "lucide-react";
import { formatTrackingDate, trackingStatusLabel, trackingSteps, type MinutaPublica, type TrackingTone } from "@/lib/trackingTimeline";

const badge: Record<TrackingTone, string> = {
  progress: "bg-orange-100 text-orange-800",
  done: "bg-green-100 text-green-700",
  stopped: "bg-gray-200 text-gray-700",
};

const sideBar: Record<TrackingTone, string> = {
  progress: "bg-orange-500",
  done: "bg-green-500",
  stopped: "bg-gray-400",
};

const stepIcon: Record<TrackingTone, string> = {
  progress: "bg-orange-100 text-orange-600",
  done: "bg-green-100 text-green-600",
  stopped: "bg-gray-200 text-gray-600",
};

export function TrackingResult({ minuta }: { minuta: MinutaPublica }) {
  const current = trackingStatusLabel(minuta.status);
  const steps = trackingSteps(minuta);
  const driver = minuta.manifest?.driver?.user?.name;

  return (
    <article className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
      <div className={`absolute left-0 top-0 w-1.5 h-full ${sideBar[current.tone]}`} />

      <div className="flex justify-between items-start gap-3 mb-6">
        <div>
          <h2 className="font-bold text-gray-900 text-lg mb-1 font-mono">Carga {minuta.trackingCode}</h2>
          <p className="text-sm text-gray-500">Solicitada em {formatTrackingDate(minuta.createdAt)}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${badge[current.tone]}`}>{current.label}</span>
      </div>

      <div className="flex items-center space-x-3 mb-8 p-4 bg-gray-50 rounded-2xl">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Origem</p>
          <p className="font-medium text-gray-900 text-sm flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400 shrink-0" />{minuta.origin}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-300 shrink-0" />
        <div className="flex-1 text-right">
          <p className="text-xs text-gray-500 mb-1">Destino</p>
          <p className="font-medium text-gray-900 text-sm flex items-center justify-end"><MapPin className="w-4 h-4 mr-1 text-orange-500 shrink-0" />{minuta.destination}</p>
        </div>
      </div>

      <ol className="relative pl-6 space-y-6">
        <div className="absolute left-7 top-2 w-0.5 h-[calc(100%-24px)] bg-gray-100 -z-10" aria-hidden="true" />
        {steps.map((step) => {
          const Icon = step.tone === "stopped" ? XCircle : step.reached ? CheckCircle2 : Circle;
          const when = step.reached ? formatTrackingDate(step.at) : "";
          return (
            <li key={step.status} className="flex items-start space-x-4">
              <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 z-10 mt-0.5 shadow-sm ${step.reached ? stepIcon[step.tone] : "bg-gray-100 text-gray-300"}`}>
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className={`font-semibold text-sm ${step.reached ? "text-gray-900" : "text-gray-400"}`}>
                  {step.label}
                  {!step.reached && <span className="sr-only"> (ainda não aconteceu)</span>}
                </p>
                {step.reached && (
                  <p className="text-xs text-gray-500 mt-1">
                    {step.status === "ROUTE" && driver ? `A carga saiu para entrega com ${driver}.` : step.detail}
                  </p>
                )}
                {when && <p className="text-xs text-gray-400 mt-0.5">{when}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
