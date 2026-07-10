import { useState } from "react";
import { Dialog, DialogContent, Box, Button, Typography } from "@mui/material";
import TextureIcon from "@mui/icons-material/Texture";
import AlbumIcon from "@mui/icons-material/Album";

import PedidoMalharia from "./Malharia/PedidoMalharia";
import PedidoDublagem from "./Dublagem/PedidoDublagem";

export default function ModalEscolhaServico() {
  const [selected, setSelected] = useState<"malharia" | "dublagem" | null>(null);
  const [open, setOpen] = useState(true);

  const handleClick = (tipo: "malharia" | "dublagem") => {
    setSelected(tipo);
    // pequena animação/efeito visual antes de trocar
    setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <>
      {/* MODAL PRINCIPAL */}
      <Dialog open={open} PaperProps={{ sx: { width: 350, borderRadius: 3, border: "4px solid #020349" } }}>
        <DialogContent>
          <Typography variant="h6" textAlign="center" mb={3} fontWeight="bold">
            Selecione o setor
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            {/* Botão Malharia */}
            <Button
              fullWidth
              onClick={() => handleClick("malharia")}
              startIcon={<TextureIcon />}
              sx={{
                py: 2,
                borderRadius: 3,
                fontSize: "1rem",
                textTransform: "none",
                border: "2px solid #020349",
                backgroundColor: selected === "malharia" ? "#E3F2FD" : "#F5F5F5",
                "&:hover": {
                  backgroundColor: selected === "malharia" ? "#BBDEFB" : "#eeeeee",
                },
              }}
            >
              Malharia
            </Button>

            {/* Botão Dublagem */}
            <Button
              fullWidth
              onClick={() => handleClick("dublagem")}
              startIcon={<AlbumIcon />}
              sx={{
                py: 2,
                borderRadius: 3,
                fontSize: "1rem",
                textTransform: "none",
                border: "2px solid #020349",
                backgroundColor: selected === "dublagem" ? "#E3F2FD" : "#F5F5F5",
                "&:hover": {
                  backgroundColor: selected === "dublagem" ? "#BBDEFB" : "#eeeeee",
                },
              }}
            >
              Dublagem
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* COMPONENTES QUE SOBREPÕEM O MODAL */}
      {!open && selected === "malharia" && <PedidoMalharia />}
      {!open && selected === "dublagem" && <PedidoDublagem />}
    </>
  );
}
