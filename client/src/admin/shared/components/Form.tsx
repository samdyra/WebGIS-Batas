import React from 'react';
import { useForm, FieldValues, Path, UseFormRegister, SubmitHandler, DefaultValues, Control } from 'react-hook-form';

export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  description?: string;
  component?: React.ComponentType<{ control: Control<T> }>;
  validation?: Record<string, any>;
}

interface GenericFormProps<T extends FieldValues> {
  fields: FieldConfig<T>[];
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
}

export function GenericForm<T extends FieldValues>({ fields, defaultValues, onSubmit }: GenericFormProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<T>({
    defaultValues: defaultValues,
  });

  const renderField = (field: FieldConfig<T>, register: UseFormRegister<T>) => {
    const commonClasses =
      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50';

    if (field.component) {
      const CustomComponent = field.component;
      return <CustomComponent control={control} />;
    }

    if (field.type === 'select') {
      return (
        <select {...register(field.name, { required: field.required, ...field.validation })} className={commonClasses}>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (field.type === 'textarea') {
      return (
        <textarea
          {...register(field.name, { required: field.required, ...field.validation })}
          className={`${commonClasses} h-32`}
        />
      );
    } else if (field.type === 'file') {
      return (
        <input
          type="file"
          {...register(field.name, {
            required: field.required,
            ...field.validation,
            onChange: (e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                return files[0];
              }
              return null;
            },
          })}
          className={commonClasses}
        />
      );
    } else {
      return (
        <input
          type={field.type}
          {...register(field.name, { required: field.required, ...field.validation })}
          className={commonClasses}
        />
      );
    }
  };

  const handleFormSubmit = (data: T) => {
    // Convert FileList to File for file inputs
    const processedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (value instanceof FileList && value.length > 0) {
          return [key, value[0]];
        }
        return [key, value];
      })
    );
    onSubmit(processedData as T);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field, register)}
          {field.description && <p className="mt-2 text-sm text-gray-500">{field.description}</p>}
          {errors[field.name] && !field.component && (
            <p className="mt-2 text-sm text-red-600">{errors[field.name]?.message as string}</p>
          )}
        </div>
      ))}
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
