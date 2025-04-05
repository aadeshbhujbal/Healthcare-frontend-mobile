import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { AlertDialogData } from "~/lib/hooks/use-form";

interface FormAlertProps {
  data: AlertDialogData;
  onClose: () => void;
}

export function FormAlert({ data, onClose }: FormAlertProps) {
  const { title, description, open, variant, action, cancelLabel } = data;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle
            className={variant === "destructive" ? "text-destructive" : ""}
          >
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          {action && (
            <AlertDialogAction
              className={variant === "destructive" ? "bg-destructive" : ""}
              onPress={action.onClick}
            >
              {action.label}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
