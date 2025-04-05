import { useState } from 'react';
import { useForm as useReactHookForm, UseFormProps, FieldValues, UseFormReturn, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ZodSchema } from 'zod';

interface UseZodFormProps<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema: z.ZodType<T>;
  defaultValues?: DefaultValues<any>;
}

export function useZodForm<T extends FieldValues>({
  schema,
  defaultValues,
  ...formProps
}: UseZodFormProps<T>): UseFormReturn<T> {
  return useReactHookForm<T>({
    ...formProps,
    resolver: zodResolver(schema),
    defaultValues,
  });
}

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseFormStatusReturn {
  status: FormStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  setStatus: (status: FormStatus) => void;
  setLoading: () => void;
  setSuccess: () => void;
  setError: () => void;
  reset: () => void;
}

export function useFormStatus(initialStatus: FormStatus = 'idle'): UseFormStatusReturn {
  const [status, setStatus] = useState<FormStatus>(initialStatus);

  return {
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    setStatus,
    setLoading: () => setStatus('loading'),
    setSuccess: () => setStatus('success'),
    setError: () => setStatus('error'),
    reset: () => setStatus('idle'),
  };
}

export interface AlertDialogData {
  title: string;
  description: string;
  open: boolean;
  variant?: "default" | "destructive";
  action?: {
    label: string;
    onClick: () => void;
  };
  cancelLabel?: string;
}

const defaultAlertData: AlertDialogData = {
  title: "",
  description: "",
  open: false,
  variant: "default",
  cancelLabel: "Cancel",
};

export function useAlertDialog() {
  const [alertData, setAlertData] = useState<AlertDialogData>(defaultAlertData);

  const showAlert = (data: Partial<AlertDialogData>) => {
    setAlertData({ ...defaultAlertData, ...data, open: true });
  };

  const hideAlert = () => {
    setAlertData((prev) => ({ ...prev, open: false }));
  };

  const successAlert = (title: string, description: string, action?: AlertDialogData["action"]) => {
    showAlert({
      title,
      description,
      variant: "default",
      action,
    });
  };

  const errorAlert = (title: string, description: string, action?: AlertDialogData["action"]) => {
    showAlert({
      title,
      description,
      variant: "destructive",
      action,
    });
  };

  return {
    alertData,
    showAlert,
    hideAlert,
    successAlert,
    errorAlert,
  };
} 