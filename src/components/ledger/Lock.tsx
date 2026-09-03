import { useState, type FormEvent } from "react";
import { Lock as LockIcon } from "lucide-react";

const PASSCODE = "xv";

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSCODE) {
      onUnlock();
    } else {
      setError(true);
      setValue("");
    }
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[430px] flex-col items-center justify-center gap-6 px-8 text-foreground app-shell grain">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card ring-1 ring-border">
        <LockIcon className="h-7 w-7" strokeWidth={1.7} />
      </div>
      <div className="text-center">
        <h1 className="text-[30px] font-medium tracking-tight">Enter your key</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">Your wallet is locked.</p>
      </div>
      <form onSubmit={submit} className="w-full space-y-3">
        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Key"
          className="w-full rounded-2xl bg-card px-4 py-4 text-center text-[20px] tracking-[0.4em] outline-none ring-1 ring-border"
        />
        {error && <p className="text-center text-[15px] text-destructive">Wrong key, try again</p>}
        <button
          type="submit"
          className="w-full rounded-full bg-foreground py-4 text-[18px] font-medium text-background active:scale-[0.99]"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
