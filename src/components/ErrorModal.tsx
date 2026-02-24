import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
}

export default function ErrorModal({
  open,
  onOpenChange,
  title,
  message,
}: ErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-none">
        <DialogHeader>
          <DialogTitle className="text-[#3358A5]">{title}</DialogTitle>
        </DialogHeader>
        <p className="text-gray-700">{message}</p>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
