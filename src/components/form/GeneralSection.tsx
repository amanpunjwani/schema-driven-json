import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JsonifyData } from '@/lib/schema';
import { FormSection } from './FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GeneralSectionProps {
  form: UseFormReturn<JsonifyData>;
}

export function GeneralSection({ form }: GeneralSectionProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  
  const actualFileVersion = watch('actualfileversion');

  return (
    <FormSection title="General">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Application name"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bundleid">Bundle ID</Label>
          <Input
            id="bundleid"
            placeholder="com.example.app"
            {...register('bundleid')}
            className={errors.bundleid ? 'border-destructive' : ''}
          />
          {errors.bundleid && (
            <p className="text-sm text-destructive">{errors.bundleid.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            placeholder="1.0.0"
            {...register('version')}
            className={errors.version ? 'border-destructive' : ''}
          />
          {errors.version && (
            <p className="text-sm text-destructive">{errors.version.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="actualfileversion">Actual File Version</Label>
          <Select value={actualFileVersion} onValueChange={(value) => setValue('actualfileversion', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select version format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="version">version</SelectItem>
              <SelectItem value="dotVersion">dotVersion</SelectItem>
              <SelectItem value="dashVersion">dashVersion</SelectItem>
              <SelectItem value="cleanv">cleanv</SelectItem>
            </SelectContent>
          </Select>
          {errors.actualfileversion && (
            <p className="text-sm text-destructive">{errors.actualfileversion.message}</p>
          )}
        </div>
      </div>
    </FormSection>
  );
}