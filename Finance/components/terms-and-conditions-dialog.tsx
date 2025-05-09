"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TermsAndConditionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TermsAndConditionsDialog({ open, onOpenChange }: TermsAndConditionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Termos e Condições</DialogTitle>
          <DialogDescription>
            Por favor, leia atentamente os termos e condições antes de usar nosso serviço.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <h3 className="text-base font-semibold">Termos de Uso do App</h3>
          <p>
            Bem-vindo(a)! Antes de começar a usar nosso app de controle financeiro, precisamos que você leia e concorde
            com os termos abaixo. Prometemos ser rápidos e diretos:
          </p>

          <div>
            <h4 className="font-medium">1. Sobre o uso do app</h4>
            <p>
              Esse app foi feito pra te ajudar a organizar suas finanças pessoais ou do seu negócio. Ao usar, você
              concorda em fazer isso de forma honesta e segura — sem usar o app pra nada ilegal ou que possa prejudicar
              outros.
            </p>
          </div>

          <div>
            <h4 className="font-medium">2. Sua conta, sua responsabilidade</h4>
            <p>
              Se você criar uma conta, cuide bem do seu login e senha. Tudo o que for feito com sua conta é de sua
              responsabilidade, então evite compartilhar seus dados com outras pessoas.
            </p>
          </div>

          <div>
            <h4 className="font-medium">3. Seus dados são importantes</h4>
            <p>
              Levamos a sua privacidade a sério. Seus dados financeiros e pessoais são tratados com segurança e só
              usamos essas informações pra melhorar sua experiência com o app. Nada será compartilhado sem sua
              autorização.
            </p>
          </div>

          <div>
            <h4 className="font-medium">4. Sem promessas milagrosas</h4>
            <p>
              A gente faz de tudo pra manter o app funcionando bem, mas pode ser que aconteçam pausas, atualizações ou
              algum erro. Não garantimos que tudo estará 100% o tempo todo, mas trabalhamos pra resolver qualquer
              problema o mais rápido possível.
            </p>
          </div>

          <div>
            <h4 className="font-medium">5. Mudanças nos termos</h4>
            <p>
              A gente pode atualizar esses termos de tempos em tempos. Sempre que isso acontecer, vamos avisar por aqui.
              Continuar usando o app depois das mudanças significa que você concorda com elas.
            </p>
          </div>

          <div>
            <h4 className="font-medium">6. Quer sair?</h4>
            <p>
              Se em algum momento você quiser excluir sua conta, é só avisar. Também podemos bloquear contas que estejam
              desrespeitando essas regras.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
