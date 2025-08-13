import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { JsonifyData } from '@/lib/schema';
import { FormSection } from './FormSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface MetadataSectionProps {
  form: UseFormReturn<JsonifyData>;
}

export function MetadataSection({ form }: MetadataSectionProps) {
  const { register, setValue, watch, unregister, formState: { errors } } = form;

  return (
    <FormSection title="Metadata">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Application description goes here..."
            {...register('description')}
            className={errors.description ? 'border-destructive' : ''}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="homepage">Homepage</Label>
            <Input
              id="homepage"
              placeholder="https://example.com"
              {...register('homepage')}
              className={errors.homepage ? 'border-destructive' : ''}
            />
            {errors.homepage && (
              <p className="text-sm text-destructive">{errors.homepage.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">License</Label>
            <Input
              id="license"
              placeholder="MIT"
              {...register('license')}
              className={errors.license ? 'border-destructive' : ''}
            />
            {errors.license && (
              <p className="text-sm text-destructive">{errors.license.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="docs">Documentation URL</Label>
          <Input
            id="docs"
            placeholder="https://docs.example.com"
            {...register('docs')}
            className={errors.docs ? 'border-destructive' : ''}
          />
          {errors.docs && (
            <p className="text-sm text-destructive">{errors.docs.message}</p>
          )}
        </div>
        
        <div className="space-y-4 mt-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="metadata-binary"
              checked={!!watch('file')}
              onCheckedChange={(checked) => {
                if (checked) {
                  setValue('file', '');
                } else {
                  unregister('file');
                }
              }}
            />
            <Label htmlFor="metadata-binary">Binary</Label>
          </div>

          {watch('file') !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="file">File Address</Label>
              <Input
                id="file"
                placeholder="/path/to/file"
                {...register('file')}
                className={errors.file ? 'border-destructive' : ''}
              />
              {errors.file && (
                <p className="text-sm text-destructive">{errors.file.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}