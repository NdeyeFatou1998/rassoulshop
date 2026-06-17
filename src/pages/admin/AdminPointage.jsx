/**
 * Page Pointage — /admin/pointage
 *
 * Borne de pointage du personnel (anti-fraude) :
 * - Liste des assistants avec leur statut (en service / hors service)
 * - Pour pointer : sélection de l'assistant → saisie du code PIN → prise de
 *   photo via webcam → envoi. L'arrivée ou la descente est déterminée
 *   automatiquement selon l'état courant.
 * - Chaque pointage déclenche un email aux admins (photo + infos).
 * - Gestion du code PIN : chaque assistant peut changer son PIN (PIN actuel
 *   requis) ; l'administrateur complet peut réinitialiser un PIN au défaut 1234.
 * - Historique de tous les pointages avec photos.
 *
 * Accès : administrateurs et sous-administrateurs (borne en boutique).
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Camera, LogIn, LogOut, KeyRound, RotateCcw, X, Check,
  AlertCircle, RefreshCw, Image as ImageIcon, History,
} from "lucide-react";
import {
  fetchAttendanceAssistants,
  clockAttendance,
  fetchAttendanceHistory,
  changeAttendancePin,
  resetAttendancePin,
} from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

const TZ = "Africa/Dakar";

function formatTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDuration(minutes) {
  if (minutes == null || minutes < 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h${String(m).padStart(2, "0")}`;
}

function initials(first, last) {
  return `${(first || "")[0] || ""}${(last || "")[0] || ""}`.toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Modal de pointage (webcam + PIN)                                   */
/* ------------------------------------------------------------------ */

function ClockModal({ assistant, onClose, onDone }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [pin, setPin] = useState("");
  const [camError, setCamError] = useState("");
  const [camReady, setCamReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const isArrival = !assistant.onDuty;
  const actionLabel = isArrival ? "Arrivée" : "Descente";

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCamError("");
    setCamReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCamReady(true);
    } catch (err) {
      console.error("Erreur caméra:", err);
      setCamError(
        "Impossible d'accéder à la caméra. Autorisez l'accès et vérifiez qu'aucune autre application ne l'utilise."
      );
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const maxW = 640;
    const scale = Math.min(1, maxW / video.videoWidth);
    const w = Math.round(video.videoWidth * scale);
    const h = Math.round(video.videoHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.82);
  }

  async function handleSubmit() {
    setError("");
    if (!/^\d{4,6}$/.test(pin)) {
      setError("Saisissez votre code PIN (4 à 6 chiffres).");
      return;
    }
    if (!camReady) {
      setError("La caméra n'est pas prête.");
      return;
    }
    const photo = capturePhoto();
    if (!photo) {
      setError("Échec de la capture photo. Réessayez.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await clockAttendance({ assistantId: assistant.id, pin, photo });
      stopCamera();
      setResult(res);
      onDone();
    } catch (err) {
      setError(err.message || "Erreur lors du pointage.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
          <h2 className="text-lg font-medium text-[#f5f0e8]">
            Pointage — {assistant.firstName} {assistant.lastName}
          </h2>
          <button onClick={onClose} className="text-[#555] hover:text-[#f5f0e8]">
            <X size={20} />
          </button>
        </div>

        {result ? (
          <div className="px-6 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-emerald-400" />
            </div>
            <p className="text-[#f5f0e8] text-lg font-medium mb-1">
              {result.type === "in" ? "Arrivée enregistrée" : "Descente enregistrée"}
            </p>
            <p className="text-sm text-[#888] mb-6">{result.message}</p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#D7A12B] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#E8B945]"
            >
              Fermer
            </button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            {/* Aperçu caméra */}
            <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden border border-[#222]">
              <video
                ref={videoRef}
                muted
                playsInline
                className="w-full h-full object-cover -scale-x-100"
              />
              {!camReady && !camError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#888] gap-2">
                  <Camera size={28} className="opacity-50" />
                  <span className="text-xs">Activation de la caméra…</span>
                </div>
              )}
              {camError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 gap-3">
                  <AlertCircle size={26} className="text-red-400" />
                  <span className="text-xs text-[#bbb]">{camError}</span>
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 text-xs px-3 py-1.5 bg-[#222] rounded-lg text-[#f5f0e8] hover:bg-[#333]"
                  >
                    <RefreshCw size={13} /> Réessayer
                  </button>
                </div>
              )}
              <span
                className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  isArrival ? "bg-emerald-500/80 text-white" : "bg-red-500/80 text-white"
                }`}
              >
                {actionLabel}
              </span>
            </div>

            <p className="text-xs text-[#888] text-center">
              Votre photo sera prise au moment du pointage pour vérification.
            </p>

            {/* PIN */}
            <div>
              <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">
                Code PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="••••"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-center text-2xl tracking-[0.5em] font-mono focus:border-[#D7A12B] focus:outline-none"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || !camReady}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                isArrival
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isArrival ? <LogIn size={18} /> : <LogOut size={18} />}
              {submitting ? "Pointage en cours…" : `Pointer — ${actionLabel}`}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal changement de PIN                                            */
/* ------------------------------------------------------------------ */

function PinModal({ assistant, onClose }) {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    if (newPin !== confirmPin) {
      setError("Les nouveaux PIN ne correspondent pas.");
      return;
    }
    if (!/^\d{4,6}$/.test(newPin)) {
      setError("Le nouveau PIN doit contenir 4 à 6 chiffres.");
      return;
    }
    setSaving(true);
    try {
      await changeAttendancePin({ assistantId: assistant.id, currentPin, newPin });
      setDone(true);
    } catch (err) {
      setError(err.message || "Erreur lors du changement de PIN.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#141414] border border-[#222] rounded-2xl w-full max-w-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
          <h2 className="text-lg font-medium text-[#f5f0e8]">
            Code PIN — {assistant.firstName}
          </h2>
          <button onClick={onClose} className="text-[#555] hover:text-[#f5f0e8]">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-emerald-400" />
            </div>
            <p className="text-[#f5f0e8] mb-6">Code PIN mis à jour avec succès.</p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#D7A12B] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#E8B945]"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
            <p className="text-xs text-[#888]">
              Saisissez votre PIN actuel (par défaut <strong className="text-[#D7A12B]">1234</strong>) puis le nouveau PIN.
            </p>
            {[
              ["PIN actuel", currentPin, setCurrentPin],
              ["Nouveau PIN", newPin, setNewPin],
              ["Confirmer le nouveau PIN", confirmPin, setConfirmPin],
            ].map(([label, val, setter]) => (
              <div key={label}>
                <label className="block text-xs text-[#888] uppercase tracking-wider mb-1">
                  {label}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={val}
                  onChange={(e) => setter(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#f5f0e8] text-center text-lg tracking-[0.4em] font-mono focus:border-[#D7A12B] focus:outline-none"
                />
              </div>
            ))}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-[#D7A12B] text-[#0a0a0a] rounded-lg text-sm font-semibold hover:bg-[#E8B945] disabled:opacity-50"
            >
              {saving ? "Enregistrement…" : "Mettre à jour le PIN"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page principale                                                    */
/* ------------------------------------------------------------------ */

export default function AdminPointage() {
  const { user } = useAuth();
  const isFullAdmin = user?.role === "admin";

  const [assistants, setAssistants] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clockTarget, setClockTarget] = useState(null);
  const [pinTarget, setPinTarget] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resetting, setResetting] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      const [a, h] = await Promise.all([
        fetchAttendanceAssistants(),
        fetchAttendanceHistory({ limit: 100 }),
      ]);
      setAssistants(a.assistants || []);
      setHistory(h.sessions || []);
    } catch (err) {
      console.error("Erreur chargement pointage:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleResetPin(assistant) {
    if (
      !confirm(
        `Réinitialiser le code PIN de ${assistant.firstName} ${assistant.lastName} au défaut (1234) ?`
      )
    )
      return;
    setResetting(assistant.id);
    try {
      await resetAttendancePin(assistant.id);
      alert("Code PIN réinitialisé à 1234.");
      await loadAll();
    } catch (err) {
      alert(err.message || "Erreur lors de la réinitialisation.");
    } finally {
      setResetting(null);
    }
  }

  const onDutyCount = assistants.filter((a) => a.onDuty).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#f5f0e8] mb-1 flex items-center gap-2">
            <Clock size={24} className="text-[#D7A12B]" />
            Pointage
          </h1>
          <p className="text-sm text-[#888]">
            Borne de pointage du personnel — arrivée et descente avec PIN et photo
          </p>
        </div>
        <button
          onClick={loadAll}
          className="flex items-center gap-2 px-3 py-2 text-sm text-[#888] hover:text-[#f5f0e8] border border-[#222] rounded-lg hover:border-[#333]"
        >
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {/* Liste assistants pour pointage */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#f5f0e8] uppercase tracking-wider">
            Personnel
          </h2>
          <span className="text-xs text-[#888]">
            {onDutyCount} en service · {assistants.length} au total
          </span>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#141414] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : assistants.length === 0 ? (
          <div className="text-center py-12 text-[#555] border border-[#222] rounded-xl">
            Aucun assistant. Créez-en dans Utilisateurs.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assistants.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#141414] border border-[#222] rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#D7A12B]/15 text-[#D7A12B] flex items-center justify-center font-bold">
                    {initials(a.firstName, a.lastName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#f5f0e8] truncate">
                      {a.firstName} {a.lastName}
                    </p>
                    {a.onDuty ? (
                      <p className="text-xs text-emerald-400">
                        En service depuis {formatTime(a.since)}
                      </p>
                    ) : (
                      <p className="text-xs text-[#888]">Hors service</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setClockTarget(a)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors mb-2 ${
                    a.onDuty
                      ? "bg-red-500/90 text-white hover:bg-red-600"
                      : "bg-emerald-500/90 text-white hover:bg-emerald-600"
                  }`}
                >
                  {a.onDuty ? <LogOut size={16} /> : <LogIn size={16} />}
                  {a.onDuty ? "Pointer la descente" : "Pointer l'arrivée"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPinTarget(a)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-[#888] hover:text-[#f5f0e8] border border-[#222] hover:border-[#333]"
                  >
                    <KeyRound size={13} /> Changer PIN
                  </button>
                  {isFullAdmin && (
                    <button
                      onClick={() => handleResetPin(a)}
                      disabled={resetting === a.id}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs text-orange-400/80 hover:text-orange-400 border border-[#222] hover:border-orange-500/30 disabled:opacity-50"
                      title="Réinitialiser le PIN à 1234"
                    >
                      <RotateCcw size={13} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Historique */}
      <section>
        <h2 className="text-sm font-semibold text-[#f5f0e8] uppercase tracking-wider mb-4 flex items-center gap-2">
          <History size={16} className="text-[#D7A12B]" />
          Historique des pointages
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-[#141414] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-[#555] border border-[#222] rounded-xl">
            Aucun pointage enregistré pour le moment.
          </div>
        ) : (
          <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden divide-y divide-[#222]">
            {history.map((s) => (
              <div key={s.id} className="p-4 flex items-center gap-4">
                {/* Photos */}
                <div className="flex gap-2 shrink-0">
                  <PhotoThumb
                    src={s.clockInPhoto}
                    label="Arrivée"
                    onClick={() => s.clockInPhoto && setPhotoPreview(s.clockInPhoto)}
                  />
                  <PhotoThumb
                    src={s.clockOutPhoto}
                    label="Descente"
                    onClick={() => s.clockOutPhoto && setPhotoPreview(s.clockOutPhoto)}
                  />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f5f0e8] truncate">
                    {s.assistantName}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-[#888]">
                    <span className="flex items-center gap-1 text-emerald-400/90">
                      <LogIn size={12} /> {formatDateTime(s.clockInAt)}
                    </span>
                    {s.clockOutAt ? (
                      <span className="flex items-center gap-1 text-red-400/90">
                        <LogOut size={12} /> {formatDateTime(s.clockOutAt)}
                      </span>
                    ) : (
                      <span className="text-emerald-400">En cours…</span>
                    )}
                  </div>
                </div>

                {/* Durée / statut */}
                <div className="text-right shrink-0">
                  {s.durationMinutes != null ? (
                    <span className="text-sm font-semibold text-[#D7A12B]">
                      {formatDuration(s.durationMinutes)}
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 uppercase tracking-wider font-semibold">
                      En service
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modales */}
      <AnimatePresence>
        {clockTarget && (
          <ClockModal
            key="clock"
            assistant={clockTarget}
            onClose={() => setClockTarget(null)}
            onDone={loadAll}
          />
        )}
        {pinTarget && (
          <PinModal key="pin" assistant={pinTarget} onClose={() => setPinTarget(null)} />
        )}
        {photoPreview && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPhotoPreview(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 cursor-zoom-out"
          >
            <img
              src={photoPreview}
              alt="Photo du pointage"
              className="max-w-full max-h-full rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhotoThumb({ src, label, onClick }) {
  return (
    <div className="text-center">
      {src ? (
        <button
          onClick={onClick}
          className="block w-12 h-12 rounded-lg overflow-hidden border border-[#333] hover:border-[#D7A12B] transition-colors"
        >
          <img src={src} alt={label} className="w-full h-full object-cover" />
        </button>
      ) : (
        <div className="w-12 h-12 rounded-lg border border-dashed border-[#333] flex items-center justify-center text-[#444]">
          <ImageIcon size={16} />
        </div>
      )}
      <span className="block text-[9px] text-[#666] mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}
