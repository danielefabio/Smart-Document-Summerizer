"use client";

import { RefObject, useState } from "react";
import { motion, AnimatePresence } from "motion/react"; // Import corretto per motion/react
import { PaperclipIcon, PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroupButton } from "../ui/input-group";

export function MorphingDropdown({
  inputFile,
}: {
  inputFile: RefObject<HTMLInputElement | null>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <InputGroupButton
            aria-label="Add files"
            type="button"
            size="icon-sm"
            variant="outline"
            className="rounded-full"
          >
            <PlusIcon />
          </InputGroupButton>
        }
      />

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={4}
        // Disattiviamo le animazioni CSS native di Radix/Shadcn che farebbero sfarfallare il cerchio
        className="p-0 border-none bg-transparent shadow-none min-w-0 overflow-visible data-[state=open]:animate-none data-[state=closed]:animate-none"
      >
        {/* 
          Rendiamo il div interno l'unico responsabile della comparsa/scomparsa visiva.
          In questo modo AnimatePresence riproduce la chiusura fino all'ultimo millisecondo.
        */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="dropdown-morph"
              // 1. Stato Iniziale (Un cerchio perfetto posizionato sul bottone)
              initial={{
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                opacity: 0,
                transformOrigin: "bottom left",
              }}
              // 2. Apertura (Diventa un rettangolo w-44 controllato e stabile)
              animate={{
                borderRadius: "8px",
                width: "176px", // Corrisponde a w-44
                height: "38px", // Altezza fissa per bloccare picchi e rimbalzi verticali
                opacity: 1,
              }}
              // 3. Chiusura (Simmetrico, collassa tornando a cerchio perfetto)
              exit={{
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                opacity: 0,
              }}
              // Transizione "tween" pulita con una curva morbida (rimuove i sobbalzi elastici in altezza)
              transition={{
                type: "tween",
                ease: [0.16, 1, 0.3, 1], // Custom easeOutExpo per massima fluidità premium
                duration: 0.25,
              }}
              className="bg-popover text-popover-foreground border shadow-md p-1 overflow-hidden flex items-center"
            >
              {/* Il testo sfuma in entrata e sparisce subito in uscita per non deformarsi */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
                transition={{ delay: 0.05 }}
                className="w-full"
              >
                <DropdownMenuItem
                  onClick={() => {
                    inputFile.current?.click();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer w-full"
                >
                  <PaperclipIcon className="w-4 h-4" />
                  <span>Select a PDF file</span>
                </DropdownMenuItem>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
