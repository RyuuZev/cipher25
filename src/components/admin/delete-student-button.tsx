"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";

import { deleteStudent } from "@/app/admin/actions";

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-danger/40 bg-danger/15 px-4 text-sm text-danger-text-strong transition-colors hover:border-danger-strong/60 hover:bg-danger/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
      {pending ? "Menghapus..." : "Hapus permanen"}
    </button>
  );
}

export function DeleteStudentButton({
  id,
  nama,
}: {
  id: string;
  nama: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const titleId = `delete-title-${id}`;
  const descriptionId = `delete-desc-${id}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => setOpen(false);
    dialog.addEventListener("close", handleClose);

    if (open) dialog.showModal();

    return () => dialog.removeEventListener("close", handleClose);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-danger/25 bg-danger/10 px-3 text-xs text-danger-text transition-colors hover:border-danger-strong/50 hover:bg-danger/20"
      >
        <Trash2 className="size-3.5" />
        Hapus
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={open ? titleId : undefined}
        aria-describedby={open ? descriptionId : undefined}
        className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border border-danger/25 bg-surface p-0 text-left text-fg shadow-2xl backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
      >
        {open ? (
          <form action={deleteStudent} className="p-6">
            <input type="hidden" name="id" value={id} />
            <h2 id={titleId} className="text-lg font-semibold text-fg">
              Hapus data mahasiswa?
            </h2>
            <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-muted">
              Data <span className="font-medium text-fg">{nama}</span> beserta
              fotonya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  dialogRef.current?.close();
                  setOpen(false);
                }}
                className="button-ghost text-sm"
              >
                Batal
              </button>
              <DeleteSubmitButton />
            </div>
          </form>
        ) : null}
      </dialog>
    </>
  );
}
