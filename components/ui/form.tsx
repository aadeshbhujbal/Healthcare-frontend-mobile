import { View, ViewProps } from 'react-native';
import { Text } from './text';
import {
  Controller,
  ControllerProps,
  FieldValues,
  UseFormReturn,
  Path,
} from 'react-hook-form';

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends string = string
> {
  name: TName;
}

interface FormItemContextValue {
  id: string;
}

interface FormProps<T extends FieldValues>
  extends Omit<ViewProps, keyof UseFormReturn<T>> {
  form: UseFormReturn<T>;
  children?: React.ReactNode;
}

const Form = <T extends FieldValues>({
  form,
  children,
  ...props
}: FormProps<T>) => {
  return <View {...props}>{children}</View>;
};

const FormField = <TFieldValues extends FieldValues = FieldValues>({
  ...props
}: ControllerProps<TFieldValues, Path<TFieldValues>>) => {
  return <Controller {...props} />;
};

const FormItem = ({ ...props }) => {
  return <View className="space-y-2" {...props} />;
};

const FormLabel = ({ ...props }) => {
  return <Text className="text-sm font-medium text-foreground" {...props} />;
};

const FormControl = ({ ...props }) => {
  return <View {...props} />;
};

interface FormMessageProps extends ViewProps {
  children?: React.ReactNode;
  className?: string;
}

const FormMessage = ({ children, className }: FormMessageProps) => {
  if (!children) return null;
  return (
    <Text className={`text-sm font-medium text-destructive ${className || ''}`}>
      {children}
    </Text>
  );
};

Form.Field = FormField;
Form.Item = FormItem;
Form.Label = FormLabel;
Form.Control = FormControl;
Form.Message = FormMessage;

export { Form };
